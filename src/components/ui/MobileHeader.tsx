import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell } from 'lucide-react';
import { useResponsive } from '../../providers/ResponsiveProvider';
import { useTransition } from '../../providers/AnimationProvider';
import { responsiveTokens } from '../../tokens/responsiveTokens';
import { UserProfile } from '../../types';

interface MobileHeaderProps {
  profile?: UserProfile;
  title?: string;
  showNotifications?: boolean;
  notificationCount?: number;
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  profile,
  title = 'Glitch Engine',
  showNotifications = false,
  notificationCount = 0,
  onMenuClick,
  onNotificationClick
}) => {
  const { setMobileMenuOpen } = useResponsive();
  const transition = useTransition('fast');

  const handleMenuClick = () => {
    setMobileMenuOpen(true);
    onMenuClick?.();
  };

  return (
    <header className={`
      bg-background-white border-b border-border-light
      ${responsiveTokens.spacing['section-x']} py-4
      flex items-center justify-between
      sticky top-0 z-30
    `}>
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <motion.button
          onClick={handleMenuClick}
          className={`
            p-2 rounded-button hover:bg-background-beige transition-colors
            ${responsiveTokens.interactions['touch-target']}
            ${responsiveTokens.interactions['focus-ring']}
          `}
          whileTap={{ scale: 0.95 }}
          transition={transition}
        >
          <Menu className="w-6 h-6 text-text-secondary" />
        </motion.button>
        
        <div className="flex items-center gap-2">
          <img 
            src="/logo.png" 
            alt="Glitch Engine Logo" 
            className="w-6 h-6 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className={`${responsiveTokens.typography['heading-3']} text-text-primary`}>
            {title}
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        {showNotifications && (
          <motion.button
            onClick={onNotificationClick}
            className={`
              relative p-2 rounded-button hover:bg-background-beige transition-colors
              ${responsiveTokens.interactions['touch-target']}
              ${responsiveTokens.interactions['focus-ring']}
            `}
            whileTap={{ scale: 0.95 }}
            transition={transition}
          >
            <Bell className="w-5 h-5 text-text-secondary" />
            {notificationCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                {notificationCount > 9 ? '9+' : notificationCount}
              </motion.span>
            )}
          </motion.button>
        )}

        {/* Profile Avatar */}
        {profile && (
          <motion.div
            className="w-8 h-8 bg-primary-violet rounded-full flex items-center justify-center text-white font-bold text-sm"
            whileTap={{ scale: 0.95 }}
            transition={transition}
          >
            {profile.full_name.charAt(0).toUpperCase()}
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;