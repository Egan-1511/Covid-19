import React from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100">
      <Navigation />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default Layout;