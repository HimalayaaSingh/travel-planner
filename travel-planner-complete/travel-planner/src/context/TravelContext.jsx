import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';

const TravelContext = createContext();

export function TravelProvider({ children }) {
  const [trips, setTrips] = useState([
    {
      id: 1,
      destination: 'Tokyo, Japan',
      startDate: '2025-03-10',
      endDate: '2025-03-20',
      category: 'Urban',
      status: 'upcoming',
      notes: 'Visit Shibuya, Asakusa temple, try ramen.',
      coverEmoji: '🗼',
    },
    {
      id: 2,
      destination: 'Bali, Indonesia',
      startDate: '2025-06-01',
      endDate: '2025-06-10',
      category: 'Tropical',
      status: 'planned',
      notes: 'Surfing at Kuta, rice terraces at Ubud.',
      coverEmoji: '🌺',
    },
  ]);

  const [itinerary, setItinerary] = useState([
    { id: 1, tripId: 1, day: 1, activities: ['Airport pickup', 'Check-in Hotel', 'Evening walk in Shibuya'] },
    { id: 2, tripId: 1, day: 2, activities: ['Tsukiji fish market', 'Harajuku shopping', 'Tokyo Tower at night'] },
  ]);

  const [budgetLimit, setBudgetLimit] = useState(3000);
  const [expenses, setExpenses] = useState([
    { id: 1, item: 'Flights', cost: 800, category: 'Transport' },
    { id: 2, item: 'Hotel (7 nights)', cost: 700, category: 'Accommodation' },
    { id: 3, item: 'Food & Dining', cost: 300, category: 'Food' },
  ]);

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Memoized computations ---
  const totalSpent = useMemo(() => expenses.reduce((sum, e) => sum + e.cost, 0), [expenses]);
  const remaining = useMemo(() => budgetLimit - totalSpent, [budgetLimit, totalSpent]);
  const progressPercent = useMemo(() => Math.min((totalSpent / budgetLimit) * 100, 100), [totalSpent, budgetLimit]);

  const expenseByCategory = useMemo(() => {
    const map = {};
    expenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + e.cost;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const filteredTrips = useMemo(() => {
    if (!searchQuery.trim()) return trips;
    return trips.filter(t =>
      t.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [trips, searchQuery]);

  // --- CRUD for trips ---
  const addTrip = useCallback((trip) => {
    setTrips(prev => [...prev, { ...trip, id: Date.now() }]);
  }, []);

  const updateTrip = useCallback((id, updates) => {
    setTrips(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTrip = useCallback((id) => {
    setTrips(prev => prev.filter(t => t.id !== id));
  }, []);

  // --- CRUD for itinerary ---
  const addActivity = useCallback((tripId, day, activity) => {
    setItinerary(prev => {
      const existing = prev.find(i => i.tripId === tripId && i.day === day);
      if (existing) {
        return prev.map(i =>
          i.tripId === tripId && i.day === day
            ? { ...i, activities: [...i.activities, activity] }
            : i
        );
      }
      return [...prev, { id: Date.now(), tripId, day, activities: [activity] }];
    });
  }, []);

  const removeActivity = useCallback((tripId, day, actIndex) => {
    setItinerary(prev =>
      prev.map(i =>
        i.tripId === tripId && i.day === day
          ? { ...i, activities: i.activities.filter((_, idx) => idx !== actIndex) }
          : i
      )
    );
  }, []);

  const getItineraryForTrip = useCallback((tripId) => {
    return itinerary.filter(i => i.tripId === tripId).sort((a, b) => a.day - b.day);
  }, [itinerary]);

  // --- CRUD for expenses ---
  const addExpense = useCallback((item, cost, category) => {
    setExpenses(prev => [...prev, { id: Date.now(), item, cost: parseFloat(cost), category }]);
  }, []);

  const removeExpense = useCallback((id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  const value = {
    trips, filteredTrips, searchQuery, setSearchQuery,
    addTrip, updateTrip, deleteTrip,
    selectedTrip, setSelectedTrip,
    itinerary, addActivity, removeActivity, getItineraryForTrip,
    budgetLimit, setBudgetLimit,
    expenses, totalSpent, remaining, progressPercent, expenseByCategory,
    addExpense, removeExpense,
  };

  return <TravelContext.Provider value={value}>{children}</TravelContext.Provider>;
}

export const useTravel = () => useContext(TravelContext);
