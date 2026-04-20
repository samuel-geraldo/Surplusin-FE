import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-label font-medium text-text"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'h-10 w-full rounded-lg border border-border bg-surface px-3 text-body2 text-text',
            'placeholder:text-text-muted',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
            'transition-colors duration-200',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error focus:border-error focus:ring-error/20',
            className,
          )}
          {...props}
        />
        {error && <p className="text-caption text-error">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
