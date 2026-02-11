import type { City } from '@/data/types'
import {
  computeHeaderLocationLabel,
  createCanvasMeasureText,
} from '@/lib/locationLabel'
import { useMemo } from 'react'

interface HeaderShellProps {
  selectedCities: City[]
  radiusMiles: number
  hasEditedRadius: boolean
  headerSearchQuery: string
  onSearchQueryChange: (query: string) => void
  onLocationTriggerClick: () => void
}

/** Max width for the location label in px (per spec) */
const LOCATION_LABEL_MAX_WIDTH = 240

export function HeaderShell({
  selectedCities,
  radiusMiles,
  hasEditedRadius,
  headerSearchQuery,
  onSearchQueryChange,
  onLocationTriggerClick,
}: HeaderShellProps) {
  const measureText = useMemo(() => createCanvasMeasureText(), [])

  const locationLabel = computeHeaderLocationLabel(
    selectedCities,
    radiusMiles,
    hasEditedRadius,
    LOCATION_LABEL_MAX_WIDTH,
    measureText,
  )

  return (
    <header
      data-testid="header-shell"
      className="w-full border-b"
      style={{ borderColor: 'var(--color-border-default)' }}
    >
      <div className="flex items-center justify-between py-4 px-6 gap-6">
        {/* Logo area */}
        <div className="shrink-0" data-testid="header-logo-area">
          <span
            className="text-2xl font-bold"
            style={{
              fontFamily: '"Times New Roman", Times, serif',
              color: 'var(--color-logo-purple)',
            }}
          >
            craigslist
          </span>
        </div>

        {/* Center region: search + location trigger */}
        <div className="flex flex-1 max-w-2xl items-center gap-3">
          {/* Search input area placeholder */}
          <div className="flex-1" data-testid="header-search-area">
            <input
              type="text"
              placeholder="search craigslist"
              value={headerSearchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="w-full px-3 py-2 text-base outline-none"
              style={{
                border: '1px solid var(--color-border-emphasis)',
                borderRadius: 'var(--radius-input)',
                fontFamily: '"Open Sans", sans-serif',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          {/* Location trigger area placeholder */}
          <button
            data-testid="header-location-trigger"
            onClick={onLocationTriggerClick}
            className="shrink-0 flex items-center gap-2 px-3 py-2 text-base cursor-pointer"
            style={{
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-button)',
              color: 'var(--color-text-primary)',
              fontFamily: '"Open Sans", sans-serif',
              maxWidth: `${LOCATION_LABEL_MAX_WIDTH + 48}px`,
              background: 'transparent',
            }}
          >
            <span
              className="truncate"
              style={{ maxWidth: `${LOCATION_LABEL_MAX_WIDTH}px` }}
            >
              {locationLabel}
            </span>
          </button>
        </div>

        {/* Action icons area placeholder */}
        <div
          className="shrink-0 flex items-center gap-4"
          data-testid="header-actions-area"
        >
          <div
            className="w-5 h-5 rounded"
            style={{ backgroundColor: 'var(--color-bg-subtle)' }}
            title="Post placeholder"
          />
          <div
            className="w-5 h-5 rounded"
            style={{ backgroundColor: 'var(--color-bg-subtle)' }}
            title="Favorites placeholder"
          />
          <div
            className="w-5 h-5 rounded"
            style={{ backgroundColor: 'var(--color-bg-subtle)' }}
            title="Account placeholder"
          />
        </div>
      </div>
    </header>
  )
}
