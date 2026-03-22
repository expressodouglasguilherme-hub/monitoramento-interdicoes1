/**
 * Type definitions for the Fuel Interdiction Monitoring System
 * Feature: monitoramento-interdicoes-combustiveis
 */

/**
 * Valid Brazilian state abbreviations (UF)
 */
export const VALID_UF_LIST = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;

/**
 * Type representing a valid Brazilian state abbreviation
 */
export type BrazilianState = typeof VALID_UF_LIST[number];

/**
 * Represents an event of road interdiction or fuel supply issue
 */
export interface Event {
  /** Unique identifier for the event */
  id: string;
  
  /** City name where the event occurred */
  cidade: string;
  
  /** Brazilian state abbreviation (2 characters) */
  uf: string;
  
  /** Specific location description */
  local: string;
  
  /** Event details and observations */
  observacao: string;
  
  /** Geographic coordinate (latitude) */
  latitude: number;
  
  /** Geographic coordinate (longitude) */
  longitude: number;
  
  /** Last update timestamp in ISO 8601 format */
  dataAtualizacao: string;
}

/**
 * Data required to create a new event
 * Subset of Event - backend generates id, coordinates, and timestamp
 */
export interface NewEventData {
  /** City name where the event occurred */
  cidade: string;
  
  /** Brazilian state abbreviation (2 characters) */
  uf: string;
  
  /** Specific location description */
  local: string;
  
  /** Event details and observations */
  observacao: string;
}

/**
 * Metrics for a specific state
 */
export interface StateMetric {
  /** State abbreviation (UF) */
  state: string;
  
  /** Number of events in this state */
  count: number;
}

/**
 * Aggregated metrics summary for dashboard
 */
export interface MetricsSummary {
  /** Total number of active events */
  totalEvents: number;
  
  /** Events grouped by state with counts */
  eventsByState: StateMetric[];
}
