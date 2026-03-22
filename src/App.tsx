/**
 * App - Main application component
 * Feature: monitoramento-interdicoes-combustiveis
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 8.1, 8.2, 8.4
 */

import React from 'react';
import { EventProvider, useEvents } from './context/EventContext';
import { APIService } from './services/APIService';
import { MapComponent } from './components/MapComponent';
import { DashboardComponent } from './components/DashboardComponent';
import { EventTableComponent } from './components/EventTableComponent';
import { ReportFormModal } from './components/ReportFormModal';
import { LoadingIndicator } from './components/LoadingIndicator';

// Initialize API service
const apiBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const apiService = new APIService(apiBaseURL);

/**
 * AppContent - Main content component (consumes EventContext)
 */
function AppContent(): JSX.Element {
  const { events, loading, error, reportNewEvent } = useEvents();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold">
              MONITORAMENTO INTERDIÇÕES / COMBUSTÍVEIS
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-colors shadow-md"
              aria-label="Abrir formulário para reportar novo evento"
            >
              + REPORTAR NOVO PONTO
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {loading && events.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <LoadingIndicator message="Carregando eventos..." size="large" />
          </div>
        ) : (
          <>
            {/* Responsive grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Map - Full width on mobile, left column on desktop */}
              <div className="lg:row-span-2 h-[400px] lg:h-[600px]">
                <MapComponent events={events} />
              </div>

              {/* Dashboard - Right column top on desktop */}
              <div>
                <DashboardComponent events={events} />
              </div>

              {/* Table - Right column bottom on desktop */}
              <div>
                <EventTableComponent events={events} />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-300">
              © 2024 Sistema de Monitoramento de Interdições e Combustíveis
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Parceiros:</span>
              <div className="flex gap-4">
                {/* Placeholder for partner logos */}
                <div className="bg-white rounded px-3 py-1 text-gray-800 text-xs font-semibold">
                  LOGO 1
                </div>
                <div className="bg-white rounded px-3 py-1 text-gray-800 text-xs font-semibold">
                  LOGO 2
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Report Form Modal */}
      <ReportFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={reportNewEvent}
      />
    </div>
  );
}

/**
 * App - Root component with EventProvider
 */
function App(): JSX.Element {
  return (
    <EventProvider apiService={apiService}>
      <AppContent />
    </EventProvider>
  );
}

export default App;
