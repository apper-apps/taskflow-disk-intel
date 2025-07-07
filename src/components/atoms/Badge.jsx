import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
const Badge = forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'default',
  children,
  ...props 
}, ref) => {
const variants = {
    default: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 shadow-soft border border-gray-200/50',
    primary: 'bg-gradient-to-r from-primary/10 to-primary/20 text-primary shadow-soft border border-primary/20',
    secondary: 'bg-gradient-to-r from-secondary/10 to-secondary/20 text-secondary shadow-soft border border-secondary/20',
    success: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 shadow-soft border border-green-200/50',
    warning: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 shadow-soft border border-yellow-200/50',
    danger: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 shadow-soft border border-red-200/50',
    high: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 shadow-soft border border-red-200/50',
    medium: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 shadow-soft border border-yellow-200/50',
    low: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 shadow-soft border border-green-200/50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    default: 'px-3.5 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <motion.span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-medium backdrop-blur-sm',
        variants[variant],
        sizes[size],
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.span>
  );
});

Badge.displayName = "Badge";

export default Badge;