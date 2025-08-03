import React, { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { useTransition } from '../../providers/AnimationProvider';
import { responsiveTokens } from '../../tokens/responsiveTokens';

interface UnifiedCardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  children: React.ReactNode;
}

export const UnifiedCard: React.FC<UnifiedCardProps> = ({
  padding = 'md',
  hover = false,
  clickable = false,
  children,
  className = '',
  onClick,
  ...props
}) => {
  const transition = useTransition('normal');

  // Padding variants
  const paddingClasses = {
    sm: responsiveTokens.spacing['card-p-sm'],
    md: responsiveTokens.spacing['card-p'],
    lg: responsiveTokens.spacing['card-p-lg']
  };

  // Base card styles
  const baseClasses = `
    bg-background-white 
    rounded-card 
    border border-border-light 
    shadow-card
    ${paddingClasses[padding]}
    ${hover ? 'hover:shadow-card-hover' : ''}
    ${clickable ? 'cursor-pointer' : ''}
    transition-shadow duration-200
  `;

  return (
    <motion.div
      className={`${baseClasses} ${className}`}
      whileHover={hover ? { y: -2 } : {}}
      whileTap={clickable ? { scale: 0.98 } : {}}
      transition={transition}
      onClick={clickable ? onClick : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default UnifiedCard;

