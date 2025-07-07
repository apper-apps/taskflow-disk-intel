import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

const Button = forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'default', 
  children, 
  disabled,
  ...props 
}, ref) => {
const variants = {
    default: 'bg-gradient-to-r from-primary to-primary-dark text-white hover:from-primary-dark hover:to-primary shadow-medium hover:shadow-hard hover:shadow-glow border border-primary/20',
    outline: 'border-2 border-gradient-to-r from-gray-300 to-gray-400 bg-gradient-to-r from-white to-gray-50 text-gray-700 hover:from-gray-50 hover:to-white hover:border-primary/40 hover:text-primary shadow-soft hover:shadow-medium',
    secondary: 'bg-gradient-to-r from-secondary to-secondary-dark text-white hover:from-secondary-dark hover:to-secondary shadow-medium hover:shadow-hard hover:shadow-glow-purple border border-secondary/20',
    ghost: 'text-gray-600 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 hover:shadow-soft',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-medium hover:shadow-hard border border-red-400/20',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-medium hover:shadow-hard hover:shadow-glow-green border border-green-400/20',
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    default: 'h-11 px-5 text-sm',
    lg: 'h-13 px-7 text-base',
  };

  return (
    <motion.button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm relative overflow-hidden group',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      whileHover={{ 
        scale: disabled ? 1 : 1.05,
        y: disabled ? 0 : -1
      }}
      whileTap={{ 
        scale: disabled ? 1 : 0.98,
        y: disabled ? 0 : 0
      }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 17 
      }}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
      {!disabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
      )}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;