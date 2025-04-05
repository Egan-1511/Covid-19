import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Activity, GraduationCap, Building2 } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDF6TTM2IDMwdjJIMjR2LTJoMXoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text"
          >
            COVID-19 Prediction Using CT Scans & Machine Learning
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-300"
          >
            Upload your CT scan and answer a few questions to get instant results powered by advanced AI technology.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center space-x-6"
          >
            <button
              onClick={() => navigate('/predict')}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-full text-white font-semibold transition-all transform hover:scale-105"
            >
              Predict Now
            </button>
            <button
              onClick={() => navigate('/learn')}
              className="px-8 py-3 border-2 border-purple-500 rounded-full text-purple-400 font-semibold hover:bg-purple-500/10 transition-all"
            >
              Learn More
            </button>
          </motion.div>
        </div>
      </section>

      {/* College Info */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700"
      >
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Building2 className="w-8 h-8 text-purple-500" />
          <h2 className="text-3xl font-bold">Apollo Arts and Science College</h2>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <GraduationCap className="w-6 h-6 text-purple-400" />
          <p className="text-xl text-gray-300">Department of Computer Science</p>
        </div>
      </motion.section>

      {/* Statistics Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <StatCard
          icon={<Activity className="w-8 h-8 text-purple-500" />}
          title="Global Cases"
          value="500M+"
        />
        <StatCard
          icon={<Users className="w-8 h-8 text-pink-500" />}
          title="Recovery Rate"
          value="98.7%"
        />
        <StatCard
          icon={<Shield className="w-8 h-8 text-purple-500" />}
          title="Accuracy Rate"
          value="95%"
        />
      </section>

      {/* Team Section */}
      <section className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
        <h2 className="text-3xl font-bold mb-8 text-center">Project Team</h2>
        
        {/* HOD & Guide */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-center text-purple-400">Head of Department & Project Guide</h3>
          <div className="flex justify-center">
            <div className="text-center p-6 bg-gray-700/30 rounded-lg w-64">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">P</span>
              </div>
              <h3 className="text-xl font-semibold">Dr. Poonguzhali</h3>
              <h3 className="text-xl font-semibold">M.C.A,M.Phil,PhD.</h3>
              <p className="text-purple-400 mt-1">HOD & Project Guide</p>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <h3 className="text-2xl font-semibold mb-6 text-center text-purple-400">Team Members</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            "EGAN",
            "GUNARANJANI",
            "ASHKA MARIYUM",
            "JOE DANIEL",
            "TAMILZHARASAN",
            "PRADEEP",
            "KAVIYA"
          ].map((name) => (
            <div key={name} className="text-center p-4 bg-gray-700/30 rounded-lg transform hover:scale-105 transition-all">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{name[0]}</span>
              </div>
              <h3 className="font-semibold">{name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy Section */}
      <section className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
        <div className="flex items-center space-x-4 mb-4">
          <Shield className="w-12 h-12 text-purple-500" />
          <h2 className="text-2xl font-bold">Your Privacy Matters</h2>
        </div>
        <p className="text-gray-300">
          Your data is processed securely and automatically deleted after prediction. We use state-of-the-art encryption
          and follow strict privacy guidelines to ensure your information remains confidential.
        </p>
      </section>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string }> = ({ icon, title, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center transform hover:scale-105 transition-all"
  >
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
      {value}
    </p>
  </motion.div>
);

export default Home;