'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/ToastProvider';
import { apiRequest } from '@/lib/api';
import { serviceOptions } from '@/lib/services';

const badgeStyles = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-emerald-100 text-emerald-800'
};

export default function DashboardPage() {
  const { token, user, hydrated } = useAuth();
  const { notify } = useToast();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ service: serviceOptions[0], date: '', time: '', location: 'Detecting location...' });

  useEffect(() => {
    if (!hydrated) return;
    if (!token || user?.role !== 'user') {
      router.push('/login');
      return;
    }
    loadBookings();
  }, [hydrated, token]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setForm((prev) => ({ ...prev, location: `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}` })),
      () => setForm((prev) => ({ ...prev, location: 'Location unavailable' }))
    );
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/bookings/my', {}, token);
      setBookings(data.bookings);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const submitBooking = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest('/bookings', { method: 'POST', body: JSON.stringify(form) }, token);
      notify('Booking created.', 'success');
      setForm((prev) => ({ ...prev, date: '', time: '' }));
      loadBookings();
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-ash pb-10">
      <Navbar />
      <section className="mx-auto grid max-w-6xl gap-6 px-6 lg:grid-cols-3">
        <form onSubmit={submitBooking} className="card h-fit space-y-4">
          <h1 className="text-xl font-semibold">Book a service</h1>
          <select className="input" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
            {serviceOptions.map((service) => <option key={service}>{service}</option>)}
          </select>
          <input className="input" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <input className="input" type="time" required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          <input className="input" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <button disabled={submitting} className="w-full rounded-xl bg-accent py-3 text-sm font-medium text-white shadow-md disabled:opacity-60">
            {submitting ? 'Submitting...' : 'Book now'}
          </button>
        </form>

        <div className="card overflow-x-auto lg:col-span-2">
          <h2 className="mb-4 text-xl font-semibold">Your bookings</h2>
          {loading ? (
            <LoadingSkeleton rows={5} />
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="py-3">Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, idx) => (
                  <tr key={booking._id} className={idx % 2 ? 'bg-ash' : 'bg-white'}>
                    <td className="py-3">{booking.service}</td>
                    <td>{new Date(booking.date).toLocaleDateString()}</td>
                    <td>{booking.time}</td>
                    <td>{booking.location}</td>
                    <td>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeStyles[booking.status]}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {!bookings.length && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">No bookings found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
}
