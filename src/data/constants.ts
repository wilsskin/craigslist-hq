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

/**
 * City location presets for map visualization.
 * Contains latitude, longitude, and default zoom level for each city.
 */
export const CITY_PRESETS = {
  city_boston: {
    lat: 42.3601,
    lng: -71.0589,
    defaultZoom: 11,
  },
  city_nyc: {
    lat: 40.7128,
    lng: -74.006,
    defaultZoom: 11,
  },
  city_sf: {
    lat: 37.7749,
    lng: -122.4194,
    defaultZoom: 11,
  },
} as const
