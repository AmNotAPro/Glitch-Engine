import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TermsOfService = () => {
  const handleBackClick = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background-beige">
      {/* Header Navigation */}
      <header className="bg-background-white border-b border-border-light">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button 
            onClick={handleBackClick}
            className="inline-flex items-center gap-2 text-text-secondary hover:text-primary-violet transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </header>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-6 py-12"
      >
        <div className="bg-background-white rounded-lg shadow-sm border border-border-light p-8 md:p-12">
          {/* Title */}
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-text-primary mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Terms & Conditions
          </motion.h1>
          
          <motion.p 
            className="text-lg text-text-secondary mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            By using Glitch Engine, you agree to the following terms governing access and use of our hiring platform. These terms ensure clarity, professionalism, and fairness in how we deliver services and how you interact with candidates and platform tools.
          </motion.p>

          {/* Sections */}
          <div className="space-y-8">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl font-semibold text-text-primary mb-4">Eligibility</h2>
              <p className="text-text-secondary leading-relaxed">
                You must be at least 18 years old and use the platform strictly for business purposes.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-text-primary mb-4">Service Scope</h2>
              <p className="text-text-secondary leading-relaxed">
                We deliver up to 5 video interviews per hiring request. You pay only if you decide to proceed with a candidate.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="text-2xl font-semibold text-text-primary mb-4">No Refund Policy</h2>
              <p className="text-text-secondary leading-relaxed">
                All payments are final and non-refundable once a candidate is selected and paid for.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-2xl font-semibold text-text-primary mb-4">Data Handling</h2>
              <p className="text-text-secondary leading-relaxed">
                Client and candidate data is handled using industry-standard security practices. Please review our{' '}
                <a 
                  href="/privacy-policy" 
                  className="text-primary-violet hover:underline font-medium"
                >
                  Privacy Policy
                </a>
                {' '}for details.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h2 className="text-2xl font-semibold text-text-primary mb-4">Account Security</h2>
              <p className="text-text-secondary leading-relaxed">
                Access to the dashboard is managed via secure authentication. You are responsible for maintaining secure access to your account credentials.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h2 className="text-2xl font-semibold text-text-primary mb-4">Intellectual Property</h2>
              <p className="text-text-secondary leading-relaxed">
                All platform content, designs, and workflows are the exclusive property of Glitch Engine. Do not copy, distribute, or reuse platform elements without written permission.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <h2 className="text-2xl font-semibold text-text-primary mb-4">Termination</h2>
              <p className="text-text-secondary leading-relaxed">
                We reserve the right to suspend or terminate access if the platform is misused or these terms are violated.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <h2 className="text-2xl font-semibold text-text-primary mb-4">Modifications</h2>
              <p className="text-text-secondary leading-relaxed">
                We may revise these Terms at any time. Continued use of the service after changes constitutes acceptance of the updated terms.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <h2 className="text-2xl font-semibold text-text-primary mb-4">Governing Law</h2>
              <p className="text-text-secondary leading-relaxed">
                These terms are governed by the laws of our registered business jurisdiction. Disputes will be handled in local courts accordingly.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <h2 className="text-2xl font-semibold text-text-primary mb-4">Contact</h2>
              <p className="text-text-secondary leading-relaxed">
                For questions about these Terms, contact us at{' '}
                <a 
                  href="mailto:support@glitchengine.com" 
                  className="text-primary-violet hover:underline font-medium"
                >
                  support@glitchengine.com
                </a>
                .
              </p>
            </motion.section>
          </div>

          {/* Footer */}
          <motion.div
            className="mt-12 pt-8 border-t border-border-light text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            <p className="text-text-secondary">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsOfService;