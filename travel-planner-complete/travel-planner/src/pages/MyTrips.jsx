import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTravel } from '../context/TravelContext';

const CATEGORIES = ['All', 'Urban', 'Tropical', 'Historical', 'Adventure', 'Cultural'];
const STATUSES = ['All', 'upcoming', 'planned', 'completed'];

export default function MyTrips() {
  const { trips, deleteTrip } = useTravel();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  const filtered = useMemo(() => {
    let result = trips.filter(t => {
      const matchQuery = t.destination.toLowerCase().includes(query.toLowerCase());
      const matchCat = category === 'All' || t.category === category;
      const matchStatus = status === 'All' || t.status === status;
      return matchQuery && matchCat && matchStatus;
    });
    if (sortBy === 'date') result = result.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    if (sortBy === 'name') result = result.sort((a, b) => a.destination.localeCompare(b.destination));
    return result;
  }, [trips, query, category, status, sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-800">My Trips</h1>
          <p className="text-stone-400 mt-1">{trips.length} adventures planned</p>
        </div>
        <Link
          to="/add"
          className="bg-stone-800 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-stone-700 transition-colors"
        >
          + New Trip
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 mb-6 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search destinations..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 min-w-48 px-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-3 py-2 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none"
        >
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="px-3 py-2 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none"
        >
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-3 py-2 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none"
        >
          <option value="date">Sort: Date</option>
          <option value="name">Sort: Name</option>
        </select>
      </div>

      {/* Trip Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <p className="text-4xl mb-3">🗺️</p>
          <p className="text-lg font-medium">No trips found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((trip, i) => (
            <div
              key={trip.id}
              className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-all duration-200 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              {/* Card header */}
              <div
                className="p-6 flex items-start justify-between"
                style={{ background: 'linear-gradient(135deg, #1a1a1a, #3a3a3a)' }}
              >
                <span className="text-5xl">{trip.coverEmoji}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  trip.status === 'upcoming' ? 'bg-emerald-400 text-black' :
                  trip.status === 'planned' ? 'bg-amber-400 text-black' :
                  'bg-stone-500 text-white'
                }`}>
                  {trip.status}
                </span>
              </div>
              {/* Card body */}
              <div className="p-5">
                <h3 className="font-bold text-stone-800 text-lg mb-1">{trip.destination}</h3>
                <p className="text-xs text-stone-400 mb-1">📅 {trip.startDate} → {trip.endDate}</p>
                <p className="text-xs text-stone-400 mb-3">🏷️ {trip.category}</p>
                {trip.notes && (
                  <p className="text-sm text-stone-500 line-clamp-2 mb-4">{trip.notes}</p>
                )}
                <div className="flex gap-2">
                  <Link
                    to={`/trips/${trip.id}`}
                    className="flex-1 text-center bg-stone-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-stone-700 transition-colors"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => deleteTrip(trip.id)}
                    className="px-3 py-2 border border-stone-200 rounded-lg text-stone-400 hover:text-red-500 hover:border-red-200 transition-colors text-sm"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
