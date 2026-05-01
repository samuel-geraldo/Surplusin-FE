import { AuthHeader } from './AuthHeader';
import { cn } from '@/lib/utils';

export function AuthShell({ children, wide = false }) {
  return (
    <section className="min-h-screen bg-[#f3f3f6] text-[#0f172a]">
      <AuthHeader />
      <main
        className={cn(
          'mx-auto flex min-h-[calc(100svh-80px)] w-full justify-center px-4 sm:px-6',
          wide ? 'items-start py-14' : 'items-center py-6',
        )}
      >
        <div className={wide ? 'w-full max-w-[1010px]' : 'w-full max-w-[550px]'}>
          {children}
        </div>
      </main>
    </section>
  );
}
