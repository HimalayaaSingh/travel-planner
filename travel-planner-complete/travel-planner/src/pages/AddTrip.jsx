import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTravel } from '../context/TravelContext';

const EMOJIS = ['🗼', '🌺', '🏔️', '🏖️', '🗽', '🏛️', '🌍', '🎭', '🏯', '🌋', '🎪', '🧭'];
const CATEGORIES = ['Urban', 'Tropical', 'Historical', 'Adventure', 'Cultural', 'Nature'];
const STATUSES = ['planned', 'upcoming', 'completed'];

const STEPS = ['Destination', 'Dates', 'Details', 'Review'];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            i < current ? 'bg-emerald-500 text-white' :
            i === current ? 'bg-stone-800 text-white' :
            'bg-stone-200 text-stone-400'
          }`}>
            {i < current ? '✓' : i + 1}
          </div>
          <span className={`text-sm font-medium ${i === current ? 'text-stone-800' : 'text-stone-400'}`}>{step}</span>
          {i < STEPS.length - 1 && <div className={`h-px w-8 ${i < current ? 'bg-emerald-300' : 'bg-stone-200'}`} />}
        </div>
      ))}
    </div>
  );
}

export default function AddTrip() {
  const { addTrip } = useTravel();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    destination: '',
    category: 'Urban',
    coverEmoji: '🗼',
    startDate: '',
    endDate: '',
    status: 'planned',
    notes: '',
  });

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (step === 0 && !form.destination.trim()) errs.destination = 'Destination is required';
    if (step === 1) {
      if (!form.startDate) errs.startDate = 'Start date is required';
      if (!form.endDate) errs.endDate = 'End date is required';
      if (form.startDate && form.endDate && form.endDate < form.startDate)
        errs.endDate = 'End date must be after start date';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  const handleSubmit = () => {
    addTrip(form);
    navigate('/trips');
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-2">Plan a New Trip</h1>
      <p className="text-stone-400 mb-8">Fill in the details for your next adventure</p>

      <StepIndicator current={step} />

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 animate-fade-in">

        {/* Step 0: Destination */}
        {step === 0 && (
          <div>
            <h2 className="font-bold text-xl text-stone-800 mb-6">Where are you going?</h2>
            <div className="mb-5">
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Destination *</label>
              <input
                type="text"
                placeholder="e.g. Paris, France"
                value={form.destination}
                onChange={e => set('destination', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 ${errors.destination ? 'border-red-400' : 'border-stone-200'}`}
              />
              {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination}</p>}
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => set('category', cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      form.category === cat
                        ? 'bg-stone-800 text-white border-stone-800'
                        : 'border-stone-200 text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Pick an Emoji</label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => set('coverEmoji', emoji)}
                    className={`w-10 h-10 rounded-xl text-xl border-2 transition-all ${
                      form.coverEmoji === emoji ? 'border-amber-400 bg-amber-50' : 'border-stone-100 hover:border-stone-300'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Dates */}
        {step === 1 && (
          <div>
            <h2 className="font-bold text-xl text-stone-800 mb-6">When are you traveling?</h2>
            <div className="mb-5">
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Start Date *</label>
              <input
                type="date"
                value={form.startDate}
                onChange={e => set('startDate', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 ${errors.startDate ? 'border-red-400' : 'border-stone-200'}`}
              />
              {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-stone-600 mb-1.5">End Date *</label>
              <input
                type="date"
                value={form.endDate}
                onChange={e => set('endDate', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 ${errors.endDate ? 'border-red-400' : 'border-stone-200'}`}
              />
              {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Status</label>
              <div className="flex gap-2">
                {STATUSES.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set('status', s)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all capitalize ${
                      form.status === s
                        ? 'bg-stone-800 text-white border-stone-800'
                        : 'border-stone-200 text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Notes */}
        {step === 2 && (
          <div>
            <h2 className="font-bold text-xl text-stone-800 mb-6">Any notes or details?</h2>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Trip Notes (optional)</label>
              <textarea
                placeholder="Places to visit, things to pack, reminders..."
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div>
            <h2 className="font-bold text-xl text-stone-800 mb-6">Review your trip</h2>
            <div
              className="rounded-2xl p-6 mb-4"
              style={{ background: 'linear-gradient(135deg, #1a1a1a, #3a3a3a)' }}
            >
              <span className="text-5xl block mb-3">{form.coverEmoji}</span>
              <h3 className="text-white font-bold text-xl mb-1">{form.destination}</h3>
              <p className="text-stone-400 text-sm">{form.startDate} → {form.endDate}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-stone-50">
                <span className="text-stone-400">Category</span>
                <span className="font-medium">{form.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-50">
                <span className="text-stone-400">Status</span>
                <span className="font-medium capitalize">{form.status}</span>
              </div>
              {form.notes && (
                <div className="py-2">
                  <span className="text-stone-400 block mb-1">Notes</span>
                  <span className="text-stone-600">{form.notes}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 0 ? (
            <button onClick={back} className="px-5 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors">
              ← Back
            </button>
          ) : <div />}
          {step < STEPS.length - 1 ? (
            <button onClick={next} className="bg-stone-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-700 transition-colors">
              Next →
            </button>
          ) : (
            <button onClick={handleSubmit} className="bg-amber-400 text-black px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-amber-300 transition-colors">
              🎉 Create Trip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
