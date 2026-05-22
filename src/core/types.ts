export enum ComponentType {
  FRAME = "FRAME",
  HANDLEBAR_BRAKES = "HANDLEBAR_BRAKES",
  SEATING = "SEATING",
  WHEELS = "WHEELS",
  CHAIN_ASSEMBLY = "CHAIN_ASSEMBLY",
}

export interface PriceEntry {
  validFrom: Date;
  validUntil: Date | null;
  price: number;
  reason?: string;
}

export interface Part {
  id: string;
  name: string;
  component: ComponentType;
  description?: string;
  priceHistory: PriceEntry[];
  compatibility?: string[];
  compatibilityNotes?: string;
}

export interface Component {
  id: ComponentType;
  name: string;
  description?: string;
}

export interface CycleConfiguration {
  date: Date;
  partIds: string[];
  priceBreakdown?: Map<ComponentType, number>;
  totalPrice?: number;
  isValid?: boolean;
  validationWarnings?: string[];
}

export interface PriceBreakdownResult {
  date: Date;
  breakdown: Map<ComponentType, number>;
  totalPrice: number;
  details: BreakdownDetail[];
}

export interface BreakdownDetail {
  partId: string;
  partName: string;
  component: ComponentType;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface PricingRequest {
  date: string;
  parts: string[];
}

export interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
  suggestions: Array<{ issue: string; fix: string; autoFix?: boolean }>;
}
