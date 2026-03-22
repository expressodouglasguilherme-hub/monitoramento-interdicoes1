/**
 * MapComponent - Interactive map displaying event markers
 * Feature: monitoramento-interdicoes-combustiveis
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 7.4
 */

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Event } from '../types';
import 'leaflet/dist/leaflet.css';

export interface MapComponentProps {
  /** Array of events to display on the map */
  events: Event[];
}

// Fix for default marker icon in react-leaflet
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/**
 * MapComponent - Renders interactive map with event markers
 * 
 * Requirements: 1.1, 1.4
 * 
 * @param props - Component props
 * @returns JSX.Element
 */
export function MapComponent({ events }: MapComponentProps): JSX.Element {
  // Center map on Brazil
  const brazilCenter: [number, number] = [-14.235, -51.925];
  const initialZoom = 4;

  return (
    <div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={brazilCenter}
        zoom={initialZoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        aria-label="Mapa interativo de eventos"
      >
        {/* OpenStreetMap tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render markers for each event */}
        {events.map((event) => (
          <Marker
            key={event.id}
            position={[event.latitude, event.longitude]}
            icon={defaultIcon}
          >
            {/* Popup with event details */}
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-2 text-gray-900">
                  {event.cidade} - {event.uf}
                </h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-semibold">Local:</span> {event.local}
                  </p>
                  <p>
                    <span className="font-semibold">Observação:</span> {event.observacao}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
