import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

const Motion = motion;

export function AuthCard({ children, className }) {
  const reducedMotion = useReducedMotion();

  return (
    <Motion.div
      className={cn(
        'w-full rounded-[20px] bg-white p-6 shadow-[0_0_2px_rgba(0,0,0,0.25)] sm:p-8',
        className,
      )}
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={reducedMotion ? undefined : { opacity: 1 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
    >
      {children}
    </Motion.div>
  );
}
