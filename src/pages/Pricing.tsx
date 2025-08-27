import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Pricing = () => {
  const handleGetStarted = () => {
    // Navigate to home page where signup modal can work
    window.location.href = '/';
  };

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
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 leading-tight">
                Built for hiring. Priced for outcomes.
              </h1>
              <p className="text-xl text-text-secondary mb-8">
                No retainers, no guesswork, just results.
              </p>
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center gap-2 bg-primary-violet hover:bg-primary-violet-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors mb-6"
              >
                👉 Get your free candidate videos
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Free Until Value */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                🆓 Free until you see value
              </h2>
              <p className="text-text-secondary mb-4 leading-relaxed">
                You get up to 5 video interviews for free, recorded specifically for your company. You only pay when you see someone you'd actually want to hire.
              </p>
              <p className="text-text-secondary mb-3">
                Everything happens inside the platform:
              </p>
              <ul className="pl-5 space-y-2 text-text-secondary list-disc">
                <li>Intake form = For onboarding</li>
                <li>15-minute confirmation call = alignment</li>
                <li>Within 7 days: full delivery of video interviews</li>
                <li>Email updates as progress happens</li>
                <li>Watch, evaluate, and pay inside your dashboard</li>
                <li>Every interview is created specifically for your role</li>
              </ul>
            </motion.section>

            {/* Pricing Overview */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                💰 Pricing starts at €2.500 per placement
              </h2>
              <p className="text-text-secondary mb-3">
                Most clients invest between €2.500 – €7.500, depending on:
              </p>
              <ul className="pl-5 space-y-2 text-text-secondary list-disc mb-6">
                <li>Role complexity</li>
                <li>Scope (single hire vs multi-role)</li>
                <li>Volume & urgency</li>
              </ul>
              <p className="text-text-secondary font-medium">
                You only pay when you hire, no subscriptions, no retainers, no fluff.
              </p>
            </motion.section>

            {/* What's Included */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                ✅ What's always included:
              </h2>
              <ul className="pl-5 space-y-2 text-text-secondary list-disc">
                <li>Intake form (2 minutes)</li>
                <li>Dedicated sourcing & smart filters</li>
                <li>3–5 video interviews</li>
                <li>Delivered inside your personal dashboard</li>
                <li>Fireflies summaries & transcripts</li>
                <li>Role-fit + vibe-fit scoring</li>
              </ul>
            </motion.section>

            {/* Custom Support */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                🛠️ Need something custom?
              </h2>
              <p className="text-text-secondary mb-3">We support:</p>
              <ul className="pl-5 space-y-2 text-text-secondary list-disc">
                <li>Multi-role hiring campaigns</li>
                <li>Skill assessments</li>
                <li>Ongoing pipelines (available by request)</li>
                <li>Full team buildouts</li>
              </ul>
            </motion.section>

            {/* Who We Work With */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                🤝 Who we work with
              </h2>
              <p className="text-text-secondary mb-8">
                We work with fast-moving teams who care about clarity, speed, and getting the right people in, without endless back-and-forth. If that's you!
              </p>
            </motion.section>

            {/* Final CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-center"
            >
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center gap-2 bg-primary-violet hover:bg-primary-violet-dark text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
              >
                👉 Get your free candidate videos
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Last Updated */}
            <motion.div
              className="mt-12 pt-8 border-t border-border-light text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
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

export default Pricing;