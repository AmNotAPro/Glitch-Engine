import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.tsx';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

const LoginModal = ({ isOpen, onClose, onSwitchToSignUp }: LoginModalProps) => {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }

    try {
      setLoading(true);
      await signIn(formData.email, formData.password);
      onClose();
      
      // Reset form
      setFormData({ email: '', password: '' });
    } catch (error) {
      // Error is handled in the signIn function
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-background-white rounded-card max-w-md w-full shadow-card-hover border border-border-light"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-8 border-b border-border-light">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-violet bg-opacity-10 rounded-full flex items-center justify-center">
                  <LogIn className="w-6 h-6 text-primary-violet" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary">Welcome Back</h3>
                  <p className="text-text-secondary text-sm">Sign in to your account</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-background-beige rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-6 h-6 text-text-secondary" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-border-light rounded-button focus:outline-none focus:ring-2 focus:ring-primary-violet focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 border border-border-light rounded-button focus:outline-none focus:ring-2 focus:ring-primary-violet focus:border-transparent transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Admin Login Hint */}
              <div className="bg-primary-violet bg-opacity-5 border border-primary-violet border-opacity-20 rounded-lg p-4">
                <p className="text-sm text-primary-violet font-medium">
                  💡 Admin Access: admin@gmail.com / 123456
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !formData.email || !formData.password}
                className="w-full bg-primary-violet hover:bg-primary-violet-dark text-white font-semibold py-3 rounded-button transition-all duration-200 shadow-card hover:shadow-card-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="p-8 pt-0">
            <div className="text-center">
              <p className="text-text-secondary text-sm">
                Don't have an account?{' '}
                <button
                  onClick={onSwitchToSignUp}
                  className="text-primary-violet hover:text-primary-violet-dark font-semibold transition-colors"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginModal;