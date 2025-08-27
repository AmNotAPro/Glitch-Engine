import React from 'react';
import { useAuth } from '../hooks/useAuth.tsx';
import Header from './Header';
import Hero from './Hero';
import Testimonial from './Testimonial';
import StepByStepFlow from './StepByStepFlow';
import WhyAsyncWorks from './WhyAsyncWorks';
import MidPageCTA from './MidPageCTA';
import FAQ from './FAQ';
import Footer from './Footer';
import Dashboard from './Dashboard';
import AdminContent from './AdminContent';
import LoadingSpinner from './LoadingSpinner';
import AuthDebug from './AuthDebug';

const AppContent = () => {
  const { isAuthenticated, initializing, loading, user, profile, isAdmin, signOut } = useAuth();

  // Show loading spinner during initialization OR profile loading
  if (initializing || (isAuthenticated && loading)) {
    console.log('🔄 App is initializing...', { 
      initializing,
      loading,
      isAuthenticated, 
      userEmail: user?.email, 
      profileRole: profile?.role,
      isAdmin,
      timestamp: new Date().toISOString()
    });
    
    return <LoadingSpinner fullScreen text="Setting up your account..." />;
  }
  
  // If authenticated, show appropriate dashboard
  if (isAuthenticated) {
    console.log('✅ User is authenticated', {
      userEmail: user?.email,
      role: profile?.role,
      isAdmin,
      showingDashboard: isAdmin ? 'Admin' : 'User'
    });
    
    // Show admin dashboard for users with Admin role
    if (isAdmin) {
      return <AdminContent />;
    }
    
    // Show user dashboard for regular users
    return <Dashboard />;
  }

  console.log('📄 Showing landing page', { isAuthenticated });
  
  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Testimonial />
      <div id="how-it-works">
        <StepByStepFlow />
      </div>
      <WhyAsyncWorks />
      <MidPageCTA />
      <div id="intake">
        <FAQ />
      </div>
      <Footer />
      <AuthDebug />
    </div>
  );
};

export default AppContent;

















// import React from 'react';
// import { useAuth } from '../hooks/useAuth.tsx';
// import Header from './Header';
// import Hero from './Hero';
// import Testimonial from './Testimonial';
// import StepByStepFlow from './StepByStepFlow';
// import WhyAsyncWorks from './WhyAsyncWorks';
// import MidPageCTA from './MidPageCTA';
// import FAQ from './FAQ';
// import Footer from './Footer';
// import Dashboard from './Dashboard';
// import AdminContent from './AdminContent';
// import LoadingSpinner from './LoadingSpinner';
// import AuthDebug from './AuthDebug';

// const AppContent = () => {
//   const { isAuthenticated, initializing, user, profile, isAdmin, signOut } = useAuth();

//   // Show loading spinner during initialization
//   if (initializing) {
//     console.log('🔄 App is initializing...', { 
//       isAuthenticated, 
//       userEmail: user?.email, 
//       profileRole: profile?.role,
//       isAdmin,
//       timestamp: new Date().toISOString()
//     });
    
//     return <LoadingSpinner fullScreen text="Setting up your account..." />;
//   }
  
//   // If authenticated, show appropriate dashboard
//   if (isAuthenticated) {
//     console.log('✅ User is authenticated', {
//       userEmail: user?.email,
//       role: profile?.role,
//       isAdmin,
//       showingDashboard: isAdmin ? 'Admin' : 'User'
//     });
    
//     // Show admin dashboard for users with Admin role
//     if (isAdmin) {
//       return <AdminContent />;
//     }
    
//     // Show user dashboard for regular users
//     return <Dashboard />;
//   }

//   console.log('📄 Showing landing page', { isAuthenticated });
  
//   // Show landing page for non-authenticated users
//   return (
//     <div className="min-h-screen bg-white">
//       <Header />
//       <Hero />
//       <Testimonial />
//       <div id="how-it-works">
//         <StepByStepFlow />
//       </div>
//       <WhyAsyncWorks />
//       <MidPageCTA />
//       <div id="intake">
//         <FAQ />
//       </div>
//       <Footer />
//       <AuthDebug />
//     </div>
//   );
// };

// export default AppContent;