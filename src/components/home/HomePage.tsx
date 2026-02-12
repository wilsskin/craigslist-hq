import { useState, useMemo } from 'react'
import type { City } from '@/data/types'
import type { MeasureTextFn } from '@/lib/locationLabel'
import {
  computeHeaderLocationLabel,
  createCanvasMeasureText,
} from '@/lib/locationLabel'
import { DEFAULT_RADIUS_MILES } from '@/data/constants'
import { taxonomySections } from '@/data/taxonomy'
import { filterSectionsByQuery } from '@/lib/searchTaxonomy'
import { HeaderShell } from './HeaderShell'
import { LeftRailShell } from './LeftRailShell'
import { MainContentShell } from './MainContentShell'
import { LocationModal } from '@/components/location/LocationModal'

const LOCATION_LABEL_MAX_WIDTH = 240

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
  const [selectedCities, setSelectedCities] = useState<City[]>([
    { id: 'city_boston', name: 'Boston' },
  ])
  const [radiusMiles, setRadiusMiles] = useState<number>(DEFAULT_RADIUS_MILES)
  const [hasEditedRadius, setHasEditedRadius] = useState<boolean>(true)
  const [isLocationModalOpen, setIsLocationModalOpen] =
    useState<boolean>(false)
  const [headerSearchQuery, setHeaderSearchQuery] = useState<string>('')
  const [modalCityQuery, setModalCityQuery] = useState<string>('')

  // Compute filtered sections from the search query
  const { filteredSections, matchCount } = useMemo(
    () => filterSectionsByQuery(taxonomySections, headerSearchQuery),
    [headerSearchQuery],
  )

  const clearSearch = () => setHeaderSearchQuery('')

  function scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Location label for left rail (and any other consumers); computed once for consistency
  const canvasMeasureText = useMemo(() => createCanvasMeasureText(), [])
  const measureText = measureTextOverride ?? canvasMeasureText
  const locationLabel = useMemo(
    () =>
      computeHeaderLocationLabel(
        selectedCities,
        radiusMiles,
        hasEditedRadius,
        LOCATION_LABEL_MAX_WIDTH,
        measureText,
      ),
    [selectedCities, radiusMiles, hasEditedRadius, measureText],
  )

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--color-bg-page)' }}
    >
      {/* Header spans full page width */}
      <HeaderShell
        headerSearchQuery={headerSearchQuery}
        onSearchQueryChange={setHeaderSearchQuery}
      />

      {/* Full-width container, left-aligned content per design system */}
      <div className="w-full px-6">
        {/* Below header: two-column layout */}
        <div className="flex" style={{ gap: '0px' }}>
          {/* Left rail: location trigger + categories */}
          <LeftRailShell
            locationLabel={locationLabel}
            onLocationTriggerClick={() => setIsLocationModalOpen(true)}
            onCategoryClick={(sectionId) => {
              setHeaderSearchQuery('')
              setTimeout(() => {
                scrollToSection(sectionId)
              }, 0)
            }}
          />

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
