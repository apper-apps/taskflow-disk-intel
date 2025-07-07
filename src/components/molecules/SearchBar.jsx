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
        scale: isFocused ? 1.02 : 1,
      }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
    >
      <div 
        className="absolute inset-0 rounded-xl opacity-50"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.8) 0%,
              rgba(248, 250, 252, 0.9) 50%,
              rgba(255, 255, 255, 0.8) 100%
            )
          `,
          backdropFilter: 'blur(20px)',
          border: isFocused ? '2px solid rgba(59, 130, 246, 0.3)' : '2px solid rgba(229, 231, 235, 0.5)',
          boxShadow: isFocused 
            ? '0 8px 25px rgba(59, 130, 246, 0.15), 0 4px 15px rgba(0, 0, 0, 0.1)'
            : '0 4px 15px rgba(0, 0, 0, 0.05)',
        }}
      />
      
      <motion.div
        animate={{
          scale: isFocused ? 1.1 : 1,
          color: isFocused ? '#2563eb' : '#9ca3af'
        }}
        transition={{ duration: 0.2 }}
        className="absolute left-4 z-10"
      >
        <ApperIcon 
          name="Search" 
          size={20} 
          className={cn(
            'transition-colors duration-200',
            isFocused ? 'text-primary' : 'text-gray-400'
          )}
        />
      </motion.div>
      
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="relative z-10 w-full h-12 pl-12 pr-12 bg-transparent border-none outline-none text-sm font-medium placeholder:text-gray-500 text-gray-900"
        style={{
          backdropFilter: 'blur(10px)',
        }}
      />
      
      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={onClear}
          className="absolute right-4 z-10 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200"
          style={{
            background: 'rgba(107, 114, 128, 0.1)',
            backdropFilter: 'blur(10px)',
          }}
          whileHover={{ 
            scale: 1.1,
            backgroundColor: 'rgba(107, 114, 128, 0.2)'
          }}
          whileTap={{ scale: 0.9 }}
        >
          <ApperIcon name="X" size={14} className="text-gray-500" />
        </motion.button>
      )}
    </motion.div>
  );
};

export default SearchBar;