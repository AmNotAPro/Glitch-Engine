import React from 'react';
import { useAuth } from '../hooks/useAuth.tsx';

const AuthDebug = () => {
  const { user, profile, loading, isAuthenticated, initializing, isAdmin } = useAuth();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs font-mono max-w-sm z-50">
      <div className="font-bold mb-2">🔍 Auth Debug</div>
      <div>initializing: {initializing ? '✅' : '❌'}</div>
      <div>loading: {loading ? '✅' : '❌'}</div>
      <div>isAuthenticated: {isAuthenticated ? '✅' : '❌'}</div>
      <div>user: {user ? `✅ ${user.email}` : '❌'}</div>
      <div>profile: {profile ? `✅ ${profile.role}` : '❌'}</div>
      <div>isAdmin: {isAdmin ? '✅' : '❌'}</div>
      <div className="mt-2 text-xs opacity-75">
        {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default AuthDebug;

