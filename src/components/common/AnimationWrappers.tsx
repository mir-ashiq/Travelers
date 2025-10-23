import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { pageTransitionContainer, staggerContainer, staggerItem } from '../../lib/animations';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wrap page content with this for smooth page transitions
 */
export const PageTransition = ({ children, className = '' }: PageTransitionProps) => (
  <motion.div
    variants={pageTransitionContainer}
    initial="hidden"
    animate="visible"
    exit="exit"
    className={className}
  >
    {children}
  </motion.div>
);

/**
 * Wrap a container with staggered children animations
 */
export const StaggerContainer = ({
  children,
  className = ''
}: PageTransitionProps) => (
  <motion.div
    variants={staggerContainer}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    className={className}
  >
    {children}
  </motion.div>
);

/**
 * Individual stagger item - use inside StaggerContainer
 */
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export const StaggerItem = ({ children, className = '' }: StaggerItemProps) => (
  <motion.div variants={staggerItem} className={className}>
    {children}
  </motion.div>
);

/**
 * Animated card with hover effects
 */
interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const AnimatedCard = ({ children, className = '', delay = 0 }: AnimatedCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5, boxShadow: '0 20px 25px -5rgba(0, 0, 0, 0.1)' }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

/**
 * Animated button wrapper
 */
interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const AnimatedButton = ({ children, onClick, className = '' }: AnimatedButtonProps) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={className}
  >
    {children}
  </motion.button>
);

/**
 * Floating animated element (continuous animation)
 */
interface FloatingProps {
  children: ReactNode;
  className?: string;
  duration?: number;
}

export const Floating = ({ children, className = '', duration = 3 }: FloatingProps) => (
  <motion.div
    animate={{ y: [0, -20, 0] }}
    transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

/**
 * Pulsing animated element (continuous animation)
 */
interface PulsingProps {
  children: ReactNode;
  className?: string;
  duration?: number;
}

export const Pulsing = ({ children, className = '', duration = 2 }: PulsingProps) => (
  <motion.div
    animate={{ scale: [1, 1.05, 1] }}
    transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

/**
 * Slide in from direction animation
 */
interface SlideInProps {
  children: ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  className?: string;
  delay?: number;
}

export const SlideIn = ({
  children,
  direction = 'left',
  className = '',
  delay = 0
}: SlideInProps) => {
  const directionVariants = {
    left: { initial: { opacity: 0, x: -100 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: 100 }, animate: { opacity: 1, x: 0 } },
    up: { initial: { opacity: 0, y: 100 }, animate: { opacity: 1, y: 0 } },
    down: { initial: { opacity: 0, y: -100 }, animate: { opacity: 1, y: 0 } }
  };

  const { initial, animate } = directionVariants[direction];

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Fade in animation wrapper
 */
interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export const FadeIn = ({
  children,
  className = '',
  delay = 0,
  duration = 0.6
}: FadeInProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

/**
 * Scale in animation wrapper
 */
interface ScaleInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const ScaleIn = ({ children, className = '', delay = 0 }: ScaleInProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={className}
  >
    {children}
  </motion.div>
);
