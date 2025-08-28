import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, ChevronDown, Shield, Award, Globe } from 'lucide-react';
import { useResponsive } from '../providers/ResponsiveProvider';
import { useTransition } from '../providers/AnimationProvider';
import { responsiveTokens } from '../tokens/responsiveTokens';
import UnifiedButton from './ui/UnifiedButton';
import SignUpModal from './SignUpModal';
import LoginModal from './LoginModal';

const Header = () => {
  const { isMobile } = useResponsive();
  const transition = useTransition('fast');
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignUpClick = () => {
    setShowSignUpModal(true);
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
    setIsMenuOpen(false);
  };

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
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-gray-200/30 z-50 shadow-lg">
        <div className={`${responsiveTokens.spacing['container']} mx-auto max-w-7xl`}>
          <div className="flex items-center justify-between h-18 md:h-22">
            {/* Premium Logo */}
            <motion.div 
              className="flex items-center gap-4"
              whileHover={!isMobile ? { scale: 1.02 } : {}}
              transition={transition}
            >
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-md"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  Glitch Engine
                </span>
                <div className="text-xs text-gray-600 font-bold uppercase tracking-wider -mt-1">
                  Async Recruiting Platform
                </div>
              </div>
            </motion.div>

            {/* Premium Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-10">
              <motion.a 
                href="#how-it-works" 
                className="relative text-gray-700 hover:text-gray-900 transition-all duration-300 font-semibold text-lg group"
                whileHover={{ y: -2 }}
                transition={transition}
              >
                How it Works
                <div className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300 rounded-full" />
              </motion.a>
              <motion.a 
                href="#faq" 
                className="relative text-gray-700 hover:text-gray-900 transition-all duration-300 font-semibold text-lg group"
                whileHover={{ y: -2 }}
                transition={transition}
              >
                FAQ
                <div className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300 rounded-full" />
              </motion.a>
              <motion.a 
                href="/pricing" 
                className="relative text-gray-700 hover:text-gray-900 transition-all duration-300 font-semibold text-lg group"
                whileHover={{ y: -2 }}
                transition={transition}
              >
                Pricing
                <div className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300 rounded-full" />
              </motion.a>
            </nav>

            {/* Premium Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <UnifiedButton
                onClick={handleLoginClick}
                variant="ghost"
                size="md"
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-semibold border-2 border-transparent hover:border-gray-200"
              >
                Sign In
              </UnifiedButton>
              <UnifiedButton
                onClick={handleSignUpClick}
                variant="primary"
                size="md"
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 shadow-xl hover:shadow-2xl font-bold text-lg px-6 py-3"
              >
                Start Free Trial
              </UnifiedButton>
            </div>

            {/* Premium Mobile Menu Button */}
            <motion.button
              onClick={toggleMenu}
              className="lg:hidden p-3 text-gray-700 hover:text-gray-900 transition-colors duration-200 rounded-2xl hover:bg-gray-100 shadow-md"
              whileTap={{ scale: 0.95 }}
              transition={transition}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={transition}
                  >
                    <X className="w-7 h-7" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={transition}
                  >
                    <Menu className="w-7 h-7" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Premium Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className="lg:hidden py-8 border-t border-gray-200/50 bg-white/95 backdrop-blur-xl"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={transition}
              >
                <nav className="flex flex-col gap-8">
                  <motion.a 
                    href="#how-it-works" 
                    className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-semibold text-xl py-3 px-4 rounded-xl hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                    whileTap={{ scale: 0.98, x: 6 }}
                    transition={transition}
                  >
                    How it Works
                  </motion.a>
                  <motion.a 
                    href="#faq" 
                    className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-semibold text-xl py-3 px-4 rounded-xl hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                    whileTap={{ scale: 0.98, x: 6 }}
                    transition={transition}
                  >
                    FAQ
                  </motion.a>
                  <motion.a 
                    href="/pricing" 
                    className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-semibold text-xl py-3 px-4 rounded-xl hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                    whileTap={{ scale: 0.98, x: 6 }}
                    transition={transition}
                  >
                    Pricing
                  </motion.a>
                  
                  <div className="flex flex-col gap-4 pt-6 border-t border-gray-200">
                    <UnifiedButton
                      onClick={handleLoginClick}
                      variant="ghost"
                      size="lg"
                      className="justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-semibold border-2 border-gray-200"
                    >
                      Sign In
                    </UnifiedButton>
                    <UnifiedButton
                      onClick={handleSignUpClick}
                      variant="primary"
                      size="lg"
                      className="justify-start bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 shadow-xl font-bold text-lg"
                    >
                      Start Free Trial
                    </UnifiedButton>
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

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

export default Header;