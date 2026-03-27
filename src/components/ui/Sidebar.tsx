'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { logoutUser } from '@/actions/auth';
import {
  Settings,
  User,
  UserPlus,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  CreditCard,
} from 'lucide-react';

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  role?: 'USER' | 'SUPERADMIN';
}

export function Sidebar({ className, role = 'USER', ...props }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const pathname = usePathname();

  // Close mobile drawer on route change
  React.useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Build sidebar content — accepts a `collapsed` parameter so mobile always renders expanded
  function renderSidebarContent(collapsed: boolean) {
    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-glass-border">
          {!collapsed && (
            <span className="text-xl font-bold tracking-tight truncate pl-2">Resiliocart</span>
          )}
          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              'p-2 rounded-lg hover:bg-white/10 transition-colors text-foreground/80 focus:outline-none focus:ring-2 focus:ring-indigo-500',
              collapsed && 'mx-auto',
              'hidden md:flex'
            )}
            aria-label="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>
          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-foreground/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:hidden"
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
          <SidebarItem
            href="/dashboard"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            isCollapsed={collapsed}
            isActive={pathname === '/dashboard'}
          />

          <div className="pt-6 pb-2">
            {!collapsed && (
              <p className="px-3 text-xs font-semibold text-foreground/50 uppercase tracking-wider">
                Settings
              </p>
            )}
            <div className="mt-2 space-y-1">
              <SidebarItem
                href="/dashboard/profile"
                icon={<User size={20} />}
                label="Profile"
                isCollapsed={collapsed}
                isActive={pathname === '/dashboard/profile'}
              />
              <SidebarItem
                href="/dashboard/account"
                icon={<CreditCard size={20} />}
                label="Account Details"
                isCollapsed={collapsed}
                isActive={pathname === '/dashboard/account'}
              />
              <SidebarItem
                href="/dashboard/settings"
                icon={<Settings size={20} />}
                label="Settings"
                isCollapsed={collapsed}
                isActive={pathname === '/dashboard/settings'}
              />

              {/* Conditional Super Admin Link — only renders when the authenticated session role is SUPERADMIN */}
              {role === 'SUPERADMIN' && (
                <SidebarItem
                  href="/dashboard/admin/add-user"
                  icon={<UserPlus size={20} />}
                  label="Add User (Admin)"
                  isCollapsed={collapsed}
                  isActive={pathname === '/dashboard/admin/add-user'}
                  className="text-indigo-500 hover:text-indigo-400 font-bold"
                />
              )}
            </div>
          </div>
        </nav>

        {/* Footer (Logout) */}
        <div className="p-4 border-t border-glass-border">
          <form action={logoutUser}>
            <button
              type="submit"
              className={cn(
                'flex items-center w-full p-3 rounded-lg text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-all font-medium cursor-pointer',
                collapsed ? 'justify-center' : 'space-x-3'
              )}
            >
              <LogOut size={20} />
              {!collapsed && <span>Logout</span>}
            </button>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Mobile hamburger trigger - visible only on small screens */}
      {!isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-glass-light backdrop-blur-md border border-glass-border shadow-lg hover:bg-white/10 transition-colors text-foreground/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:hidden"
          aria-label="Open Sidebar"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Mobile overlay backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile drawer sidebar — ALWAYS expanded (collapsed=false) so labels are visible */}
      <aside
        data-testid="sidebar-mobile"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col w-72 transition-transform duration-300 ease-in-out border-r border-glass-border bg-glass-light backdrop-blur-md md:hidden',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* Desktop persistent sidebar */}
      <aside
        data-testid="sidebar-desktop"
        className={cn(
          'hidden md:flex flex-col transition-all duration-300 ease-in-out border-r border-glass-border bg-glass-light backdrop-blur-md h-screen sticky top-0',
          isCollapsed ? 'w-20' : 'w-64',
          className
        )}
        {...props}
      >
        {renderSidebarContent(isCollapsed)}
      </aside>
    </>
  );
}

function SidebarItem({
  href,
  icon,
  label,
  isCollapsed,
  isActive,
  className,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  isActive?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center p-3 rounded-lg transition-all text-sm font-medium',
        isActive
          ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30 shadow-sm'
          : 'text-foreground/80 hover:bg-white/10 hover:text-foreground border border-transparent',
        isCollapsed ? 'justify-center' : 'space-x-3',
        className
      )}
      title={isCollapsed ? label : undefined}
    >
      <div className="flex-shrink-0">{icon}</div>
      {!isCollapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}
