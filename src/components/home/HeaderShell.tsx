import type { City } from '@/data/types'
import type { MeasureTextFn } from '@/lib/locationLabel'
import {
  computeHeaderLocationLabel,
  createCanvasMeasureText,
} from '@/lib/locationLabel'
import { useMemo } from 'react'
import { Search, MapPin, SquarePen, Heart, User, X } from 'lucide-react'
import craigslistLogo from '@/assets/craigslist-logo.png'

interface HeaderShellProps {
  selectedCities: City[]
  radiusMiles: number
  hasEditedRadius: boolean
  headerSearchQuery: string
  onSearchQueryChange: (query: string) => void
  onLocationTriggerClick: () => void
  /** Optional measureText override for deterministic testing. */
  measureTextOverride?: MeasureTextFn
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
  measureTextOverride,
}: HeaderShellProps) {
  const canvasMeasureText = useMemo(() => createCanvasMeasureText(), [])
  const measureText = measureTextOverride ?? canvasMeasureText

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
      <div className="flex items-center justify-between py-4 gap-6">
        {/* Logo area */}
        <div className="shrink-0" data-testid="header-logo-area">
          <img
            src={craigslistLogo}
            alt="craigslist"
            className="block"
            style={{
              height: '32px',
              width: 'auto',
            }}
          />
        </div>

        {/* Center region: search + location trigger */}
        <div className="flex flex-1 max-w-2xl items-center gap-3">
          {/* Search input with leading icon — design system: min 44px height, 1px #727272 border, 4px radius (radius.input), Open Sans 16px */}
          <div
            className="flex-1 flex items-center"
            data-testid="header-search-area"
            style={{
              border: '1px solid var(--color-border-emphasis)',
              borderRadius: 'var(--radius-input)',
              minHeight: '44px',
            }}
          >
            <span
              className="flex items-center justify-center shrink-0"
              data-testid="search-icon"
              style={{
                paddingLeft: '12px',
                color: 'var(--color-icon-default)',
              }}
            >
              <Search size={20} />
            </span>
            <input
              type="text"
              placeholder="search craigslist"
              value={headerSearchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="w-full py-2 text-base outline-none bg-transparent"
              style={{
                paddingLeft: '8px',
                paddingRight: headerSearchQuery ? '4px' : '12px',
                fontFamily: '"Open Sans", sans-serif',
                fontSize: '16px',
                color: 'var(--color-text-primary)',
                border: 'none',
              }}
            />
            {headerSearchQuery && (
              <button
                type="button"
                data-testid="search-clear"
                className="flex items-center justify-center shrink-0 cursor-pointer bg-transparent border-none p-0"
                style={{
                  paddingRight: '10px',
                  color: 'var(--color-icon-default)',
                }}
                onClick={() => onSearchQueryChange('')}
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Location trigger with MapPin icon + computed label */}
          <button
            data-testid="header-location-trigger"
            onClick={onLocationTriggerClick}
            className="shrink-0 flex items-center gap-2 px-3 py-2 text-base cursor-pointer"
            style={{
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-button)',
              color: 'var(--color-text-primary)',
              fontFamily: '"Open Sans", sans-serif',
              maxWidth: `${LOCATION_LABEL_MAX_WIDTH + 64}px`,
              background: 'transparent',
            }}
          >
            <MapPin
              size={20}
              className="shrink-0"
              style={{ color: 'var(--color-icon-default)' }}
            />
            <span
              className="truncate"
              style={{ maxWidth: `${LOCATION_LABEL_MAX_WIDTH}px` }}
            >
              {locationLabel}
            </span>
          </button>
        </div>

        {/* Action icons — lucide, 20px, #727272 per design system */}
        <div
          className="shrink-0 flex items-center gap-4"
          data-testid="header-actions-area"
        >
          <button
            className="cursor-pointer bg-transparent border-none p-0"
            title="Create post"
            onClick={() => console.log('[header] Create post clicked')}
            style={{ color: 'var(--color-icon-default)' }}
          >
            <SquarePen size={20} />
          </button>
          <button
            className="cursor-pointer bg-transparent border-none p-0"
            title="Favorites"
            onClick={() => console.log('[header] Favorites clicked')}
            style={{ color: 'var(--color-icon-default)' }}
          >
            <Heart size={20} />
          </button>
          <button
            className="cursor-pointer bg-transparent border-none p-0"
            title="Account"
            onClick={() => console.log('[header] Account clicked')}
            style={{ color: 'var(--color-icon-default)' }}
          >
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}
