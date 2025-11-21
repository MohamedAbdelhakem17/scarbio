import { cn } from '@/lib/utils/cn';
import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    const IS_PASSWORD = type === 'password';
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(prev => !prev);
    };

    const inputElement = (
      <input
        type={isPasswordVisible ? 'text' : type}
        className={cn(
          'flex w-full rounded-none border border-gray-200 border-input bg-transparent px-3 py-3 text-base shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'aria-[invalid=true]:border-red-600',
          'focus-visible:outline-none',
          'aria-[invalid=true]:focus-visible:ring-0',
          'aria-[invalid=false]:focus-visible:ring-1 aria-[invalid=false]:focus-visible:ring-blue-600',
          className
        )}
        ref={ref}
        {...props}
      />
    );

    // Return default input
    if (!IS_PASSWORD) {
      return inputElement;
    }

    // Return Password input
    return (
      <div className='relative'>
        {inputElement}
        <button
          type='button'
          onClick={togglePasswordVisibility}
          aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          className='absolute right-2 top-2/4 -translate-y-1/2'
        >
          {isPasswordVisible ? (
            <EyeOff strokeWidth={1} className='h-4 w-4' />
          ) : (
            <Eye strokeWidth={1} className='h-4 w-4' />
          )}
        </button>
      </div>
    );
  }
);

Input.displayName = 'Input';
export { Input };
