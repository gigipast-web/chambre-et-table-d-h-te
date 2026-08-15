import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthScreen } from './components/AuthScreen';
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
import { UserGuideView } from './components/UserGuideView';

// Modals
import { NewBookingModal } from './components/NewBookingModal';
import { NewGuestModal } from './components/NewGuestModal';
import { AiMenuModal } from './components/AiMenuModal';
import { AiEmailModal } from './components/AiEmailModal';
import { SubscriptionModal } from './components/SubscriptionModal';

function MainAppLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modal visibility states
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [showNewGuestModal, setShowNewGuestModal] = useState(false);
  const [showAiMenuModal, setShowAiMenuModal] = useState(false);
  const [showAiEmailModal, setShowAiEmailModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

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
        return <RoomsView onOpenSubscription={() => setShowSubscriptionModal(true)} />;
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
      case 'guide':
        return (
          <UserGuideView
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenNewBooking={() => setShowNewBookingModal(true)}
            onOpenAiMenu={() => setShowAiMenuModal(true)}
            onOpenAiEmail={() => setShowAiEmailModal(true)}
          />
        );
      case 'settings':
        return (
          <SettingsView
            onOpenSubscription={() => setShowSubscriptionModal(true)}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );
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
        onOpenSubscription={() => setShowSubscriptionModal(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container Layout */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto px-2 sm:px-4 py-3 flex gap-3">
        {/* Desktop Sidebar (Left) */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenSubscription={() => setShowSubscriptionModal(true)}
        />

        {/* Main Workspace Area (Right) */}
        <main className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {renderActiveView()}
          </div>

          {/* Footer Credit */}
          <footer className="mt-8 pt-4 pb-2 border-t border-stone-200 text-center text-xs text-stone-500 mb-16 md:mb-2">
            <p className="font-medium">
              Créé par <a href="tel:0681535770" className="font-bold text-stone-800 hover:text-[#4A6741] hover:underline transition">"l'escapade de jos 0681535770"</a>
            </p>
          </footer>
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

      {showSubscriptionModal && (
        <SubscriptionModal onClose={() => setShowSubscriptionModal(false)} />
      )}
    </div>
  );
}

function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center font-sans text-stone-600">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-[#4A6741] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-stone-700">Chargement de votre espace de gestion...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <AppProvider>
      <MainAppLayout />
    </AppProvider>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
