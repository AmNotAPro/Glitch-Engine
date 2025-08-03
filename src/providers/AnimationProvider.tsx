import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { useResponsive } from './ResponsiveProvider';

interface AnimationContextType {
  enableComplexAnimations: boolean;
  enableParallax: boolean;
  maxSimultaneousAnimations: number;
  animationDuration: number;
  deviceCapability: 'low' | 'medium' | 'high';
  prefersReducedMotion: boolean;
  transitionConfig: {
    fast: { duration: number; ease: string };
    normal: { duration: number; ease: string };
    slow: { duration: number; ease: string };
    spring: { type: string; stiffness: number; damping: number };
  };
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

interface AnimationProviderProps {
  children: ReactNode;
}

// Custom hook to detect prefers-reduced-motion
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  const { isMobile, isTablet } = useResponsive();
  const [deviceCapability, setDeviceCapability] = useState<'low' | 'medium' | 'high'>('high');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    // Device capability detection
    const detectCapability = () => {
      try {
        // Create a canvas to test WebGL capabilities
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
          setDeviceCapability('low');
          return;
        }

        const renderer = gl.getParameter(gl.RENDERER) || '';
        const vendor = gl.getParameter(gl.VENDOR) || '';
        
        // Mobile devices typically have lower capability
        if (isMobile) {
          // Check for high-end mobile GPUs
          if (renderer.includes('Apple') || renderer.includes('A15') || renderer.includes('A16')) {
            setDeviceCapability('medium');
          } else {
            setDeviceCapability('low');
          }
        } else if (isTablet) {
          // Tablets are generally medium capability
          setDeviceCapability('medium');
        } else {
          // Desktop capability detection
          if (renderer.includes('Intel')) {
            setDeviceCapability('medium');
          } else if (renderer.includes('NVIDIA') || renderer.includes('AMD') || renderer.includes('Radeon')) {
            setDeviceCapability('high');
          } else {
            setDeviceCapability('medium');
          }
        }
      } catch (error) {
        // Fallback to device type if WebGL detection fails
        if (isMobile) {
          setDeviceCapability('low');
        } else if (isTablet) {
          setDeviceCapability('medium');
        } else {
          setDeviceCapability('high');
        }
      }
    };

    detectCapability();
  }, [isMobile, isTablet]);

  // Compute animation configuration based on device capability and user preferences
  const animationConfig = useMemo((): AnimationContextType => {
    // If user prefers reduced motion, disable all animations
    if (prefersReducedMotion) {
      return {
        enableComplexAnimations: false,
        enableParallax: false,
        maxSimultaneousAnimations: 0,
        animationDuration: 0,
        deviceCapability,
        prefersReducedMotion,
        transitionConfig: {
          fast: { duration: 0, ease: "linear" },
          normal: { duration: 0, ease: "linear" },
          slow: { duration: 0, ease: "linear" },
          spring: { type: "tween", stiffness: 0, damping: 0 }
        }
      };
    }

    // Configure based on device capability
    switch (deviceCapability) {
      case 'low':
        return {
          enableComplexAnimations: false,
          enableParallax: false,
          maxSimultaneousAnimations: 3,
          animationDuration: 0.2,
          deviceCapability,
          prefersReducedMotion,
          transitionConfig: {
            fast: { duration: 0.1, ease: "easeOut" },
            normal: { duration: 0.2, ease: "easeInOut" },
            slow: { duration: 0.3, ease: "easeInOut" },
            spring: { type: "tween", stiffness: 200, damping: 20 }
          }
        };

      case 'medium':
        return {
          enableComplexAnimations: false,
          enableParallax: false,
          maxSimultaneousAnimations: 8,
          animationDuration: 0.4,
          deviceCapability,
          prefersReducedMotion,
          transitionConfig: {
            fast: { duration: 0.15, ease: "easeOut" },
            normal: { duration: 0.3, ease: "easeInOut" },
            slow: { duration: 0.5, ease: "easeInOut" },
            spring: { type: "spring", stiffness: 250, damping: 22 }
          }
        };

      case 'high':
      default:
        return {
          enableComplexAnimations: true,
          enableParallax: true,
          maxSimultaneousAnimations: 20,
          animationDuration: 0.6,
          deviceCapability,
          prefersReducedMotion,
          transitionConfig: {
            fast: { duration: 0.15, ease: "easeOut" },
            normal: { duration: 0.3, ease: "easeInOut" },
            slow: { duration: 0.6, ease: "easeInOut" },
            spring: { type: "spring", stiffness: 300, damping: 25 }
          }
        };
    }
  }, [deviceCapability, prefersReducedMotion]);

  return (
    <AnimationContext.Provider value={animationConfig}>
      {children}
    </AnimationContext.Provider>
  );
};

// Custom hook to use animation context
export const useAnimation = (): AnimationContextType => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

// Custom hook for transition configurations
export const useTransition = (speed: 'fast' | 'normal' | 'slow' | 'spring' = 'normal') => {
  const { transitionConfig } = useAnimation();
  return transitionConfig[speed];
};

export default AnimationProvider;

