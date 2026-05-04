import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTravel } from '../context/TravelContext';

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trips, getItineraryForTrip, addActivity, removeActivity, deleteTrip } = useTravel();

  const trip = trips.find(t => t.id === parseInt(id));
  const itinerary = getItineraryForTrip(parseInt(id));

  const [newActivity, setNewActivity] = useState('');
  const [targetDay, setTargetDay] = useState(1);
  const [maxDay, setMaxDay] = useState(itinerary.length > 0 ? Math.max(...itinerary.map(i => i.day)) : 1);

  if (!trip) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="text-2xl font-bold text-stone-700 mb-2">Trip not found</h2>
        <Link to="/trips" className="text-amber-600 underline">Back to trips</Link>
      </div>
    );
  }

  const days = Array.from({ length: maxDay }, (_, i) => i + 1);

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!newActivity.trim()) return;
    addActivity(parseInt(id), parseInt(targetDay), newActivity.trim());
    setNewActivity('');
  };

  const handleAddDay = () => {
    const newDay = maxDay + 1;
    setMaxDay(newDay);
    setTargetDay(newDay);
  };

  const handleDelete = () => {
    if (window.confirm('Delete this trip?')) {
      deleteTrip(trip.id);
      navigate('/trips');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Back */}
      <Link to="/trips" className="text-sm text-stone-400 hover:text-stone-700 flex items-center gap-1 mb-6">
        ← Back to trips
      </Link>

      {/* Trip Header */}
      <div
        className="rounded-3xl p-8 mb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a1a1a, #3a3a3a)' }}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-6xl mb-4 block">{trip.coverEmoji}</span>
            <h1 className="font-display text-white text-3xl font-bold mb-2">{trip.destination}</h1>
            <p className="text-stone-400 text-sm mb-1">📅 {trip.startDate} → {trip.endDate}</p>
            <p className="text-stone-400 text-sm mb-3">🏷️ {trip.category}</p>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
              trip.status === 'upcoming' ? 'bg-emerald-400 text-black' :
              trip.status === 'planned' ? 'bg-amber-400 text-black' :
              'bg-stone-500 text-white'
            }`}>{trip.status}</span>
          </div>
          <button
            onClick={handleDelete}
            className="text-stone-500 hover:text-red-400 transition-colors text-sm border border-stone-600 px-4 py-2 rounded-xl"
          >
            Delete Trip
          </button>
        </div>
        {trip.notes && (
          <p className="mt-4 text-stone-300 text-sm bg-white/5 rounded-xl p-4">{trip.notes}</p>
        )}
      </div>

      {/* Itinerary */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-stone-800">🗓️ Itinerary</h2>
          <button
            onClick={handleAddDay}
            className="text-sm bg-amber-400 text-black px-4 py-2 rounded-xl font-semibold hover:bg-amber-300 transition-colors"
          >
            + Add Day
          </button>
        </div>

        {/* Add Activity Form */}
        <form onSubmit={handleAddActivity} className="flex gap-2 mb-6 p-3 bg-stone-50 rounded-xl border border-stone-100">
          <select
            value={targetDay}
            onChange={e => setTargetDay(e.target.value)}
            className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none"
          >
            {days.map(d => <option key={d} value={d}>Day {d}</option>)}
          </select>
          <input
            type="text"
            placeholder="Add an activity..."
            value={newActivity}
            onChange={e => setNewActivity(e.target.value)}
            className="flex-1 px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white"
          />
          <button
            type="submit"
            className="bg-stone-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-700 transition-colors"
          >
            Add
          </button>
        </form>

        {/* Day Cards */}
        <div className="space-y-4">
          {days.map(day => {
            const dayData = itinerary.find(i => i.day === day);
            const activities = dayData?.activities || [];
            return (
              <div key={day} className="border border-stone-100 rounded-xl p-4">
                <h3 className="font-bold text-amber-600 text-sm mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-xs">{day}</span>
                  Day {day}
                </h3>
                {activities.length === 0 ? (
                  <p className="text-stone-300 text-sm italic">No activities yet — add one above!</p>
                ) : (
                  <ul className="space-y-2">
                    {activities.map((act, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-stone-50 px-4 py-2.5 rounded-lg text-sm">
                        <span className="text-stone-700">● {act}</span>
                        <button
                          onClick={() => removeActivity(parseInt(id), day, idx)}
                          className="text-stone-300 hover:text-red-400 font-bold ml-3"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
