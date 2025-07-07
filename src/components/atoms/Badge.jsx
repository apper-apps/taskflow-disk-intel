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
    default: `
      bg-gradient-to-r from-gray-200/80 via-gray-100 to-gray-200/80 
      text-gray-800 shadow-md border border-gray-300/50
      hover:shadow-lg backdrop-blur-sm
    `,
    primary: `
      bg-gradient-to-r from-blue-100/80 via-blue-50 to-blue-100/80 
      text-blue-800 shadow-md border border-blue-300/50
      hover:shadow-lg hover:shadow-blue-500/20 backdrop-blur-sm
    `,
    secondary: `
      bg-gradient-to-r from-purple-100/80 via-purple-50 to-purple-100/80 
      text-purple-800 shadow-md border border-purple-300/50
      hover:shadow-lg hover:shadow-purple-500/20 backdrop-blur-sm
    `,
    success: `
      bg-gradient-to-r from-green-100/80 via-green-50 to-green-100/80 
      text-green-800 shadow-md border border-green-300/50
      hover:shadow-lg hover:shadow-green-500/20 backdrop-blur-sm
    `,
    warning: `
      bg-gradient-to-r from-yellow-100/80 via-yellow-50 to-yellow-100/80 
      text-yellow-800 shadow-md border border-yellow-300/50
      hover:shadow-lg hover:shadow-yellow-500/20 backdrop-blur-sm
    `,
    danger: `
      bg-gradient-to-r from-red-100/80 via-red-50 to-red-100/80 
      text-red-800 shadow-md border border-red-300/50
      hover:shadow-lg hover:shadow-red-500/20 backdrop-blur-sm
    `,
    high: `
      bg-gradient-to-r from-red-100/80 via-red-50 to-red-100/80 
      text-red-800 shadow-md border border-red-300/50
      hover:shadow-lg hover:shadow-red-500/20 backdrop-blur-sm
    `,
    medium: `
      bg-gradient-to-r from-yellow-100/80 via-yellow-50 to-yellow-100/80 
      text-yellow-800 shadow-md border border-yellow-300/50
      hover:shadow-lg hover:shadow-yellow-500/20 backdrop-blur-sm
    `,
    low: `
      bg-gradient-to-r from-green-100/80 via-green-50 to-green-100/80 
      text-green-800 shadow-md border border-green-300/50
      hover:shadow-lg hover:shadow-green-500/20 backdrop-blur-sm
    `,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    default: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  return (
    <motion.span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-xl font-bold transition-all duration-300 hover:scale-105 relative overflow-hidden',
        variants[variant],
        sizes[size],
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
        initial={false}
      />
    </motion.span>
  );
});

Badge.displayName = "Badge";

export default Badge;