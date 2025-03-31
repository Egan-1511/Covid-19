import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Youtube, AlertCircle, Phone, Shield, Book } from 'lucide-react';

const Learn: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700"
      >
        <h1 className="text-3xl font-bold mb-6">Understanding COVID-19</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300">
            COVID-19 is an infectious disease caused by the SARS-CoV-2 virus. Most people infected with
            the virus will experience mild to moderate respiratory illness and recover without requiring
            special treatment.
          </p>
        </div>
      </motion.section>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <AlertCircle className="w-6 h-6 text-purple-500" />
            <span>Common Symptoms</span>
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li>• Fever or chills</li>
            <li>• Cough</li>
            <li>• Shortness of breath</li>
            <li>• Fatigue</li>
            <li>• Muscle or body aches</li>
          </ul>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <Shield className="w-6 h-6 text-purple-500" />
            <span>Prevention</span>
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li>• Wear a mask in public</li>
            <li>• Maintain social distancing</li>
            <li>• Wash hands frequently</li>
            <li>• Get vaccinated</li>
            <li>• Stay home if sick</li>
          </ul>
        </motion.section>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Book className="w-6 h-6 text-purple-500" />
          <span>Trusted Resources</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="https://www.who.int/health-topics/coronavirus"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 p-4 rounded-lg bg-gray-800/30 hover:bg-purple-500/20 transition-all group"
          >
            <ExternalLink className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
            <span>World Health Organization (WHO)</span>
          </a>
          <a
            href="https://www.cdc.gov/coronavirus/2019-ncov/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 p-4 rounded-lg bg-gray-800/30 hover:bg-purple-500/20 transition-all group"
          >
            <ExternalLink className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
            <span>Centers for Disease Control (CDC)</span>
          </a>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Phone className="w-6 h-6 text-purple-500" />
          <span>Emergency Contacts</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-gray-800/30">
            <p className="font-semibold">COVID-19 Helpline</p>
            <p className="text-purple-400">1-800-XXX-XXXX</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-800/30">
            <p className="font-semibold">Medical Emergency</p>
            <p className="text-purple-400">911</p>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Learn;