/**
 * DashboardComponent - Displays aggregated metrics and charts
 * Feature: monitoramento-interdicoes-combustiveis
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 6.1
 */

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Event, MetricsSummary, StateMetric } from '../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export interface DashboardComponentProps {
  /** Array of events to aggregate and display */
  events: Event[];
}

/**
 * Calculate metrics summary from events
 * 
 * Requirements: 2.1, 2.2, 2.4
 * 
 * @param events - Array of events
 * @returns MetricsSummary with aggregated data
 */
function calculateMetrics(events: Event[]): MetricsSummary {
  // Count total events
  const totalEvents = events.length;

  // Aggregate events by state
  const stateCountMap = new Map<string, number>();
  
  events.forEach((event) => {
    const currentCount = stateCountMap.get(event.uf) || 0;
    stateCountMap.set(event.uf, currentCount + 1);
  });

  // Convert to array and sort by count (descending)
  const eventsByState: StateMetric[] = Array.from(stateCountMap.entries())
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalEvents,
    eventsByState,
  };
}

/**
 * DashboardComponent - Renders metrics and bar chart
 * 
 * @param props - Component props
 * @returns JSX.Element
 */
export function DashboardComponent({ events }: DashboardComponentProps): JSX.Element {
  const metrics = calculateMetrics(events);
  
  // Limit to top 7 states for chart
  const top7States = metrics.eventsByState.slice(0, 7);

  // Prepare chart data
  const chartData = {
    labels: top7States.map((metric) => metric.state),
    datasets: [
      {
        label: 'Eventos por Estado',
        data: top7States.map((metric) => metric.count),
        backgroundColor: 'rgba(37, 99, 235, 0.8)', // Blue-600 with opacity
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Top 7 Estados com Mais Eventos',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Total events metric */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Métricas Gerais
        </h2>
        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
          <p className="text-sm text-gray-600 mb-1">Total de Eventos Ativos</p>
          <p className="text-4xl font-bold text-blue-600">
            {metrics.totalEvents}
          </p>
        </div>
      </div>

      {/* Bar chart */}
      {metrics.totalEvents > 0 ? (
        <div className="h-[300px]">
          <Bar data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          <p>Nenhum evento para exibir no gráfico</p>
        </div>
      )}

      {/* State breakdown list */}
      {metrics.eventsByState.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Distribuição por Estado
          </h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {metrics.eventsByState.map((metric) => (
              <div
                key={metric.state}
                className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-700">{metric.state}</span>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {metric.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
