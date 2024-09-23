'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Spinner: React.FC = () => {
  return (
    <div className="flex items-start justify-center h-screen w-full pt-20 sm:pt-32 md:pt-40">
      <motion.div
        role="status"
        aria-label="Loading"
        initial={{ opacity: 0, scale: 1 }}
        animate={{
          opacity: 1,
          scale: 1.5,
          rotate: 360,
        }}
        transition={{
          rotate: { repeat: Infinity, duration: 1, ease: 'linear' },
          opacity: { duration: 0.2 },
          scale: { duration: 0.2 },
        }}
        className="rounded-full border-4 border-t-transparent border-brand-dark"
        style={{ width: 48, height: 48 }}
      >
      </motion.div>
      </div>
  );
};

export default Spinner;
