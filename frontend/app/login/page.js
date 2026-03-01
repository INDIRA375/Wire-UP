'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/ToastProvider';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { notify } = useToast();

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      login(data);
      notify('Welcome back!', 'success');
      router.push(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6">
      <form onSubmit={onSubmit} className="card w-full space-y-4">
        <h1 className="text-2xl font-semibold">Login</h1>
        <input className="input" placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button disabled={loading} className="w-full rounded-xl bg-accent py-3 text-sm font-medium text-white shadow-md disabled:opacity-60">
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <p className="text-sm text-gray-600">No account? <Link href="/register" className="text-accent">Register</Link></p>
      </form>
    </main>
  );
}
