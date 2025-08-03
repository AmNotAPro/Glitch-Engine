import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, FileText, Users, History, LogOut, BarChart3, Upload, Calendar, Settings } from 'lucide-react';
import { useResponsive } from '../../providers/ResponsiveProvider';
import { useTransition } from '../../providers/AnimationProvider';
import { responsiveTokens } from '../../tokens/responsiveTokens';
import { UserProfile } from '../../types';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  profile?: UserProfile;
  onSignOut: () => void;
  type?: 'dashboard' | 'admin';
}

const dashboardNavItems: NavigationItem[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'intake', label: 'Job Intake', icon: FileText },
  { id: 'candidates', label: 'Candidates', icon: Users },
  { id: 'history', label: 'History', icon: History }
];

const adminNavItems: NavigationItem[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'jobs', label: 'Jobs', icon: FileText },
  { id: 'videos', label: 'Videos', icon: Upload },
  { id: 'meetings', label: 'Meetings', icon: Calendar }
];

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  profile,
  onSignOut,
  type = 'dashboard'
}) => {
  const { setMobileMenuOpen } = useResponsive();
  const transition = useTransition('normal');

  const navItems = type === 'admin' ? adminNavItems : dashboardNavItems;

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
    onClose();
    setMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    onSignOut();
    onClose();
    setMobileMenuOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Navigation Panel */}
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-background-white shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-light">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.svg" 
                  alt="Glitch Engine" 
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className={`${responsiveTokens.typography['heading-3']} text-text-primary`}>
                  Glitch Engine
                </span>
              </div>
              <button
                onClick={onClose}
                className={`
                  p-2 rounded-button hover:bg-background-beige transition-colors
                  ${responsiveTokens.interactions['touch-target']}
                  ${responsiveTokens.interactions['focus-ring']}
                `}
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            {/* Profile Section */}
            {profile && (
              <div className="p-4 border-b border-border-light">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-violet rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {profile.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`${responsiveTokens.typography['body']} font-medium text-text-primary truncate`}>
                      {profile.full_name}
                    </p>
                    <p className={`${responsiveTokens.typography['caption']} text-text-secondary truncate`}>
                      {profile.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Items */}
            <div className="flex-1 py-4">
              <nav className="space-y-1 px-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-3 rounded-button text-left transition-colors
                        ${responsiveTokens.interactions['touch-target']}
                        ${responsiveTokens.interactions['focus-ring']}
                        ${isActive 
                          ? 'bg-primary-violet bg-opacity-10 text-primary-violet border-r-2 border-primary-violet' 
                          : 'text-text-secondary hover:text-text-primary hover:bg-background-beige'
                        }
                      `}
                      whileTap={{ scale: 0.98 }}
                      transition={transition}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-primary-violet' : 'text-current'}`} />
                      <span className={`${responsiveTokens.typography['body']} font-medium`}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="ml-auto bg-primary-violet text-white text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </nav>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border-light">
              <motion.button
                onClick={handleSignOut}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-button text-left transition-colors
                  ${responsiveTokens.interactions['touch-target']}
                  ${responsiveTokens.interactions['focus-ring']}
                  text-red-600 hover:bg-red-50
                `}
                whileTap={{ scale: 0.98 }}
                transition={transition}
              >
                <LogOut className="w-5 h-5" />
                <span className={`${responsiveTokens.typography['body']} font-medium`}>
                  Sign Out
                </span>
              </motion.button>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNavigation;

