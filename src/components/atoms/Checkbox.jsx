import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = forwardRef(({ 
  className, 
  checked,
  onChange,
  ...props 
}, ref) => {
  return (
    <motion.div
      className="relative inline-flex items-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        onChange={onChange}
        className={cn(
          'h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20 focus:ring-2 transition-all duration-200',
          className
        )}
        {...props}
      />
      {checked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <ApperIcon name="Check" size={12} className="text-white" />
        </motion.div>
      )}
    </motion.div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;