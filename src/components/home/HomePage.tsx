import { useState, useMemo } from 'react'
import type { City } from '@/data/types'
import type { MeasureTextFn } from '@/lib/locationLabel'
import { DEFAULT_RADIUS_MILES } from '@/data/constants'
import { taxonomySections } from '@/data/taxonomy'
import { filterSectionsByQuery, normalizeQuery } from '@/lib/searchTaxonomy'
import { HeaderShell } from './HeaderShell'
import { LeftRailShell } from './LeftRailShell'
import { MainContentShell } from './MainContentShell'
import { LocationModal } from '@/components/location/LocationModal'

interface HomePageProps {
  /** Optional measureText override for deterministic label overflow testing. */
  measureTextOverride?: MeasureTextFn
}

/**
 * HomePage owns all page-level state.
 * Defaults per spec:
 *   selectedCities: []
 *   radiusMiles: 10
 *   hasEditedRadius: false
 *   isLocationModalOpen: false
 *   headerSearchQuery: ""
 *   modalCityQuery: ""
 */
export function HomePage({ measureTextOverride }: HomePageProps = {}) {
  const [selectedCities, setSelectedCities] = useState<City[]>([])
  const [radiusMiles, setRadiusMiles] = useState<number>(DEFAULT_RADIUS_MILES)
  const [hasEditedRadius, setHasEditedRadius] = useState<boolean>(false)
  const [isLocationModalOpen, setIsLocationModalOpen] =
    useState<boolean>(false)
  const [headerSearchQuery, setHeaderSearchQuery] = useState<string>('')
  const [modalCityQuery, setModalCityQuery] = useState<string>('')

  // Compute filtered sections from the search query
  const { filteredSections, matchCount } = useMemo(
    () => filterSectionsByQuery(taxonomySections, headerSearchQuery),
    [headerSearchQuery],
  )

  const isSearchActive = normalizeQuery(headerSearchQuery) !== ''

  const clearSearch = () => setHeaderSearchQuery('')

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
          measureTextOverride={measureTextOverride}
        />

        {/* Below header: two-column layout */}
        <div className="flex" style={{ gap: '0px' }}>
          {/* Left rail: fixed width 240px */}
          <LeftRailShell isSearchActive={isSearchActive} />

          {/* Main content: fills remaining width */}
          <MainContentShell
            sections={filteredSections}
            matchCount={matchCount}
            onClearSearch={clearSearch}
          />
        </div>
      </div>

      {/* Location modal — fully controlled from HomePage state */}
      <LocationModal
        open={isLocationModalOpen}
        onOpenChange={setIsLocationModalOpen}
        selectedCities={selectedCities}
        setSelectedCities={setSelectedCities}
        radiusMiles={radiusMiles}
        setRadiusMiles={setRadiusMiles}
        hasEditedRadius={hasEditedRadius}
        setHasEditedRadius={setHasEditedRadius}
        modalCityQuery={modalCityQuery}
        setModalCityQuery={setModalCityQuery}
      />
    </div>
  )
}
