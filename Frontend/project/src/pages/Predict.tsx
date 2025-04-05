import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Upload, AlertCircle } from 'lucide-react';
import type { Symptom } from '../types';

const symptoms: Symptom[] = [
  {
    id: 'cough',
    name: 'Cough',
    followUpQuestion: 'How long have you had the cough?',
    options: ['Less than a week', '1-2 weeks', 'More than 2 weeks']
  },
  {
    id: 'fever',
    name: 'Fever',
    followUpQuestion: 'What is your temperature?',
    options: ['37.5-38.0°C', '38.1-39.0°C', 'Above 39.0°C']
  },
  {
    id: 'breathing',
    name: 'Difficulty Breathing',
    followUpQuestion: 'How severe is your breathing difficulty?',
    options: ['Mild', 'Moderate', 'Severe']
  },
  {
    id: 'fatigue',
    name: 'Fatigue',
    followUpQuestion: 'How would you rate your fatigue level?',
    options: ['Mild', 'Moderate', 'Severe']
  },
  {
    id: 'taste_smell',
    name: 'Loss of Taste/Smell',
    followUpQuestion: 'When did you notice this symptom?',
    options: ['Today', '2-3 days ago', 'More than 3 days']
  },
  {
    id: 'body_aches',
    name: 'Body Aches',
    followUpQuestion: 'Where do you feel the most pain?',
    options: ['Muscles', 'Joints', 'Both']
  },
  {
    id: 'headache',
    name: 'Headache',
    followUpQuestion: 'How would you describe your headache?',
    options: ['Mild', 'Moderate', 'Severe']
  },
  {
    id: 'sore_throat',
    name: 'Sore Throat',
    followUpQuestion: 'How long have you had the sore throat?',
    options: ['1-2 days', '3-5 days', 'More than 5 days']
  }
];

