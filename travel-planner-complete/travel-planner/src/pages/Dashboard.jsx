import { useTravel } from '../context/TravelContext';
import { Link } from 'react-router-dom';

function StatCard({ label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 animate-fade-in-up">
      <p className="text-sm text-stone-400 font-medium mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color || 'text-stone-800'}`}>{value}</p>
      {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { trips, totalSpent, budgetLimit, remaining, expenses } = useTravel();

  const upcoming = trips.filter(t => t.status === 'upcoming').length;
  const planned = trips.filter(t => t.status === 'planned').length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Hero */}
      <div
        className="rounded-3xl p-10 mb-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}
      >
        <div className="relative z-10">
          <p className="text-amber-400 font-medium text-sm mb-2 tracking-widest uppercase">Welcome back</p>
          <h1 className="font-display text-white text-4xl font-bold mb-3">
            Where to next? 🌍
          </h1>
          <p className="text-stone-400 text-base mb-6 max-w-md">
            Plan your adventures, track your budget, and build your perfect itinerary.
          </p>
          <div className="flex gap-3">
            <Link
              to="/add"
              className="bg-amber-400 text-black px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-amber-300 transition-colors"
            >
              Plan a Trip
            </Link>
            <Link
              to="/trips"
              className="border border-white/20 text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-white/10 transition-colors"
            >
              View All Trips
            </Link>
          </div>
        </div>
        {/* Decorative */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 text-8xl opacity-20 select-none">✈️</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Trips" value={trips.length} sub="all time" />
        <StatCard label="Upcoming" value={upcoming} sub="confirmed" color="text-emerald-600" />
        <StatCard label="Planned" value={planned} sub="in progress" color="text-amber-600" />
        <StatCard label="Total Spent" value={`$${totalSpent}`} sub={`of $${budgetLimit} budget`} color={remaining < 0 ? 'text-red-500' : 'text-stone-800'} />
      </div>

      {/* Recent Trips */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl font-bold text-stone-800">Recent Trips</h2>
          <Link to="/trips" className="text-sm text-amber-600 font-medium hover:underline">See all →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.slice(0, 3).map((trip, i) => (
            <Link
              key={trip.id}
              to={`/trips/${trip.id}`}
              className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl">{trip.coverEmoji}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  trip.status === 'upcoming' ? 'bg-emerald-100 text-emerald-700' :
                  trip.status === 'planned' ? 'bg-amber-100 text-amber-700' :
                  'bg-stone-100 text-stone-600'
                }`}>
                  {trip.status}
                </span>
              </div>
              <h3 className="font-bold text-stone-800 text-lg mb-1">{trip.destination}</h3>
              <p className="text-sm text-stone-400">{trip.startDate} → {trip.endDate}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Expenses */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl font-bold text-stone-800">Recent Expenses</h2>
          <Link to="/budget" className="text-sm text-amber-600 font-medium hover:underline">Manage →</Link>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          {expenses.slice(0, 4).map((exp, i) => (
            <div key={exp.id} className={`flex items-center justify-between px-6 py-4 ${i !== 0 ? 'border-t border-stone-50' : ''}`}>
              <div>
                <p className="font-medium text-stone-800">{exp.item}</p>
                <p className="text-xs text-stone-400">{exp.category}</p>
              </div>
              <span className="font-bold text-stone-700">${exp.cost}</span>
            </div>
          ))}
          {expenses.length === 0 && (
            <div className="px-6 py-8 text-center text-stone-400">No expenses yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
