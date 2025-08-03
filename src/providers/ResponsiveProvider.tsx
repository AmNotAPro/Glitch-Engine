import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ResponsiveContextType {
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(undefined);

interface ResponsiveProviderProps {
  children: ReactNode;
}

// Debounce utility function
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const ResponsiveProvider: React.FC<ResponsiveProviderProps> = ({ children }) => {
  const [breakpoint, setBreakpoint] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('lg');
  const [dimensions, setDimensions] = useState({ width: 1024, height: 768 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Breakpoint detection with debouncing for performance
    const updateBreakpoint = debounce(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDimensions({ width, height });
      
      // Tailwind breakpoints: xs < 640, sm >= 640, md >= 768, lg >= 1024, xl >= 1280
      if (width < 640) {
        setBreakpoint('xs');
      } else if (width < 768) {
        setBreakpoint('sm');
      } else if (width < 1024) {
        setBreakpoint('md');
      } else if (width < 1280) {
        setBreakpoint('lg');
      } else {
        setBreakpoint('xl');
      }
    }, 100);

    // Initial breakpoint detection
    updateBreakpoint();

    // Add resize listener
    window.addEventListener('resize', updateBreakpoint);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  // Auto-close mobile menu when switching to desktop
  useEffect(() => {
    if ((breakpoint === 'lg' || breakpoint === 'xl') && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [breakpoint, mobileMenuOpen]);

  // Compute responsive states
  const isMobile = breakpoint === 'xs' || breakpoint === 'sm';
  const isTablet = breakpoint === 'md';
  const isDesktop = breakpoint === 'lg' || breakpoint === 'xl';

  const contextValue: ResponsiveContextType = {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    width: dimensions.width,
    height: dimensions.height,
    mobileMenuOpen,
    setMobileMenuOpen,
    sidebarCollapsed,
    setSidebarCollapsed
  };

  return (
    <ResponsiveContext.Provider value={contextValue}>
      {children}
    </ResponsiveContext.Provider>
  );
};

// Custom hook to use responsive context
export const useResponsive = (): ResponsiveContextType => {
  const context = useContext(ResponsiveContext);
  if (context === undefined) {
    throw new Error('useResponsive must be used within a ResponsiveProvider');
  }
  return context;
};

export default ResponsiveProvider;

