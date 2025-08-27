import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Zap, Play, Users, Target, Clock, CheckCircle, Sparkles, Star, Award, TrendingUp } from 'lucide-react';
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

  // Professional floating elements
  const floatingElements = [
    { Icon: Award, delay: 0, duration: 4, color: 'text-yellow-500' },
    { Icon: TrendingUp, delay: 0.8, duration: 3.5, color: 'text-green-500' },
    { Icon: Star, delay: 1.6, duration: 4.2, color: 'text-blue-500' },
    { Icon: Target, delay: 2.4, duration: 3.8, color: 'text-purple-500' },
    { Icon: CheckCircle, delay: 3.2, duration: 4.5, color: 'text-emerald-500' },
  ];

  // Reduce floating elements on mobile for performance
  const visibleElements = isMobile ? floatingElements.slice(0, 2) : floatingElements;

  return (
    <section 
      id="hero"
      ref={heroRef}
      className={`
        relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50
        pt-20 md:pt-24 overflow-hidden
        ${responsiveTokens.spacing['section-y']}
      `}
    >
      {/* Professional Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric Grid */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, #7B61FF 1px, transparent 1px),
              linear-gradient(180deg, #7B61FF 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-primary-violet/10 to-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
        
        {/* Professional Floating Elements */}
        {enableComplexAnimations && visibleElements.map(({ Icon, delay, duration, color }, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: `${15 + (index * 18)}%`,
              top: `${25 + (index * 12)}%`,
            }}
            animate={!prefersReducedMotion ? {
              y: [0, -40, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.1, 0.3, 0.1],
            } : {}}
            transition={{
              duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay
            }}
          >
            <Icon className={`w-8 h-8 ${color} opacity-20`} />
          </motion.div>
        ))}
      </div>

      <div className={`${responsiveTokens.spacing['container']} mx-auto max-w-7xl relative z-10`}>
        <div className={`${responsiveTokens.layout['hero-grid']} ${responsiveTokens.spacing['grid-gap-lg']} items-center min-h-[85vh]`}>
          {/* Left Content - Enhanced */}
          <motion.div
            className={`${responsiveTokens.spacing['element-gap-lg']} space-y-8 sm:space-y-10`}
            style={isDesktop ? { y, opacity, scale } : {}}
          >
            {/* Trust Badge */}
            <motion.div
              className="flex items-center gap-4 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                  >
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </motion.div>
                ))}
              </div>
              <span className="text-sm text-gray-600 font-medium">Trusted by 200+ agencies</span>
            </motion.div>

            {/* Urgency Badge - Enhanced */}
            <motion.div
              className={`
                inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900
                px-4 py-3 sm:px-6 sm:py-3 rounded-full font-bold shadow-lg
                ${responsiveTokens.typography['caption']}
              `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={!isMobile ? { scale: 1.05, y: -2 } : {}}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
              <span className="text-sm sm:text-base font-bold">Limited: Only 5 spots left this week</span>
            </motion.div>

            {/* Main Headline - Professional Typography */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-6">
                The Future of{' '}
                <motion.span
                  className="relative inline-block"
                  whileHover={!isMobile ? { scale: 1.02 } : {}}
                  transition={{ duration: 0.2 }}
                >
                  <span className="bg-gradient-to-r from-primary-violet via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Async Recruiting
                  </span>
                  <motion.div
                    className="absolute -bottom-2 sm:-bottom-3 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-primary-violet to-blue-600 opacity-30 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.2, delay: 1.2 }}
                  />
                </motion.span>
              </h1>
              
              <div className="text-lg sm:text-xl md:text-2xl text-gray-600 font-medium mb-2">
                for Modern Agencies
              </div>
            </motion.div>

            {/* Enhanced Value Proposition */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p className={`${responsiveTokens.typography['body-xl']} text-gray-700 max-w-2xl leading-relaxed`}>
                We screen <span className="font-bold text-primary-violet">100+ candidates</span> and deliver 
                <span className="font-bold text-primary-violet"> 5 perfect video interviews</span> in just 
                <span className="font-bold text-primary-violet"> 7 days</span>.
              </p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No scheduling hassles</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No endless meetings</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Just results</span>
                </div>
              </div>
            </motion.div>

            {/* Enhanced CTA Section */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <UnifiedButton
                  variant="primary"
                  size={isMobile ? "lg" : "xl"}
                  onClick={() => setShowSignUpModal(true)}
                  className="group shadow-xl hover:shadow-2xl bg-gradient-to-r from-primary-violet to-purple-600 hover:from-primary-violet-dark hover:to-purple-700"
                >
                  <span>Get 5 Free Candidates</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </UnifiedButton>
                
                <UnifiedButton
                  variant="ghost"
                  size={isMobile ? "lg" : "xl"}
                  onClick={() => setShowLoginModal(true)}
                  className="border-2 border-gray-200 hover:border-primary-violet hover:bg-primary-violet/5"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </UnifiedButton>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>7-day delivery</span>
                </div>
              </div>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              className="pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <p className="text-sm text-gray-500 mb-4">Trusted by leading agencies:</p>
              <div className="flex items-center gap-8 opacity-60">
                {['TechCorp', 'InnovateLab', 'GrowthCo', 'ScaleUp'].map((company, index) => (
                  <motion.div
                    key={company}
                    className="text-gray-400 font-semibold text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 1.2 + (index * 0.1) }}
                  >
                    {company}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual - Enhanced Dashboard Mockup */}
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
              {/* Enhanced Main Dashboard */}
              <motion.div
                className="relative"
                whileHover={!isMobile ? { y: -8, rotateY: 5 } : {}}
                transition={{ duration: 0.4 }}
              >
                <UnifiedCard
                  padding={isMobile ? "sm" : "md"}
                  className="border-2 border-gray-100 shadow-2xl bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm"
                >
                  {/* Professional Browser Header */}
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg h-7 flex items-center px-4 border border-gray-200">
                      <span className={`${responsiveTokens.typography['caption']} text-gray-500 font-mono`}>
                        app.glitchengine.com/dashboard
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-6 h-6 bg-gray-100 rounded border border-gray-200"></div>
                      <div className="w-6 h-6 bg-gray-100 rounded border border-gray-200"></div>
                    </div>
                  </div>

                  {/* Enhanced Dashboard Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className={`${responsiveTokens.typography['heading-3']} text-gray-900 font-bold`}>
                        Top 5 Candidates
                      </h3>
                      <p className="text-sm text-gray-500">Ready for your review</p>
                    </div>
                    <div className={`flex items-center gap-2 ${responsiveTokens.typography['caption']} text-gray-500`}>
                      <motion.div 
                        className="w-2 h-2 bg-green-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="font-medium">Live Updates</span>
                    </div>
                  </div>

                  {/* Enhanced Candidate Cards */}
                  <div className="space-y-3">
                    {[
                      { name: 'Sarah Chen', role: 'Senior Marketing Manager', score: 98, experience: '8+ years', color: 'emerald', status: 'Top Pick' },
                      { name: 'Marcus Rodriguez', role: 'Lead Developer', score: 95, experience: '6+ years', color: 'blue', status: 'Excellent' },
                      { name: 'Elena Kowalski', role: 'UX Design Director', score: 93, experience: '7+ years', color: 'purple', status: 'Strong' },
                      { name: 'James Park', role: 'Product Manager', score: 91, experience: '5+ years', color: 'orange', status: 'Good Fit' },
                      { name: 'Sofia Martinez', role: 'Sales Director', score: 89, experience: '9+ years', color: 'pink', status: 'Potential' }
                    ].map((candidate, index) => (
                      <motion.div
                        key={index}
                        className={`
                          group relative overflow-hidden rounded-xl border-2 p-4 cursor-pointer transition-all duration-300
                          ${candidate.color === 'emerald' ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 hover:border-emerald-300 hover:shadow-lg' :
                            candidate.color === 'blue' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300 hover:shadow-lg' :
                            candidate.color === 'purple' ? 'bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200 hover:border-purple-300 hover:shadow-lg' :
                            candidate.color === 'orange' ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 hover:border-orange-300 hover:shadow-lg' :
                            'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200 hover:border-pink-300 hover:shadow-lg'
                          }
                        `}
                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.5, delay: 1.2 + (index * 0.1) }}
                        whileHover={!isMobile ? { scale: 1.02, x: 8 } : {}}
                      >
                        {/* Rank Badge */}
                        <div className={`
                          absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                          ${candidate.color === 'emerald' ? 'bg-emerald-500 text-white' :
                            candidate.color === 'blue' ? 'bg-blue-500 text-white' :
                            candidate.color === 'purple' ? 'bg-purple-500 text-white' :
                            candidate.color === 'orange' ? 'bg-orange-500 text-white' :
                            'bg-pink-500 text-white'
                          }
                        `}>
                          #{index + 1}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <motion.div 
                              className={`
                                w-12 h-12 rounded-xl flex items-center justify-center shadow-md
                                ${candidate.color === 'emerald' ? 'bg-gradient-to-br from-emerald-500 to-green-600' :
                                  candidate.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                                  candidate.color === 'purple' ? 'bg-gradient-to-br from-purple-500 to-violet-600' :
                                  candidate.color === 'orange' ? 'bg-gradient-to-br from-orange-500 to-amber-600' :
                                  'bg-gradient-to-br from-pink-500 to-rose-600'
                                }
                              `}
                              whileHover={{ rotate: 5, scale: 1.1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Play className="w-5 h-5 text-white" />
                            </motion.div>
                            <div>
                              <div className={`${responsiveTokens.typography['body']} font-bold text-gray-900`}>
                                {candidate.name}
                              </div>
                              <div className={`${responsiveTokens.typography['caption']} text-gray-600 font-medium`}>
                                {candidate.role}
                              </div>
                              <div className={`${responsiveTokens.typography['caption']} text-gray-500`}>
                                {candidate.experience} experience
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`
                              font-bold text-lg mb-1
                              ${candidate.color === 'emerald' ? 'text-emerald-600' :
                                candidate.color === 'blue' ? 'text-blue-600' :
                                candidate.color === 'purple' ? 'text-purple-600' :
                                candidate.color === 'orange' ? 'text-orange-600' :
                                'text-pink-600'
                              }
                            `}>
                              {candidate.score}%
                            </div>
                            <div className={`
                              text-xs font-medium px-2 py-1 rounded-full
                              ${candidate.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                                candidate.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                                candidate.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                                candidate.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                                'bg-pink-100 text-pink-700'
                              }
                            `}>
                              {candidate.status}
                            </div>
                          </div>
                        </div>

                        {/* Hover overlay */}
                        <motion.div
                          className="absolute inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-xl"
                          initial={false}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Enhanced Stats Footer */}
                  <motion.div 
                    className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.8 }}
                  >
                    <div className="text-center">
                      <motion.div 
                        className="text-2xl font-bold bg-gradient-to-r from-primary-violet to-blue-600 bg-clip-text text-transparent"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                      >
                        5
                      </motion.div>
                      <div className={`${responsiveTokens.typography['caption']} text-gray-500 font-medium`}>Top Picks</div>
                    </div>
                    <div className="text-center">
                      <motion.div 
                        className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 2.5 }}
                      >
                        100+
                      </motion.div>
                      <div className={`${responsiveTokens.typography['caption']} text-gray-500 font-medium`}>Screened</div>
                    </div>
                    <div className="text-center">
                      <motion.div 
                        className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 3 }}
                      >
                        7
                      </motion.div>
                      <div className={`${responsiveTokens.typography['caption']} text-gray-500 font-medium`}>Days</div>
                    </div>
                  </motion.div>
                </UnifiedCard>
              </motion.div>

              {/* Enhanced Floating Stats */}
              {!isMobile && (
                <>
                  <motion.div
                    className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 2.0, type: "spring" }}
                    whileHover={{ scale: 1.05, rotate: 2, y: -4 }}
                  >
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Award className="w-6 h-6 text-yellow-500 mr-2" />
                        <div className={`${responsiveTokens.typography['heading-2']} bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent`}>
                          98%
                        </div>
                      </div>
                      <div className={`${responsiveTokens.typography['caption']} text-gray-600 font-medium`}>Success Rate</div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
                    initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 2.2, type: "spring" }}
                    whileHover={{ scale: 1.05, rotate: -2, y: -4 }}
                  >
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="w-6 h-6 text-blue-500 mr-2" />
                        <div className={`${responsiveTokens.typography['heading-2']} bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent`}>
                          0
                        </div>
                      </div>
                      <div className={`${responsiveTokens.typography['caption']} text-gray-600 font-medium`}>Meetings</div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute top-1/2 -right-12 bg-white rounded-2xl shadow-xl p-4 border-2 border-gray-100"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 2.4, type: "spring" }}
                    whileHover={{ scale: 1.05, x: 4 }}
                  >
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <TrendingUp className="w-5 h-5 text-green-500 mr-1" />
                        <div className="text-lg font-bold text-green-600">7d</div>
                      </div>
                      <div className="text-xs text-gray-600 font-medium">Delivery</div>
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      {isDesktop && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.5 }}
        >
          <motion.div
            className="flex flex-col items-center gap-2"
            animate={!prefersReducedMotion ? { y: [0, 8, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs text-gray-500 font-medium">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
              <motion.div
                className="w-1 h-3 bg-gray-400 rounded-full mt-2"
                animate={!prefersReducedMotion ? { y: [0, 12, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
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