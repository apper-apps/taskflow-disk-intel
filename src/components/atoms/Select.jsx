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
        'flex h-12 w-full rounded-xl border-2 px-4 py-3 text-sm font-medium focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 backdrop-blur-sm',
        error 
          ? 'border-red-300 bg-gradient-to-r from-red-50/50 to-white focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
          : 'border-gray-200 bg-gradient-to-r from-white via-gray-50/30 to-white focus:border-primary focus:ring-4 focus:ring-primary/20 focus:bg-white',
        'shadow-sm focus:shadow-lg hover:border-gray-300',
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