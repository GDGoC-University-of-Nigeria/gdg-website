import { HTMLAttributes } from 'react';

import { motion } from 'framer-motion';

interface ViewProps extends HTMLAttributes<HTMLElement> {
  offset?: number;
}

export const AnimatedIntoView = ({ children, offset = 48 }: ViewProps) => {
  return (
      <motion.section
        initial={{ opacity: 0, y: offset }}
        viewport={{ once: true, margin: `${-Math.abs(offset)}px` }}
        transition={{ ease: 'easeOut', duration: 0.512, delay: 0.256 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        {children}
      </motion.section>
  );
};
