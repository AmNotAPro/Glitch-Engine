import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, ChevronDown } from 'lucide-react';
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
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200/50 z-50 shadow-sm">
        <div className={`${responsiveTokens.spacing['container']} mx-auto max-w-7xl`}>
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Enhanced Logo */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={!isMobile ? { scale: 1.02 } : {}}
              transition={transition}
            >
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-violet to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <span className={`${responsiveTokens.typography['heading-2']} text-gray-900 font-bold`}>
                  Glitch Engine
                </span>
                <div className="text-xs text-gray-500 font-medium -mt-1">
                  Async Recruiting
                </div>
              </div>
            </motion.div>

            {/* Enhanced Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <motion.a 
                href="#how-it-works" 
                className={`
                  ${responsiveTokens.typography['body']} text-gray-600 hover:text-gray-900 
                  transition-all duration-200 font-medium relative group
                  ${responsiveTokens.interactions['focus-ring']}
                `}
                whileHover={{ y: -1 }}
                transition={transition}
              >
                How it Works
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-violet group-hover:w-full transition-all duration-300" />
              </motion.a>
              <motion.a 
                href="#faq" 
                className={`
                  ${responsiveTokens.typography['body']} text-gray-600 hover:text-gray-900 
                  transition-all duration-200 font-medium relative group
                  ${responsiveTokens.interactions['focus-ring']}
                `}
                whileHover={{ y: -1 }}
                transition={transition}
              >
                FAQ
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-violet group-hover:w-full transition-all duration-300" />
              </motion.a>
              <motion.a 
                href="/pricing" 
                className={`
                  ${responsiveTokens.typography['body']} text-gray-600 hover:text-gray-900 
                  transition-all duration-200 font-medium relative group
                  ${responsiveTokens.interactions['focus-ring']}
                `}
                whileHover={{ y: -1 }}
                transition={transition}
              >
                Pricing
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-violet group-hover:w-full transition-all duration-300" />
              </motion.a>
            </nav>

            {/* Enhanced Desktop CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <UnifiedButton
                onClick={handleLoginClick}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                Sign In
              </UnifiedButton>
              <UnifiedButton
                onClick={handleSignUpClick}
                variant="primary"
                size="sm"
                className="bg-gradient-to-r from-primary-violet to-purple-600 hover:from-primary-violet-dark hover:to-purple-700 shadow-lg hover:shadow-xl"
              >
                Get Started Free
              </UnifiedButton>
            </div>

            {/* Enhanced Mobile Menu Button */}
            <motion.button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 rounded-xl hover:bg-gray-100"
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
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={transition}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Enhanced Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className="md:hidden py-6 border-t border-gray-200/50 bg-white/95 backdrop-blur-md"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={transition}
              >
                <nav className="flex flex-col gap-6">
                  <motion.a 
                    href="#how-it-works" 
                    className={`
                      ${responsiveTokens.typography['body']} text-gray-600 hover:text-gray-900 
                      transition-colors duration-200 font-medium py-2 px-2 rounded-lg hover:bg-gray-50
                      ${responsiveTokens.interactions['touch-target']}
                      ${responsiveTokens.interactions['focus-ring']}
                    `}
                    onClick={() => setIsMenuOpen(false)}
                    whileTap={{ scale: 0.98, x: 4 }}
                    transition={transition}
                  >
                    How it Works
                  </motion.a>
                  <motion.a 
                    href="#faq" 
                    className={`
                      ${responsiveTokens.typography['body']} text-gray-600 hover:text-gray-900 
                      transition-colors duration-200 font-medium py-2 px-2 rounded-lg hover:bg-gray-50
                      ${responsiveTokens.interactions['touch-target']}
                      ${responsiveTokens.interactions['focus-ring']}
                    `}
                    onClick={() => setIsMenuOpen(false)}
                    whileTap={{ scale: 0.98, x: 4 }}
                    transition={transition}
                  >
                    FAQ
                  </motion.a>
                  <motion.a 
                    href="/pricing" 
                    className={`
                      ${responsiveTokens.typography['body']} text-gray-600 hover:text-gray-900 
                      transition-colors duration-200 font-medium py-2 px-2 rounded-lg hover:bg-gray-50
                      ${responsiveTokens.interactions['touch-target']}
                      ${responsiveTokens.interactions['focus-ring']}
                    `}
                    onClick={() => setIsMenuOpen(false)}
                    whileTap={{ scale: 0.98, x: 4 }}
                    transition={transition}
                  >
                    Pricing
                  </motion.a>
                  
                  <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                    <UnifiedButton
                      onClick={handleLoginClick}
                      variant="ghost"
                      size="md"
                      className="justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                      Sign In
                    </UnifiedButton>
                    <UnifiedButton
                      onClick={handleSignUpClick}
                      variant="primary"
                      size="md"
                      className="justify-start bg-gradient-to-r from-primary-violet to-purple-600 shadow-lg"
                    >
                      Get Started Free
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