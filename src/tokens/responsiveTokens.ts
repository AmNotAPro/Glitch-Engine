// Responsive Design Tokens for Glitch Engine
// These tokens ensure consistent responsive behavior across all components

export const responsiveTokens = {
  // Responsive Typography Scale
  typography: {
    // Display text for hero sections and major headlines
    'display-1': 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold',
    'display-2': 'text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold',
    
    // Heading hierarchy
    'heading-1': 'text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold',
    'heading-2': 'text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold',
    'heading-3': 'text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium',
    'heading-4': 'text-sm sm:text-base md:text-lg lg:text-xl font-medium',
    
    // Body text variants
    'body-xl': 'text-base sm:text-lg md:text-xl leading-relaxed',
    'body-lg': 'text-sm sm:text-base md:text-lg leading-relaxed',
    'body': 'text-xs sm:text-sm md:text-base leading-normal',
    'body-sm': 'text-xs sm:text-sm leading-normal',
    
    // UI text
    'caption': 'text-xs sm:text-sm leading-tight',
    'label': 'text-xs sm:text-sm font-medium',
    'button': 'text-sm sm:text-base font-semibold'
  },

  // Responsive Spacing System
  spacing: {
    // Container padding for different screen sizes
    'container': 'px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16',
    'container-narrow': 'px-4 sm:px-6 md:px-8',
    'container-wide': 'px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20',
    
    // Section spacing (vertical)
    'section-y': 'py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24',
    'section-y-sm': 'py-6 sm:py-8 md:py-12 lg:py-16',
    'section-y-lg': 'py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32',
    
    // Section spacing (horizontal)
    'section-x': 'px-4 sm:px-6 md:px-8 lg:px-12',
    
    // Card padding
    'card-p': 'p-4 sm:p-6 md:p-8 lg:p-10',
    'card-p-sm': 'p-3 sm:p-4 md:p-6',
    'card-p-lg': 'p-6 sm:p-8 md:p-10 lg:p-12',
    
    // Element gaps
    'element-gap': 'gap-4 sm:gap-6 md:gap-8 lg:gap-10',
    'element-gap-sm': 'gap-2 sm:gap-3 md:gap-4',
    'element-gap-lg': 'gap-6 sm:gap-8 md:gap-10 lg:gap-12',
    
    // Grid gaps
    'grid-gap': 'gap-4 sm:gap-6 md:gap-8 lg:gap-12',
    'grid-gap-sm': 'gap-3 sm:gap-4 md:gap-6',
    'grid-gap-lg': 'gap-6 sm:gap-8 md:gap-12 lg:gap-16'
  },

  // Responsive Layout Patterns
  layout: {
    // Auto-fitting grids
    'grid-auto': 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    'grid-auto-sm': 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    'grid-auto-lg': 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    
    // Fixed column grids
    'grid-two': 'grid grid-cols-1 md:grid-cols-2',
    'grid-three': 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    'grid-four': 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    
    // Special layouts
    'hero-grid': 'grid grid-cols-1 lg:grid-cols-2',
    'sidebar-layout': 'grid grid-cols-1 lg:grid-cols-[256px_1fr]',
    
    // Flexbox patterns
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'flex-col-center': 'flex flex-col items-center justify-center',
    'flex-responsive': 'flex flex-col sm:flex-row'
  },

  // Touch-Optimized Interactions
  interactions: {
    // Touch target minimum sizes (44px minimum for accessibility)
    'touch-target': 'min-h-[44px] min-w-[44px]',
    'touch-target-sm': 'min-h-[36px] min-w-[36px]',
    'touch-target-lg': 'min-h-[48px] min-w-[48px]',
    
    // Button sizes with touch optimization
    'button-sm': 'px-3 py-1.5 text-sm min-h-[36px] sm:min-h-[32px]',
    'button-md': 'px-4 py-2 text-base min-h-[40px] sm:min-h-[36px]',
    'button-lg': 'px-6 py-3 text-lg min-h-[44px] sm:min-h-[40px]',
    'button-xl': 'px-8 py-4 text-xl min-h-[48px] sm:min-h-[44px]',
    
    // Interactive states
    'hover-lift': 'hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200',
    'hover-scale': 'hover:scale-105 transition-transform duration-200',
    'active-press': 'active:scale-95 transition-transform duration-100',
    
    // Focus states for accessibility
    'focus-ring': 'focus:outline-none focus:ring-2 focus:ring-primary-violet focus:ring-opacity-50',
    'focus-visible': 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-violet'
  },

  // Responsive Breakpoint Utilities
  breakpoints: {
    // Show/hide at different breakpoints
    'mobile-only': 'block sm:hidden',
    'tablet-only': 'hidden sm:block lg:hidden',
    'desktop-only': 'hidden lg:block',
    'mobile-tablet': 'block lg:hidden',
    'tablet-desktop': 'hidden sm:block',
    
    // Responsive positioning
    'mobile-fixed': 'fixed sm:relative',
    'mobile-full': 'w-full sm:w-auto',
    'mobile-center': 'mx-auto sm:mx-0'
  },

  // Animation Responsive Patterns
  animations: {
    // Entrance animations
    'fade-in': 'animate-in fade-in duration-300',
    'slide-in-up': 'animate-in slide-in-from-bottom-4 duration-300',
    'slide-in-down': 'animate-in slide-in-from-top-4 duration-300',
    'slide-in-left': 'animate-in slide-in-from-left-4 duration-300',
    'slide-in-right': 'animate-in slide-in-from-right-4 duration-300',
    
    // Exit animations
    'fade-out': 'animate-out fade-out duration-200',
    'slide-out-up': 'animate-out slide-out-to-top-4 duration-200',
    'slide-out-down': 'animate-out slide-out-to-bottom-4 duration-200',
    
    // Transition durations
    'transition-fast': 'transition-all duration-150 ease-out',
    'transition-normal': 'transition-all duration-300 ease-in-out',
    'transition-slow': 'transition-all duration-500 ease-in-out'
  }
};

