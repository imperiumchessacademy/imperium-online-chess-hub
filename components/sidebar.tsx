'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, Suspense } from 'react';
import {
  Home, Trophy, Users, Swords, Crown, Heart,
  BookOpen, Info, Settings, User, LineChart, LogOut, Menu, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@stackframe/stack';
import { useSidebar } from '@/components/sidebar-context';

const coreLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/premiership', label: 'Premiership', icon: Trophy },
  { href: '/players', label: 'Players', icon: Users },
  { href: '/champ-challenge', label: 'Champ Challenge', icon: Trophy },
  { href: '/cage-match', label: 'Cage Match', icon: Swords },
];

const hubLinks = [
  { href: '/wall-of-champions', label: 'Wall of Champions', icon: Crown },
  { href: '/contributions', label: 'Contributions', icon: Heart },
  { href: '/rules', label: 'Rules', icon: BookOpen },
  { href: '/about', label: 'About', icon: Info },
];

const accountLinks = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/account', label: 'Account', icon: User },
  { href: '/performance', label: 'My Performance', icon: LineChart },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const user = useUser();
  const { collapsed } = useSidebar();

  const renderLink = (link: { href: string; label: string; icon: React.ElementType }) => {
    const Icon = link.icon;
    const isActive = pathname === link.href;
    return (
      <Link
        key={link.href}
        href={link.href}
        onClick={onClose}
        title={collapsed ? link.label : undefined}
        className={cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          collapsed && 'justify-center px-2',
          isActive
            ? 'bg-[#c68a2e]/15 text-[#c68a2e]'
            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsed && link.label}
      </Link>
    );
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className={cn(
        'flex items-center border-b border-border px-4 py-4 min-h-[72px]',
        collapsed ? 'justify-center px-2' : 'gap-3'
      )}>
        {collapsed ? (
          <span className="text-lg font-bold text-[#c68a2e]">I</span>
        ) : (
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold text-[#c68a2e]">IMPERIUM</span>
            <span className="text-lg font-bold text-[#c68a2e]">Online Chess Hub</span>
            <span className="text-xs text-muted-foreground">Hub dashboard</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* CORE Section */}
        <div>
          {!collapsed && (
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Core
            </p>
          )}
          <div className="space-y-0.5">{coreLinks.map(renderLink)}</div>
        </div>

        {/* HUB Section */}
        <div>
          {!collapsed && (
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Hub
            </p>
          )}
          <div className="space-y-0.5">{hubLinks.map(renderLink)}</div>
        </div>

        {/* ACCOUNT Section - Only when signed in */}
        {user && (
          <div>
            {!collapsed && (
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Account
              </p>
            )}
            <div className="space-y-0.5">
              {accountLinks.map(renderLink)}
              <Link
                href="/handler/sign-out"
                onClick={onClose}
                title={collapsed ? 'Log Out' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground',
                  collapsed && 'justify-center px-2'
                )}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {!collapsed && 'Log Out'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:border-border lg:bg-card z-40 transition-[width] duration-300 ease-in-out overflow-visible',
          collapsed ? 'lg:w-14' : 'lg:w-56'
        )}
      >
        <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Loading...</div>}>
          <SidebarContent />
        </Suspense>

        {/* Collapse toggle button — floats on the right edge */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3 top-16 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-secondary hover:text-foreground"
        >
          {collapsed
            ? <ChevronRight className="h-3 w-3" />
            : <ChevronLeft className="h-3 w-3" />
          }
        </button>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-card px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#c68a2e]">IMPERIUM</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 bg-card border-r border-border h-full">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
            <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Loading...</div>}>
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </Suspense>
          </div>
        </div>
      )}

      {/* Mobile Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card pb-safe">
        <div className="flex items-center justify-around py-2">
          {coreLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-1 px-2 py-1 text-muted-foreground hover:text-[#c68a2e]"
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{link.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
