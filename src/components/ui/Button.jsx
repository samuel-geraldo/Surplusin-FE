import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  /* base */
  'inline-flex items-center justify-center rounded-lg font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-white hover:bg-primary-hover active:bg-primary-active focus-visible:outline-primary',
        secondary:
          'bg-secondary text-white hover:bg-secondary-hover active:bg-secondary-active focus-visible:outline-secondary',
        ghost:
          'bg-transparent text-text hover:bg-border/40 active:bg-border/60',
      },
      size: {
        default: 'h-10 px-5 text-body2',
        sm: 'h-8 px-3 text-label',
        lg: 'h-12 px-7 text-body1',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export function Button({ variant, size, className, children, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}
