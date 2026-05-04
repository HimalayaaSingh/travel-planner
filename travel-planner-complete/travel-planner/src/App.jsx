import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { TravelProvider } from './context/TravelContext';
import Dashboard from './pages/Dashboard';
import MyTrips from './pages/MyTrips';
import TripDetail from './pages/TripDetail';
import AddTrip from './pages/AddTrip';
import Budget from './pages/Budget';
import './index.css';

function Navbar() {
  const links = [
    { to: '/', label: 'Dashboard', exact: true },
    { to: '/trips', label: 'My Trips' },
    { to: '/budget', label: 'Budget' },
    { to: '/add', label: '+ New Trip' },
  ];

  return (
    <nav style={{ background: '#1a1a1a' }} className="sticky top-0 z-50 px-8 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-2xl">✈️</span>
        <span className="font-display text-white text-xl font-bold tracking-wide">Voyagr</span>
      </div>
      <div className="flex items-center gap-1">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-amber-400 text-black'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <TravelProvider>
      <BrowserRouter>
        <div className="min-h-screen" style={{ background: '#f7f5f0' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trips" element={<MyTrips />} />
            <Route path="/trips/:id" element={<TripDetail />} />
            <Route path="/add" element={<AddTrip />} />
            <Route path="/budget" element={<Budget />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TravelProvider>
  );
}
