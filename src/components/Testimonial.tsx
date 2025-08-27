import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Award, TrendingUp } from 'lucide-react';

const Testimonial = () => {
  const testimonials = [
    {
      quote: "We hired our async marketing manager in 5 days. No meetings. No stress. Just results.",
      author: "Carla Meyer",
      role: "Head of Talent",
      company: "TechFlow Agency",
      avatar: "CM",
      rating: 5,
      metric: "5 days",
      metricLabel: "Time to hire"
    },
    {
      quote: "The quality of candidates was exceptional. Every video interview was worth watching.",
      author: "David Chen",
      role: "CEO",
      company: "Growth Labs",
      avatar: "DC",
      rating: 5,
      metric: "98%",
      metricLabel: "Quality score"
    },
    {
      quote: "Finally, a recruiting process that respects our time. Async is the future.",
      author: "Sarah Johnson",
      role: "Operations Director",
      company: "Scale Ventures",
      avatar: "SJ",
      rating: 5,
      metric: "0",
      metricLabel: "Meetings needed"
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #7B61FF 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="ml-2 text-gray-600 font-medium">4.9/5 from 200+ agencies</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Loved by Modern Agencies
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See why leading agencies choose async recruiting over traditional methods
          </p>
        </motion.div>
        
        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 relative overflow-hidden h-full">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10">
                  <Quote className="w-12 h-12 text-primary-violet" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed font-medium relative z-10">
                  "{testimonial.quote}"
                </blockquote>
                
                {/* Author */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-violet to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">
                        {testimonial.author}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {testimonial.role}
                      </div>
                      <div className="text-gray-500 text-sm font-medium">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                  
                  {/* Metric */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-violet">
                      {testimonial.metric}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      {testimonial.metricLabel}
                    </div>
                  </div>
                </div>

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-violet/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {[
            { icon: Award, label: "Industry Leader", value: "2025" },
            { icon: TrendingUp, label: "Growth Rate", value: "300%" },
            { icon: Star, label: "Client Rating", value: "4.9/5" },
            { icon: Quote, label: "Success Stories", value: "200+" }
          ].map((indicator, index) => (
            <motion.div
              key={index}
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:from-primary-violet/10 group-hover:to-blue-500/10 transition-all duration-300">
                <indicator.icon className="w-8 h-8 text-gray-600 group-hover:text-primary-violet transition-colors duration-300" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{indicator.value}</div>
              <div className="text-sm text-gray-600 font-medium">{indicator.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonial;