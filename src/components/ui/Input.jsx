import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef(
  (
    {
      type = 'text',
      value,
      onChange,
      placeholder,
      label,
      error,
      className,
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    const inputId = id || props.name;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-label font-medium text-[#0f172a]"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'h-[60px] w-full rounded-lg border border-[#64748b] bg-white px-4 text-body1 font-normal text-[#0f172a]',
            'placeholder:text-[#64748b]',
            'focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10',
            'transition-colors duration-200',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-normal focus:border-red-normal focus:ring-red-normal/20',
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
