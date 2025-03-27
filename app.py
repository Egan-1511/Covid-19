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
app = Flask(__name__, template_folder="template", static_folder="static")
CORS(app)
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
def index():
    return "Hello_"

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
    result = {
        "COVID-19 Likelihood": f"{final_prediction:.2f}%",
        "Recommendation": "See a doctor" if final_prediction >= 70 else "Monitor symptoms nothing to worry about"
    }

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

@app.route("/register", methods=["POST"])  # ✅ Fixed from GET to POST
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    try:
        with sqlite3.connect("users.db") as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_password))
            conn.commit()
        return jsonify({"message": "User registered successfully!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username already exists"}), 409

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username, password = data.get("username"), data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    with sqlite3.connect("users.db") as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT password FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()

    if user and bcrypt.checkpw(password.encode(), user[0].encode()):
        access_token = create_access_token(identity=username)
        return jsonify({"access_token": access_token}), 200

    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    return jsonify({"message": f"Hello, {get_jwt_identity()}! You have access."}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
