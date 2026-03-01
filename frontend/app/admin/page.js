'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/ToastProvider';
import { apiRequest } from '@/lib/api';

export default function AdminPage() {
  const { token, user, hydrated, logout } = useAuth();
  const { notify } = useToast();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hydrated) return;
    if (!token || user?.role !== 'admin') {
      router.push('/login');
      return;
    }
    loadBookings();
  }, [hydrated, token, status, search]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        ...(status !== 'all' ? { status } : {}),
        ...(search ? { search } : {})
      }).toString();
      const data = await apiRequest(`/admin/bookings${query ? `?${query}` : ''}`, {}, token);
      setBookings(data.bookings);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, nextStatus) => {
    try {
      await apiRequest(`/admin/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: nextStatus }) }, token);
      notify('Status updated.', 'success');
      loadBookings();
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  return (
    <main className="min-h-screen bg-ash">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 lg:grid-cols-[220px_1fr]">
        <aside className="border-r border-gray-200 bg-white p-6 shadow-md">
          <h1 className="mb-8 text-xl font-semibold">Admin Panel</h1>
          <nav className="space-y-2 text-sm">
            <p className="rounded-xl bg-ash px-3 py-2">Bookings</p>
            <button onClick={logout} className="w-full rounded-xl bg-gray-100 px-3 py-2 text-left">Logout</button>
          </nav>
        </aside>
        <section className="p-6">
          <div className="card mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
              <input className="input pl-9" placeholder="Search by service or customer" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="input md:max-w-[180px]" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="card overflow-x-auto">
            {loading ? (
              <LoadingSkeleton rows={6} />
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="py-3">Customer</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, idx) => (
                    <tr key={booking._id} className={idx % 2 ? 'bg-ash' : 'bg-white'}>
                      <td className="py-3">{booking.user?.name || 'Unknown'}<br /><span className="text-xs text-gray-500">{booking.user?.email}</span></td>
                      <td>{booking.service}</td>
                      <td>{new Date(booking.date).toLocaleDateString()} {booking.time}</td>
                      <td>{booking.location}</td>
                      <td className="capitalize">{booking.status}</td>
                      <td>
                        <select className="rounded-lg border border-gray-200 px-2 py-1" value={booking.status} onChange={(e) => updateStatus(booking._id, e.target.value)}>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {!bookings.length && (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-gray-500">No bookings match current filter.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
