import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Input = forwardRef(({
  className, 
  type = 'text', 
  error,
  ...props 
}, ref) => {
return (
    <motion.input
      type={type}
      className={cn(
        'flex h-12 w-full rounded-xl border-2 px-4 py-3 text-sm font-medium placeholder:text-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 backdrop-blur-sm',
        error 
          ? 'border-red-300 bg-gradient-to-r from-red-50/50 to-white focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
          : 'border-gray-200 bg-gradient-to-r from-white via-gray-50/30 to-white focus:border-primary focus:ring-4 focus:ring-primary/20 focus:bg-white',
        'shadow-sm focus:shadow-lg hover:border-gray-300',
        className
      )}
      ref={ref}
      whileFocus={{ 
        scale: 1.01,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;