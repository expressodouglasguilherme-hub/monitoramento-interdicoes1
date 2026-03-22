# EventContext Implementation

## Overview

This module implements the EventProvider component with polling logic for the fuel interdiction monitoring system.

## Components

### EventProvider

The `EventProvider` component manages global event state and provides it to child components through React Context.

**Features:**
- ✅ Initializes state with empty events, loading false, error null
- ✅ Implements `refreshEvents()` function that calls `APIService.getEvents()`
- ✅ Configures automatic polling every 30 seconds using `useEffect`
- ✅ Implements reconnection logic after failures (10-second interval after errors)
- ✅ Provides `reportNewEvent()` function for creating new events

**Requirements Satisfied:**
- 4.4: Polling to API every 30 seconds
- 4.5: Reconnection logic after failures
- 7.1: Real-time updates without page reload
- 7.2: Dashboard updates automatically
- 7.3: Table updates automatically

## Usage

```typescript
import { EventProvider } from './context';
import { APIService } from './services/APIService';

const apiService = new APIService('https://api.example.com');

function App() {
  return (
    <EventProvider apiService={apiService}>
      <YourComponents />
    </EventProvider>
  );
}
```

## Polling Behavior

- **Normal operation**: Polls every 30 seconds
- **After failure**: Polls every 10 seconds (reconnection logic)
- **On success**: Resets to 30-second interval

## State Management

The provider manages three pieces of state:
- `events`: Array of Event objects
- `loading`: Boolean indicating if a request is in progress
- `error`: String with error message or null

## Error Handling

- Catches API errors and stores them in state
- Increments failure counter on errors
- Resets failure counter on successful requests
- Throws errors from `reportNewEvent()` for UI handling
