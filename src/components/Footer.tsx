import React from 'react';
import { Linkedin, Twitter, Zap } from 'lucide-react';

const Footer = () => {
  const handleTermsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = '/terms';
  };

  const handlePrivacyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = '/privacy-policy';
  };

  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = '/pricing';
  };

  return (
    <footer className="bg-text-primary text-white py-12 md:py-16">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-container">
        <div className="grid md:grid-cols-4 gap-8 md:gap-12">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Glitch Engine</h3>
            <p className="text-gray-300 leading-relaxed max-w-md">
              Get 5 top video candidates in 7 days. We screen 100+ people so you only watch the best.
            </p>
          </div>
          
          {/* Navigation Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors duration-200">
                  How it works
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-300 hover:text-white transition-colors duration-200">
                  FAQ
                </a>
              </li>
              <li>
                <a 
                  href="/pricing" 
                  onClick={handlePricingClick}
                  className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a 
                  href="/privacy-policy" 
                  onClick={handlePrivacyClick}
                  className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="/terms" 
                  onClick={handleTermsClick}
                  className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          
          {/* Social Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Connect</h4>
            <div className="flex gap-4">
              <a
                href="https://linkedin.com"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Glitch Engine. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;