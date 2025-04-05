import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, Brain, ArrowLeft } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
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
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Enter your email to receive a password reset link
          </p>
        </div>

        {!isSubmitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-10 py-3 border border-gray-600 bg-gray-700/50 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Email address"
                />
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
                  'Send Reset Link'
                )}
              </button>
            </div>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4"
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Check your email</h3>
            <p className="text-gray-300">
              We've sent a password reset link to {email}
            </p>
          </motion.div>
        )}

        <div className="flex justify-center mt-4">
          <Link
            to="/login"
            className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;