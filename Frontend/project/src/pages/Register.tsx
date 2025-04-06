import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, Brain } from 'lucide-react';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        // Password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        
        if (!passwordRegex.test(formData.password)) {
            throw new Error(
                'Password must contain at least 8 characters, including uppercase, lowercase, number and special character'
            );
        }

        if (formData.password !== formData.confirmPassword) {
            throw new Error('Passwords do not match');
        }

        const response = await fetch('http://127.0.0.1:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
                name: formData.name
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }

        // Registration successful, redirect to login
        navigate('/login');
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDF6TTM2IDMwdjJIMjR2LTJoMXoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 relative z-10 mx-4"
      >
        <div className="flex flex-col items-center">
          <Brain className="w-12 h-12 text-purple-500" />
          <h2 className="mt-4 text-center text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Join COVID AI Predict today
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="appearance-none relative block w-full px-10 py-3 border border-gray-600 bg-gray-700/50 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Full Name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="appearance-none relative block w-full px-10 py-3 border border-gray-600 bg-gray-700/50 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none relative block w-full px-10 py-3 border border-gray-600 bg-gray-700/50 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Password"
                />
              </div>
              <p className="mt-1 text-sm text-gray-400">
                Password must contain at least 8 characters, including uppercase, lowercase, number and special character
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="appearance-none relative block w-full px-10 py-3 border border-gray-600 bg-gray-700/50 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Confirm Password"
                />
              </div>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 text-red-400 bg-red-400/10 p-3 rounded-lg"
            >
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="text-sm text-center">
            <Link
              to="/login"
              className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                isLoading
                  ? 'bg-purple-600/50 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors`}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;