'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Welcome to Home Store
          </h1>
          <p className="text-xl text-muted-foreground/90 max-w-2xl mx-auto">
            Your home management system with Clean Architecture
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link
            href="/tasks"
            className="bg-card border border-jpc-vibrant-cyan-500/20 rounded-xl p-8 shadow-xl hover:shadow-2xl hover:shadow-jpc-vibrant-cyan-500/10 transition-all duration-300 hover:-translate-y-1 group hover:border-jpc-vibrant-cyan-500/40 bg-gradient-to-br from-cyan-500/5 to-transparent"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">✅</div>
            <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-jpc-vibrant-cyan-400 transition-colors">
              Tasks Manager
            </h3>
            <p className="text-sm text-muted-foreground/80 leading-relaxed">
              Manage your tasks efficiently with priorities and status tracking
            </p>
          </Link>

          <div className="bg-card border border-border/60 rounded-xl p-8 shadow-xl opacity-50 cursor-not-allowed">
            <div className="text-5xl mb-4">🔗</div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Links Manager
            </h3>
            <p className="text-sm text-muted-foreground/80 leading-relaxed">
              Coming soon - Organize your important links
            </p>
          </div>

          <div className="bg-card border border-border/60 rounded-xl p-8 shadow-xl opacity-50 cursor-not-allowed">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Analytics
            </h3>
            <p className="text-sm text-muted-foreground/80 leading-relaxed">
              Coming soon - Track your productivity
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mb-12">
          <div className="flex gap-4 rounded-xl border border-blue-500/40 bg-gradient-to-r from-blue-500/15 to-blue-600/5 p-6 hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group backdrop-blur-sm">
            <div className="text-2xl flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
              ℹ️
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-blue-100 group-hover:text-blue-50 transition-colors duration-300">
                Clean Architecture Pattern
              </h4>
              <p className="mt-2 text-xs text-blue-100/70 leading-relaxed">
                This project follows Clean Architecture principles with clear separation of concerns: Domain (entities), Application (use cases), and Infrastructure (implementation details). Each layer is independent and testable.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card border border-jpc-vibrant-cyan-500/20 rounded-xl p-6 shadow-xl hover:shadow-2xl hover:shadow-jpc-vibrant-cyan-500/10 transition-all duration-300 hover:border-jpc-vibrant-cyan-500/40 group">
            <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">Modules</p>
            <p className="text-4xl font-bold text-jpc-vibrant-cyan-400 group-hover:scale-105 transition-transform duration-300">1</p>
          </div>
          <div className="bg-card border border-jpc-vibrant-emerald-500/20 rounded-xl p-6 shadow-xl hover:shadow-2xl hover:shadow-jpc-vibrant-emerald-500/10 transition-all duration-300 hover:border-jpc-vibrant-emerald-500/40 group">
            <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">Architecture</p>
            <p className="text-4xl font-bold text-jpc-vibrant-emerald-400 group-hover:scale-105 transition-transform duration-300">Clean</p>
          </div>
          <div className="bg-card border border-jpc-vibrant-orange-500/20 rounded-xl p-6 shadow-xl hover:shadow-2xl hover:shadow-jpc-vibrant-orange-500/10 transition-all duration-300 hover:border-jpc-vibrant-orange-500/40 group">
            <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">Database</p>
            <p className="text-4xl font-bold text-jpc-vibrant-orange-400 group-hover:scale-105 transition-transform duration-300">Turso</p>
          </div>
          <div className="bg-card border border-jpc-vibrant-purple-500/20 rounded-xl p-6 shadow-xl hover:shadow-2xl hover:shadow-jpc-vibrant-purple-500/10 transition-all duration-300 hover:border-jpc-vibrant-purple-500/40 group">
            <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">Status</p>
            <p className="text-4xl font-bold text-jpc-vibrant-purple-400 group-hover:scale-105 transition-transform duration-300">✓</p>
          </div>
        </div>
      </main>
    </div>
  );
}
