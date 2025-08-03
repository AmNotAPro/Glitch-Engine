import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Zap, Play, Users, Target, Clock, CheckCircle, Sparkles } from 'lucide-react';
import { useResponsive } from '../providers/ResponsiveProvider';
import { useAnimation, useTransition } from '../providers/AnimationProvider';
import { responsiveTokens } from '../tokens/responsiveTokens';
import SignUpModal from './SignUpModal';
import LoginModal from './LoginModal';
import UnifiedButton from './ui/UnifiedButton';
import UnifiedCard from './ui/UnifiedCard';

const Hero = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const { enableComplexAnimations, enableParallax, prefersReducedMotion } = useAnimation();
  const transition = useTransition('normal');
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Scroll-based animations (only on desktop with complex animations enabled)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Conditional parallax transforms
  const y = enableParallax && isDesktop ? useTransform(scrollYProgress, [0, 1], [0, -100]) : useMotionValue(0);
  const opacity = enableParallax && isDesktop ? useTransform(scrollYProgress, [0, 0.5], [1, 0]) : useMotionValue(1);
  const scale = enableParallax && isDesktop ? useTransform(scrollYProgress, [0, 0.5], [1, 0.8]) : useMotionValue(1);

  // Mouse parallax (only on desktop with complex animations)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  const switchToLogin = () => {
    setShowSignUpModal(false);
    setShowLoginModal(true);
  };

  const switchToSignUp = () => {
    setShowLoginModal(false);
    setShowSignUpModal(true);
  };

  useEffect(() => {
    // Only enable mouse tracking on desktop with complex animations
    if (!enableComplexAnimations || !isDesktop) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        
        setMousePosition({ x: e.clientX, y: e.clientY });
        mouseX.set(x * 20);
        mouseY.set(y * 20);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, enableComplexAnimations, isDesktop]);

  // Floating icons data (reduced for mobile performance)
  const floatingIcons = [
    { Icon: Zap, delay: 0, duration: 3 },
    { Icon: Users, delay: 0.5, duration: 4 },
    { Icon: Target, delay: 1, duration: 3.5 },
    { Icon: Clock, delay: 1.5, duration: 4.5 },
    { Icon: CheckCircle, delay: 2, duration: 3.8 },
    { Icon: Sparkles, delay: 2.5, duration: 4.2 },
  ];

  // Reduce floating icons on mobile for performance
  const visibleIcons = isMobile ? floatingIcons.slice(0, 3) : floatingIcons;

  return (
    <section 
      id="hero"
      ref={heroRef}
      className={`
        relative min-h-screen bg-gradient-to-br from-background-beige via-background-white to-background-beige 
        pt-20 md:pt-24 overflow-hidden
        ${responsiveTokens.spacing['section-y']}
      `}
    >
      {/* Animated Background Elements - Only show if complex animations are enabled */}
      {enableComplexAnimations && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Geometric Shapes */}
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 bg-primary-violet bg-opacity-5 rounded-full"
            animate={!prefersReducedMotion ? {
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            } : {}}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={isDesktop ? {
              x: mouseXSpring,
              y: mouseYSpring,
            } : {}}
          />
          
          <motion.div
            className="absolute top-40 right-20 w-16 h-16 bg-accent-yellow bg-opacity-10 rounded-lg"
            animate={!prefersReducedMotion ? {
              y: [0, 30, 0],
              rotate: [0, -180, -360],
            } : {}}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            style={isDesktop ? {
              x: useTransform(mouseXSpring, [0, 1], [0, -10]),
              y: useTransform(mouseYSpring, [0, 1], [0, -10]),
            } : {}}
          />

          <motion.div
            className="absolute bottom-40 left-20 w-12 h-12 bg-primary-violet bg-opacity-8 rounded-full"
            animate={!prefersReducedMotion ? {
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            } : {}}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />

          {/* Floating Icons - Reduced on mobile */}
          {visibleIcons.map(({ Icon, delay, duration }, index) => (
            <motion.div
              key={index}
              className="absolute"
              style={{
                left: `${10 + (index * 15)}%`,
                top: `${20 + (index * 10)}%`,
              }}
              animate={!prefersReducedMotion ? {
                y: [0, -30, 0],
                rotate: [0, 360],
                opacity: [0.2, 0.6, 0.2],
              } : {}}
              transition={{
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay
              }}
            >
              <Icon className="w-6 h-6 text-primary-violet opacity-20" />
            </motion.div>
          ))}

          {/* Gradient Orbs - Only on desktop */}
          {isDesktop && (
            <motion.div
              className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-primary-violet to-purple-400 rounded-full opacity-5 blur-3xl"
              animate={!prefersReducedMotion ? {
                scale: [1, 1.2, 1],
                opacity: [0.05, 0.1, 0.05],
              } : {}}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </div>
      )}

      <div className={`${responsiveTokens.spacing['container']} mx-auto max-w-7xl relative z-10`}>
        <div className={`${responsiveTokens.layout['hero-grid']} ${responsiveTokens.spacing['grid-gap-lg']} items-center min-h-[80vh]`}>
          {/* Left Content */}
          <motion.div
            className={`${responsiveTokens.spacing['element-gap-lg']} space-y-6 sm:space-y-8`}
            style={isDesktop ? { y, opacity, scale } : {}}
          >
            {/* Urgency Badge */}
            <motion.div
              className={`
                inline-flex items-center gap-2 bg-accent-yellow text-text-primary 
                px-3 py-2 sm:px-4 sm:py-2 rounded-full font-bold
                ${responsiveTokens.typography['caption']}
              `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={!isMobile ? { scale: 1.05 } : {}}
            >
              <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">Only 3 free spots left this week</span>
            </motion.div>

            {/* Main Headline - Responsive Typography */}
            <motion.h1
              className={`${responsiveTokens.typography['display-1']} text-text-primary leading-tight`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              The{' '}
              <motion.span
                className="text-primary-violet relative inline-block"
                whileHover={!isMobile ? { scale: 1.05 } : {}}
                transition={{ duration: 0.2 }}
              >
                Async Recruiting Engine
                <motion.div
                  className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-primary-violet opacity-20 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                />
              </motion.span>
              {' '}for Modern Agencies
            </motion.h1>

            {/* Subheading - Responsive Typography */}
            <motion.p
              className={`${responsiveTokens.typography['body-xl']} text-text-secondary max-w-2xl`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              No calls. No hassle. Just 5 videos. You pick. We deliver.
            </motion.p>

            {/* CTA Button - Touch Optimized */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <UnifiedButton
                variant="primary"
                size={isMobile ? "lg" : "xl"}
                onClick={() => setShowSignUpModal(true)}
                className="group"
              >
                <span>Start in 5 Minutes</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </UnifiedButton>
            </motion.div>
          </motion.div>

          {/* Right Visual - Dashboard Mockup */}
          <motion.div
            className="relative order-first lg:order-last"
            initial={{ opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 20 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            style={isDesktop && enableComplexAnimations ? {
              x: useTransform(mouseXSpring, [0, 1], [0, 10]),
              y: useTransform(mouseYSpring, [0, 1], [0, 10]),
            } : {}}
          >
            <div className="relative">
              {/* Main Dashboard */}
              <UnifiedCard
                padding={isMobile ? "sm" : "md"}
                hover={!isMobile}
                className="border border-border-light"
              >
                {/* Browser Header */}
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-accent-yellow rounded-full"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1 bg-gray-100 rounded-md h-4 sm:h-6 ml-2 sm:ml-4 flex items-center px-2 sm:px-3">
                    <span className={`${responsiveTokens.typography['caption']} text-gray-500`}>
                      glitchengine.com/dashboard
                    </span>
                  </div>
                </div>

                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className={`${responsiveTokens.typography['heading-3']} text-text-primary`}>
                    Top 5 Candidates
                  </h3>
                  <div className={`flex items-center gap-2 ${responsiveTokens.typography['caption']} text-text-secondary`}>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Live
                  </div>
                </div>

                {/* Candidate Cards - Responsive Layout */}
                <div className="space-y-2 sm:space-y-3">
                  {[
                    { name: 'Sarah Chen', role: 'Marketing Manager', score: 95, color: 'green' },
                    { name: 'Mike Johnson', role: 'Senior Developer', score: 92, color: 'violet' },
                    { name: 'Lisa Park', role: 'UX Designer', score: 89, color: 'purple' },
                    { name: 'David Kim', role: 'Product Manager', score: 87, color: 'orange' },
                    { name: 'Alex Rivera', role: 'Sales Director', score: 84, color: 'gray' }
                  ].map((candidate, index) => (
                    <motion.div
                      key={index}
                      className={`
                        flex items-center justify-between p-2 sm:p-4 rounded-lg border-l-2 sm:border-l-4
                        ${candidate.color === 'green' ? 'bg-green-50 border-green-500' :
                          candidate.color === 'violet' ? 'bg-primary-violet bg-opacity-5 border-primary-violet' :
                          candidate.color === 'purple' ? 'bg-purple-50 border-purple-500' :
                          candidate.color === 'orange' ? 'bg-orange-50 border-orange-500' :
                          'bg-gray-50 border-gray-300'
                        }
                      `}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.2 + (index * 0.1) }}
                      whileHover={!isMobile ? { scale: 1.02, x: 5 } : {}}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`
                          w-6 h-6 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                          ${candidate.color === 'green' ? 'bg-green-600' :
                            candidate.color === 'violet' ? 'bg-primary-violet' :
                            candidate.color === 'purple' ? 'bg-purple-600' :
                            candidate.color === 'orange' ? 'bg-orange-600' :
                            'bg-gray-500'
                          }
                        `}>
                          <Play className="w-2 h-2 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <div>
                          <div className={`${responsiveTokens.typography['body-sm']} font-medium text-text-primary`}>
                            {candidate.name}
                          </div>
                          <div className={`${responsiveTokens.typography['caption']} text-text-secondary`}>
                            {candidate.role}
                          </div>
                        </div>
                      </div>
                      <div className={`
                        font-semibold text-xs sm:text-sm
                        ${candidate.color === 'green' ? 'text-green-600' :
                          candidate.color === 'violet' ? 'text-primary-violet' :
                          candidate.color === 'purple' ? 'text-purple-600' :
                          candidate.color === 'orange' ? 'text-orange-600' :
                          'text-text-secondary'
                        }
                      `}>
                        {candidate.score}% Match
                      </div>
                    </motion.div>
                  ))}
                </div>
              </UnifiedCard>

              {/* Floating Stats - Hidden on mobile for cleaner layout */}
              {!isMobile && (
                <>
                  <motion.div
                    className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-background-white rounded-lg shadow-card p-3 sm:p-4 border border-border-light"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.8 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-center">
                      <div className={`${responsiveTokens.typography['heading-2']} text-primary-violet`}>7</div>
                      <div className={`${responsiveTokens.typography['caption']} text-text-secondary`}>Days</div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 bg-background-white rounded-lg shadow-card p-3 sm:p-4 border border-border-light"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 2 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-center">
                      <div className={`${responsiveTokens.typography['heading-2']} text-accent-yellow`}>100+</div>
                      <div className={`${responsiveTokens.typography['caption']} text-text-secondary`}>Screened</div>
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Only show on desktop */}
      {isDesktop && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.2 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-text-secondary rounded-full flex justify-center"
            animate={!prefersReducedMotion ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-3 bg-text-secondary rounded-full mt-2"
              animate={!prefersReducedMotion ? { y: [0, 12, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      )}
      
      {/* Auth Modals */}
      <SignUpModal 
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSwitchToLogin={switchToLogin}
      />
      
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignUp={switchToSignUp}
      />
    </section>
  );
};

export default Hero;

