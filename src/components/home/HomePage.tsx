import { useState } from 'react'
import type { City } from '@/data/types'
import { DEFAULT_RADIUS_MILES } from '@/data/constants'
import { HeaderShell } from './HeaderShell'
import { LeftRailShell } from './LeftRailShell'
import { MainContentShell } from './MainContentShell'

/**
 * HomePage owns all page-level state.
 * Sprint 1 defaults per sprint spec:
 *   selectedCities: []
 *   radiusMiles: 10
 *   hasEditedRadius: false
 *   isLocationModalOpen: false
 *   headerSearchQuery: ""
 *   modalCityQuery: ""
 */
export function HomePage() {
  const [selectedCities, _setSelectedCities] = useState<City[]>([])
  const [radiusMiles, _setRadiusMiles] = useState<number>(DEFAULT_RADIUS_MILES)
  const [hasEditedRadius, _setHasEditedRadius] = useState<boolean>(false)
  const [isLocationModalOpen, setIsLocationModalOpen] =
    useState<boolean>(false)
  const [headerSearchQuery, setHeaderSearchQuery] = useState<string>('')
  // modalCityQuery state — wired for later sprints
  const [modalCityQuery, setModalCityQuery] = useState<string>('')

  // Suppress unused-variable warnings for state setters wired in later sprints.
  // These are intentionally declared now so the state model is complete.
  void _setSelectedCities
  void _setRadiusMiles
  void _setHasEditedRadius
  void setModalCityQuery
  void modalCityQuery

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--color-bg-page)' }}
    >
      {/* Full-width container, left-aligned content per design system */}
      <div className="w-full px-6">
        {/* Header spans full container width */}
        <HeaderShell
          selectedCities={selectedCities}
          radiusMiles={radiusMiles}
          hasEditedRadius={hasEditedRadius}
          headerSearchQuery={headerSearchQuery}
          onSearchQueryChange={setHeaderSearchQuery}
          onLocationTriggerClick={() => setIsLocationModalOpen(true)}
        />

        {/* Below header: two-column layout */}
        <div className="flex" style={{ gap: '0px' }}>
          {/* Left rail: fixed width 240px */}
          <LeftRailShell />

          {/* Main content: fills remaining width */}
          <MainContentShell />
        </div>
      </div>

      {/*
        Location modal placeholder — no UI in Sprint 1.
        Only the state flag (isLocationModalOpen) is wired above.
        Later sprints will render the modal here.
      */}
      {isLocationModalOpen && (
        <div
          data-testid="location-modal-placeholder"
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
        >
          <div
            className="bg-white p-6 shadow-lg"
            style={{ borderRadius: 'var(--radius-card)' }}
          >
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              Location modal placeholder — Sprint 2+
            </p>
            <button
              onClick={() => setIsLocationModalOpen(false)}
              className="px-4 py-2 text-sm text-white cursor-pointer"
              style={{
                backgroundColor: 'var(--color-link-default)',
                borderRadius: 'var(--radius-button)',
                border: 'none',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
