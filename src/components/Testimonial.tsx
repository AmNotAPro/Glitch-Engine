import React from 'react';

const Testimonial = () => {
  return (
    <section className="py-16 md:py-section-desktop bg-background-white">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-4xl">
        <div className="bg-background-beige rounded-card shadow-card p-8 md:p-12 text-center border border-border-light">
          <blockquote className="text-2xl md:text-3xl font-medium text-text-primary mb-6 leading-relaxed">
            "We hired our async marketing manager in 5 days. No meetings. No stress."
          </blockquote>
          
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-violet to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              CM
            </div>
            <div className="text-left">
              <div className="font-semibold text-text-primary text-lg">
                Carla Meyer
              </div>
              <div className="text-text-secondary">
                Head of Talent
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;