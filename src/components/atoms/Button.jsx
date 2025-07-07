import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Button = forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-surface hover:bg-gray-100 text-gray-700 border border-gray-300',
    accent: 'bg-gradient-to-r from-accent to-accent-light hover:from-accent-dark hover:to-accent text-white shadow-lg hover:shadow-xl',
    ghost: 'hover:bg-gray-100 text-gray-700',
    danger: 'bg-gradient-to-r from-error to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;