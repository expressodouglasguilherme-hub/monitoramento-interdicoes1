/**
 * EventTableComponent - Displays events in tabular format
 * Feature: monitoramento-interdicoes-combustiveis
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 7.5, 8.3
 */

import React from 'react';
import { Event } from '../types';

export interface EventTableComponentProps {
  /** Array of events to display in the table */
  events: Event[];
}

/**
 * Format ISO 8601 date string to DD/MM/YYYY HH:mm format
 * 
 * Requirements: 3.4
 * 
 * @param isoDateString - Date string in ISO 8601 format
 * @returns Formatted date string
 */
function formatDate(isoDateString: string): string {
  try {
    const date = new Date(isoDateString);
    
    // Format using Intl.DateTimeFormat for Brazilian locale
    const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    
    const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    
    const datePart = dateFormatter.format(date);
    const timePart = timeFormatter.format(date);
    
    return `${datePart} ${timePart}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return isoDateString;
  }
}

/**
 * EventTableComponent - Renders table with event details
 * 
 * @param props - Component props
 * @returns JSX.Element
 */
export function EventTableComponent({ events }: EventTableComponentProps): JSX.Element {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">
          Eventos Detalhados
        </h2>
      </div>

      {events.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <p className="text-lg">Nenhum evento registrado</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Cidade
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    UF
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Local
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Observação
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Atualização
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event, index) => (
                  <tr
                    key={event.id}
                    className="hover:bg-gray-50 transition-colors animate-fadeIn"
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {event.cidade}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-semibold">
                      {event.uf}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {event.local}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                      {event.observacao}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {formatDate(event.dataAtualizacao)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
