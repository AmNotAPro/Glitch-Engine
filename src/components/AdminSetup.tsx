import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AdminSetupProps {
  onComplete?: () => void;
}

const AdminSetup = ({ onComplete }: AdminSetupProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 Creating admin user:', formData.email);

      // Sign up the admin user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName.trim(),
            role: 'Admin'
          }
        }
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('Failed to create admin user');
      }

      // Wait a moment for the profile to be created by the trigger
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update the profile to ensure admin role (in case trigger didn't set it)
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ role: 'Admin' })
        .eq('user_id', data.user.id);

      if (updateError) {
        console.error('⚠️ Failed to update admin role:', updateError);
        // Don't throw here, the user was created successfully
      }

      setSuccess(true);
      toast.success(`Admin user created successfully! 🎉`);
      
      if (onComplete) {
        setTimeout(onComplete, 2000);
      }

    } catch (error: any) {
      console.error('❌ Admin creation failed:', error);
      
      if (error.message?.includes('already registered')) {
        toast.error('This email is already registered.');
      } else {
        toast.error(error.message || 'Failed to create admin user');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-white rounded-card shadow-card border border-border-light p-8 text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-4">Admin User Created!</h2>
        <p className="text-text-secondary mb-6">
          The admin user has been created successfully. You can now sign in with the admin credentials.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 text-left">
          <p className="text-sm text-gray-600 mb-2">Admin Credentials:</p>
          <p className="font-mono text-sm"><strong>Email:</strong> {formData.email}</p>
          <p className="font-mono text-sm"><strong>Role:</strong> Admin</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto bg-white rounded-card shadow-card border border-border-light p-8"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-violet rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Create Admin User</h2>
        <p className="text-text-secondary">
          Set up the first admin user for the Glitch Engine platform
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-border-light rounded-button focus:outline-none focus:ring-2 focus:ring-primary-violet focus:border-transparent"
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-border-light rounded-button focus:outline-none focus:ring-2 focus:ring-primary-violet focus:border-transparent"
            placeholder="Enter admin email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            <Lock className="w-4 h-4 inline mr-2" />
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            minLength={6}
            className="w-full px-4 py-3 border border-border-light rounded-button focus:outline-none focus:ring-2 focus:ring-primary-violet focus:border-transparent"
            placeholder="Enter password (min 6 characters)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            <Lock className="w-4 h-4 inline mr-2" />
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            minLength={6}
            className="w-full px-4 py-3 border border-border-light rounded-button focus:outline-none focus:ring-2 focus:ring-primary-violet focus:border-transparent"
            placeholder="Confirm password"
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Important:</p>
              <p>This will create an admin user with full system access. Keep these credentials secure.</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-violet text-white py-3 px-6 rounded-button font-semibold hover:bg-primary-violet-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Creating Admin User...
            </div>
          ) : (
            'Create Admin User'
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default AdminSetup;

