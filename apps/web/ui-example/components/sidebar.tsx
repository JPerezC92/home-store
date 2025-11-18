'use client';

import { Home, CheckSquare, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', href: '#' },
  { icon: CheckSquare, label: 'Tasks', href: '#' },
  { icon: CreditCard, label: 'Transactions', href: '#', active: true },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border p-6 flex flex-col gap-8 shadow-sm">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
            🏪
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">Home Store</h1>
            <p className="text-xs text-muted-foreground">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200',
              item.active
                ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/20'
                : 'text-sidebar-foreground hover:bg-muted'
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Footer */}
      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p className="font-medium">Clean Architecture</p>
        <p>Built with Next.js & Tailwind</p>
      </div>
    </aside>
  );
}
