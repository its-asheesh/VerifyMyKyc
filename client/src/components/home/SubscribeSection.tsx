import React from 'react';
import { motion } from 'framer-motion';
import SubscribeForm from '../common/SubscribeForm';

interface SubscribeSectionProps {
  title?: string;
  description?: string;
  className?: string;
}

const SubscribeSection: React.FC<SubscribeSectionProps> = ({
  title = 'Stay Updated',
  description = 'Subscribe to our newsletter to get the latest updates and news.',
  className = '',
}) => {
  return (
    <section className={`py-16 bg-gray-50 dark:bg-gray-900 ${className}`}>
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            {description}
          </p>
          
          <div className="max-w-md mx-auto">
            <SubscribeForm 
              buttonText="Subscribe Now"
              inputPlaceholder="Your email address"
              className="flex-col sm:flex-row"
            />
          </div>
          
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SubscribeSection;
