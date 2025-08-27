import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
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
      <header className="fixed top-0 left-0 right-0 bg-background-white border-b border-border-light z-50 backdrop-blur-sm bg-opacity-95">
        <div className={`${responsiveTokens.spacing['container']} mx-auto max-w-7xl`}>
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={!isMobile ? { scale: 1.02 } : {}}
              transition={transition}
            >
              <img 
                src="/logo.png" 
                alt="Glitch Engine Logo" 
                className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                onError={(e) => {
                  // Fallback to icon if image fails
                  const iconDiv = document.createElement('div');
                  iconDiv.className = 'w-6 h-6 sm:w-8 sm:h-8 bg-primary-violet rounded flex items-center justify-center';
                  iconDiv.innerHTML = '<svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>';
                  e.currentTarget.parentNode?.replaceChild(iconDiv, e.currentTarget);
                }}
              />
              <span className={`${responsiveTokens.typography['heading-2']} text-text-primary`}>
                Glitch Engine
              </span>
            </motion.div>

            {/* Desktop Navigation - FIXED */}
            <nav className="hidden md:flex items-center gap-8">
              <motion.a 
                href="#how-it-works" 
                className={`
                  ${responsiveTokens.typography['body']} text-text-secondary hover:text-text-primary 
                  transition-colors duration-200 font-medium
                  ${responsiveTokens.interactions['focus-ring']}
                `}
                whileHover={{ y: -1 }}
                transition={transition}
              >
                How it Works
              </motion.a>
              <motion.a 
                href="#faq" 
                className={`
                  ${responsiveTokens.typography['body']} text-text-secondary hover:text-text-primary 
                  transition-colors duration-200 font-medium
                  ${responsiveTokens.interactions['focus-ring']}
                `}
                whileHover={{ y: -1 }}
                transition={transition}
              >
                FAQ
              </motion.a>
            </nav>

            {/* Desktop CTA Buttons - FIXED */}
            <div className="hidden md:flex items-center gap-4">
              <UnifiedButton
                onClick={handleLoginClick}
                variant="ghost"
                size="sm"
              >
                Login
              </UnifiedButton>
              <UnifiedButton
                onClick={handleSignUpClick}
                variant="primary"
                size="sm"
              >
                Sign Up
              </UnifiedButton>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={toggleMenu}
              className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors duration-200 rounded-button"
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

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className="md:hidden py-4 border-t border-border-light"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={transition}
              >
                <nav className="flex flex-col gap-4">
                  <motion.a 
                    href="#how-it-works" 
                    className={`
                      ${responsiveTokens.typography['body']} text-text-secondary hover:text-text-primary 
                      transition-colors duration-200 font-medium py-2
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
                      ${responsiveTokens.typography['body']} text-text-secondary hover:text-text-primary 
                      transition-colors duration-200 font-medium py-2
                      ${responsiveTokens.interactions['touch-target']}
                      ${responsiveTokens.interactions['focus-ring']}
                    `}
                    onClick={() => setIsMenuOpen(false)}
                    whileTap={{ scale: 0.98, x: 4 }}
                    transition={transition}
                  >
                    FAQ
                  </motion.a>
                  
                  <div className="flex flex-col gap-3 pt-4 border-t border-border-light">
                    <UnifiedButton
                      onClick={handleLoginClick}
                      variant="ghost"
                      size="md"
                      className="justify-start"
                    >
                      Login
                    </UnifiedButton>
                    <UnifiedButton
                      onClick={handleSignUpClick}
                      variant="primary"
                      size="md"
                      className="justify-start"
                    >
                      Sign Up
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























// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Menu, X, Zap } from 'lucide-react';
// import { useResponsive } from '../providers/ResponsiveProvider';
// import { useTransition } from '../providers/AnimationProvider';
// import { responsiveTokens } from '../tokens/responsiveTokens';
// import UnifiedButton from './ui/UnifiedButton';
// import SignUpModal from './SignUpModal';
// import LoginModal from './LoginModal';

// const Header = () => {
//   const { isMobile } = useResponsive();
//   const transition = useTransition('fast');
  
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [showSignUpModal, setShowSignUpModal] = useState(false);
//   const [showLoginModal, setShowLoginModal] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const handleSignUpClick = () => {
//     setShowSignUpModal(true);
//     setIsMenuOpen(false);
//   };

//   const handleLoginClick = () => {
//     setShowLoginModal(true);
//     setIsMenuOpen(false);
//   };

//   const switchToLogin = () => {
//     setShowSignUpModal(false);
//     setShowLoginModal(true);
//   };

//   const switchToSignUp = () => {
//     setShowLoginModal(false);
//     setShowSignUpModal(true);
//   };

//   return (
//     <>
//       <header className="fixed top-0 left-0 right-0 bg-background-white border-b border-border-light z-50 backdrop-blur-sm bg-opacity-95">
//         <div className={`${responsiveTokens.spacing['container']} mx-auto max-w-7xl`}>
//           <div className="flex items-center justify-between h-16 md:h-20">
//             {/* Logo */}
//             <motion.div 
//   className="flex items-center gap-3"
//   whileHover={!isMobile ? { scale: 1.02 } : {}}
//   transition={transition}
// >
//   <img 
//     src="/logo.png" 
//     alt="Glitch Engine Logo" 
//     className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
//     onError={(e) => {
//       e.currentTarget.style.display = 'none';
//     }}
//   />
//   <span className={`${responsiveTokens.typography['heading-2']} text-text-primary`}>
//     Glitch Engine
//   </span>
// </motion.div>

