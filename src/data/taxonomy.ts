import type { TaxonomyData } from './types'
import rawTaxonomy from '../../craigslist_taxonomy.json'

/**
 * Taxonomy data imported from the repo-root JSON file.
 * Do not modify the JSON in Sprint 1.
 */
export const taxonomy: TaxonomyData = rawTaxonomy as TaxonomyData
