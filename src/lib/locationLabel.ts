import type { City } from '@/data/types'

/**
 * Type for a function that measures the pixel width of a text string.
 * Injected as a dependency for deterministic testing.
 */
export type MeasureTextFn = (text: string) => number

/**
 * Compute the location label displayed in the header trigger.
 *
 * Formatting rules (Sprint 1 spec):
 * 1. Empty selectedCities -> "Select location"
 * 2. One city -> city name
 * 3. Multiple cities -> comma-separated in selection order
 * 4. If measured width > maxWidthPx, use overflow fallback:
 *    "firstCity, {n} more"
 * 5. Radius suffix only when hasEditedRadius is true:
 *    " ± {radiusMiles} mi"
 */
export function computeHeaderLocationLabel(
  selectedCities: City[],
  radiusMiles: number,
  hasEditedRadius: boolean,
  maxWidthPx: number,
  measureText: MeasureTextFn,
): string {
  if (selectedCities.length === 0) {
    return 'select location'
  }

  const radiusSuffix = hasEditedRadius ? ` ± ${radiusMiles} mi` : ''

  // Build the full label from all city names
  const fullList = selectedCities.map((c) => c.name).join(', ')
  const fullLabel = fullList + radiusSuffix

  // If it fits, return the full label
  if (measureText(fullLabel) <= maxWidthPx) {
    return fullLabel
  }

  // Overflow fallback: "firstCity, {n} more"
  if (selectedCities.length > 1) {
    const remaining = selectedCities.length - 1
    const overflowLabel =
      `${selectedCities[0].name}, ${remaining} more` + radiusSuffix
    return overflowLabel
  }

  // Single city that overflows: just return with suffix anyway (best effort)
  return fullLabel
}

/**
 * Production helper: creates a measureText function backed by a canvas context.
 * The font string matches the header location label typography from the design system:
 * Open Sans 16px (type.body).
 */
export function createCanvasMeasureText(
  font: string = '16px "Open Sans", sans-serif',
): MeasureTextFn {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    // Fallback: rough estimate at ~8px per character
    return (text: string) => text.length * 8
  }
  ctx.font = font

  return (text: string): number => {
    return ctx.measureText(text).width
  }
}
