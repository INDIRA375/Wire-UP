'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/ToastProvider';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { notify } = useToast();

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      login(data);
      notify('Account created!', 'success');
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
        <h1 className="text-2xl font-semibold">Create account</h1>
        <input className="input" placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Password" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button disabled={loading} className="w-full rounded-xl bg-accent py-3 text-sm font-medium text-white shadow-md disabled:opacity-60">
          {loading ? 'Creating...' : 'Register'}
        </button>
        <p className="text-sm text-gray-600">Already have an account? <Link href="/login" className="text-accent">Login</Link></p>
      </form>
    </main>
  );
}
