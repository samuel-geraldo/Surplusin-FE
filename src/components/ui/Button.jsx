import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-bold leading-none transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'rounded-2xl bg-gradient-to-r from-[#27623b] to-green-normal !text-white hover:bg-[#307848] hover:bg-none hover:shadow-[0_0_8px_0_rgba(255,255,255,0.9)] active:bg-[#23ad51] active:bg-none focus-visible:outline-green-normal',
        secondary:
          'rounded-[20px] bg-orange-normal !text-white hover:bg-[#ff8839] hover:shadow-[0_0_12px_0_rgba(255,255,255,0.3)] active:bg-orange-normal-active focus-visible:outline-orange-normal',
        outline:
          'rounded-[20px] border border-slate-900 bg-white !text-[#0f172a] hover:bg-green-light-hover active:bg-green-light-active focus-visible:outline-green-normal',
        ghost:
          'rounded-[20px] bg-white !text-[#0f172a] hover:bg-green-light-hover hover:shadow-[0_0_12px_0_rgba(255,255,255,0.3)] active:bg-green-light-active focus-visible:outline-green-normal',
      },
      size: {
        sm: 'min-h-[45px] px-5 py-2.5 text-label',
        md: 'min-h-[57px] px-8 py-3 text-h3',
        lg: 'min-h-[73px] px-10 py-5 text-h3',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export function Button({
  children,
  onClick,
  disabled,
  className,
  variant,
  size,
  ...props
}) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
