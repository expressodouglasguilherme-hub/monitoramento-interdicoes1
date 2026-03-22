/**
 * Mock API Server for Development
 * 
 * Simple Express server that simulates the backend API
 * Run with: node mock-server.js
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
let events = [
  {
    id: '1',
    cidade: 'São Paulo',
    uf: 'SP',
    local: 'Rodovia Anhanguera, km 50',
    observacao: 'Interdição parcial devido a acidente',
    latitude: -23.5505,
    longitude: -46.6333,
    dataAtualizacao: new Date().toISOString(),
  },
  {
    id: '2',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    local: 'Avenida Brasil, altura da Penha',
    observacao: 'Falta de combustível em postos da região',
    latitude: -22.9068,
    longitude: -43.1729,
    dataAtualizacao: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    cidade: 'Belo Horizonte',
    uf: 'MG',
    local: 'BR-040, km 120',
    observacao: 'Manifestação bloqueando rodovia',
    latitude: -19.9167,
    longitude: -43.9345,
    dataAtualizacao: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '4',
    cidade: 'Brasília',
    uf: 'DF',
    local: 'Eixo Monumental',
    observacao: 'Protesto de caminhoneiros',
    latitude: -15.7939,
    longitude: -47.8828,
    dataAtualizacao: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: '5',
    cidade: 'Curitiba',
    uf: 'PR',
    local: 'BR-277, km 80',
    observacao: 'Interdição total por obras',
    latitude: -25.4284,
    longitude: -49.2733,
    dataAtualizacao: new Date(Date.now() - 14400000).toISOString(),
  },
];

// GET /api/events - Get all events
app.get('/api/events', (req, res) => {
  console.log('[Mock API] GET /api/events');
  res.json(events);
});

// POST /api/events - Create new event
app.post('/api/events', (req, res) => {
  console.log('[Mock API] POST /api/events', req.body);
  
  const { cidade, uf, local, observacao } = req.body;
  
  // Validate required fields
  if (!cidade || !uf || !local || !observacao) {
    return res.status(400).json({
      error: 'Todos os campos são obrigatórios',
    });
  }
  
  // Generate mock coordinates based on UF (simplified)
  const ufCoordinates = {
    SP: { lat: -23.5505, lng: -46.6333 },
    RJ: { lat: -22.9068, lng: -43.1729 },
    MG: { lat: -19.9167, lng: -43.9345 },
    DF: { lat: -15.7939, lng: -47.8828 },
    PR: { lat: -25.4284, lng: -49.2733 },
    RS: { lat: -30.0346, lng: -51.2177 },
    BA: { lat: -12.9714, lng: -38.5014 },
    PE: { lat: -8.0476, lng: -34.8770 },
    CE: { lat: -3.7172, lng: -38.5433 },
    PA: { lat: -1.4558, lng: -48.4902 },
  };
  
  const coords = ufCoordinates[uf] || { lat: -14.235, lng: -51.925 };
  
  // Add some randomness to coordinates
  const latitude = coords.lat + (Math.random() - 0.5) * 2;
  const longitude = coords.lng + (Math.random() - 0.5) * 2;
  
  // Create new event
  const newEvent = {
    id: String(events.length + 1),
    cidade,
    uf,
    local,
    observacao,
    latitude,
    longitude,
    dataAtualizacao: new Date().toISOString(),
  };
  
  events.push(newEvent);
  
  res.status(201).json(newEvent);
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock API Server running on http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  GET  http://localhost:${PORT}/api/events`);
  console.log(`  POST http://localhost:${PORT}/api/events`);
});
