import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { 
  FileText, 
  Search, 
  UserCheck, 
  Play, 
  CheckCircle,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

const StepByStepFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Use Framer Motion's useScroll hook
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"]
  });

  // Move useTransform hooks to top level to avoid conditional hook calls
  const backgroundTransform = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    [
      'linear-gradient(to bottom, #FFFFFF, #FAF9F6)',
      'linear-gradient(to bottom, #FAF9F6, #F3F4F6)',
      'linear-gradient(to bottom, #F3F4F6, #EDE9FE)',
      'linear-gradient(to bottom, #EDE9FE, #DDD6FE)'
    ]
  );

  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const trackerTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const steps = [
    {
      number: 1,
      title: "It starts with understanding your needs",
      description: "No endless meetings. Just a quick async intake.",
      details: "We capture exactly what you need in 5 minutes, via a guided form.",
      icon: FileText,
      emoji: "📝",
      color: "violet",
      bgColor: "from-background-white to-background-beige"
    },
    {
      number: 2,
      title: "We go hunting, not waiting",
      description: "We don't wait for applicants, we reach out.",
      details: "Smart filters and AI sourcing target the best candidates instantly.",
      icon: Search,
      emoji: "🎯",
      color: "purple",
      bgColor: "from-background-beige to-purple-50"
    },
    {
      number: 3,
      title: "Only the best, pre-screened",
      description: "We interview the top 5 candidates asynchronously.",
      details: "Every interview is scripted, scored and available in your dashboard.",
      icon: UserCheck,
      emoji: "✅",
      color: "green",
      bgColor: "from-purple-50 to-green-50"
    },
    {
      number: 4,
      title: "Final picks, no fluff",
      description: "You watch 5 video interviews, popcorn style.",
      details: "No back-and-forth, just clarity and comparison.",
      icon: Play,
      emoji: "🍿",
      color: "orange",
      bgColor: "from-green-50 to-orange-50"
    },
    {
      number: 5,
      title: "You hire. We disappear.",
      description: "Pick your candidate, onboard them, done.",
      details: "You get results, no recruiter overhead, no delays.",
      icon: CheckCircle,
      emoji: "🎉",
      color: "indigo",
      bgColor: "from-orange-50 to-primary-violet/10"
    }
  ];

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Desktop scroll tracking with Framer Motion
  useEffect(() => {
    if (isMobile) return;
  }, [isMobile]);

  // Listen to scroll progress changes
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!isMobile) {
      const stepIndex = Math.min(Math.floor(latest * steps.length), steps.length - 1);
      setActiveStep(stepIndex);
    }
  });

  // Mobile carousel navigation
  const scrollToStep = (stepIndex: number) => {
    if (!carouselRef.current) return;
    
    const stepWidth = carouselRef.current.offsetWidth;
    carouselRef.current.scrollTo({
      left: stepIndex * stepWidth,
      behavior: 'smooth'
    });
    setActiveStep(stepIndex);
  };

  const getColorClasses = (color: string, variant: 'bg' | 'text' | 'border') => {
    const colorMap = {
      violet: { bg: 'bg-primary-violet', text: 'text-primary-violet', border: 'border-primary-violet' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-500' },
      green: { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-500' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-500' },
      indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', border: 'border-indigo-500' }
    };
    return colorMap[color as keyof typeof colorMap]?.[variant] || colorMap.violet[variant];
  };

  if (isMobile) {
    return (
      <section ref={sectionRef} className="py-16 bg-background-white relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-container">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-h2 text-text-primary mb-6">
              How It Works
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              From intake to hire in 5 simple steps. No complexity, no delays.
            </p>
          </div>

          {/* Mobile Carousel */}
          <div className="relative">
            {/* Horizontal Progress Line */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-8 h-1 rounded-full transition-all duration-300 ${
                      index <= activeStep ? 'bg-primary-violet' : 'bg-border-light'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Carousel Container */}
            <div
              ref={carouselRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-6"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {steps.map((step, index) => {
                const Icon = step.icon;
                
                return (
                  <motion.div
                    key={index}
                    className="flex-shrink-0 w-full snap-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className={`bg-gradient-to-br ${step.bgColor} rounded-card p-8 border border-border-light shadow-card`}>
                      {/* Step Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-12 h-12 rounded-full ${getColorClasses(step.color, 'bg')} bg-opacity-10 flex items-center justify-center border ${getColorClasses(step.color, 'border')} border-opacity-20`}>
                          <Icon className={`w-6 h-6 ${getColorClasses(step.color, 'text')}`} />
                        </div>
                        <div className={`px-3 py-1 rounded-full text-caption font-bold ${getColorClasses(step.color, 'bg')} bg-opacity-10 ${getColorClasses(step.color, 'text')} border ${getColorClasses(step.color, 'border')} border-opacity-20`}>
                          Step {step.number}
                        </div>
                        <span className="text-2xl">{step.emoji}</span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-text-primary leading-tight mb-4">
                        {step.title}
                      </h3>
                      
                      <p className="text-lg text-text-secondary leading-relaxed mb-4">
                        {step.description}
                      </p>
                      
                      <p className="text-text-secondary leading-relaxed opacity-80">
                        {step.details}
                      </p>

                      {/* Visual Element */}
                      <div className="mt-6 p-6 bg-background-white rounded-lg border border-border-light">
                        <div className="text-center">
                          <div className={`w-16 h-16 mx-auto rounded-full ${getColorClasses(step.color, 'bg')} bg-opacity-10 flex items-center justify-center mb-4 border ${getColorClasses(step.color, 'border')} border-opacity-20`}>
                            <Icon className={`w-8 h-8 ${getColorClasses(step.color, 'text')}`} />
                          </div>
                          
                          {/* Step-specific visual content */}
                          {index === 0 && (
                            <div className="space-y-2">
                              <div className="h-2 bg-gray-200 rounded w-3/4 mx-auto" />
                              <div className="h-2 bg-gray-200 rounded w-1/2 mx-auto" />
                              <div className="h-6 bg-primary-violet rounded w-full" />
                            </div>
                          )}
                          
                          {index === 1 && (
                            <div className="grid grid-cols-3 gap-1">
                              {[...Array(9)].map((_, i) => (
                                <div key={i} className={`h-6 rounded ${i < 3 ? 'bg-purple-200' : 'bg-gray-100'}`} />
                              ))}
                            </div>
                          )}
                          
                          {index === 2 && (
                            <div className="space-y-1">
                              {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
                                  <div className="w-6 h-6 bg-green-500 rounded-full" />
                                  <div className="flex-1 h-2 bg-green-200 rounded" />
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {index === 3 && (
                            <div className="grid grid-cols-2 gap-2">
                              {[...Array(4)].map((_, i) => (
                                <div key={i} className="aspect-video bg-orange-100 rounded flex items-center justify-center border border-orange-200">
                                  <Play className="w-4 h-4 text-orange-500" />
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {index === 4 && (
                            <div className="text-center">
                              <CheckCircle className="w-12 h-12 text-indigo-500 mx-auto mb-2" />
                              <div className="h-2 bg-indigo-200 rounded w-2/3 mx-auto" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => scrollToStep(Math.max(0, activeStep - 1))}
                disabled={activeStep === 0}
                className="p-3 rounded-full bg-background-white border border-border-light shadow-card disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-card-hover transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-text-secondary" />
              </button>
              <button
                onClick={() => scrollToStep(Math.min(steps.length - 1, activeStep + 1))}
                disabled={activeStep === steps.length - 1}
                className="p-3 rounded-full bg-background-white border border-border-light shadow-card disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-card-hover transition-all duration-200"
              >
                <ArrowRight className="w-5 h-5 text-text-secondary" />
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Desktop Version
  return (
    <section ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden">
      {/* Dynamic Background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-background-white via-background-beige to-primary-violet/5"
        style={{ background: backgroundTransform }}
      />

      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-container relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-h2 text-text-primary mb-6">
            How It Works
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            From intake to hire in 5 simple steps. No complexity, no delays.
          </p>
          <motion.div 
            className="mt-8 flex justify-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-6 h-6 text-gray-400" />
          </motion.div>
        </motion.div>

        {/* Steps Container */}
        <div className="relative">
          {/* Vertical Dashed Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0">
            <div className="w-0.5 h-full relative">
              {/* Dashed Background Line */}
              <div 
                className="absolute inset-0 border-l-2 border-dashed border-border-light"
                style={{
                  borderImage: 'repeating-linear-gradient(to bottom, #E5E5E5, #E5E5E5 8px, transparent 8px, transparent 16px) 1'
                }}
              />
              
              {/* Animated Progress Line */}
              <motion.div 
                className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary-violet to-purple-500 transition-all duration-500 ease-out"
                style={{ height: progressHeight, borderRadius: '2px' }}
              />
              
              {/* Tracker Dot */}
              <motion.div 
                className="absolute w-6 h-6 bg-background-white border-4 border-primary-violet rounded-full transform -translate-x-1/2 transition-all duration-500 ease-out shadow-card z-10"
                style={{ top: trackerTop, transform: 'translateX(-50%) translateY(-50%)' }}
                animate={{
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(123, 97, 255, 0.4)',
                    '0 0 0 8px rgba(123, 97, 255, 0.1)',
                    '0 0 0 0 rgba(123, 97, 255, 0.4)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="absolute inset-1 bg-primary-violet rounded-full" />
              </motion.div>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-24 md:space-y-32">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= activeStep;
              const isCurrentStep = index === activeStep;
              const isLeft = index % 2 === 0;
              
              return (
                <motion.div
                  key={index}
                  ref={el => stepsRef.current[index] = el}
                  className={`relative transition-all duration-700 ease-out ${
                    isActive ? 'opacity-100' : 'opacity-40'
                  }`}
                  initial={{ 
                    opacity: 0, 
                    x: isLeft ? -100 : 100,
                    scale: 0.9
                  }}
                  whileInView={{ 
                    opacity: 1, 
                    x: 0,
                    scale: 1
                  }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.2,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <div className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center ${
                    isLeft ? '' : 'md:grid-flow-col-dense'
                  }`}>
                    {/* Content */}
                    <motion.div 
                      className={`${isLeft ? '' : 'md:col-start-2'} space-y-6`}
                      whileHover={{ x: isLeft ? 10 : -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <motion.div 
                          className={`w-12 h-12 rounded-full ${getColorClasses(step.color, 'bg')} bg-opacity-10 flex items-center justify-center border ${getColorClasses(step.color, 'border')} border-opacity-20`}
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className={`w-6 h-6 ${getColorClasses(step.color, 'text')}`} />
                        </motion.div>
                        <motion.div 
                          className={`px-3 py-1 rounded-full text-caption font-bold ${getColorClasses(step.color, 'bg')} bg-opacity-10 ${getColorClasses(step.color, 'text')} border ${getColorClasses(step.color, 'border')} border-opacity-20`}
                          whileHover={{ scale: 1.05 }}
                        >
                          Step {step.number}
                        </motion.div>
                        <motion.span 
                          className="text-2xl"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                        >
                          {step.emoji}
                        </motion.span>
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-bold text-text-primary leading-tight">
                        {step.title}
                      </h3>
                      
                      <p className="text-lg text-text-secondary leading-relaxed">
                        {step.description}
                      </p>
                      
                      <p className="text-text-secondary leading-relaxed opacity-80">
                        {step.details}
                      </p>
                    </motion.div>

                    {/* Visual */}
                    <motion.div 
                      className={`${isLeft ? '' : 'md:col-start-1'} relative`}
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div 
                        className={`bg-background-white rounded-card shadow-card p-8 border-2 transition-all duration-500 ${
                          isCurrentStep 
                            ? `${getColorClasses(step.color, 'border')} shadow-card-hover` 
                            : 'border-border-light shadow-card'
                        }`}
                        animate={isCurrentStep ? {
                          boxShadow: [
                            '0px 4px 12px rgba(0, 0, 0, 0.05)',
                            '0px 8px 24px rgba(123, 97, 255, 0.15)',
                            '0px 4px 12px rgba(0, 0, 0, 0.05)'
                          ]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="text-center">
                          <motion.div 
                            className={`w-20 h-20 mx-auto rounded-full ${getColorClasses(step.color, 'bg')} bg-opacity-10 flex items-center justify-center mb-6 border ${getColorClasses(step.color, 'border')} border-opacity-20`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.8 }}
                          >
                            <Icon className={`w-10 h-10 ${getColorClasses(step.color, 'text')}`} />
                          </motion.div>
                          
                          {/* Step-specific visual content */}
                          {index === 0 && (
                            <motion.div 
                              className="space-y-3"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              <motion.div 
                                className="h-3 bg-gray-200 rounded w-3/4 mx-auto"
                                animate={{ width: ['75%', '85%', '75%'] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                              <motion.div 
                                className="h-3 bg-gray-200 rounded w-1/2 mx-auto"
                                animate={{ width: ['50%', '60%', '50%'] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                              />
                              <motion.div 
                                className="h-8 bg-primary-violet rounded w-full"
                                whileHover={{ scale: 1.02 }}
                              />
                            </motion.div>
                          )}
                          
                          {index === 1 && (
                            <div className="grid grid-cols-3 gap-2">
                              {[...Array(9)].map((_, i) => (
                                <motion.div 
                                  key={i} 
                                  className={`h-8 rounded ${i < 3 ? 'bg-purple-200' : 'bg-gray-100'}`}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: i * 0.1 }}
                                  whileHover={{ scale: 1.1 }}
                                />
                              ))}
                            </div>
                          )}
                          
                          {index === 2 && (
                            <div className="space-y-2">
                              {[...Array(5)].map((_, i) => (
                                <motion.div 
                                  key={i} 
                                  className="flex items-center gap-3 p-2 bg-green-50 rounded border border-green-200"
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: i * 0.1 }}
                                  whileHover={{ x: 5 }}
                                >
                                  <div className="w-8 h-8 bg-green-500 rounded-full" />
                                  <div className="flex-1 h-3 bg-green-200 rounded" />
                                </motion.div>
                              ))}
                            </div>
                          )}
                          
                          {index === 3 && (
                            <div className="grid grid-cols-2 gap-3">
                              {[...Array(4)].map((_, i) => (
                                <motion.div 
                                  key={i} 
                                  className="aspect-video bg-orange-100 rounded-lg flex items-center justify-center border border-orange-200"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: i * 0.1 }}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                                  >
                                    <Play className="w-6 h-6 text-orange-500" />
                                  </motion.div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                          
                          {index === 4 && (
                            <motion.div 
                              className="text-center"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              <motion.div
                                animate={{ 
                                  scale: [1, 1.1, 1],
                                  rotate: [0, 5, -5, 0]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <CheckCircle className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                              </motion.div>
                              <motion.div 
                                className="h-3 bg-indigo-200 rounded w-2/3 mx-auto"
                                animate={{ width: ['66%', '80%', '66%'] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepByStepFlow;