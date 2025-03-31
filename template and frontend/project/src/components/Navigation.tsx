import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Home, Upload, Info } from 'lucide-react';

const Navigation: React.FC = () => {
  return (
    <nav className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-purple-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              COVID AI Predict
            </span>
          </Link>
          
          <div className="flex space-x-8">
            <NavLink to="/" icon={<Home className="w-5 h-5" />} text="Home" />
            <NavLink to="/predict" icon={<Upload className="w-5 h-5" />} text="Predict" />
            <NavLink to="/learn" icon={<Info className="w-5 h-5" />} text="Learn More" />
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink: React.FC<{ to: string; icon: React.ReactNode; text: string }> = ({ to, icon, text }) => (
  <Link to={to}>
    <motion.div
      className="flex items-center space-x-1 text-gray-300 hover:text-purple-400 transition-colors"
      whileHover={{ scale: 1.05 }}
    >
      {icon}
      <span>{text}</span>
    </motion.div>
  </Link>
);

export default Navigation;