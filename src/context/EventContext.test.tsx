/**
 * EventContext tests
 * Feature: monitoramento-interdicoes-combustiveis
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { EventProvider, useEvents } from './EventContext';
import { Event } from '../types';

// Mock APIService
const createMockAPIService = () => ({
  getEvents: vi.fn(),
  createEvent: vi.fn(),
});

// Test component that uses the context
function TestConsumer() {
  const { events, loading, error } = useEvents();
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'not-loading'}</div>
      <div data-testid="error">{error || 'no-error'}</div>
      <div data-testid="events-count">{events.length}</div>
    </div>
  );
}

describe('EventProvider', () => {
  let mockAPIService: ReturnType<typeof createMockAPIService>;

  beforeEach(() => {
    mockAPIService = createMockAPIService();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should initialize with empty events, loading false, and no error', async () => {
    mockAPIService.getEvents.mockResolvedValue({
      success: true,
      data: [],
    });

    render(
      <EventProvider apiService={mockAPIService}>
        <TestConsumer />
      </EventProvider>
    );

    // Wait for initial fetch to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });

    expect(screen.getByTestId('events-count')).toHaveTextContent('0');
    expect(screen.getByTestId('error')).toHaveTextContent('no-error');
  });

  it('should fetch events on mount', async () => {
    const mockEvents: Event[] = [
      {
        id: '1',
        cidade: 'São Paulo',
        uf: 'SP',
        local: 'Rodovia Anhanguera',
        observacao: 'Interdição total',
        latitude: -23.5505,
        longitude: -46.6333,
        dataAtualizacao: '2024-01-01T10:00:00Z',
      },
    ];

    mockAPIService.getEvents.mockResolvedValue({
      success: true,
      data: mockEvents,
    });

    render(
      <EventProvider apiService={mockAPIService}>
        <TestConsumer />
      </EventProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('events-count')).toHaveTextContent('1');
    });

    expect(mockAPIService.getEvents).toHaveBeenCalledTimes(1);
  });

  it('should setup polling every 30 seconds', async () => {
    mockAPIService.getEvents.mockResolvedValue({
      success: true,
      data: [],
    });

    render(
      <EventProvider apiService={mockAPIService}>
        <TestConsumer />
      </EventProvider>
    );

    // Wait for initial fetch
    await waitFor(() => {
      expect(mockAPIService.getEvents).toHaveBeenCalledTimes(1);
    });

    // Advance time by 30 seconds
    vi.advanceTimersByTime(30000);

    await waitFor(() => {
      expect(mockAPIService.getEvents).toHaveBeenCalledTimes(2);
    });

    // Advance another 30 seconds
    vi.advanceTimersByTime(30000);

    await waitFor(() => {
      expect(mockAPIService.getEvents).toHaveBeenCalledTimes(3);
    });
  });

  it('should implement reconnection logic after failure', async () => {
    // First call fails
    mockAPIService.getEvents.mockResolvedValueOnce({
      success: false,
      error: 'Network error',
    });

    // Subsequent calls succeed
    mockAPIService.getEvents.mockResolvedValue({
      success: true,
      data: [],
    });

    render(
      <EventProvider apiService={mockAPIService}>
        <TestConsumer />
      </EventProvider>
    );

    // Wait for initial fetch to fail
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Network error');
    });

    expect(mockAPIService.getEvents).toHaveBeenCalledTimes(1);

    // After failure, polling interval should be 10 seconds (reconnection logic)
    vi.advanceTimersByTime(10000);

    await waitFor(() => {
      expect(mockAPIService.getEvents).toHaveBeenCalledTimes(2);
    });

    // After success, error should be cleared
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('no-error');
    });
  });

  it('should handle API errors gracefully', async () => {
    mockAPIService.getEvents.mockResolvedValue({
      success: false,
      error: 'Server error',
    });

    render(
      <EventProvider apiService={mockAPIService}>
        <TestConsumer />
      </EventProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Server error');
    });

    expect(screen.getByTestId('events-count')).toHaveTextContent('0');
  });
});
