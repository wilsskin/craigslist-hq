import type { City } from './types'

/**
 * Hardcoded city list fixture.
 * IDs are stable and not derived from display labels.
 */
export const CITIES: City[] = [
  { id: 'city_sf', name: 'San Francisco' },
  { id: 'city_boston', name: 'Boston' },
  { id: 'city_nyc', name: 'New York City' },
]

/** Radius options in miles */
export const RADIUS_OPTIONS = [5, 8, 10, 25, 50, 100] as const

/** Default radius in miles (Sprint 1 default per sprint spec) */
export const DEFAULT_RADIUS_MILES = 10
