'use client';

import { useEffect, useState } from 'react';
import { AirVent, BrushCleaning, PlugZap, Search, Wrench, WrenchIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { serviceOptions } from '@/lib/services';

const categoryConfig = [
  { title: 'Electrician', icon: PlugZap },
  { title: 'AC Repair', icon: AirVent },
  { title: 'Plumber', icon: Wrench },
  { title: 'Appliance Repair', icon: WrenchIcon },
  { title: 'Cleaning Services', icon: BrushCleaning }
];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('Detecting location...');

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation('Geolocation unavailable');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation(`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
      },
      () => {
        setLocation('Unable to detect location');
      }
    );
  }, []);

  const suggestions = serviceOptions.filter((service) =>
    service.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-ash">
      <Navbar />
      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <h1 className="mb-4 text-4xl font-semibold tracking-tight">Home services, simplified.</h1>
        <p className="mb-8 text-gray-600">Find and book trusted professionals in a few clicks.</p>

        <div className="card mx-auto max-w-3xl">
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
            <Search className="text-gray-400" size={20} />
            <input
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Search services..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          {!!query && (
            <ul className="mt-3 rounded-xl border border-gray-100 bg-white text-left text-sm shadow-sm">
              {suggestions.length ? (
                suggestions.map((service) => (
                  <li key={service} className="border-b border-gray-100 px-4 py-2 last:border-0">
                    {service}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500">No matches found.</li>
              )}
            </ul>
          )}
          <p className="mt-4 text-left text-xs text-gray-500">Detected location: {location}</p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categoryConfig.map(({ title, icon: Icon }) => (
            <article
              key={title}
              className="rounded-xl bg-white p-4 text-left shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <Icon className="mb-3 text-accent" size={22} />
              <h2 className="text-sm font-medium">{title}</h2>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
