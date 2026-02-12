import type { City } from '@/data/types'
import { CITIES, RADIUS_OPTIONS, DEFAULT_RADIUS_MILES } from '@/data/constants'
import { Search, X, RotateCcw, MapPin } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

const MAX_CITIES = 3

interface LocationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCities: City[]
  setSelectedCities: React.Dispatch<React.SetStateAction<City[]>>
  radiusMiles: number
  setRadiusMiles: React.Dispatch<React.SetStateAction<number>>
  hasEditedRadius: boolean
  setHasEditedRadius: React.Dispatch<React.SetStateAction<boolean>>
  modalCityQuery: string
  setModalCityQuery: React.Dispatch<React.SetStateAction<string>>
}

export function LocationModal({
  open,
  onOpenChange,
  selectedCities,
  setSelectedCities,
  radiusMiles,
  setRadiusMiles,
  hasEditedRadius,
  setHasEditedRadius,
  modalCityQuery,
  setModalCityQuery,
}: LocationModalProps) {
  const selectedIds = new Set(selectedCities.map((c) => c.id))
  const atMax = selectedCities.length >= MAX_CITIES

  // Filter city list: exclude already-selected, match by query substring
  const filteredCities = CITIES.filter((city) => {
    if (selectedIds.has(city.id)) return false
    if (modalCityQuery.trim() === '') return true
    return city.name.toLowerCase().includes(modalCityQuery.toLowerCase())
  })

  function handleAddCity(city: City) {
    if (atMax || selectedIds.has(city.id)) return
    setSelectedCities((prev) => [...prev, city])
  }

  function handleRemoveCity(cityId: string) {
    setSelectedCities((prev) => prev.filter((c) => c.id !== cityId))
  }

  function handleRadiusChange(value: number) {
    setRadiusMiles(value)
    setHasEditedRadius(true)
  }

  function handleResetRadius() {
    setRadiusMiles(DEFAULT_RADIUS_MILES)
    setHasEditedRadius(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[680px] p-0 gap-0 overflow-hidden"
        style={{
          borderRadius: 'var(--radius-card)',
          fontFamily: '"Open Sans", sans-serif',
        }}
        showCloseButton={true}
        data-testid="location-modal"
      >
        <div className="flex min-h-[420px]">
          {/* Left panel: search, city list, chips, radius, actions */}
          <div
            className="flex flex-col flex-1 p-6"
            style={{ borderRight: '1px solid var(--color-border-default)' }}
          >
            <DialogHeader className="mb-4">
              <DialogTitle
                className="text-lg font-bold"
                style={{
                  fontFamily: '"Open Sans", sans-serif',
                  color: 'var(--color-text-primary)',
                }}
              >
                Location
              </DialogTitle>
              <DialogDescription className="sr-only">
                Select up to 3 cities and set a search radius
              </DialogDescription>
            </DialogHeader>

            {/* City search input */}
            <div
              className="flex items-center mb-3"
              style={{
                border: '1px solid var(--color-border-emphasis)',
                borderRadius: 'var(--radius-card)',
                minHeight: '40px',
              }}
            >
              <span
                className="flex items-center justify-center shrink-0"
                style={{ paddingLeft: '10px', color: 'var(--color-icon-default)' }}
              >
                <Search size={16} />
              </span>
              <input
                type="text"
                data-testid="modal-city-search"
                placeholder="Search by city, neighborhood or ZIP code"
                value={modalCityQuery}
                onChange={(e) => setModalCityQuery(e.target.value)}
                className="w-full py-2 text-sm outline-none bg-transparent"
                style={{
                  paddingLeft: '8px',
                  paddingRight: '10px',
                  fontFamily: '"Open Sans", sans-serif',
                  color: 'var(--color-text-primary)',
                  border: 'none',
                }}
              />
            </div>

            {/* City list */}
            <div
              className="flex flex-col gap-1 mb-4"
              data-testid="modal-city-list"
              style={{ minHeight: '80px' }}
            >
              {filteredCities.length === 0 ? (
                <p
                  className="text-sm py-2"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  No matching cities
                </p>
              ) : (
                filteredCities.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    data-testid={`city-option-${city.id}`}
                    disabled={atMax}
                    className="flex items-center justify-between py-2 px-3 text-sm text-left transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      borderRadius: 'var(--radius-card)',
                      border: 'none',
                      background: 'transparent',
                      fontFamily: '"Open Sans", sans-serif',
                      color: 'var(--color-text-primary)',
                      transitionDuration: 'var(--duration-fast)',
                    }}
                    onMouseEnter={(e) => {
                      if (!atMax)
                        e.currentTarget.style.backgroundColor =
                          'var(--color-bg-subtle)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                    onClick={() => handleAddCity(city)}
                  >
                    <span className="flex items-center gap-2">
                      <MapPin
                        size={16}
                        style={{ color: 'var(--color-icon-default)' }}
                      />
                      {city.name}
                    </span>
                  </button>
                ))
              )}
              {atMax && filteredCities.length > 0 && (
                <p
                  className="text-xs mt-1"
                  style={{ color: 'var(--color-text-secondary)' }}
                  data-testid="max-cities-message"
                >
                  Max {MAX_CITIES} locations
                </p>
              )}
            </div>

            {/* Selected locations chips */}
            <div className="mb-4">
              <p
                className="text-xs font-semibold mb-2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Selected locations
              </p>
              <div
                className="flex flex-wrap gap-2"
                data-testid="modal-chips"
              >
                {selectedCities.length === 0 ? (
                  <p
                    className="text-sm"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    No locations selected
                  </p>
                ) : (
                  selectedCities.map((city) => (
                    <span
                      key={city.id}
                      data-testid={`chip-${city.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm transition-colors"
                      style={{
                        border: '1px solid var(--color-border-default)',
                        borderRadius: 'var(--radius-chip)',
                        color: 'var(--color-text-primary)',
                        fontFamily: '"Open Sans", sans-serif',
                        transitionDuration: 'var(--duration-fast)',
                      }}
                    >
                      {city.name}
                      <button
                        type="button"
                        data-testid={`chip-remove-${city.id}`}
                        className="inline-flex items-center justify-center cursor-pointer bg-transparent border-none p-0"
                        style={{ color: 'var(--color-text-secondary)' }}
                        onClick={() => handleRemoveCity(city.id)}
                        aria-label={`Remove ${city.name}`}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Radius control */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p
                  className="text-xs font-semibold"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Radius
                </p>
                {hasEditedRadius && (
                  <button
                    type="button"
                    data-testid="radius-reset"
                    className="flex items-center gap-1 text-xs cursor-pointer bg-transparent border-none p-0"
                    style={{ color: 'var(--color-link-default)' }}
                    onClick={handleResetRadius}
                  >
                    <RotateCcw size={12} />
                    Reset
                  </button>
                )}
              </div>
              <select
                data-testid="radius-select"
                value={radiusMiles}
                onChange={(e) => handleRadiusChange(Number(e.target.value))}
                className="w-full py-2 px-3 text-sm cursor-pointer"
                style={{
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-card)',
                  fontFamily: '"Open Sans", sans-serif',
                  color: 'var(--color-text-primary)',
                  backgroundColor: 'var(--color-bg-page)',
                }}
              >
                {RADIUS_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r} miles
                  </option>
                ))}
              </select>
            </div>

            {/* Apply button */}
            <div className="mt-auto pt-2">
              <button
                type="button"
                data-testid="modal-apply"
                className="w-full py-2 text-sm font-semibold text-white cursor-pointer transition-colors"
                style={{
                  backgroundColor: 'var(--color-link-default)',
                  borderRadius: 'var(--radius-button)',
                  border: 'none',
                  fontFamily: '"Open Sans", sans-serif',
                  transitionDuration: 'var(--duration-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'brightness(0.8)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'none'
                }}
                onClick={() => onOpenChange(false)}
              >
                Apply
              </button>
            </div>
          </div>

          {/* Right panel: map placeholder */}
          <div
            className="flex flex-col p-6"
            style={{ width: '260px', backgroundColor: 'var(--color-bg-subtle)' }}
            data-testid="modal-map-placeholder"
          >
            <p
              className="text-sm font-semibold mb-3"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Map preview
            </p>
            <div
              className="flex-1 flex flex-col items-center justify-center"
              style={{
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-card)',
                backgroundColor: 'var(--color-bg-page)',
                minHeight: '200px',
              }}
            >
              {selectedCities.length === 0 ? (
                <p
                  className="text-sm"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  No locations selected
                </p>
              ) : (
                <div className="flex flex-col gap-2 p-4">
                  {selectedCities.map((city) => (
                    <div
                      key={city.id}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      <MapPin
                        size={14}
                        style={{ color: 'var(--color-link-default)' }}
                      />
                      {city.name}
                    </div>
                  ))}
                  {hasEditedRadius && (
                    <p
                      className="text-xs mt-2"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Radius: {radiusMiles} mi
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
