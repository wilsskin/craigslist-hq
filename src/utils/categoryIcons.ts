/**
 * Category icon resolver.
 *
 * Uses Vite's import.meta.glob to eagerly load all SVG icons from
 * src/assets/categories/ and provides a lookup by section + item slug.
 */

// Eagerly import all SVGs as URL strings (query: '?url' makes Vite return the asset URL)
const iconModules = import.meta.glob<string>(
  '@/assets/categories/**/*.svg',
  { eager: true, query: '?url', import: 'default' },
)

// Build a lookup map: "sectionFolder/filename" → resolved URL
// Path keys from Vite can be like "src/assets/categories/community/activities.svg" or with @ resolved
const iconMap: Record<string, string> = {}
for (const [rawPath, url] of Object.entries(iconModules)) {
  const path = rawPath.replace(/\?.*$/, '') // strip any ?url query from key
  const parts = path.split(/[/\\]/) // support both Unix and Windows paths
  const file = parts[parts.length - 1] || ''
  const folder = parts[parts.length - 2] || ''
  const filename = file.replace(/\.svg$/i, '')
  if (folder && filename) {
    iconMap[`${folder}/${filename}`] = url
  }
}

/**
 * Get the icon URL for a taxonomy item.
 *
 * @param sectionId - The section id from taxonomy (e.g. "community", "for_sale")
 * @param itemId - The item id from taxonomy (e.g. "community_activities")
 * @returns The resolved SVG URL, or undefined if no icon exists
 */
export function getCategoryIconUrl(
  sectionId: string,
  itemId: string,
): string | undefined {
  // Item IDs use a prefix that may differ from the section folder name.
  // e.g. item "forums_apple" belongs to section "discussion_forums"
  // e.g. item "forsale_antiques" belongs to section "for_sale"
  // Strip the prefix from itemId to get the slug
  const prefixMap: Record<string, string> = {
    community: 'community',
    services: 'services',
    discussion_forums: 'forums',
    housing: 'housing',
    for_sale: 'forsale',
    jobs: 'jobs',
    gigs: 'gigs',
    resumes: 'resumes',
    events: 'events',
  }

  const prefix = prefixMap[sectionId]
  if (!prefix) return undefined

  // Extract slug: "community_activities" -> "activities"
  // "forsale_auto_parts" -> "auto_parts"
  const slug = itemId.startsWith(`${prefix}_`)
    ? itemId.slice(prefix.length + 1)
    : itemId

  return iconMap[`${sectionId}/${slug}`]
}
