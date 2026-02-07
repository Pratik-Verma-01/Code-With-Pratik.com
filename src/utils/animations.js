/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Animation Variants
 * 
 * Framer Motion animation presets and variants.
 */

// ===================
// Timing Presets
// ===================

export const timing = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
};

export const spring = {
  gentle: { type: 'spring', stiffness: 120, damping: 14 },
  bouncy: { type: 'spring', stiffness: 300, damping: 10 },
  stiff: { type: 'spring', stiffness: 400, damping: 30 },
  smooth: { type: 'spring', stiffness: 200, damping: 20 },
};

export const ease = {
  easeOut: [0.16, 1, 0.3, 1],
  easeIn: [0.4, 0, 1, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
};

// ===================
// Fade Variants
// ===================

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: timing.normal },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: timing.normal, ease: ease.easeOut },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: timing.normal, ease: ease.easeOut },
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: timing.normal, ease: ease.easeOut },
};

export const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: timing.normal, ease: ease.easeOut },
};

// ===================
// Scale Variants
// ===================

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: timing.normal, ease: ease.easeOut },
};

export const scaleUp = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5 },
  transition: spring.bouncy,
};

export const popIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: spring.gentle,
};

// ===================
// Slide Variants
// ===================

export const slideInRight = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: { duration: timing.normal, ease: ease.easeOut },
};

export const slideInLeft = {
  initial: { x: '-100%' },
  animate: { x: 0 },
  exit: { x: '-100%' },
  transition: { duration: timing.normal, ease: ease.easeOut },
};

export const slideInUp = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
  transition: { duration: timing.normal, ease: ease.easeOut },
};

export const slideInDown = {
  initial: { y: '-100%' },
  animate: { y: 0 },
  exit: { y: '-100%' },
  transition: { duration: timing.normal, ease: ease.easeOut },
};

// ===================
// Page Transition Variants
// ===================

export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: timing.fast, ease: ease.easeOut },
};

export const pageSlide = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: timing.normal, ease: ease.easeOut },
};

// ===================
// Modal Variants
// ===================

export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: timing.fast },
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 10 },
  transition: spring.smooth,
};

export const drawerLeft = {
  initial: { x: '-100%' },
  animate: { x: 0 },
  exit: { x: '-100%' },
  transition: { type: 'tween', duration: timing.normal, ease: ease.easeOut },
};

export const drawerRight = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: { type: 'tween', duration: timing.normal, ease: ease.easeOut },
};

export const drawerBottom = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
  transition: { type: 'tween', duration: timing.normal, ease: ease.easeOut },
};

// ===================
// List/Stagger Variants
// ===================

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: timing.normal, ease: ease.easeOut },
};

export const staggerFadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: timing.fast },
};

export const gridContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const gridItem = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: spring.gentle,
};

// ===================
// Hover Variants
// ===================

export const hoverScale = {
  scale: 1.02,
  transition: { duration: timing.fast },
};

export const hoverLift = {
  y: -4,
  transition: { duration: timing.fast },
};

export const hoverGlow = {
  boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
  transition: { duration: timing.fast },
};

export const tapScale = {
  scale: 0.98,
};

// ===================
// Interactive Element Variants
// ===================

export const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

export const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { 
    y: -4,
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
    transition: { duration: timing.fast },
  },
  tap: { scale: 0.99 },
};

export const linkVariants = {
  initial: { opacity: 0.8 },
  hover: { opacity: 1, x: 4 },
  tap: { scale: 0.98 },
};

// ===================
// Loading Variants
// ===================

export const pulse = {
  animate: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const spin = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const bounce = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const typingDots = {
  animate: {
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ===================
// Notification Variants
// ===================

export const notificationSlide = {
  initial: { opacity: 0, x: 100, scale: 0.9 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 100, scale: 0.9 },
  transition: spring.gentle,
};

export const notificationPop = {
  initial: { opacity: 0, scale: 0.8, y: -20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8, y: -20 },
  transition: spring.bouncy,
};

// ===================
// Utility Functions
// ===================

/**
 * Create stagger container with custom settings
 * @param {number} staggerChildren - Delay between children
 * @param {number} delayChildren - Initial delay
 * @returns {Object}
 */
export function createStaggerContainer(staggerChildren = 0.05, delayChildren = 0) {
  return {
    initial: {},
    animate: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
}

/**
 * Create fade variant with custom settings
 * @param {Object} options - Animation options
 * @returns {Object}
 */
export function createFadeIn(options = {}) {
  const { duration = timing.normal, y = 0, x = 0, scale = 1 } = options;
  
  return {
    initial: { opacity: 0, y, x, scale },
    animate: { opacity: 1, y: 0, x: 0, scale: 1 },
    exit: { opacity: 0, y, x, scale },
    transition: { duration, ease: ease.easeOut },
  };
}

/**
 * Create spring animation with custom settings
 * @param {Object} options - Spring options
 * @returns {Object}
 */
export function createSpring(options = {}) {
  const { stiffness = 200, damping = 20, mass = 1 } = options;
  
  return {
    type: 'spring',
    stiffness,
    damping,
    mass,
  };
}

/**
 * Animation presets for common use cases
 */
export const presets = {
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  popIn,
  slideInRight,
  slideInLeft,
  slideInUp,
  slideInDown,
  pageTransition,
  modalContent,
  modalBackdrop,
  staggerContainer,
  staggerItem,
  cardVariants,
  buttonVariants,
};

export default presets;