// Semantic Color Tokens (extending existing design system)
export const semanticColors = {
  status: {
    'not-started': 'bg-gray-100 text-gray-800 border-gray-200',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
    'warning': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'success': 'bg-green-100 text-green-800 border-green-200',
    'completed': 'bg-purple-100 text-purple-800 border-purple-200',
    'error': 'bg-red-100 text-red-800 border-red-200'
  },
  
  interactive: {
    'primary': 'bg-primary-violet text-white hover:bg-primary-violet-dark',
    'secondary': 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    'ghost': 'text-primary-violet hover:bg-primary-violet hover:bg-opacity-10',
    'danger': 'bg-red-500 text-white hover:bg-red-600',
    'success': 'bg-green-500 text-white hover:bg-green-600'
  }
};

// Component-specific token combinations
export const componentTokens = {
  // Card variants
  card: {
    'default': `bg-background-white rounded-card border border-border-light shadow-card ${responsiveTokens.spacing['card-p']}`,
    'hover': `bg-background-white rounded-card border border-border-light shadow-card hover:shadow-card-hover transition-shadow ${responsiveTokens.spacing['card-p']}`,
    'interactive': `bg-background-white rounded-card border border-border-light shadow-card hover:shadow-card-hover cursor-pointer transition-all duration-200 ${responsiveTokens.spacing['card-p']}`
  },
  
  // Button variants
  button: {
    'primary': `${semanticColors.interactive.primary} ${responsiveTokens.interactions['button-md']} ${responsiveTokens.interactions['touch-target']} rounded-button font-semibold transition-colors ${responsiveTokens.interactions['focus-ring']}`,
    'secondary': `border border-border-light text-text-secondary hover:text-text-primary hover:border-text-primary ${responsiveTokens.interactions['button-md']} ${responsiveTokens.interactions['touch-target']} rounded-button font-semibold transition-colors ${responsiveTokens.interactions['focus-ring']}`,
    'ghost': `${semanticColors.interactive.ghost} ${responsiveTokens.interactions['button-md']} ${responsiveTokens.interactions['touch-target']} rounded-button font-semibold transition-colors ${responsiveTokens.interactions['focus-ring']}`
  },
  
  // Navigation variants
  navigation: {
    'mobile-menu': `fixed inset-y-0 left-0 z-50 w-64 bg-background-white shadow-xl transform transition-transform duration-300 ease-in-out`,
    'desktop-sidebar': `w-64 bg-background-white border-r border-border-light`,
    'mobile-header': `bg-background-white border-b border-border-light ${responsiveTokens.spacing['section-x']} py-4`
  }
};

export default responsiveTokens;

