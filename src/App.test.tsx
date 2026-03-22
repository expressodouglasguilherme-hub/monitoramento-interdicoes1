import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the header with correct title', () => {
    render(<App />)
    const heading = screen.getByText(/MONITORAMENTO INTERDIÇÕES \/ COMBUSTÍVEIS/i)
    expect(heading).toBeInTheDocument()
  })

  it('renders development message', () => {
    render(<App />)
    const message = screen.getByText(/Sistema em desenvolvimento/i)
    expect(message).toBeInTheDocument()
  })
})
