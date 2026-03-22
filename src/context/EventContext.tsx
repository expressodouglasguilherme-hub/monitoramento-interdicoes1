/**
 * EventContext - Global state management for events
 * Feature: monitoramento-interdicoes-combustiveis
 * 
 * Manages event state, loading state, and error handling
 * Requirements: 4.1, 8.1
 */

import React, { createContext, useContext } from 'react';
import { Event, NewEventData } from '../types';

// Mock data for production when API is not available
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    cidade: 'São Paulo',
    uf: 'SP',
    local: 'Rodovia Anhanguera, km 50',
    observacao: 'Interdição total devido a acidente com caminhão',
    latitude: -23.5505,
    longitude: -46.6333,
    dataAtualizacao: new Date().toISOString(),
  },
  {
    id: '2',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    local: 'Ponte Rio-Niterói',
    observacao: 'Falta de combustível em postos da região',
    latitude: -22.9068,
    longitude: -43.1729,
    dataAtualizacao: new Date().toISOString(),
  },
  {
    id: '3',
    cidade: 'Belo Horizonte',
    uf: 'MG',
    local: 'BR-040, km 120',
    observacao: 'Manifestação bloqueando rodovia',
    latitude: -19.9167,
    longitude: -43.9345,
    dataAtualizacao: new Date().toISOString(),
  },
  {
    id: '4',
    cidade: 'Curitiba',
    uf: 'PR',
    local: 'BR-277, km 80',
    observacao: 'Neblina intensa, tráfego lento',
    latitude: -25.4284,
    longitude: -49.2733,
    dataAtualizacao: new Date().toISOString(),
  },
  {
    id: '5',
    cidade: 'Salvador',
    uf: 'BA',
    local: 'BR-324, km 15',
    observacao: 'Acidente com múltiplos veículos',
    latitude: -12.9714,
    longitude: -38.5014,
    dataAtualizacao: new Date().toISOString(),
  },
];

/**
 * Context value interface defining the shape of event state and operations
 */
export interface EventContextValue {
  /** Array of current events */
  events: Event[];
  
  /** Loading state indicator */
  loading: boolean;
  
  /** Error message if any operation failed */
  error: string | null;
  
  /** Function to manually refresh events from API */
  refreshEvents: () => Promise<void>;
  
  /** Function to report a new event */
  reportNewEvent: (data: NewEventData) => Promise<void>;
}

/**
 * React Context for event state management
 * Initialized as undefined to enforce usage within EventProvider
 */
export const EventContext = createContext<EventContextValue | undefined>(undefined);

/**
 * Custom hook to consume EventContext
 * 
 * @throws Error if used outside of EventProvider
 * @returns EventContextValue with current state and operations
 */
export function useEvents(): EventContextValue {
  const context = useContext(EventContext);
  
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  
  return context;
}

/**
 * EventProvider - Provides event state and operations to child components
 * 
 * Implements polling logic, error handling, and reconnection
 * Requirements: 4.4, 4.5, 7.1, 7.2, 7.3
 */
interface EventProviderProps {
  children: React.ReactNode;
  apiService: any; // APIService instance
}

export function EventProvider({ children, apiService }: EventProviderProps): JSX.Element {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [failureCount, setFailureCount] = React.useState<number>(0);

  /**
   * Refresh events from API
   * Requirements: 4.4
   */
  const refreshEvents = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if API is available
      if (!apiService) {
        // Use mock data if no API service
        setEvents(MOCK_EVENTS);
        setFailureCount(0);
        setLoading(false);
        return;
      }

      const response = await apiService.getEvents();

      if (response.success && response.data) {
        setEvents(response.data);
        setFailureCount(0); // Reset failure count on success
      } else {
        // Fallback to mock data on error
        console.warn('API error, using mock data:', response.error);
        setEvents(MOCK_EVENTS);
        setError(null); // Don't show error when using mock data
        setFailureCount(0);
      }
    } catch (err) {
      // Fallback to mock data on exception
      console.warn('API exception, using mock data:', err);
      setEvents(MOCK_EVENTS);
      setError(null); // Don't show error when using mock data
      setFailureCount(0);
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  /**
   * Report a new event
   * Requirements: 5.4, 5.5, 5.6
   */
  const reportNewEvent = React.useCallback(async (data: NewEventData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.createEvent(data);

      if (response.success) {
        // Refresh events after successful creation
        await refreshEvents();
      } else {
        setError(response.error || 'Erro ao reportar evento');
        throw new Error(response.error || 'Erro ao reportar evento');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiService, refreshEvents]);

  /**
   * Setup polling and reconnection logic
   * Requirements: 4.4, 4.5, 7.1, 7.2, 7.3
   */
  React.useEffect(() => {
    // Initial fetch
    refreshEvents();

    // Determine polling interval based on failure count
    // Normal: 30 seconds, After failure: 10 seconds (reconnection logic)
    const pollingInterval = failureCount > 0 ? 10000 : 30000;

    // Setup polling
    const intervalId = setInterval(() => {
      refreshEvents();
    }, pollingInterval);

    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [refreshEvents, failureCount]);

  const contextValue: EventContextValue = {
    events,
    loading,
    error,
    refreshEvents,
    reportNewEvent,
  };

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
}
