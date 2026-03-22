/**
 * APIService - HTTP client for backend communication
 * Feature: monitoramento-interdicoes-combustiveis
 * 
 * Handles all API requests with retry logic, error handling, and logging
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { Event, NewEventData } from '../types';

/**
 * Generic API response wrapper
 */
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * APIService class - Encapsulates all backend communication
 * 
 * Requirements: 4.1, 4.2
 */
export class APIService {
  private axiosInstance: AxiosInstance;

  /**
   * Constructor - Initialize Axios instance with base configuration
   * 
   * @param baseURL - Base URL for API endpoints
   */
  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000, // 10 seconds timeout as per requirements
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors for logging
   * 
   * Requirements: 4.2
   */
  private setupInterceptors(): void {
    // Request interceptor - Log outgoing requests
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        console.log(`[APIService] ${config.method?.toUpperCase()} ${config.url}`, {
          params: config.params,
          data: config.data,
        });
        return config;
      },
      (error: AxiosError) => {
        console.error('[APIService] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - Log responses and errors
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`[APIService] Response ${response.status}:`, {
          url: response.config.url,
          data: response.data,
        });
        return response;
      },
      (error: AxiosError) => {
        console.error('[APIService] Response error:', {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message,
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get all events from the backend
   * 
   * Requirements: 4.1, 4.3, 4.5
   * 
   * @returns Promise with APIResponse containing Event array
   */
  async getEvents(): Promise<APIResponse<Event[]>> {
    const maxRetries = 3;
    let lastError: AxiosError | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.axiosInstance.get<Event[]>('/api/events');
        return {
          success: true,
          data: response.data,
        };
      } catch (error) {
        lastError = error as AxiosError;
        const errorResponse = this.handleError(lastError);

        // Don't retry on client errors (4xx)
        if (lastError.response && lastError.response.status >= 400 && lastError.response.status < 500) {
          return errorResponse;
        }

        // Retry on server errors (5xx) or network errors
        if (attempt < maxRetries) {
          const backoffDelay = Math.pow(2, attempt - 1) * 1000; // Exponential backoff: 1s, 2s, 4s
          console.log(`[APIService] Retry attempt ${attempt}/${maxRetries} after ${backoffDelay}ms`);
          await this.delay(backoffDelay);
        }
      }
    }

    // All retries exhausted
    return this.handleError(lastError!);
  }

  /**
   * Create a new event
   * 
   * Requirements: 5.4, 5.6
   * 
   * @param data - New event data
   * @returns Promise with APIResponse containing created Event
   */
  async createEvent(data: NewEventData): Promise<APIResponse<Event>> {
    const maxRetries = 3;
    let lastError: AxiosError | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.axiosInstance.post<Event>('/api/events', data);
        return {
          success: true,
          data: response.data,
        };
      } catch (error) {
        lastError = error as AxiosError;
        const errorResponse = this.handleError(lastError);

        // Don't retry on client errors (4xx) - validation errors, etc.
        if (lastError.response && lastError.response.status >= 400 && lastError.response.status < 500) {
          return errorResponse;
        }

        // Retry on server errors (5xx) or network errors
        if (attempt < maxRetries) {
          const backoffDelay = Math.pow(2, attempt - 1) * 1000; // Exponential backoff: 1s, 2s, 4s
          console.log(`[APIService] Retry attempt ${attempt}/${maxRetries} after ${backoffDelay}ms`);
          await this.delay(backoffDelay);
        }
      }
    }

    // All retries exhausted
    return this.handleError(lastError!);
  }

  /**
   * Handle API errors and return user-friendly messages
   * 
   * Requirements: 4.3
   * 
   * @param error - Axios error object
   * @returns APIResponse with error message
   */
  private handleError(error: AxiosError): APIResponse<never> {
    // Network error (no response from server)
    if (!error.response) {
      return {
        success: false,
        error: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
      };
    }

    // HTTP error responses
    const statusCode = error.response.status;
    let errorMessage: string;

    switch (statusCode) {
      case 400:
        errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';
        break;
      case 401:
        errorMessage = 'Sessão expirada. Por favor, faça login novamente.';
        break;
      case 403:
        errorMessage = 'Você não tem permissão para realizar esta ação.';
        break;
      case 404:
        errorMessage = 'Recurso não encontrado.';
        break;
      case 500:
        errorMessage = 'Erro no servidor. Tente novamente em alguns instantes.';
        break;
      case 503:
        errorMessage = 'Serviço temporariamente indisponível. Tentando reconectar...';
        break;
      default:
        errorMessage = `Erro ao processar requisição (código ${statusCode}).`;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }

  /**
   * Utility method to delay execution
   * 
   * @param ms - Milliseconds to delay
   * @returns Promise that resolves after delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
