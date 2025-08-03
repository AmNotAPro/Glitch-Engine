import React, { useState, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { useResponsive } from '../../providers/ResponsiveProvider';
import { useTransition } from '../../providers/AnimationProvider';
import { responsiveTokens, semanticColors } from '../../tokens/responsiveTokens';

interface UnifiedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  children: React.ReactNode;
}

const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} border-2 border-current border-t-transparent rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};

export const UnifiedButton: React.FC<UnifiedButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  onClick,
  className = '',
  ...props
}) => {
  const { isMobile } = useResponsive();
  const transition = useTransition('fast');
  const [isPressed, setIsPressed] = useState(false);

  // Button variant styles
  const variants = {
    primary: semanticColors.interactive.primary,
    secondary: 'border border-border-light text-text-secondary hover:text-text-primary hover:border-text-primary bg-background-white',
    ghost: semanticColors.interactive.ghost,
    danger: semanticColors.interactive.danger,
    success: semanticColors.interactive.success
  };

  // Button size styles
  const sizes = {
    sm: responsiveTokens.interactions['button-sm'],
    md: responsiveTokens.interactions['button-md'],
    lg: responsiveTokens.interactions['button-lg'],
    xl: responsiveTokens.interactions['button-xl']
  };

  // Handle touch/mouse interactions
  const handlePressStart = () => {
    if (!disabled && !loading) {
      setIsPressed(true);
    }
  };

  const handlePressEnd = (event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    setIsPressed(false);
    if (!disabled && !loading && onClick) {
      onClick(event as React.MouseEvent<HTMLButtonElement>);
    }
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${responsiveTokens.interactions['touch-target']}
        rounded-button font-semibold transition-colors
        ${responsiveTokens.interactions['focus-ring']}
        disabled:opacity-50 disabled:cursor-not-allowed
        relative overflow-hidden
        ${className}
      `}
      disabled={isDisabled}
      // Touch interactions for mobile
      onTouchStart={isMobile ? handlePressStart : undefined}
      onTouchEnd={isMobile ? handlePressEnd : undefined}
      // Mouse interactions for desktop
      onMouseDown={!isMobile ? handlePressStart : undefined}
      onMouseUp={!isMobile ? handlePressEnd : undefined}
      onClick={!isMobile ? onClick : undefined}
      // Framer Motion animations
      whileHover={!isMobile && !isDisabled ? { scale: 1.02 } : {}}
      whileTap={{ scale: 0.98 }}
      transition={transition}
      style={{
        backgroundColor: isPressed && !isDisabled ? 'rgba(123, 97, 255, 0.1)' : undefined
      }}
      {...props}
    >
      {/* Loading state */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-current bg-opacity-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <LoadingSpinner size={size === 'sm' ? 'sm' : size === 'xl' ? 'lg' : 'md'} />
        </motion.div>
      )}
      
      {/* Button content */}
      <motion.div
        className="flex items-center justify-center gap-2"
        animate={{ opacity: loading ? 0.3 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.button>
  );
};

export default UnifiedButton;

