import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { X, Target, Clock, Zap, Play, Users, CheckCircle, Star } from 'lucide-react';

const WhyAsyncWorks = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Background color transition
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [
      'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 100%)',
      'linear-gradient(135deg, #FFFFFF 0%, #FAF9F6 100%)',
      'linear-gradient(135deg, #FAF9F6 0%, rgba(123, 97, 255, 0.05) 100%)',
      'linear-gradient(135deg, rgba(123, 97, 255, 0.05) 0%, rgba(123, 97, 255, 0.1) 100%)'
    ]
  );

  const benefits = [
    {
      emoji: "🚫",
      title: "No time-wasting calls",
      description: "Forget back-and-forth scheduling. It's async from day one.",
      icon: X,
      color: "red"
    },
    {
      emoji: "🎯",
      title: "Candidates answer your exact questions",
      description: "Every interview is structured, scored, and searchable.",
      icon: Target,
      color: "violet"
    },
    {
      emoji: "⏰",
      title: "Review on your own time",
      description: "Pause, rewind, binge — just like Netflix for talent.",
      icon: Clock,
      color: "green"
    },
    {
      emoji: "⭐",
      title: "Quality > quantity",
      description: "No inbox clutter. Just 5 top async performers.",
      icon: Star,
      color: "orange"
    }
  ];

  return (
    <motion.section 
      ref={sectionRef}
      className="py-16 md:py-section-desktop relative overflow-hidden"
      style={{ background: backgroundColor }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-primary-violet bg-opacity-5 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-20 right-10 w-24 h-24 bg-accent-yellow bg-opacity-10 rounded-lg blur-lg"
          animate={{
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-text-primary mb-8 md:mb-12 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Why Async Hiring Works
            </motion.h2>
            
            <div className="space-y-6 md:space-y-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                
                return (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4 group"
                    initial={{ opacity: 0, x: -30, scale: 0.9 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.4 + (index * 0.15),
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                    viewport={{ once: true, margin: "-50px" }}
                    whileHover={{ x: 10, transition: { duration: 0.2 } }}
                  >
                    {/* Icon Container */}
                    <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                      <motion.span 
                        className="text-2xl md:text-3xl"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ 
                          duration: 0.4, 
                          delay: 0.6 + (index * 0.15),
                          type: "spring",
                          stiffness: 200
                        }}
                        viewport={{ once: true }}
                        whileHover={{ 
                          scale: 1.2,
                          rotate: [0, -10, 10, 0],
                          transition: { duration: 0.3 }
                        }}
                      >
                        {benefit.emoji}
                      </motion.span>
                    </div>
                    
                    <div className="flex-1">
                      <motion.h3 
                        className="text-xl md:text-2xl font-bold text-text-primary mb-2 group-hover:text-primary-violet transition-colors duration-200"
                        whileHover={{ x: 5 }}
                      >
                        {benefit.title}
                      </motion.h3>
                      <motion.p 
                        className="text-text-secondary leading-relaxed text-lg"
                        whileHover={{ x: 5 }}
                      >
                        {benefit.description}
                      </motion.p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
          
          {/* Right Column - Animated Visual */}
          <motion.div 
            className="lg:order-last order-first"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ 
              scale: 1.02,
              y: -5,
              transition: { duration: 0.3 }
            }}
          >
            <motion.div 
              className="bg-background-white rounded-card shadow-card-hover p-6 md:p-8 border border-border-light relative overflow-hidden"
              whileHover={{ 
                boxShadow: "0px 12px 32px rgba(123, 97, 255, 0.15)",
                transition: { duration: 0.3 }
              }}
            >
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              />

              {/* Browser Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-accent-yellow rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1 bg-gray-100 rounded-md h-6 ml-4 flex items-center px-3">
                  <span className="text-xs text-gray-500">async-dashboard.com</span>
                </div>
              </div>

              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">
                  Async Interview Dashboard
                </h3>
                <div className="flex items-center gap-2 text-caption text-text-secondary">
                  <motion.div 
                    className="w-2 h-2 bg-green-500 rounded-full"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity 
                    }}
                  />
                  Live Updates
                </div>
              </div>

              {/* Candidate Cards with Enhanced Animations */}
              <div className="space-y-3">
                {[
                  { name: 'Sarah Chen', role: 'Marketing Manager', score: 95, status: 'Reviewed', color: 'green' },
                  { name: 'Mike Johnson', role: 'Senior Developer', score: 92, status: 'In Review', color: 'violet' },
                  { name: 'Lisa Park', role: 'UX Designer', score: 89, status: 'Pending', color: 'purple' },
                  { name: 'David Kim', role: 'Product Manager', score: 87, status: 'Scheduled', color: 'orange' },
                  { name: 'Alex Rivera', role: 'Sales Director', score: 84, status: 'New', color: 'gray' }
                ].map((candidate, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg border-l-4 cursor-pointer ${
                      candidate.color === 'green' ? 'bg-green-50 border-green-500 hover:bg-green-100' :
                      candidate.color === 'violet' ? 'bg-primary-violet bg-opacity-5 border-primary-violet hover:bg-primary-violet hover:bg-opacity-10' :
                      candidate.color === 'purple' ? 'bg-purple-50 border-purple-500 hover:bg-purple-100' :
                      candidate.color === 'orange' ? 'bg-orange-50 border-orange-500 hover:bg-orange-100' :
                      'bg-gray-50 border-gray-300 hover:bg-gray-100'
                    }`}
                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.8 + (index * 0.1),
                      type: "spring",
                      stiffness: 100
                    }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      scale: 1.02, 
                      x: 5,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          candidate.color === 'green' ? 'bg-green-600' :
                          candidate.color === 'violet' ? 'bg-primary-violet' :
                          candidate.color === 'purple' ? 'bg-purple-600' :
                          candidate.color === 'orange' ? 'bg-orange-600' :
                          'bg-gray-500'
                        }`}
                        whileHover={{ 
                          rotate: 360,
                          transition: { duration: 0.5 }
                        }}
                      >
                        <Play className="w-4 h-4 text-white" />
                      </motion.div>
                      <div>
                        <div className="font-medium text-text-primary">{candidate.name}</div>
                        <div className="text-caption text-text-secondary">{candidate.role}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${
                        candidate.color === 'green' ? 'text-green-600' :
                        candidate.color === 'violet' ? 'text-primary-violet' :
                        candidate.color === 'purple' ? 'text-purple-600' :
                        candidate.color === 'orange' ? 'text-orange-600' :
                        'text-text-secondary'
                      }`}>
                        {candidate.score}% Match
                      </div>
                      <div className="text-caption text-text-secondary">{candidate.status}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Stats Footer */}
              <motion.div 
                className="mt-6 pt-4 border-t border-border-light flex justify-between items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <motion.div 
                      className="text-2xl font-bold text-primary-violet"
                      animate={{ 
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        delay: 2
                      }}
                    >
                      5
                    </motion.div>
                    <div className="text-caption text-text-secondary">Candidates</div>
                  </div>
                  <div className="text-center">
                    <motion.div 
                      className="text-2xl font-bold text-green-600"
                      animate={{ 
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        delay: 2.5
                      }}
                    >
                      100+
                    </motion.div>
                    <div className="text-caption text-text-secondary">Screened</div>
                  </div>
                  <div className="text-center">
                    <motion.div 
                      className="text-2xl font-bold text-accent-yellow"
                      animate={{ 
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        delay: 3
                      }}
                    >
                      7
                    </motion.div>
                    <div className="text-caption text-text-secondary">Days</div>
                  </div>
                </div>
                
              </motion.div>
            </motion.div>

            {/* Floating Stats */}
            <motion.div
              className="absolute -top-4 -right-4 bg-background-white rounded-lg shadow-card p-4 border border-border-light"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 1.8, type: "spring" }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05,
                rotate: 5,
                transition: { duration: 0.2 }
              }}
            >
              <div className="text-center">
                <motion.div 
                  className="text-2xl font-bold text-green-600"
                >
                  92%
                </motion.div>
                <div className="text-caption text-text-secondary">Success Rate</div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-4 bg-background-white rounded-lg shadow-card p-4 border border-border-light"
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 2, type: "spring" }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05,
                rotate: -5,
                transition: { duration: 0.2 }
              }}
            >
              <div className="text-center">
                <motion.div 
                  className="text-2xl font-bold text-primary-violet"
                >
                  0
                </motion.div>
                <div className="text-caption text-text-secondary">Meetings</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Section Divider with Shimmer */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-violet to-transparent opacity-20"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 2.5 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-violet to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </motion.div>
    </motion.section>
  );
};

export default WhyAsyncWorks;