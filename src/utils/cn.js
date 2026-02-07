/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 ClassName Utility
 * 
 * Combines clsx and tailwind-merge for optimal class handling.
 */

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with Tailwind CSS conflict resolution
 * 
 * @param {...(string|Object|Array)} inputs - Class names, objects, or arrays
 * @returns {string} Merged class names
 * 
 * @example
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4'
 * cn('text-red-500', { 'bg-blue-500': true }) // => 'text-red-500 bg-blue-500'
 * cn(['flex', 'items-center'], 'justify-between') // => 'flex items-center justify-between'
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Create variant-based class name generator
 * 
 * @param {Object} config - Variant configuration
 * @returns {Function} Class name generator function
 * 
 * @example
 * const button = cva('px-4 py-2 rounded', {
 *   variants: {
 *     intent: {
 *       primary: 'bg-blue-500 text-white',
 *       secondary: 'bg-gray-200 text-gray-800',
 *     },
 *     size: {
 *       sm: 'text-sm',
 *       md: 'text-base',
 *       lg: 'text-lg',
 *     },
 *   },
 *   defaultVariants: {
 *     intent: 'primary',
 *     size: 'md',
 *   },
 * });
 * 
 * button({ intent: 'secondary', size: 'lg' })
 */
export function cva(base, config = {}) {
  const { variants = {}, defaultVariants = {}, compoundVariants = [] } = config;
  
  return function (props = {}) {
    // Start with base classes
    const classes = [base];
    
    // Merge props with defaults
    const mergedProps = { ...defaultVariants, ...props };
    
    // Add variant classes
    Object.entries(variants).forEach(([variantKey, variantValues]) => {
      const variantValue = mergedProps[variantKey];
      if (variantValue && variantValues[variantValue]) {
        classes.push(variantValues[variantValue]);
      }
    });
    
    // Add compound variant classes
    compoundVariants.forEach((compound) => {
      const { class: compoundClass, className, ...conditions } = compound;
      const matches = Object.entries(conditions).every(
        ([key, value]) => mergedProps[key] === value
      );
      
      if (matches) {
        classes.push(compoundClass || className);
      }
    });
    
    // Add any additional className from props
    if (mergedProps.className) {
      classes.push(mergedProps.className);
    }
    
    return cn(...classes);
  };
}

/**
 * Conditional class names
 * 
 * @param {Object} conditions - Object with class names as keys and conditions as values
 * @returns {string} Class names where condition is true
 * 
 * @example
 * conditionalClasses({
 *   'bg-blue-500': isPrimary,
 *   'bg-gray-500': !isPrimary,
 *   'opacity-50': isDisabled,
 * })
 */
export function conditionalClasses(conditions) {
  return cn(
    Object.entries(conditions)
      .filter(([_, condition]) => condition)
      .map(([className]) => className)
  );
}

/**
 * Focus ring utility classes
 * @param {Object} options - Focus ring options
 * @returns {string}
 */
export function focusRing(options = {}) {
  const { color = 'neon-blue', offset = 2 } = options;
  
  return cn(
    'focus:outline-none',
    'focus-visible:ring-2',
    `focus-visible:ring-${color}`,
    `focus-visible:ring-offset-${offset}`,
    'focus-visible:ring-offset-dark-950'
  );
}

/**
 * Interactive element base classes
 * @returns {string}
 */
export function interactiveBase() {
  return cn(
    'transition-all duration-200',
    'cursor-pointer',
    'select-none',
    focusRing()
  );
}

/**
 * Glassmorphism classes
 * @param {string} intensity - 'light' | 'medium' | 'heavy'
 * @returns {string}
 */
export function glass(intensity = 'medium') {
  const intensities = {
    light: 'bg-white/5 backdrop-blur-md border-white/10',
    medium: 'bg-white/10 backdrop-blur-lg border-white/15',
    heavy: 'bg-white/15 backdrop-blur-xl border-white/20',
  };
  
  return cn(
    intensities[intensity] || intensities.medium,
    'border',
    'shadow-glass'
  );
}

/**
 * Gradient text classes
 * @param {string} type - Gradient type
 * @returns {string}
 */
export function gradientText(type = 'neon') {
  const gradients = {
    neon: 'bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink',
    blue: 'bg-gradient-to-r from-blue-400 to-cyan-400',
    purple: 'bg-gradient-to-r from-purple-400 to-pink-400',
    gold: 'bg-gradient-to-r from-yellow-400 to-orange-400',
  };
  
  return cn(
    gradients[type] || gradients.neon,
    'bg-clip-text text-transparent'
  );
}

export default cn;
