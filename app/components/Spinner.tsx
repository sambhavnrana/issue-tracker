'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Spinner: React.FC<{ fullscreen?: boolean; size?: number }> = ({ fullscreen = false, size = 24 }) => {
  if (fullscreen) {
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
        />
      </div>
    );
  }
  // Inline spinner for button or small loading states
  return (
    <motion.div
      role="status"
      aria-label="Loading"
      initial={{ opacity: 0, scale: 1 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: 360,
      }}
      transition={{
        rotate: { repeat: Infinity, duration: 1, ease: 'linear' },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      }}
      className="inline-block align-middle rounded-full border-2 border-t-transparent border-brand-dark"
      style={{ width: size, height: size }}
    />
  );
};

export default Spinner;
