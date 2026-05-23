/**
 * Core TypeScript types and interfaces for the Pricing Engine
 */

/**
 * High-level component categories
 */
export enum ComponentType {
  FRAME = "FRAME",
  HANDLEBAR_BRAKES = "HANDLEBAR_BRAKES",
  SEATING = "SEATING",
  WHEELS = "WHEELS",
  CHAIN_ASSEMBLY = "CHAIN_ASSEMBLY",
}

/**
 * Represents a price at a specific time period
 */
export interface PriceEntry {
  validFrom: Date;
  validUntil: Date | null; // null means "still current"
  price: number; // in ₹
  reason?: string; // optional: why the price changed
}

/**
 * Represents a single bicycle part (e.g., Steel Frame, V-Brakes)
 */
export interface Part {
  id: string; // unique identifier (e.g., "steel_frame")
  name: string; // display name
  component: ComponentType; // which high-level group
  description?: string;
  priceHistory: PriceEntry[]; // sorted by validFrom ascending
  compatibility?: string[]; // ids of parts this is compatible with (or required with)
  compatibilityNotes?: string; // notes about compatibility (e.g., "requires adapter")
}

/**
 * A high-level component group
 */
export interface Component {
  id: ComponentType;
  name: string; // display name (e.g., "Frame")
  description?: string;
}

/**
 * A single bicycle configuration and its pricing
 */
export interface CycleConfiguration {
  date: Date; // the date to calculate prices for
  partIds: string[]; // list of selected part IDs
  priceBreakdown?: Map<ComponentType, number>; // calculated breakdown
  totalPrice?: number; // calculated total
  isValid?: boolean; // are parts compatible?
  validationWarnings?: string[]; // any issues with the combination
}

/**
 * The price breakdown result
 */
export interface PriceBreakdownResult {
  date: Date;
  breakdown: Map<ComponentType, number>; // component → total price
  totalPrice: number;
  details: BreakdownDetail[]; // per-part details
}

/**
 * Details for a single part's contribution to breakdown
 */
export interface BreakdownDetail {
  partId: string;
  partName: string;
  component: ComponentType;
  price: number;
  quantity: number;
  totalPrice: number;
}

/**
 * Input format for command-line tool
 */
export interface PricingRequest {
  date: string; // ISO format: "2016-12-15"
  parts: string[]; // list of part IDs
}

/**
 * Validation result for a cycle configuration
 */
export interface ValidationResult {
  isValid: boolean; // overall validity
  warnings: string[]; // list of warning messages
  errors: string[]; // list of error messages
  suggestions: Array<{ issue: string; fix: string; autoFix?: boolean }>; // list of suggested fixes
}
