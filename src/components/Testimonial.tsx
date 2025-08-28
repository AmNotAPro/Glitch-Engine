import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Award, TrendingUp, Users, Clock, Target, Shield } from 'lucide-react';

const Testimonial = () => {
  const testimonials = [
    {
      quote: "We hired our async marketing director in 4 days. Zero meetings, zero stress, pure excellence.",
      author: "Carla Meyer",
      role: "Head of Talent Acquisition",
      company: "TechFlow Ventures",
      avatar: "CM",
      rating: 5,
      metric: "4 days",
      metricLabel: "Time to hire",
      color: "emerald"
    },
    {
      quote: "The caliber of candidates was extraordinary. Every video interview delivered genuine value.",
      author: "David Chen",
      role: "Chief Executive Officer",
      company: "Growth Labs International",
      avatar: "DC",
      rating: 5,
      metric: "98%",
      metricLabel: "Quality score",
      color: "blue"
    },
    {
      quote: "Finally, a recruiting process that respects executive time. This is the future of talent acquisition.",
      author: "Sarah Johnson",
      role: "VP of Operations",
      company: "Scale Ventures Group",
      avatar: "SJ",
      rating: 5,
      metric: "0",
      metricLabel: "Meetings needed",
      color: "purple"
    }
  ];

  const trustMetrics = [
    { icon: Award, label: "Industry Recognition", value: "2025 Leader", color: "yellow" },
    { icon: TrendingUp, label: "Client Growth", value: "400% YoY", color: "green" },
    { icon: Shield, label: "Success Rate", value: "98.2%", color: "blue" },
    { icon: Users, label: "Elite Placements", value: "500+", color: "purple" }
  ];

  return (
    <section className="py-24 md:py-32 lg:py-40 bg-gradient-to-br from-gray-50 via-white to-slate-50 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Sophisticated Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #1e293b 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, #7c3aed 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px, 40px 40px'
          }} />
        </div>

        {/* Premium Gradient Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400/15 via-indigo-400/10 to-purple-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-violet-400/15 via-purple-400/10 to-pink-400/5 rounded-full blur-3xl" />
        
        {/* Animated Mesh */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl relative z-10">
        {/* Premium Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Trust Badge */}
          <motion.div 
            className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-xl border border-gray-200/50 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                >
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </motion.div>
              ))}
            </div>
            <span className="text-lg font-bold text-gray-800">4.9/5 from 200+ Elite Agencies</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </motion.div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Industry Leaders
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto font-medium leading-relaxed">
            See why the world's most successful agencies choose async recruiting over traditional methods
          </p>
        </motion.div>
        
        {/* Premium Testimonials Grid */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-20">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="group h-full"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -12, rotateY: 5 }}
            >
              <div className={`
                bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 p-8 md:p-10 
                border-2 relative overflow-hidden h-full flex flex-col
                ${testimonial.color === 'emerald' ? 'border-emerald-200/50 hover:border-emerald-300' :
                  testimonial.color === 'blue' ? 'border-blue-200/50 hover:border-blue-300' :
                  'border-purple-200/50 hover:border-purple-300'
                }
              `}>
                {/* Premium Quote Icon */}
                <div className="absolute top-8 right-8 opacity-10">
                  <Quote className="w-16 h-16 text-gray-600" />
                </div>

                {/* Enhanced Rating */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + (index * 0.2) + (i * 0.1) }}
                      >
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                  <div className={`
                    px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm
                    ${testimonial.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                      testimonial.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }
                  `}>
                    Verified Client
                  </div>
                </div>

                {/* Premium Quote */}
                <blockquote className="text-xl md:text-2xl text-gray-800 mb-8 leading-relaxed font-semibold relative z-10 flex-grow">
                  "{testimonial.quote}"
                </blockquote>
                
                {/* Premium Author Section */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-5">
                    <div className={`
                      w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl
                      ${testimonial.color === 'emerald' ? 'bg-gradient-to-br from-emerald-500 to-green-600' :
                        testimonial.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                        'bg-gradient-to-br from-purple-500 to-violet-600'
                      }
                    `}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-black text-gray-900 text-xl mb-1">
                        {testimonial.author}
                      </div>
                      <div className="text-gray-700 font-semibold text-sm mb-1">
                        {testimonial.role}
                      </div>
                      <div className="text-gray-600 text-sm font-bold">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                  
                  {/* Premium Metric */}
                  <div className="text-right">
                    <div className={`
                      text-4xl font-black mb-2
                      ${testimonial.color === 'emerald' ? 'text-emerald-600' :
                        testimonial.color === 'blue' ? 'text-blue-600' :
                        'text-purple-600'
                      }
                    `}>
                      {testimonial.metric}
                    </div>
                    <div className="text-xs text-gray-600 font-bold uppercase tracking-wide">
                      {testimonial.metricLabel}
                    </div>
                  </div>
                </div>

                {/* Premium gradient overlay on hover */}
                <motion.div
                  className={`
                    absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl
                    ${testimonial.color === 'emerald' ? 'bg-gradient-to-br from-emerald-500/5 to-green-500/5' :
                      testimonial.color === 'blue' ? 'bg-gradient-to-br from-blue-500/5 to-indigo-500/5' :
                      'bg-gradient-to-br from-purple-500/5 to-violet-500/5'
                    }
                  `}
                  initial={false}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Premium Trust Indicators */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {trustMetrics.map((metric, index) => (
            <motion.div
              key={index}
              className="text-center group"
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`
                w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl transition-all duration-300 relative overflow-hidden
                ${metric.color === 'yellow' ? 'bg-gradient-to-br from-yellow-400 to-orange-500 group-hover:from-yellow-500 group-hover:to-orange-600' :
                  metric.color === 'green' ? 'bg-gradient-to-br from-green-400 to-emerald-500 group-hover:from-green-500 group-hover:to-emerald-600' :
                  metric.color === 'blue' ? 'bg-gradient-to-br from-blue-400 to-indigo-500 group-hover:from-blue-500 group-hover:to-indigo-600' :
                  'bg-gradient-to-br from-purple-400 to-violet-500 group-hover:from-purple-500 group-hover:to-violet-600'
                }
              `}>
                <metric.icon className="w-10 h-10 md:w-12 md:h-12 text-white relative z-10" />
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ scale: [1, 1.2, 1], opacity: [0, 0.3, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.7 }}
                />
              </div>
              <div className="text-3xl md:text-4xl font-black text-gray-900 mb-2">{metric.value}</div>
              <div className="text-sm md:text-base text-gray-600 font-bold uppercase tracking-wide">{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Premium Results Banner */}
        <motion.div
          className="mt-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-3xl p-8 md:p-12 text-center shadow-2xl border border-indigo-300/30"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="text-center">
              <motion.div 
                className="text-5xl md:text-6xl font-black text-white mb-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                200+
              </motion.div>
              <div className="text-indigo-100 font-bold text-lg uppercase tracking-wide">Elite Agencies</div>
            </div>
            <div className="text-center">
              <motion.div 
                className="text-5xl md:text-6xl font-black text-white mb-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
              >
                500+
              </motion.div>
              <div className="text-indigo-100 font-bold text-lg uppercase tracking-wide">Successful Hires</div>
            </div>
            <div className="text-center">
              <motion.div 
                className="text-5xl md:text-6xl font-black text-white mb-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 2 }}
              >
                98%
              </motion.div>
              <div className="text-indigo-100 font-bold text-lg uppercase tracking-wide">Success Rate</div>
            </div>
          </div>
          
          <motion.div
            className="mt-8 text-white/90 text-xl font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Join the elite agencies revolutionizing talent acquisition
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonial;