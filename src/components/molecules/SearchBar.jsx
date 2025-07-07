import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import { cn } from '@/utils/cn';

const SearchBar = ({ 
  placeholder = 'Search tasks...', 
  value, 
  onChange, 
  onClear,
  className 
}) => {
  const [isFocused, setIsFocused] = useState(false);

return (
    <motion.div
      className={cn(
        'relative flex items-center',
        className
      )}
      animate={{
        scale: isFocused ? 1.03 : 1,
      }}
      transition={{ duration: 0.3, type: "spring", stiffness: 400 }}
    >
      <motion.div
        animate={{
          scale: isFocused ? 1.1 : 1,
          color: isFocused ? '#2563eb' : '#9ca3af'
        }}
        transition={{ duration: 0.2 }}
      >
        <ApperIcon 
          name="Search" 
          size={18} 
          className="absolute left-3 text-gray-400 pointer-events-none z-10 transition-colors duration-200" 
        />
      </motion.div>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="pl-10 pr-10 h-10 bg-gradient-to-r from-white to-surface-50 border-gray-300 focus:border-primary focus:ring-primary/30 transition-all duration-300 shadow-soft focus:shadow-medium hover:border-gray-400 rounded-xl backdrop-blur-sm"
      />
      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={onClear}
          className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <ApperIcon name="X" size={16} />
        </motion.button>
      )}
    </motion.div>
  );
};

export default SearchBar;