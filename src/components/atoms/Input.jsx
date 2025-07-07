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
        'flex h-11 w-full rounded-xl border border-gray-300 bg-gradient-to-r from-white to-gray-50/50 px-4 py-3 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:shadow-glow focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 backdrop-blur-sm',
        error && 'border-red-400 focus:border-red-500 focus:ring-red-500/30 focus:shadow-0 focus:shadow-red-500/20',
        className
      )}
      ref={ref}
      whileFocus={{ 
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 17 }
      }}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;