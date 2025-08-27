import React from 'react';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
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
      <section className="py-16 md:py-24 lg:py-32 bg-primary-violet">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 md:mb-8">
            Ready to meet your next hire?
          </h2>
          
          <button 
            onClick={() => setShowSignUpModal(true)}
            className="inline-flex items-center gap-3 bg-background-white hover:bg-gray-50 text-primary-violet font-semibold px-7 py-4 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl mb-4"
          >
            Sign Up Now
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <p className="text-purple-100 text-lg">
            No credit card. No pressure.
          </p>
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













// import React from 'react';
// import { useState } from 'react';
// import { ArrowRight } from 'lucide-react';
// import SignUpModal from './SignUpModal';
// import LoginModal from './LoginModal';

// const MidPageCTA = () => {
//   const [showSignUpModal, setShowSignUpModal] = useState(false);
//   const [showLoginModal, setShowLoginModal] = useState(false);

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
//       <section className="py-16 md:py-section-desktop bg-primary-violet">
//       <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-4xl text-center">
//         <h2 className="text-h2 text-white mb-6 md:mb-8">
//           Ready to meet your next hire?
//         </h2>
        
//         <button 
//           onClick={() => setShowSignUpModal(true)}
//           className="inline-flex items-center gap-3 bg-background-white hover:bg-gray-50 text-primary-violet font-button px-7 py-4 rounded-button text-button transition-all duration-200 transform hover:scale-105 shadow-card hover:shadow-card-hover mb-4"
//         >
//           Sign Up Now
//           <ArrowRight className="w-5 h-5" />
//         </button>
        
//         <p className="text-purple-100 text-lg">
//           No credit card. No pressure.
//         </p>
//       </div>
//       </section>

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

// export default MidPageCTA;