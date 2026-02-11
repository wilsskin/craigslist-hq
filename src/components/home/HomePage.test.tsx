import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HomePage } from './HomePage'

describe('HomePage smoke test', () => {
  it('renders the three layout regions', () => {
    render(<HomePage />)

    expect(screen.getByTestId('header-shell')).toBeInTheDocument()
    expect(screen.getByTestId('left-rail-shell')).toBeInTheDocument()
    expect(screen.getByTestId('main-content-shell')).toBeInTheDocument()
  })

  it('renders the default location label when no cities selected', () => {
    render(<HomePage />)

    expect(screen.getByTestId('header-location-trigger')).toHaveTextContent(
      'Select location',
    )
  })
})
