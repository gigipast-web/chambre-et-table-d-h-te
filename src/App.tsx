import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';

// View Components
import { DashboardView } from './components/DashboardView';
import { BookingsView } from './components/BookingsView';
import { RoomsView } from './components/RoomsView';
import { GuestsView } from './components/GuestsView';
import { TableDhotesView } from './components/TableDhotesView';
import { InvoicesView } from './components/InvoicesView';
import { HousekeepingView } from './components/HousekeepingView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';

// Modals
import { NewBookingModal } from './components/NewBookingModal';
import { NewGuestModal } from './components/NewGuestModal';
import { AiMenuModal } from './components/AiMenuModal';
import { AiEmailModal } from './components/AiEmailModal';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modal visibility states
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [showNewGuestModal, setShowNewGuestModal] = useState(false);
  const [showAiMenuModal, setShowAiMenuModal] = useState(false);
  const [showAiEmailModal, setShowAiEmailModal] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenNewBooking={() => setShowNewBookingModal(true)}
          />
        );
      case 'bookings':
        return (
          <BookingsView
            onOpenNewBooking={() => setShowNewBookingModal(true)}
          />
        );
      case 'rooms':
        return <RoomsView />;
      case 'guests':
        return (
          <GuestsView
            onOpenNewGuestModal={() => setShowNewGuestModal(true)}
          />
        );
      case 'table_dhotes':
        return (
          <TableDhotesView
            onOpenAiMenuModal={() => setShowAiMenuModal(true)}
          />
        );
      case 'invoices':
        return <InvoicesView />;
      case 'housekeeping':
        return <HousekeepingView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <DashboardView
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenNewBooking={() => setShowNewBookingModal(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#2D3436] font-sans flex flex-col selection:bg-[#4A6741]/20 selection:text-stone-900">
      {/* Top Header Navbar */}
      <Navbar
        onOpenNewBooking={() => setShowNewBookingModal(true)}
        onOpenAiEmailModal={() => setShowAiEmailModal(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container Layout */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto px-2 sm:px-4 py-3 flex gap-3">
        {/* Desktop Sidebar (Left) */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Workspace Area (Right) */}
        <main className="flex-1 min-w-0">
          {renderActiveView()}
        </main>
      </div>


      {/* Mobile Bottom Navigation Bar */}
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Modals */}
      {showNewBookingModal && (
        <NewBookingModal onClose={() => setShowNewBookingModal(false)} />
      )}

      {showNewGuestModal && (
        <NewGuestModal onClose={() => setShowNewGuestModal(false)} />
      )}

      {showAiMenuModal && (
        <AiMenuModal onClose={() => setShowAiMenuModal(false)} />
      )}

      {showAiEmailModal && (
        <AiEmailModal onClose={() => setShowAiEmailModal(false)} />
      )}
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
