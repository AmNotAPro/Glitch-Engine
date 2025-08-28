import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Zap, Play, Users, Target, Clock, CheckCircle, Sparkles, Star, Award, TrendingUp, Shield, Globe, Rocket } from 'lucide-react';
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
    { Icon: Shield, delay: 0, duration: 4, color: 'text-blue-500', position: { top: '15%', left: '8%' } },
    { Icon: Globe, delay: 0.8, duration: 3.5, color: 'text-green-500', position: { top: '25%', right: '12%' } },
    { Icon: Rocket, delay: 1.6, duration: 4.2, color: 'text-purple-500', position: { bottom: '30%', left: '5%' } },
    { Icon: Target, delay: 2.4, duration: 3.8, color: 'text-orange-500', position: { bottom: '20%', right: '8%' } },
    { Icon: Award, delay: 3.2, duration: 4.5, color: 'text-yellow-500', position: { top: '40%', left: '15%' } },
  ];

  // Reduce floating elements on mobile for performance
  const visibleElements = isMobile ? floatingElements.slice(0, 2) : floatingElements;

  return (
    <section 
      id="hero"
      ref={heroRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 pt-20 md:pt-24 overflow-hidden"
    >
      {/* Enhanced Professional Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Sophisticated Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.015]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, #1e293b 1px, transparent 1px),
              linear-gradient(180deg, #1e293b 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }} />
        </div>

        {/* Premium Gradient Orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 via-purple-400/15 to-indigo-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-tl from-violet-400/20 via-purple-400/15 to-pink-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl" />
        
        {/* Professional Floating Elements */}
        {enableComplexAnimations && visibleElements.map(({ Icon, delay, duration, color, position }, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={position}
            animate={!prefersReducedMotion ? {
              y: [0, -30, 0],
              rotate: [0, 5, -5, 0],
              opacity: [0.1, 0.25, 0.1],
            } : {}}
            transition={{
              duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay
            }}
          >
            <Icon className={`w-6 h-6 md:w-8 md:h-8 ${color} opacity-30`} />
          </motion.div>
        ))}

        {/* Animated Mesh Gradient */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className={`${responsiveTokens.spacing['container']} mx-auto max-w-7xl relative z-10`}>
        <div className={`${responsiveTokens.layout['hero-grid']} ${responsiveTokens.spacing['grid-gap-lg']} items-center min-h-[90vh]`}>
          {/* Left Content - Enhanced Professional Design */}
          <motion.div
            className="space-y-8 lg:space-y-12"
            style={isDesktop ? { y, opacity, scale } : {}}
          >
            {/* Premium Trust Indicators */}
            <motion.div
              className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* Rating Badge */}
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-gray-200/50">
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
                <span className="text-sm font-semibold text-gray-700">4.9/5 from 200+ agencies</span>
              </div>

              {/* Live Activity Badge */}
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2">
                <motion.div 
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm font-medium text-green-700">12 agencies hiring this week</span>
              </div>
            </motion.div>

            {/* Enhanced Urgency Badge */}
            <motion.div
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-2xl font-bold shadow-xl border border-orange-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={!isMobile ? { scale: 1.05, y: -2 } : {}}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-5 h-5" />
              </motion.div>
              <span className="text-base font-bold">⚡ Limited: Only 5 spots left this week</span>
            </motion.div>

            {/* Professional Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 leading-[0.9] mb-8">
                <span className="block mb-2">Hire Top Talent</span>
                <motion.span
                  className="relative inline-block"
                  whileHover={!isMobile ? { scale: 1.02 } : {}}
                  transition={{ duration: 0.2 }}
                >
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Without Meetings
                  </span>
                  <motion.div
                    className="absolute -bottom-3 sm:-bottom-4 left-0 right-0 h-2 sm:h-3 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-20 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.2, delay: 1.2 }}
                  />
                </motion.span>
              </h1>
            </motion.div>

            {/* Enhanced Value Proposition */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 font-medium leading-relaxed max-w-3xl">
                We screen <span className="font-black text-indigo-600">100+ candidates</span> and deliver{' '}
                <span className="font-black text-purple-600">5 perfect video interviews</span> in just{' '}
                <span className="font-black text-blue-600">7 days</span>.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-200/50 shadow-sm">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-semibold text-gray-700">Zero scheduling</span>
                </div>
                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-200/50 shadow-sm">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-semibold text-gray-700">No endless calls</span>
                </div>
                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-200/50 shadow-sm">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-semibold text-gray-700">Pure results</span>
                </div>
              </div>
            </motion.div>

            {/* Premium CTA Section */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <UnifiedButton
                  variant="primary"
                  size={isMobile ? "lg" : "xl"}
                  onClick={() => setShowSignUpModal(true)}
                  className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 shadow-2xl hover:shadow-3xl border-0 text-lg font-bold px-8 py-5"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                  <span className="relative z-10 flex items-center gap-3">
                    <Sparkles className="w-6 h-6" />
                    Get 5 Free Candidates
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </UnifiedButton>
                
                <UnifiedButton
                  variant="ghost"
                  size={isMobile ? "lg" : "xl"}
                  onClick={() => setShowLoginModal(true)}
                  className="border-2 border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 font-bold px-8 py-5 text-lg"
                >
                  <Play className="w-6 h-6" />
                  <span>Watch Demo</span>
                </UnifiedButton>
              </div>
              
              {/* Enhanced Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
                  <span className="font-semibold">100% Free to Start</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-sm"></div>
                  <span className="font-semibold">No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse shadow-sm"></div>
                  <span className="font-semibold">7-Day Guarantee</span>
                </div>
              </div>
            </motion.div>

            {/* Premium Social Proof */}
            <motion.div
              className="pt-8 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <div className="flex items-center gap-4">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Trusted by Industry Leaders:</p>
                <div className="flex -space-x-2">
                  {['TC', 'IL', 'GC', 'SU', 'VX'].map((initials, index) => (
                    <motion.div
                      key={initials}
                      className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-md"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2 + (index * 0.1) }}
                    >
                      {initials}
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 opacity-70">
                {['TechFlow', 'InnovateLab', 'GrowthCorp', 'ScaleVentures'].map((company, index) => (
                  <motion.div
                    key={company}
                    className="text-gray-500 font-bold text-sm tracking-wide"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ delay: 1.4 + (index * 0.1) }}
                    whileHover={{ opacity: 1, scale: 1.05 }}
                  >
                    {company}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual - Premium Dashboard Mockup */}
          <motion.div
            className="relative order-first lg:order-last"
            initial={{ opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 20 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            style={isDesktop && enableComplexAnimations ? {
              x: useTransform(mouseXSpring, [0, 1], [0, 15]),
              y: useTransform(mouseYSpring, [0, 1], [0, 15]),
            } : {}}
          >
            <div className="relative perspective-1000">
              {/* Premium Main Dashboard */}
              <motion.div
                className="relative transform-gpu"
                whileHover={!isMobile ? { y: -12, rotateX: 5, rotateY: 5 } : {}}
                transition={{ duration: 0.4 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-6 md:p-8 relative overflow-hidden">
                  {/* Glassmorphism overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-3xl" />
                  
                  {/* Premium Browser Header */}
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100 relative z-10">
                    <div className="flex gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
                      <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
                      <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
                    </div>
                    <div className="flex-1 bg-gray-50/80 backdrop-blur-sm rounded-xl h-8 flex items-center px-4 border border-gray-200/50 shadow-inner">
                      <span className="text-sm text-gray-600 font-mono">
                        🔒 app.glitchengine.com/dashboard
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-7 h-7 bg-gray-100 rounded-lg border border-gray-200 shadow-sm"></div>
                      <div className="w-7 h-7 bg-gray-100 rounded-lg border border-gray-200 shadow-sm"></div>
                    </div>
                  </div>

                  {/* Premium Dashboard Header */}
                  <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        Elite Candidate Pipeline
                      </h3>
                      <p className="text-gray-600 font-medium">5 top performers ready for review</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full border border-green-200">
                        <motion.div 
                          className="w-2 h-2 bg-green-500 rounded-full"
                          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-xs font-bold text-green-700">LIVE</span>
                      </div>
                    </div>
                  </div>

                  {/* Premium Candidate Cards */}
                  <div className="space-y-4 relative z-10">
                    {[
                      { name: 'Alexandra Chen', role: 'Senior Marketing Director', score: 98, experience: '8+ years', skills: ['Strategy', 'Growth', 'Analytics'], color: 'emerald', status: 'Elite', company: 'Ex-Google' },
                      { name: 'Marcus Thompson', role: 'Lead Full-Stack Engineer', score: 96, experience: '7+ years', skills: ['React', 'Node.js', 'AWS'], color: 'blue', status: 'Expert', company: 'Ex-Meta' },
                      { name: 'Sofia Rodriguez', role: 'UX Design Principal', score: 94, experience: '9+ years', skills: ['Design Systems', 'Research', 'Strategy'], color: 'purple', status: 'Senior', company: 'Ex-Apple' },
                      { name: 'David Kim', role: 'Product Strategy Lead', score: 92, experience: '6+ years', skills: ['Product', 'Analytics', 'Growth'], color: 'orange', status: 'Strong', company: 'Ex-Stripe' },
                      { name: 'Emma Wilson', role: 'Sales Operations Director', score: 90, experience: '8+ years', skills: ['Sales', 'Operations', 'CRM'], color: 'pink', status: 'Solid', company: 'Ex-Salesforce' }
                    ].map((candidate, index) => (
                      <motion.div
                        key={index}
                        className={`
                          group relative overflow-hidden rounded-2xl border-2 p-5 cursor-pointer transition-all duration-300 backdrop-blur-sm
                          ${candidate.color === 'emerald' ? 'bg-gradient-to-r from-emerald-50/80 to-green-50/80 border-emerald-200 hover:border-emerald-300 hover:shadow-xl' :
                            candidate.color === 'blue' ? 'bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-blue-200 hover:border-blue-300 hover:shadow-xl' :
                            candidate.color === 'purple' ? 'bg-gradient-to-r from-purple-50/80 to-violet-50/80 border-purple-200 hover:border-purple-300 hover:shadow-xl' :
                            candidate.color === 'orange' ? 'bg-gradient-to-r from-orange-50/80 to-amber-50/80 border-orange-200 hover:border-orange-300 hover:shadow-xl' :
                            'bg-gradient-to-r from-pink-50/80 to-rose-50/80 border-pink-200 hover:border-pink-300 hover:shadow-xl'
                          }
                        `}
                        initial={{ opacity: 0, x: -30, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.5, delay: 1.4 + (index * 0.1) }}
                        whileHover={!isMobile ? { scale: 1.02, x: 12 } : {}}
                      >
                        {/* Elite Badge */}
                        <div className={`
                          absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm
                          ${candidate.color === 'emerald' ? 'bg-emerald-500 text-white' :
                            candidate.color === 'blue' ? 'bg-blue-500 text-white' :
                            candidate.color === 'purple' ? 'bg-purple-500 text-white' :
                            candidate.color === 'orange' ? 'bg-orange-500 text-white' :
                            'bg-pink-500 text-white'
                          }
                        `}>
                          {candidate.status}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <motion.div 
                              className={`
                                w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden
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
                              <Play className="w-6 h-6 text-white relative z-10" />
                              <motion.div
                                className="absolute inset-0 bg-white/20"
                                animate={{ scale: [1, 1.2, 1], opacity: [0, 0.3, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                              />
                            </motion.div>
                            <div>
                              <div className="font-bold text-gray-900 text-lg mb-1">
                                {candidate.name}
                              </div>
                              <div className="text-gray-700 font-semibold text-sm mb-1">
                                {candidate.role}
                              </div>
                              <div className="text-gray-500 text-xs font-medium mb-2">
                                {candidate.experience} • {candidate.company}
                              </div>
                              <div className="flex gap-1">
                                {candidate.skills.slice(0, 2).map((skill, skillIndex) => (
                                  <span key={skillIndex} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">
                                    {skill}
                                  </span>
                                ))}
                                {candidate.skills.length > 2 && (
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">
                                    +{candidate.skills.length - 2}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`
                              font-black text-2xl mb-2
                              ${candidate.color === 'emerald' ? 'text-emerald-600' :
                                candidate.color === 'blue' ? 'text-blue-600' :
                                candidate.color === 'purple' ? 'text-purple-600' :
                                candidate.color === 'orange' ? 'text-orange-600' :
                                'text-pink-600'
                              }
                            `}>
                              {candidate.score}%
                            </div>
                            <div className="text-xs text-gray-500 font-semibold">
                              Perfect Match
                            </div>
                          </div>
                        </div>

                        {/* Premium hover overlay */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl"
                          initial={false}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Premium Stats Footer */}
                  <motion.div 
                    className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-3 gap-6 relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 2.0 }}
                  >
                    <div className="text-center">
                      <motion.div 
                        className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 2.2 }}
                      >
                        5
                      </motion.div>
                      <div className="text-xs text-gray-600 font-bold uppercase tracking-wide">Elite Picks</div>
                    </div>
                    <div className="text-center">
                      <motion.div 
                        className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 2.7 }}
                      >
                        100+
                      </motion.div>
                      <div className="text-xs text-gray-600 font-bold uppercase tracking-wide">Screened</div>
                    </div>
                    <div className="text-center">
                      <motion.div 
                        className="text-3xl font-black bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-1"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 3.2 }}
                      >
                        7d
                      </motion.div>
                      <div className="text-xs text-gray-600 font-bold uppercase tracking-wide">Delivery</div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Premium Floating Stats */}
              {!isMobile && (
                <>
                  <motion.div
                    className="absolute -top-8 -right-8 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-gray-200/50"
                    initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 2.4, type: "spring" }}
                    whileHover={{ scale: 1.05, rotate: 3, y: -6 }}
                  >
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-3">
                        <Award className="w-6 h-6 text-yellow-500 mr-2" />
                        <div className="text-3xl font-black bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                          98%
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 font-bold uppercase tracking-wide">Success Rate</div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-gray-200/50"
                    initial={{ opacity: 0, scale: 0.8, rotate: 8 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 2.6, type: "spring" }}
                    whileHover={{ scale: 1.05, rotate: -3, y: -6 }}
                  >
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-3">
                        <Clock className="w-6 h-6 text-blue-500 mr-2" />
                        <div className="text-3xl font-black bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                          0
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 font-bold uppercase tracking-wide">Meetings</div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute top-1/3 -right-16 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-5 border border-gray-200/50"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 2.8, type: "spring" }}
                    whileHover={{ scale: 1.05, x: 6 }}
                  >
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                        <div className="text-2xl font-black text-green-600">7d</div>
                      </div>
                      <div className="text-xs text-gray-600 font-bold uppercase tracking-wide">Fast Track</div>
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Professional Scroll Indicator */}
      {isDesktop && (
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 3.0 }}
        >
          <motion.div
            className="flex flex-col items-center gap-3"
            animate={!prefersReducedMotion ? { y: [0, 8, 0] } : {}}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <span className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Discover More</span>
            <div className="w-8 h-12 border-2 border-gray-400 rounded-full flex justify-center bg-white/50 backdrop-blur-sm shadow-lg">
              <motion.div
                className="w-1.5 h-4 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mt-2"
                animate={!prefersReducedMotion ? { y: [0, 16, 0] } : {}}
                transition={{ duration: 2.5, repeat: Infinity }}
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