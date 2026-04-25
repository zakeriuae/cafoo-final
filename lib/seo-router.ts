/**
 * Valid transaction types in the system
 */
export const VALID_TRANSACTIONS = ["for-sale", "for-rent", "off-plan"] as const;
export type TransactionType = typeof VALID_TRANSACTIONS[number];

/**
 * Valid property types in the system
 */
export const VALID_PROPERTY_TYPES = [
  "property", // generic
  "apartment", 
  "villa", 
  "townhouse", 
  "penthouse", 
  "commercial"
] as const;
export type PropertyType = typeof VALID_PROPERTY_TYPES[number];

/**
 * Converts any string to a URL-safe slug.
 */
export function generateSlug(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD') // separate accent from letter
    .replace(/[\u0300-\u036f]/g, '') // remove fractional
    .replace(/\s+/g, '-') // replace spaces with -
    .replace(/[^\w\-]+/g, '') // remove all non-word chars
    .replace(/\-\-+/g, '-'); // replace multiple - with single -
}

export interface SeoRouteParams {
  transactionType: TransactionType | string;
  propertyType: PropertyType | string;
  city?: string;
  area?: string;
  project?: string;
  unit?: string;
}

/**
 * Builds an SEO-friendly URL based on the hierarchical structure.
 */
export function buildSeoUrl(params: SeoRouteParams, locale: string = 'en'): string {
  const parts = [
    '', // leading slash
    locale,
    params.transactionType,
    params.propertyType,
  ];

  if (params.city) {
    parts.push(generateSlug(params.city));
    if (params.area) {
      parts.push(generateSlug(params.area));
      if (params.project) {
        parts.push(generateSlug(params.project));
        if (params.unit) {
          parts.push(generateSlug(params.unit));
        }
      }
    }
  }

  return parts.join('/');
}

/**
 * Parses a path array into the hierarchical structure.
 */
export function parseSeoRoute(
  transactionType: string, 
  propertyType: string, 
  slugArray: string[] = []
): SeoRouteParams | null {
  // Validate first two segments
  if (!VALID_TRANSACTIONS.includes(transactionType as any)) return null;
  if (!VALID_PROPERTY_TYPES.includes(propertyType as any)) return null;

  return {
    transactionType: transactionType as TransactionType,
    propertyType: propertyType as PropertyType,
    city: slugArray[0] || undefined,
    area: slugArray[1] || undefined,
    project: slugArray[2] || undefined,
    unit: slugArray[3] || undefined,
  };
}
