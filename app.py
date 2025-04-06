import os
import logging
import gdown
import numpy as np
import tensorflow as tf
import sqlite3
import bcrypt
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from werkzeug.utils import secure_filename
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv

# ✅ Load environment variables
load_dotenv()

# ✅ Initialize Flask App
app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173"],  # Vite's default port
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "default_secret_key")
jwt = JWTManager(app)

# ✅ Disable GPU & Suppress TensorFlow Warnings
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'   
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'    
logging.basicConfig(level=logging.INFO)

# ✅ Google Drive Model Download
GDRIVE_FILE_ID = "1F3CyYozjJlPSfKanlm0n2SmqOyT5rQ8L"
MODEL_PATH = "final_model.h5"

def download_model():
    if not os.path.exists(MODEL_PATH):
        logging.info("📥 Downloading model from Google Drive...")
        url = f"https://drive.google.com/uc?export=download&id={GDRIVE_FILE_ID}"
        try:
            gdown.download(url, MODEL_PATH, quiet=False)
        except Exception as e:
            logging.error(f"🚨 Model download failed: {e}")
            exit(1)  # Stop app if model download fails

# ✅ Load Trained Model
download_model()
model = load_model(MODEL_PATH)

# ✅ Preprocess CT Scan Image
def preprocess_image(image_path):
    img = load_img(image_path, target_size=(224, 224))
    img_array = img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

# ✅ Symptom Weight Calculation
def calculate_symptom_weight(symptom):
    total_symptom = ["fever", "cough", "shortness of breath", "fatigue", "loss of taste or smell", "cold"]
    present_symptom = len([s for s in symptom if s in total_symptom])
    symptom_percentage = (present_symptom / len(total_symptom)) * 20  
    return symptom_percentage

@app.route("/")
def home():
    return 'Backend is running'

# ✅ Prediction Route (With File Validation)
@app.route('/predict', methods=['POST'])
def predict():
    print("Received files:", request.files)
    print("Received form data:", request.form)
      
    if 'image' not in request.files:
        return jsonify({'error': '🚫 CT scan is required'}), 400 
    file = request.files['image']
    
    if file.filename == '' or not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        return jsonify({'error': 'Invalid file format. Please upload a PNG or JPG image'}), 400

    # ✅ Process Symptoms
    symptoms = request.form.getlist('symptoms')
    symptom_weight = calculate_symptom_weight(symptoms)

    # ✅ Process CT Scan
    filename = secure_filename(file.filename)
    image_path = os.path.join("temp_" + filename)
    file.save(image_path)
    img_array = preprocess_image(image_path)
    scan_prediction = model.predict(img_array)[0][0] * 100
    os.remove(image_path)

    # ✅ Final Weighted Prediction
    final_prediction = (scan_prediction * 0.8) + symptom_weight
    
    # Return clean, consistent JSON format
    result = {
        "prediction": {
            "likelihood": float(final_prediction),
            "recommendation": "See a doctor" if final_prediction >= 70 else "Monitor symptoms"
        }
    }

    print("Returning JSON:", result)  # Debug log
    return jsonify(result), 200

# ✅ User Authentication & Database Functions
def db_connection():
    with sqlite3.connect("users.db") as conn:
        conn.execute("""CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )""")
        conn.commit()

def init_db():
    with sqlite3.connect("users.db") as conn:
        conn.execute("""
        DROP TABLE IF EXISTS users;
        """)
        conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        conn.commit()

# Initialize database on startup
init_db()

@app.route("/register", methods=["POST"])  # ✅ Fixed from GET to POST
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Basic email validation
    if not '@' in email or not '.' in email:
        return jsonify({"error": "Invalid email format"}), 400

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

    try:
        with sqlite3.connect("users.db") as conn:
            conn.execute(
                "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
                (email, hashed_password.decode(), name)
            )
            conn.commit()
        return jsonify({"message": "Registration successful"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already registered"}), 409

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        print(f"Attempting login for email: {email}")  # Debug log

        with sqlite3.connect("users.db") as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT password, name FROM users WHERE email = ?", (email,))
            user = cursor.fetchone()

            if not user:
                return jsonify({"error": "User not found"}), 401

            if not bcrypt.checkpw(password.encode(), user[0].encode()):
                return jsonify({"error": "Invalid password"}), 401

            # Generate token and return user data
            access_token = create_access_token(identity=email)
            return jsonify({
                "access_token": access_token,
                "user": {
                    "email": email,
                    "name": user[1]
                }
            }), 200

    except Exception as e:
        print(f"Login error: {str(e)}")  # Debug log
        return jsonify({"error": "Server error during login"}), 500

@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    return jsonify({"message": f"Hello, {get_jwt_identity()}! You have access."}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)