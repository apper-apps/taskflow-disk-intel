import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import { cn } from '@/utils/cn';

const FormField = ({ 
  label, 
  id, 
  required, 
  error, 
  children, 
  className,
  ...props 
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      {children || <Input id={id} error={error} {...props} />}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;