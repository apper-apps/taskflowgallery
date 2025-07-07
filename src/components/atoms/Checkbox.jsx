import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = forwardRef(({ 
  className, 
  label,
  checked,
  onChange,
  ...props 
}, ref) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
          ref={ref}
          {...props}
        />
        <div className={cn(
          'w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center',
          checked 
            ? 'bg-gradient-to-r from-primary to-primary-light border-primary' 
            : 'border-gray-300 hover:border-primary bg-white',
          className
        )}>
          {checked && (
            <ApperIcon 
              name="Check" 
              size={12} 
              className="text-white animate-checkmark" 
            />
          )}
        </div>
      </div>
      {label && (
        <span className="ml-2 text-sm text-gray-700">{label}</span>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;