const Predict: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'symptoms' | 'upload'>('symptoms');
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
  const [currentFollowUp, setCurrentFollowUp] = useState<Symptom | null>(null);
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string>>({});
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<{
    likelihood: number;
    recommendation: string;
  } | null>(null);

  const handleSymptomClick = (symptom: Symptom) => {
    const newSelected = new Set(selectedSymptoms);
    if (newSelected.has(symptom.id)) {
      newSelected.delete(symptom.id);
      const answers = { ...followUpAnswers };
      delete answers[symptom.id];
      setFollowUpAnswers(answers);
    } else {
      newSelected.add(symptom.id);
      setCurrentFollowUp(symptom);
    }
    setSelectedSymptoms(newSelected);
  };

  const handleFollowUpAnswer = (answer: string) => {
    if (currentFollowUp) {
      setFollowUpAnswers({ ...followUpAnswers, [currentFollowUp.id]: answer });
      setCurrentFollowUp(null);
    }
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Reset states
    setUploadError(null);
    setIsUploading(true);
    setPredictionResult(null);
    
    const file = e.target.files?.[0];
    if (!file) {
        setUploadError('Please select a CT scan image');
        setIsUploading(false);
        return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
        setUploadError('Invalid file type. Please upload JPEG or PNG files only');
        setIsUploading(false);
        return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('name', name.trim());
    formData.append('age', age.toString());
    
    // Map symptom IDs to the expected backend format
    const symptomMapping: Record<string, string> = {
        'cough': 'cough',
        'fever': 'fever',
        'breathing': 'shortness of breath',
        'fatigue': 'fatigue',
        'taste_smell': 'loss of taste or smell',
        'sore_throat': 'cold'
    };
    
    // Convert selected symptoms to backend format
    const backendSymptoms = Array.from(selectedSymptoms)
        .map(symptomId => symptomMapping[symptomId])
        .filter(Boolean);
    
    // Append symptoms as a JSON string array
    formData.append('symptoms', JSON.stringify(backendSymptoms));

    try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Upload failed');
        }

        const result = await response.json();
        console.log('Raw API response:', result);
        console.log('Response keys:', Object.keys(result));

        // Safely access nested prediction data
        if (!result?.prediction?.likelihood) {
            throw new Error('Invalid response format from server');
        }

        const predictionData = {
            likelihood: Math.round(result.prediction.likelihood),
            recommendation: result.prediction.recommendation
        };

        console.log('Formatted prediction:', predictionData);
        setPredictionResult(predictionData);
        
        navigate('/results', { 
            state: { 
                result: predictionData,
                name: name.trim(),
                age: age
            } 
        });
        
    } catch (error) {
        console.error('Upload failed:', error);
        setUploadError(
            error instanceof Error 
                ? error.message 
                : 'Failed to process prediction'
        );
        setPredictionResult(null);
    } finally {
        setIsUploading(false);
    }
};

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-8">
        <motion.div
          className={`flex items-center space-x-2 ${
            step === 'symptoms' ? 'text-purple-400' : 'text-gray-500'
          }`}
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
        >
          <Stethoscope className="w-6 h-6" />
          <span>Symptoms</span>
        </motion.div>
        <div className="h-0.5 flex-1 mx-4 bg-gray-700" />
        <motion.div
          className={`flex items-center space-x-2 ${
            step === 'upload' ? 'text-purple-400' : 'text-gray-500'
          }`}
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
        >
          <Upload className="w-6 h-6" />
          <span>CT Scan Upload</span>
        </motion.div>
      </div>

      {step === 'symptoms' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Personal Information */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  placeholder="Enter your age"
                />
              </div>
            </div>
          </div>

          {/* Symptoms Selection */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Select Your Symptoms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {symptoms.map((symptom) => (
                <motion.button
                  key={symptom.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-lg border ${
                    selectedSymptoms.has(symptom.id)
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-600 bg-gray-800/30'
                  } transition-all`}
                  onClick={() => handleSymptomClick(symptom)}
                >
                  {symptom.name}
                </motion.button>
              ))}
            </div>
          </div>

          {currentFollowUp && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <h3 className="text-xl font-semibold mb-4">{currentFollowUp.followUpQuestion}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentFollowUp.options?.map((option) => (
                  <motion.button
                    key={option}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-3 rounded-lg border border-gray-600 bg-gray-800/30 hover:bg-purple-500/20 hover:border-purple-500 transition-all"
                    onClick={() => handleFollowUpAnswer(option)}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-full text-white font-semibold transition-all"
              onClick={() => setStep('upload')}
              disabled={!name || !age || selectedSymptoms.size === 0}
            >
              Continue to CT Scan Upload
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700"
        >
          <h2 className="text-2xl font-bold mb-6">Upload Your CT Scan</h2>
          <div className={`border-2 border-dashed rounded-xl p-8 text-center
            ${uploadError ? 'border-red-500 bg-red-500/10' : 'border-gray-600'}`}>
            <input
              type="file"
              id="ct-scan"
              className="hidden"
              accept="image/jpeg,image/png"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <label
              htmlFor="ct-scan"
              className={`cursor-pointer flex flex-col items-center space-y-4 
                ${isUploading ? 'opacity-50' : ''}`}
            >
              <Upload className={`w-16 h-16 ${uploadError ? 'text-red-500' : 'text-purple-500'}`} />
              <div className="text-lg">
                {isUploading ? 'Uploading...' : 
                  <>Drag and drop your CT scan here or <span className="text-purple-400">browse</span></>
                }
              </div>
              <p className="text-sm text-gray-400">Supported formats: JPEG, PNG</p>
            </label>
          </div>
          
          {uploadError && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{uploadError}</span>
            </div>
          )}

          <div className="mt-6 flex items-start space-x-2 text-amber-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              Please ensure your CT scan is clear and recent. The accuracy of our prediction depends on
              the quality of the uploaded image.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Predict;