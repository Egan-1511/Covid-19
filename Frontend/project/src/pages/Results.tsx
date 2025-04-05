import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Phone, Stethoscope, Share2, MessageSquare } from 'lucide-react';
import { useLocation } from 'react-router-dom';
// Removed unused PredictionResult interface

const Results: React.FC = () => {
  const [sharing, setSharing] = useState(false);
  const [consulting, setConsulting] = useState(false);
  const location = useLocation();
  
  // Get the actual prediction data from navigation state
  const predictionData = location.state?.result ?? {
    likelihood: 0,
    recommendation: 'No prediction available'
  };

  // Define recommendations based on likelihood
  const getRecommendations = (likelihood: number) => {
    if (likelihood >= 70) {
      return [
        'Isolate immediately and avoid contact with others',
        'Schedule a PCR test for confirmation',
        'Monitor your symptoms and seek medical attention if they worsen',
        'Ensure proper ventilation in your living space'
      ];
    } else {
      return [
        'Continue monitoring your symptoms',
        'Practice social distancing and wear a mask',
        'Maintain good hygiene practices',
        'Consider getting tested if symptoms worsen'
      ];
    }
  };

  const recommendations = getRecommendations(predictionData.likelihood);

  const handleShareResults = async () => {
    setSharing(true);
    try {
      // In a real app, this would send the results to a healthcare provider
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      alert('Results have been shared with your healthcare provider.');
    } catch (error) {
      console.error('Error sharing results:', error);
    } finally {
      setSharing(false);
    }
  };

  const handleConsultDoctor = async () => {
    setConsulting(true);
    try {
      // Simulate connecting to a telemedicine service
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Connecting you to an available healthcare professional...');
    } catch (error) {
      console.error('Error initiating consultation:', error);
    } finally {
      setConsulting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700"
      >
        <h1 className="text-3xl font-bold mb-6">AI Prediction Results</h1>
        
        {/* Risk Score */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Risk Assessment</h2>
          <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${predictionData.likelihood}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500"
            />
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span>Low Risk</span>
            <span className="font-bold text-purple-400">{predictionData.likelihood}%</span>
            <span>High Risk</span>
          </div>
        </div>

        {/* Confidence Level based on likelihood */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">AI Confidence Level</h2>
          <div className="flex items-center space-x-3">
            {['Low', 'Medium', 'High'].map((level) => (
              <div
                key={level}
                className={`px-4 py-2 rounded-full ${
                  (predictionData.likelihood >= 70 && level === 'High') ||
                  (predictionData.likelihood >= 30 && predictionData.likelihood < 70 && level === 'Medium') ||
                  (predictionData.likelihood < 30 && level === 'Low')
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500'
                    : 'bg-gray-700/50 text-gray-400'
                }`}
              >
                {level}
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <AlertCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span>{rec}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Emergency Resources */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <Phone className="w-6 h-6 text-purple-500" />
            <span>Emergency Contacts</span>
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <span>National COVID-19 Helpline</span>
              <a href="tel:1075" className="text-purple-400 hover:text-purple-300">1075</a>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <span>Emergency Medical Services</span>
              <a href="tel:108" className="text-purple-400 hover:text-purple-300">108</a>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <span>State COVID-19 Helpline</span>
              <a href="tel:104" className="text-purple-400 hover:text-purple-300">104</a>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <Stethoscope className="w-6 h-6 text-purple-500" />
            <span>Take Action</span>
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-700/30 rounded-lg">
              <h3 className="font-semibold mb-2">Share Results</h3>
              <p className="text-sm text-gray-300 mb-3">Share your results securely with healthcare providers</p>
              <button 
                className={`flex items-center space-x-2 text-purple-400 hover:text-purple-300 ${sharing ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleShareResults}
                disabled={sharing}
              >
                <Share2 className="w-4 h-4" />
                <span>{sharing ? 'Sharing...' : 'Share Results'}</span>
              </button>
            </div>
            <div className="p-3 bg-gray-700/30 rounded-lg">
              <h3 className="font-semibold mb-2">Online Consultation</h3>
              <p className="text-sm text-gray-300 mb-3">Connect with a healthcare professional instantly</p>
              <button 
                className={`flex items-center space-x-2 text-purple-400 hover:text-purple-300 ${consulting ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleConsultDoctor}
                disabled={consulting}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{consulting ? 'Connecting...' : 'Start Consultation'}</span>
              </button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Results;