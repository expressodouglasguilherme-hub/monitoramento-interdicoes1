// Event interface - formato esperado pelo frontend
export interface Event {
  id: string;
  cidade: string;
  uf: string;
  local: string;
  observacao: string;
  latitude: number;
  longitude: number;
  dataAtualizacao: string; // ISO 8601 format
}

// RawEvent - dados brutos extraídos do Power BI antes da transformação
export type RawEvent = {
  cidade?: string;
  uf?: string;
  local?: string;
  observacao?: string;
  latitude?: string | number;
  longitude?: string | number;
  dataAtualizacao?: string | Date;
};

// CacheEntry - entrada do cache com timestamp
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// ScrapingResult - resultado de uma operação de scraping
export interface ScrapingResult {
  success: boolean;
  data: Event[];
  duration: number;
  error?: string;
}

// Config - configuração do backend via variáveis de ambiente
export interface Config {
  port: number;
  powerbiUrl: string;
  cacheDurationMs: number;
  scrapingTimeoutMs: number;
  allowedOrigins: string[];
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}
