import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | 'avatar' | 'button' | 'video';
  count?: number;
  className?: string;
}

const SkeletonLoader = ({ variant = 'card', count = 1, className = '' }: SkeletonLoaderProps) => {
  const shimmer = {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  };

  const baseClasses = 'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse';

  const variants = {
    card: `${baseClasses} h-32 rounded-card`,
    text: `${baseClasses} h-4 rounded`,
    avatar: `${baseClasses} w-10 h-10 rounded-full`,
    button: `${baseClasses} h-10 rounded-button`,
    video: `${baseClasses} aspect-video rounded-lg`
  };

  const skeletonClass = `${variants[variant]} ${className}`;

  if (variant === 'card') {
    return (
      <div className="space-y-6">
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            className="bg-background-white rounded-card shadow-card p-6 border border-border-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded-full"
                  {...shimmer}
                />
                <div className="space-y-2 flex-1">
                  <motion.div 
                    className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded w-1/3"
                    {...shimmer}
                  />
                  <motion.div 
                    className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded w-1/2"
                    {...shimmer}
                  />
                </div>
              </div>
              <motion.div 
                className="h-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded"
                {...shimmer}
              />
              <div className="flex gap-2">
                <motion.div 
                  className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded w-20"
                  {...shimmer}
                />
                <motion.div 
                  className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded w-24"
                  {...shimmer}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === 'video') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            className="bg-background-white rounded-card shadow-card border border-border-light overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <motion.div 
              className="aspect-video bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]"
              {...shimmer}
            />
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded-full"
                  {...shimmer}
                />
                <div className="space-y-2 flex-1">
                  <motion.div 
                    className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded w-2/3"
                    {...shimmer}
                  />
                  <motion.div 
                    className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded w-1/2"
                    {...shimmer}
                  />
                </div>
              </div>
              <motion.div 
                className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded-button"
                {...shimmer}
              />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={skeletonClass}
          {...shimmer}
          style={{ animationDelay: `${index * 0.1}s` }}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;