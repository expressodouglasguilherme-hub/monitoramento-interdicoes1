/**
 * Unit tests for APIService
 * Feature: monitoramento-interdicoes-combustiveis
 * Task 3.5 (optional)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { APIService } from './APIService';
import { Event, NewEventData } from '../types';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as any;

describe('APIService', () => {
  let apiService: APIService;
  const baseURL = 'https://api.example.com';

  beforeEach(() => {
    // Create a mock axios instance
    const mockInstance = {
      get: vi.fn(),
      post: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    };

    mockedAxios.create = vi.fn(() => mockInstance);
    apiService = new APIService(baseURL);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create axios instance with correct configuration', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should setup interceptors', () => {
      const mockInstance = (apiService as any).axiosInstance;
      expect(mockInstance.interceptors.request.use).toHaveBeenCalled();
      expect(mockInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('getEvents', () => {
    it('should make GET request to /events endpoint', async () => {
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

      const mockInstance = (apiService as any).axiosInstance;
      mockInstance.get.mockResolvedValueOnce({ data: mockEvents });

      const result = await apiService.getEvents();

      expect(mockInstance.get).toHaveBeenCalledWith('/events');
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockEvents);
    });

    it('should timeout after 10 seconds', async () => {
      // This is tested by the axios configuration
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({ timeout: 10000 })
      );
    });

    it('should retry 3 times on 5xx errors', async () => {
      const mockInstance = (apiService as any).axiosInstance;
      const error = {
        response: { status: 500 },
        config: {},
      };

      mockInstance.get.mockRejectedValue(error);

      const result = await apiService.getEvents();

      // Should be called 3 times (initial + 2 retries)
      expect(mockInstance.get).toHaveBeenCalledTimes(3);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Erro no servidor. Tente novamente em alguns instantes.');
    });

    it('should not retry on 4xx errors', async () => {
      const mockInstance = (apiService as any).axiosInstance;
      const error = {
        response: { status: 400 },
        config: {},
      };

      mockInstance.get.mockRejectedValueOnce(error);

      const result = await apiService.getEvents();

      // Should only be called once (no retries)
      expect(mockInstance.get).toHaveBeenCalledTimes(1);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Dados inválidos. Verifique os campos e tente novamente.');
    });

    it('should handle network errors', async () => {
      const mockInstance = (apiService as any).axiosInstance;
      const error = {
        message: 'Network Error',
        config: {},
      };

      mockInstance.get.mockRejectedValue(error);

      const result = await apiService.getEvents();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Não foi possível conectar ao servidor. Verifique sua conexão.');
    });
  });

  describe('createEvent', () => {
    it('should make POST request with correct data', async () => {
      const newEventData: NewEventData = {
        cidade: 'Rio de Janeiro',
        uf: 'RJ',
        local: 'Ponte Rio-Niterói',
        observacao: 'Falta de combustível',
      };

      const createdEvent: Event = {
        id: '2',
        ...newEventData,
        latitude: -22.9068,
        longitude: -43.1729,
        dataAtualizacao: '2024-01-01T11:00:00Z',
      };

      const mockInstance = (apiService as any).axiosInstance;
      mockInstance.post.mockResolvedValueOnce({ data: createdEvent });

      const result = await apiService.createEvent(newEventData);

      expect(mockInstance.post).toHaveBeenCalledWith('/events', newEventData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(createdEvent);
    });

    it('should retry on 5xx errors', async () => {
      const mockInstance = (apiService as any).axiosInstance;
      const error = {
        response: { status: 503 },
        config: {},
      };

      mockInstance.post.mockRejectedValue(error);

      const newEventData: NewEventData = {
        cidade: 'Brasília',
        uf: 'DF',
        local: 'Eixo Monumental',
        observacao: 'Protesto',
      };

      const result = await apiService.createEvent(newEventData);

      expect(mockInstance.post).toHaveBeenCalledTimes(3);
      expect(result.success).toBe(false);
    });

    it('should not retry on validation errors (4xx)', async () => {
      const mockInstance = (apiService as any).axiosInstance;
      const error = {
        response: { status: 400 },
        config: {},
      };

      mockInstance.post.mockRejectedValueOnce(error);

      const newEventData: NewEventData = {
        cidade: '',
        uf: 'XX',
        local: '',
        observacao: '',
      };

      const result = await apiService.createEvent(newEventData);

      expect(mockInstance.post).toHaveBeenCalledTimes(1);
      expect(result.success).toBe(false);
    });
  });

  describe('handleError', () => {
    it('should return appropriate message for 400 error', async () => {
      const mockInstance = (apiService as any).axiosInstance;
      mockInstance.get.mockRejectedValueOnce({
        response: { status: 400 },
        config: {},
      });

      const result = await apiService.getEvents();
      expect(result.error).toBe('Dados inválidos. Verifique os campos e tente novamente.');
    });

    it('should return appropriate message for 401 error', async () => {
      const mockInstance = (apiService as any).axiosInstance;
      mockInstance.get.mockRejectedValueOnce({
        response: { status: 401 },
        config: {},
      });

      const result = await apiService.getEvents();
      expect(result.error).toBe('Sessão expirada. Por favor, faça login novamente.');
    });

    it('should return appropriate message for 403 error', async () => {
      const mockInstance = (apiService as any).axiosInstance;
      mockInstance.get.mockRejectedValueOnce({
        response: { status: 403 },
        config: {},
      });

      const result = await apiService.getEvents();
      expect(result.error).toBe('Você não tem permissão para realizar esta ação.');
    });

    it('should return appropriate message for 404 error', async () => {
      const mockInstance = (apiService as any).axiosInstance;
      mockInstance.get.mockRejectedValueOnce({
        response: { status: 404 },
        config: {},
      });

      const result = await apiService.getEvents();
      expect(result.error).toBe('Recurso não encontrado.');
    });

    it('should return appropriate message for 500 error', async () => {
      const mockInstance = (apiService as any).axiosInstance;
      mockInstance.get.mockRejectedValueOnce({
        response: { status: 500 },
        config: {},
      });

      const result = await apiService.getEvents();
      expect(result.error).toBe('Erro no servidor. Tente novamente em alguns instantes.');
    });

    it('should return appropriate message for 503 error', async () => {
      const mockInstance = (apiService as any).axiosInstance;
      mockInstance.get.mockRejectedValueOnce({
        response: { status: 503 },
        config: {},
      });

      const result = await apiService.getEvents();
      expect(result.error).toBe('Serviço temporariamente indisponível. Tentando reconectar...');
    });
  });
});
