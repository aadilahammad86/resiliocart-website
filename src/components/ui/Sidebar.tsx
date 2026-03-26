'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Settings, User, UserPlus, LogOut, LayoutDashboard, Menu } from 'lucide-react';

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  role?: 'user' | 'superadmin';
}

export function Sidebar({ className, role = 'user', ...props }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <aside
      className={cn(
        'flex flex-col transition-all duration-300 ease-in-out border-r border-glass-border bg-glass-light backdrop-blur-md h-screen',
        isCollapsed ? 'w-20' : 'w-64',
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-glass-border">
        {!isCollapsed && (
          <span className="text-xl font-bold tracking-tight truncate pl-2">Resiliocart</span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'p-2 rounded-lg hover:bg-white/10 transition-colors text-foreground/80 focus:outline-none focus:ring-2 focus:ring-indigo-500',
            isCollapsed && 'mx-auto'
          )}
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
        <SidebarItem
          href="/dashboard"
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          isCollapsed={isCollapsed}
          isActive
        />

        <div className="pt-6 pb-2">
          {!isCollapsed && (
            <p className="px-3 text-xs font-semibold text-foreground/50 uppercase tracking-wider">
              Settings
            </p>
          )}
          <div className="mt-2 space-y-1">
            <SidebarItem
              href="/profile"
              icon={<User size={20} />}
              label="Profile"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              href="/account"
              icon={<Settings size={20} />}
              label="Account Details"
              isCollapsed={isCollapsed}
            />

            {/* Conditional Super Admin Link */}
            {role === 'superadmin' && (
              <SidebarItem
                href="/admin/add-user"
                icon={<UserPlus size={20} />}
                label="Add User (Admin)"
                isCollapsed={isCollapsed}
                className="text-indigo-500 hover:text-indigo-400 font-bold"
              />
            )}
          </div>
        </div>
      </nav>

      {/* Footer (Logout) */}
      <div className="p-4 border-t border-glass-border">
        <button
          className={cn(
            'flex items-center w-full p-3 rounded-lg text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-all font-medium',
            isCollapsed ? 'justify-center' : 'space-x-3'
          )}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
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
          ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30'
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
