import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Select = forwardRef(({ 
  className, 
  children,
  error,
  ...props 
}, ref) => {
return (
    <select
      className={cn(
        'flex h-10 w-full rounded-xl border border-gray-300 bg-gradient-to-r from-white to-surface-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 shadow-soft focus:shadow-medium hover:border-gray-400',
        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/30 bg-gradient-to-r from-red-50/50 to-white',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;