//             {/* Desktop Navigation */}
//             <nav className={`${responsiveTokens.breakpoints['tablet-desktop']} items-center gap-8`}>
//               <motion.a 
//                 href="#how-it-works" 
//                 className={`
//                   ${responsiveTokens.typography['body']} text-text-secondary hover:text-text-primary 
//                   transition-colors duration-200 font-medium
//                   ${responsiveTokens.interactions['focus-ring']}
//                 `}
//                 whileHover={{ y: -1 }}
//                 transition={transition}
//               >
//                 How it Works
//               </motion.a>
//               <motion.a 
//                 href="#intake" 
//                 className={`
//                   ${responsiveTokens.typography['body']} text-text-secondary hover:text-text-primary 
//                   transition-colors duration-200 font-medium
//                   ${responsiveTokens.interactions['focus-ring']}
//                 `}
//                 whileHover={{ y: -1 }}
//                 transition={transition}
//               >
//                 FAQ
//               </motion.a>
//             </nav>

//             {/* Desktop CTA Buttons */}
//             <div className={`${responsiveTokens.breakpoints['tablet-desktop']} items-center gap-4`}>
//               <UnifiedButton
//                 onClick={handleLoginClick}
//                 variant="ghost"
//                 size="sm"
//               >
//                 Login
//               </UnifiedButton>
//               <UnifiedButton
//                 onClick={handleSignUpClick}
//                 variant="primary"
//                 size="sm"
//               >
//                 Sign Up
//               </UnifiedButton>
//             </div>

//             {/* Mobile Menu Button */}
//             <motion.button
//               onClick={toggleMenu}
//               className={`
//                 ${responsiveTokens.breakpoints['mobile-tablet']} p-2 text-text-secondary hover:text-text-primary 
//                 transition-colors duration-200 rounded-button
//                 ${responsiveTokens.interactions['touch-target']}
//                 ${responsiveTokens.interactions['focus-ring']}
//               `}
//               whileTap={{ scale: 0.95 }}
//               transition={transition}
//             >
//               <AnimatePresence mode="wait">
//                 {isMenuOpen ? (
//                   <motion.div
//                     key="close"
//                     initial={{ rotate: -90, opacity: 0 }}
//                     animate={{ rotate: 0, opacity: 1 }}
//                     exit={{ rotate: 90, opacity: 0 }}
//                     transition={transition}
//                   >
//                     <X className="w-6 h-6" />
//                   </motion.div>
//                 ) : (
//                   <motion.div
//                     key="menu"
//                     initial={{ rotate: 90, opacity: 0 }}
//                     animate={{ rotate: 0, opacity: 1 }}
//                     exit={{ rotate: -90, opacity: 0 }}
//                     transition={transition}
//                   >
//                     <Menu className="w-6 h-6" />
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.button>
//           </div>

//           {/* Mobile Menu */}
//           <AnimatePresence>
//             {isMenuOpen && (
//               <motion.div
//                 className={`${responsiveTokens.breakpoints['mobile-tablet']} py-4 border-t border-border-light`}
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{ height: 'auto', opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }}
//                 transition={transition}
//               >
//                 <nav className="flex flex-col gap-4">
//                   <motion.a 
//                     href="#how-it-works" 
//                     className={`
//                       ${responsiveTokens.typography['body']} text-text-secondary hover:text-text-primary 
//                       transition-colors duration-200 font-medium py-2
//                       ${responsiveTokens.interactions['touch-target']}
//                       ${responsiveTokens.interactions['focus-ring']}
//                     `}
//                     onClick={() => setIsMenuOpen(false)}
//                     whileTap={{ scale: 0.98, x: 4 }}
//                     transition={transition}
//                   >
//                     How it Works
//                   </motion.a>
//                   <motion.a 
//                     href="#intake" 
//                     className={`
//                       ${responsiveTokens.typography['body']} text-text-secondary hover:text-text-primary 
//                       transition-colors duration-200 font-medium py-2
//                       ${responsiveTokens.interactions['touch-target']}
//                       ${responsiveTokens.interactions['focus-ring']}
//                     `}
//                     onClick={() => setIsMenuOpen(false)}
//                     whileTap={{ scale: 0.98, x: 4 }}
//                     transition={transition}
//                   >
//                     FAQ
//                   </motion.a>
                  
//                   <div className="flex flex-col gap-3 pt-4 border-t border-border-light">
//                     <UnifiedButton
//                       onClick={handleLoginClick}
//                       variant="ghost"
//                       size="md"
//                       className="justify-start"
//                     >
//                       Login
//                     </UnifiedButton>
//                     <UnifiedButton
//                       onClick={handleSignUpClick}
//                       variant="primary"
//                       size="md"
//                       className="justify-start"
//                     >
//                       Sign Up
//                     </UnifiedButton>
//                   </div>
//                 </nav>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </header>

//       {/* Auth Modals */}
//       <SignUpModal 
//         isOpen={showSignUpModal}
//         onClose={() => setShowSignUpModal(false)}
//         onSwitchToLogin={switchToLogin}
//       />
      
//       <LoginModal 
//         isOpen={showLoginModal}
//         onClose={() => setShowLoginModal(false)}
//         onSwitchToSignUp={switchToSignUp}
//       />
//     </>
//   );
// };

// export default Header;

