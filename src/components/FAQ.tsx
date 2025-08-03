import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqItems = [
    {
      question: "What if I don't like any of the candidates?",
      answer: "If none of the 5 candidates meet your standards, we'll source another batch at no additional cost. We're committed to finding you the right fit."
    },
    {
      question: "How fast do I get the interviews?",
      answer: "You'll receive your first batch of 5 video interviews within 7 days of completing your intake form. Most clients get them even faster."
    },
    {
      question: "Are the interviews async or live?",
      answer: "All interviews are async video recordings. Candidates answer your specific questions on camera, and you review them on your own schedule."
    },
    {
      question: "Do I need to schedule anything?",
      answer: "No scheduling required! Once you submit your requirements, we handle everything. You'll simply receive a link to review the candidate videos when they're ready."
    },
    {
      question: "Is this really free to start?",
      answer: "Yes! Your first batch of 5 candidates is completely free. No credit card required. You only pay if you want to hire someone or request additional batches."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <section className="py-16 md:py-section-desktop bg-background-white">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-4xl">
        <h2 className="text-h2 text-text-primary text-center mb-12 md:mb-16">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="border border-border-light rounded-card overflow-hidden bg-background-white shadow-card"
            >
              <button
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-background-beige transition-colors duration-200"
                onClick={() => toggleItem(index)}
              >
                <h3 className="text-lg font-semibold text-text-primary pr-4">
                  {item.question}
                </h3>
                {openItem === index ? (
                  <Minus className="w-5 h-5 text-text-secondary flex-shrink-0" />
                ) : (
                  <Plus className="w-5 h-5 text-text-secondary flex-shrink-0" />
                )}
              </button>
              
              {openItem === index && (
                <div className="px-6 pb-5 pt-2 bg-background-beige">
                  <p className="text-text-secondary leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;