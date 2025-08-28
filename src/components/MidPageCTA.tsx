import React from 'react';
import { useState } from 'react';
import { ArrowRight, Sparkles, Zap, Star, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import SignUpModal from './SignUpModal';
import LoginModal from './LoginModal';

const MidPageCTA = () => {
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const switchToLogin = () => {
    setShowSignUpModal(false);
    setShowLoginModal(true);
  };

  const switchToSignUp = () => {
    setShowLoginModal(false);
    setShowSignUpModal(true);
  };

  return (
    <>
      <section className="py-24 md:py-32 lg:py-40 relative overflow-hidden">
        {/* Premium Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
          {/* Animated Gradient Mesh */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Premium Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(180deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px'
            }} />
          </div>
        </div>

        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-6xl relative z-10">
          <div className="text-center">
            {/* Premium Badge */}
            <motion.div
              className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold text-lg">Limited Time Offer</span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </motion.div>
            </motion.div>

            {/* Premium Headline */}
            <motion.h2 
              className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Ready to Meet Your{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Next Elite Hire?
              </span>
            </motion.h2>

            {/* Premium Subheading */}
            <motion.p
              className="text-xl md:text-2xl text-indigo-100 mb-12 max-w-3xl mx-auto font-medium leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Join 200+ elite agencies who've revolutionized their hiring process. 
              Get your first 5 candidates completely free.
            </motion.p>
            
            {/* Premium CTA Button */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <button 
                onClick={() => setShowSignUpModal(true)}
                className="group relative inline-flex items-center gap-4 bg-white hover:bg-gray-50 text-gray-900 font-black px-10 py-6 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl border-4 border-white/20"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
                <Sparkles className="w-6 h-6 text-indigo-600" />
                <span className="relative z-10">Start Your Free Trial</span>
                <ArrowRight className="w-6 h-6 text-indigo-600 group-hover:translate-x-2 transition-transform duration-200" />
              </button>
            </motion.div>
            
            {/* Premium Trust Indicators */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-8 text-indigo-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-sm"></div>
                <span className="font-bold text-lg">No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-sm"></div>
                <span className="font-bold text-lg">100% Risk-Free</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-sm"></div>
                <span className="font-bold text-lg">7-Day Guarantee</span>
              </div>
            </motion.div>

            {/* Premium Urgency Message */}
            <motion.div
              className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-6 h-6 text-yellow-400" />
                </motion.div>
                <span className="text-white font-bold text-lg">Limited Availability</span>
              </div>
              <p className="text-indigo-100 font-semibold">
                Only 5 spots remaining this week. Secure your elite candidate pipeline today.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

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
    </>
  );
};

export default MidPageCTA;