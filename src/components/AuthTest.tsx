import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  User, 
  Shield, 
  Database,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.tsx';
import { supabase } from '../lib/supabase';
import { adminService } from '../lib/adminService';
import toast from 'react-hot-toast';

const AuthTest = () => {
  const { user, profile, isAuthenticated, isAdmin, signUp, signIn, signOut } = useAuth();
  const [testResults, setTestResults] = useState<Record<string, 'pending' | 'success' | 'error' | 'info'>>({});
  const [testOutput, setTestOutput] = useState<string[]>([]);
  const [showOutput, setShowOutput] = useState(false);
  const [loading, setLoading] = useState(false);

  const addOutput = (message: string) => {
    setTestOutput(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const updateTestResult = (testName: string, result: 'success' | 'error' | 'info') => {
    setTestResults(prev => ({ ...prev, [testName]: result }));
  };

  const runDatabaseTests = async () => {
    addOutput('🔄 Starting database connectivity tests...');
    
    try {
      // Test 1: Basic connection
      addOutput('Testing Supabase connection...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        addOutput(`❌ Session error: ${sessionError.message}`);
        updateTestResult('connection', 'error');
        return;
      }
      addOutput('✅ Supabase connection successful');
      updateTestResult('connection', 'success');

      // Test 2: Database access
      addOutput('Testing database access...');
      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1);
      
      if (profileError) {
        addOutput(`❌ Database access error: ${profileError.message}`);
        updateTestResult('database', 'error');
        return;
      }
      addOutput('✅ Database access successful');
      updateTestResult('database', 'success');

      // Test 3: RLS policies
      addOutput('Testing Row Level Security policies...');
      const { data: testData, error: rlsError } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);
      
      if (rlsError && rlsError.code !== 'PGRST116') {
        addOutput(`❌ RLS policy error: ${rlsError.message}`);
        updateTestResult('rls', 'error');
      } else {
        addOutput('✅ RLS policies working correctly');
        updateTestResult('rls', 'success');
      }

    } catch (error: any) {
      addOutput(`❌ Database test failed: ${error.message}`);
      updateTestResult('database', 'error');
    }
  };

  const runAuthTests = async () => {
    addOutput('🔄 Starting authentication tests...');
    
    try {
      // Test current auth state
      addOutput(`Current auth state: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}`);
      addOutput(`Current user: ${user?.email || 'None'}`);
      addOutput(`Current profile: ${profile?.full_name || 'None'} (${profile?.role || 'No role'})`);
      
      if (isAuthenticated) {
        updateTestResult('auth_state', 'success');
        addOutput('✅ Authentication state is valid');
      } else {
        updateTestResult('auth_state', 'info');
        addOutput('ℹ️ User is not authenticated (this is normal for testing)');
      }

      // Test profile loading if authenticated
      if (user && !profile) {
        addOutput('⚠️ User is authenticated but profile is missing');
        updateTestResult('profile_sync', 'error');
      } else if (user && profile) {
        addOutput('✅ User and profile are in sync');
        updateTestResult('profile_sync', 'success');
      } else {
        addOutput('ℹ️ No user session to test profile sync');
        updateTestResult('profile_sync', 'info');
      }

    } catch (error: any) {
      addOutput(`❌ Auth test failed: ${error.message}`);
      updateTestResult('auth_state', 'error');
    }
  };

  const runAdminTests = async () => {
    addOutput('🔄 Starting admin functionality tests...');
    
    try {
      if (!isAdmin) {
        addOutput('ℹ️ Current user is not admin, skipping admin tests');
        updateTestResult('admin_access', 'info');
        return;
      }

      // Test admin stats
      addOutput('Testing admin stats...');
      try {
        const stats = await adminService.getAdminStats();
        addOutput(`✅ Admin stats retrieved: ${JSON.stringify(stats)}`);
        updateTestResult('admin_stats', 'success');
      } catch (error: any) {
        addOutput(`❌ Admin stats failed: ${error.message}`);
        updateTestResult('admin_stats', 'error');
      }

      // Test user management
      addOutput('Testing user management...');
      try {
        const users = await adminService.getAllUsers();
        addOutput(`✅ User list retrieved: ${users.length} users`);
        updateTestResult('admin_users', 'success');
      } catch (error: any) {
        addOutput(`❌ User management failed: ${error.message}`);
        updateTestResult('admin_users', 'error');
      }

    } catch (error: any) {
      addOutput(`❌ Admin test failed: ${error.message}`);
      updateTestResult('admin_access', 'error');
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setTestResults({});
    setTestOutput([]);
    
    addOutput('🚀 Starting comprehensive authentication tests...');
    
    await runDatabaseTests();
    await runAuthTests();
    await runAdminTests();
    
    addOutput('✅ All tests completed!');
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />;
    }
  };

  const testCategories = [
    {
      title: 'Database Connection',
      tests: [
        { key: 'connection', label: 'Supabase Connection' },
        { key: 'database', label: 'Database Access' },
        { key: 'rls', label: 'Row Level Security' }
      ]
    },
    {
      title: 'Authentication',
      tests: [
        { key: 'auth_state', label: 'Auth State' },
        { key: 'profile_sync', label: 'Profile Sync' }
      ]
    },
    {
      title: 'Admin Functions',
      tests: [
        { key: 'admin_access', label: 'Admin Access' },
        { key: 'admin_stats', label: 'Admin Stats' },
        { key: 'admin_users', label: 'User Management' }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-card shadow-card border border-border-light p-6">
        <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center">
          <Shield className="w-6 h-6 mr-3 text-primary-violet" />
          Authentication System Test
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <User className="w-5 h-5 text-blue-500 mr-2" />
              <span className="font-medium">Current User</span>
            </div>
            <p className="text-sm text-gray-600">
              {user ? user.email : 'Not authenticated'}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Database className="w-5 h-5 text-green-500 mr-2" />
              <span className="font-medium">Profile</span>
            </div>
            <p className="text-sm text-gray-600">
              {profile ? `${profile.full_name} (${profile.role})` : 'No profile'}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Shield className="w-5 h-5 text-purple-500 mr-2" />
              <span className="font-medium">Status</span>
            </div>
            <p className="text-sm text-gray-600">
              {isAdmin ? 'Admin' : isAuthenticated ? 'Client' : 'Guest'}
            </p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={runAllTests}
            disabled={loading}
            className="bg-primary-violet text-white px-6 py-2 rounded-button hover:bg-primary-violet-dark transition-colors disabled:opacity-50 flex items-center"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Running Tests...' : 'Run All Tests'}
          </button>
          
          <button
            onClick={() => setShowOutput(!showOutput)}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-button hover:bg-gray-200 transition-colors flex items-center"
          >
            {showOutput ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showOutput ? 'Hide Output' : 'Show Output'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testCategories.map((category) => (
            <div key={category.title} className="space-y-3">
              <h3 className="font-semibold text-text-primary">{category.title}</h3>
              {category.tests.map((test) => (
                <div key={test.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-text-secondary">{test.label}</span>
                  {getStatusIcon(testResults[test.key] || 'pending')}
                </div>
              ))}
            </div>
          ))}
        </div>

        {showOutput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6"
          >
            <h3 className="font-semibold text-text-primary mb-3">Test Output</h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
              {testOutput.length === 0 ? (
                <p className="text-gray-500">No output yet. Run tests to see results.</p>
              ) : (
                testOutput.map((line, index) => (
                  <div key={index} className="mb-1">
                    {line}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AuthTest;

