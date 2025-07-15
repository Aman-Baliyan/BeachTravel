import React, { useState } from 'react';
import Header from './components/header';
import Footer from './components/footer';
import Hero from './components/hero';
import SearchForm from './components/searchform';
import TravelPlans from './components/TravelPlans';
import DestinationCarousel from './components/destinationcarousel';
import AccommodationCards from './components/accomodationcards';
import WeatherInsights from './components/weatherinsights';
import BeachSafetyDashboard from './components/BeachSafetyDashboard';
import BeachSafetyMap from './components/BeachSafetyMap';
import BeachAlerts from './components/BeachAlerts';
import BeachSafetyAnalyzer from './components/BeachSafetyAnalyzer';

import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

const demoDestinations = [/* same as before */];
const demoStays = [/* same as before */];

function App() {
  const [destinations, setDestinations] = useState(demoDestinations);
  const [currentDestination, setCurrentDestination] = useState(0);
  const [currentView, setCurrentView] = useState('travel');
  const [showBeachAnalyzer, setShowBeachAnalyzer] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [selectedDestination, setSelectedDestination] = useState(null);

  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState('home');

  const handleLogin = (email) => {
    setUser(email);
    setAuthView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setAuthView('home');
  };

  const showAuth = () => {
    setAuthView('auth');
  };

  // 🔐 Auth Page View
  if (authView === 'auth') {
    return <AuthPage onLogin={handleLogin} onCancel={() => setAuthView('home')} />; // ✅ Auth cancel handled
  }

  // ✅ Dashboard View
  if (authView === 'dashboard' && user) {
    return (
      <div className="min-h-screen">
        <Header user={user} onLogout={handleLogout} />
        <Dashboard user={user} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header user={user} onLogout={handleLogout} onShowAuth={showAuth} />

      <BeachSafetyAnalyzer
        isOpen={showBeachAnalyzer}
        onToggle={() => setShowBeachAnalyzer(!showBeachAnalyzer)}
        onClose={() => setShowBeachAnalyzer(false)}
      />

      <div className="fixed top-20 right-4 z-40">
        <button
          onClick={() => setShowBeachAnalyzer(!showBeachAnalyzer)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
          title="Beach Safety Analyzer"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </button>
      </div>

      {/* Travel/Beach Dashboard Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex justify-center mb-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1 border border-white/20">
            <button
              onClick={() => setCurrentView('travel')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                currentView === 'travel' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Travel by Weather
            </button>
            <button
              onClick={() => setCurrentView('beach-safety')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                currentView === 'beach-safety' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Beach Safety Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Conditional View */}
      {currentView === 'travel' ? (
        <>
          <Hero />
          <SearchForm
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            checkIn={checkIn}
            setCheckIn={setCheckIn}
            checkOut={checkOut}
            setCheckOut={setCheckOut}
            guests={guests}
            setGuests={setGuests}
            selectedDestination={selectedDestination}
            setSelectedDestination={setSelectedDestination}
          />
          {selectedDestination && (
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              <TravelPlans destination={selectedDestination} />
            </div>
          )}
          <DestinationCarousel
            destinations={destinations}
            currentDestination={currentDestination}
            setCurrentDestination={setCurrentDestination}
          />
          <AccommodationCards stays={demoStays} />
          <WeatherInsights />
        </>
      ) : (
        <>
          <BeachSafetyDashboard />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <BeachSafetyMap />
              <BeachAlerts />
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}

export default App;
