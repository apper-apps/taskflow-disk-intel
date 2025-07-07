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
    default: `
      bg-gradient-to-r from-primary via-blue-500 to-primary-dark text-white 
      hover:from-blue-600 hover:via-blue-700 hover:to-primary-dark 
      shadow-lg hover:shadow-xl focus:shadow-glow
      border border-primary/30 backdrop-blur-sm
      relative overflow-hidden
    `,
    outline: `
      border-2 border-gray-300 
      bg-gradient-to-r from-white/90 via-surface-50/90 to-white/90 
      text-gray-700 hover:text-primary 
      hover:border-primary/50 hover:from-primary/5 hover:via-primary/3 hover:to-primary/5
      shadow-md hover:shadow-lg 
      backdrop-blur-sm
      relative overflow-hidden
    `,
    secondary: `
      bg-gradient-to-r from-secondary via-purple-500 to-secondary-dark text-white 
      hover:from-purple-600 hover:via-purple-700 hover:to-secondary-dark 
      shadow-lg hover:shadow-xl focus:shadow-glow-purple
      border border-secondary/30 backdrop-blur-sm
      relative overflow-hidden
    `,
    ghost: `
      text-gray-600 hover:text-primary 
      hover:bg-gradient-to-r hover:from-primary/8 hover:via-primary/4 hover:to-secondary/8
      hover:shadow-md hover:backdrop-blur-sm
      border border-transparent hover:border-primary/20
      relative overflow-hidden
    `,
    danger: `
      bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white 
      hover:from-red-600 hover:via-red-700 hover:to-red-800 
      shadow-lg hover:shadow-xl focus:shadow-red-500/30
      border border-red-400/30 backdrop-blur-sm
      relative overflow-hidden
    `,
    success: `
      bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white 
      hover:from-green-600 hover:via-green-700 hover:to-green-800 
      shadow-lg hover:shadow-xl focus:shadow-green-500/30
      border border-green-400/30 backdrop-blur-sm
      relative overflow-hidden
    `,
  };

  const sizes = {
    sm: 'h-10 px-5 text-sm',
    default: 'h-12 px-6 text-sm',
    lg: 'h-14 px-8 text-base',
  };

  return (
    <motion.button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed group',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      whileHover={{ 
        scale: disabled ? 1 : 1.02,
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
          className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
          style={{
            animation: 'gradient-shift 3s ease infinite',
          }}
        />
      )}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;