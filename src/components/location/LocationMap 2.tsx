import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { City } from '@/data/types'
import { CITY_PRESETS } from '@/data/constants'

interface LocationMapProps {
  /** Selected cities to display on the map */
  selectedCities: City[]
  /** Radius in miles to display around each city */
  radiusMiles: number
  /** Whether radius should be displayed */
  hasEditedRadius: boolean
}

/**
 * Converts miles to meters for map radius display.
 */
function milesToMeters(miles: number): number {
  return miles * 1609.34
}

/**
 * Converts meters to pixels for circle radius at a given zoom level and latitude.
 */
function metersToPixels(
  meters: number,
  zoom: number,
  latitude: number,
): number {
  const earthCircumference = 40075017
  const metersPerPixel =
    (earthCircumference * Math.cos((latitude * Math.PI) / 180)) /
    Math.pow(2, zoom + 8)
  return meters / metersPerPixel
}

/**
 * Calculates zoom level needed to fit a circle with radius in meters,
 * ensuring 8px padding on each side (16px total).
 * Returns the zoom level that fits the circle + padding in the viewport.
 */
function calculateZoomForRadiusWithPadding(
  radiusMeters: number,
  latitude: number,
  viewportWidth: number = 260, // Default modal map width
  viewportHeight: number = 200, // Default modal map height
): number {
  // We need to fit: circle diameter + 16px padding (8px on each side)
  // Use the smaller dimension to ensure it fits
  const availableSize = Math.min(viewportWidth, viewportHeight) - 16
  
  // Binary search for the right zoom level
  // Start with wider range, especially for large radii (100 miles)
  const radiusMiles = radiusMeters / 1609.34
  let minZoom = 6 // Lower minimum for large radii
  let maxZoom = 15
  // Start even lower for very large radii (100 miles)
  let bestZoom = radiusMiles >= 100 ? 7 : 8
  
  // Find zoom where circle fits with padding
  for (let i = 0; i < 30; i++) {
    const testZoom = (minZoom + maxZoom) / 2
    const radiusPixels = metersToPixels(radiusMeters, testZoom, latitude)
    const diameterPixels = radiusPixels * 2
    
    if (diameterPixels <= availableSize) {
      // Circle fits, try zooming in more (but don't go too far)
      bestZoom = testZoom
      minZoom = testZoom
    } else {
      // Circle too big, need to zoom out more
      maxZoom = testZoom
      // If we're hitting the lower bound, use that
      if (testZoom <= minZoom + 0.1) {
        bestZoom = testZoom
        break
      }
    }
    
    if (maxZoom - minZoom < 0.05) break
  }
  
  // Add extra zoom out for breathing room (ensures 8px padding is visible)
  // For large radii, be more aggressive with zoom out (30% more zoom out)
  let zoomOutBuffer = 0.3
  if (radiusMiles >= 100) {
    zoomOutBuffer = 0.65 // 30% more than 0.5 (0.5 * 1.3 ≈ 0.65)
  } else if (radiusMiles >= 50) {
    zoomOutBuffer = 0.5
  }
  
  // For 100 miles, ensure we zoom out significantly more
  const finalZoom = bestZoom - zoomOutBuffer
  return Math.max(6, Math.min(15, finalZoom))
}

