import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background-beige">
      {/* Full Site Header */}
      <Header />
      
      {/* Main Content with proper top padding for fixed header */}
      <main className="pt-16 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-6 py-12"
        >
          <div className="bg-background-white rounded-lg shadow-sm border border-border-light p-8 md:p-12">
            {/* Title */}
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-text-primary mb-10 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Privacy Policy
            </motion.h1>
            
            <motion.p 
              className="text-lg text-text-secondary mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Glitch Engine ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share personal information when you use our services.
            </motion.p>

            {/* Sections */}
            <div className="space-y-8">
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-2xl font-semibold text-text-primary mb-4">1. Information We Collect</h2>
                <ul className="pl-5 space-y-2 text-text-secondary leading-relaxed list-disc">
                  <li><strong className="text-text-primary">Account Info:</strong> Name, email, and signup data.</li>
                  <li><strong className="text-text-primary">Usage Data:</strong> How you use our platform.</li>
                  <li><strong className="text-text-primary">Transactions:</strong> Payment and billing data via Paddle.</li>
                </ul>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-2xl font-semibold text-text-primary mb-4">2. How We Use Your Information</h2>
                <ul className="pl-5 space-y-2 text-text-secondary leading-relaxed list-disc">
                  <li>To deliver and maintain our services.</li>
                  <li>To process payments and support transactions.</li>
                  <li>To communicate updates or service-related notices.</li>
                  <li>To improve our offerings and ensure platform reliability.</li>
                </ul>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h2 className="text-2xl font-semibold text-text-primary mb-4">3. Sharing Your Information</h2>
                <p className="text-text-secondary leading-relaxed">
                  We do not sell your data. We share it only with trusted providers like Paddle for payment processing, and where required by law.
                </p>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h2 className="text-2xl font-semibold text-text-primary mb-4">4. Data Security</h2>
                <p className="text-text-secondary leading-relaxed">
                  We use industry-standard security practices to protect your data against unauthorized access or misuse.
                </p>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <h2 className="text-2xl font-semibold text-text-primary mb-4">5. Your Rights</h2>
                <p className="text-text-secondary leading-relaxed">
                  You may access, update, or delete your data. You can also request portability or limit how your data is used. Contact us to exercise these rights.
                </p>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <h2 className="text-2xl font-semibold text-text-primary mb-4">6. Data Retention</h2>
                <p className="text-text-secondary leading-relaxed">
                  We retain your data only as long as needed to provide services or meet legal requirements.
                </p>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <h2 className="text-2xl font-semibold text-text-primary mb-4">7. International Transfers</h2>
                <p className="text-text-secondary leading-relaxed">
                  Data may be transferred outside your region. We follow all applicable laws to protect it during international transfers.
                </p>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <h2 className="text-2xl font-semibold text-text-primary mb-4">8. Changes to This Policy</h2>
                <p className="text-text-secondary leading-relaxed">
                  We may update this policy. If we do, the new version will be posted here with the updated effective date.
                </p>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <h2 className="text-2xl font-semibold text-text-primary mb-4">9. Contact</h2>
                <p className="text-text-secondary leading-relaxed">
                  Questions? Reach us at{' '}
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
              transition={{ duration: 0.6, delay: 1.2 }}
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
      </main>

      {/* Full Site Footer */}
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;