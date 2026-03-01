'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
      <Link href="/" className="text-xl font-semibold">WireUP</Link>
      <div className="flex items-center gap-3 text-sm">
        {isAuthenticated ? (
          <>
            <span className="rounded-xl bg-white px-3 py-2 shadow-sm">{user?.name}</span>
            <Link href={user?.role === 'admin' ? '/admin' : '/dashboard'} className="rounded-xl bg-accent px-4 py-2 text-white shadow-md">Dashboard</Link>
            <button onClick={logout} className="rounded-xl bg-white px-4 py-2 shadow-sm">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="rounded-xl bg-white px-4 py-2 shadow-sm">Login</Link>
            <Link href="/register" className="rounded-xl bg-accent px-4 py-2 text-white shadow-md">Get Started</Link>
          </>
        )}
      </div>
    </header>
  );
}