export function LocationMap({
  selectedCities,
  radiusMiles,
  hasEditedRadius,
}: LocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<maplibregl.Marker[]>([])
  const circlesRef = useRef<string[]>([])
  const isUpdatingRef = useRef(false)

  // Initialize map once on mount
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'carto-positron': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
              'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
              'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
          },
        },
        layers: [
          {
            id: 'carto-positron-layer',
            type: 'raster',
            source: 'carto-positron',
          },
        ],
      },
      center: [CITY_PRESETS.city_boston.lng, CITY_PRESETS.city_boston.lat],
      zoom: CITY_PRESETS.city_boston.defaultZoom,
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Main update effect - runs when cities, radius, or hasEditedRadius changes
  useEffect(() => {
    if (!map.current) return

    const currentMap = map.current

    // Wait for map to be ready
    const executeUpdate = () => {
      // Prevent concurrent updates
      if (isUpdatingRef.current) {
        setTimeout(executeUpdate, 50)
        return
      }
      isUpdatingRef.current = true
      // Clean up ALL existing markers
      markersRef.current.forEach((marker) => {
        try {
          marker.remove()
        } catch (e) {
          // Ignore errors if marker already removed
        }
      })
      markersRef.current = []

      // Clean up ALL existing circles
      circlesRef.current.forEach((circleId) => {
        try {
          if (currentMap.getLayer(circleId)) {
            currentMap.removeLayer(circleId)
          }
          if (currentMap.getSource(circleId)) {
            currentMap.removeSource(circleId)
          }
        } catch (e) {
          // Ignore errors
        }
      })
      circlesRef.current = []

      if (selectedCities.length === 0) {
        isUpdatingRef.current = false
        return
      }

      // Get coordinates for all selected cities
      const coordinates: [number, number][] = selectedCities.map((city) => {
        const preset = CITY_PRESETS[city.id as keyof typeof CITY_PRESETS]
        if (!preset) {
          return [CITY_PRESETS.city_boston.lng, CITY_PRESETS.city_boston.lat]
        }
        return [preset.lng, preset.lat]
      })

      // Add markers immediately - always show pins
      coordinates.forEach((coord) => {
        try {
          const marker = new maplibregl.Marker({
            color: '#0020E5',
          })
            .setLngLat(coord)
            .addTo(currentMap)
          markersRef.current.push(marker)
        } catch (e) {
          console.error('Error adding marker:', e)
        }
      })

      // Function to create circles - must be called after zoom is set
      const createCircles = () => {
        // Double-check cleanup
        circlesRef.current.forEach((circleId) => {
          try {
            if (currentMap.getLayer(circleId)) {
              currentMap.removeLayer(circleId)
            }
            if (currentMap.getSource(circleId)) {
              currentMap.removeSource(circleId)
            }
          } catch (e) {
            // Ignore
          }
        })
        circlesRef.current = []

        if (!hasEditedRadius || radiusMiles <= 0) {
          isUpdatingRef.current = false
          return
        }

        const radiusMeters = milesToMeters(radiusMiles)
        const currentZoom = currentMap.getZoom()

        coordinates.forEach((coord, index) => {
          try {
            const circleId = `radius-circle-${index}`
            const radiusPixels = metersToPixels(radiusMeters, currentZoom, coord[1])

            if (radiusPixels <= 0 || !isFinite(radiusPixels)) {
              console.warn(`Invalid radius pixels: ${radiusPixels}`)
              return
            }

            // Add source
            if (currentMap.getSource(circleId)) {
              currentMap.removeSource(circleId)
            }
            
            currentMap.addSource(circleId, {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: coord,
                },
                properties: {},
              },
            })

            // Add layer
            if (currentMap.getLayer(circleId)) {
              currentMap.removeLayer(circleId)
            }
            
            currentMap.addLayer({
              id: circleId,
              type: 'circle',
              source: circleId,
              paint: {
                'circle-radius': radiusPixels,
                'circle-color': '#0020E5',
                'circle-opacity': 0.25,
                'circle-stroke-width': 3,
                'circle-stroke-color': '#0015B3',
                'circle-stroke-opacity': 1,
              },
            })

            circlesRef.current.push(circleId)
          } catch (e) {
            console.error(`Error creating circle ${index}:`, e)
          }
        })

        isUpdatingRef.current = false
      }

      // Function to update circle sizes when zoom changes
      const updateCircleSizes = () => {
        if (!hasEditedRadius || radiusMiles <= 0 || circlesRef.current.length === 0) {
          return
        }

        const radiusMeters = milesToMeters(radiusMiles)
        const currentZoom = currentMap.getZoom()

        circlesRef.current.forEach((circleId, index) => {
          const coord = coordinates[index]
          if (coord && currentMap.getLayer(circleId)) {
            try {
              const radiusPixels = metersToPixels(radiusMeters, currentZoom, coord[1])
              if (radiusPixels > 0 && isFinite(radiusPixels)) {
                currentMap.setPaintProperty(circleId, 'circle-radius', radiusPixels)
              }
            } catch (e) {
              // Ignore errors
            }
          }
        })
      }

      // Set up zoom handler
      currentMap.on('zoom', updateCircleSizes)

      if (coordinates.length === 1) {
        // Single city
        const preset = CITY_PRESETS[selectedCities[0].id as keyof typeof CITY_PRESETS]
        if (preset) {
          currentMap.setCenter([preset.lng, preset.lat])
          
          // Calculate zoom with padding - ensures circle + 8px padding fits
          let targetZoom: number
          if (hasEditedRadius && radiusMiles > 0) {
            const radiusMeters = milesToMeters(radiusMiles)
            const container = currentMap.getContainer()
            const width = container?.clientWidth || 260
            const height = container?.clientHeight || 200
            targetZoom = calculateZoomForRadiusWithPadding(
              radiusMeters,
              preset.lat,
              width,
              height,
            )
            // Ensure zoom is reasonable
            targetZoom = Math.max(7, Math.min(15, targetZoom))
          } else {
            targetZoom = preset.defaultZoom
          }

          // ALWAYS set zoom - even if close, this ensures it updates every time radius changes
          // This fixes the "every other time" issue
          currentMap.setZoom(targetZoom)

          // Create circles after zoom completes
          let circlesCreated = false
          const onZoomEnd = () => {
            if (!circlesCreated) {
              circlesCreated = true
              createCircles()
            }
            currentMap.off('zoomend', onZoomEnd)
          }
          currentMap.once('zoomend', onZoomEnd)

          // Fallback: create circles after delay - ensure it always happens
          setTimeout(() => {
            if (!circlesCreated) {
              circlesCreated = true
              createCircles()
            }
            isUpdatingRef.current = false
          }, 500)
        } else {
          isUpdatingRef.current = false
        }
      } else {
        // Multiple cities
        const radiusMeters = hasEditedRadius && radiusMiles > 0
          ? milesToMeters(radiusMiles)
          : 0

        const bounds = coordinates.reduce(
          (bounds, coord) => {
            bounds.extend(coord as maplibregl.LngLatLike)
            if (radiusMeters > 0) {
              const latDelta = radiusMeters / 111000
              const lngDelta = radiusMeters / (111000 * Math.cos((coord[1] * Math.PI) / 180))
              bounds.extend([coord[0] - lngDelta, coord[1] - latDelta] as maplibregl.LngLatLike)
              bounds.extend([coord[0] + lngDelta, coord[1] + latDelta] as maplibregl.LngLatLike)
            }
            return bounds
          },
          new maplibregl.LngLatBounds(
            coordinates[0] as maplibregl.LngLatLike,
            coordinates[0] as maplibregl.LngLatLike,
          ),
        )

        // Calculate max zoom with padding for multiple cities
        let maxZoom = 12
        if (hasEditedRadius && radiusMiles > 0 && coordinates.length > 0) {
          const firstCoord = coordinates[0]
          const container = currentMap.getContainer()
          const width = container?.clientWidth || 260
          const height = container?.clientHeight || 200
          maxZoom = calculateZoomForRadiusWithPadding(
            radiusMeters,
            firstCoord[1],
            width,
            height,
          )
        }

        currentMap.fitBounds(bounds, {
          padding: 60,
          maxZoom: maxZoom,
        })

        // Create circles after fitBounds completes
        let circlesCreated = false
        const onIdle = () => {
          if (!circlesCreated) {
            circlesCreated = true
            createCircles()
          }
          currentMap.off('idle', onIdle)
        }
        currentMap.once('idle', onIdle)
        
        // Fallback for multiple cities too
        setTimeout(() => {
          if (!circlesCreated) {
            circlesCreated = true
            createCircles()
          }
          isUpdatingRef.current = false
        }, 500)
      }
    }

    if (currentMap.loaded()) {
      executeUpdate()
    } else {
      currentMap.once('load', executeUpdate)
    }

    // Cleanup
    return () => {
      // Don't clean up here - let the next effect handle it
      // This prevents race conditions
    }
  }, [selectedCities, radiusMiles, hasEditedRadius])

  return (
    <div
      ref={mapContainer}
      className="w-full h-full"
      style={{
        minHeight: '200px',
        width: '100%',
        height: '100%',
      }}
      data-testid="location-map"
    />
  )
}
