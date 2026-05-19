'use client';

import { useUser } from '@stackframe/stack';
import { useSidebar } from '@/components/sidebar-context';
import { cn } from '@/lib/utils';

export function MainContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  const user = useUser();

  return (
    <div
      className={cn(
        'flex flex-col flex-1 transition-[padding] duration-300 ease-in-out',
        user && (collapsed ? 'lg:pl-14' : 'lg:pl-56')
      )}
    >
      <main className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>
    </div>
  );
}
