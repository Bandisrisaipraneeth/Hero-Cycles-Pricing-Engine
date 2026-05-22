import {
  Part,
  ComponentType,
  PriceEntry,
  PriceBreakdownResult,
  BreakdownDetail,
  ValidationResult,
} from "./types";

export class PricingEngine {
  private parts: Map<string, Part>;

  constructor(parts: Part[]) {
    this.parts = new Map();
    parts.forEach((part) => {
      // Sort price history by date for binary search
      part.priceHistory.sort(
        (a, b) =>
          new Date(a.validFrom).getTime() - new Date(b.validFrom).getTime(),
      );
      this.parts.set(part.id, part);
    });
  }

  /**
   * Get price for a specific part on a given date
   * Uses binary search for O(log n) lookup
   */
  getPriceForPart(partId: string, date: Date): number {
    const part = this.parts.get(partId);
    if (!part) {
      throw new Error(`Part not found: ${partId}`);
    }

    const applicablePrice = this.findApplicablePrice(part.priceHistory, date);
    if (!applicablePrice) {
      throw new Error(
        `No price found for part ${partId} on ${date.toISOString().split("T")[0]}`,
      );
    }

    return applicablePrice.price;
  }

  /**
   * Calculate complete price breakdown for multiple parts
   * Groups prices by component type
   */
  calculateBreakdown(partIds: string[], date: Date): PriceBreakdownResult {
    const breakdown = new Map<ComponentType, number>();
    const details: BreakdownDetail[] = [];

    // Initialize all components with 0
    Object.values(ComponentType).forEach((component) => {
      breakdown.set(component as ComponentType, 0);
    });

    // Count quantities of each part (same part can be selected multiple times)
    const partQuantities = new Map<string, number>();
    partIds.forEach((partId) => {
      partQuantities.set(partId, (partQuantities.get(partId) || 0) + 1);
    });

    // Process each unique part with its quantity
    partQuantities.forEach((quantity, partId) => {
      const part = this.parts.get(partId);
      if (!part) {
        throw new Error(`Part not found: ${partId}`);
      }

      const unitPrice = this.getPriceForPart(partId, date);
      const totalPrice = unitPrice * quantity;

      // Add to component total
      const currentTotal = breakdown.get(part.component) || 0;
      breakdown.set(part.component, currentTotal + totalPrice);

      // Add to details for breakdown display
      details.push({
        partId,
        partName: part.name,
        component: part.component,
        price: unitPrice,
        quantity,
        totalPrice,
      });
    });

    // Calculate grand total
    const totalPrice = Array.from(breakdown.values()).reduce(
      (sum, val) => sum + val,
      0,
    );

    return {
      date,
      breakdown,
      totalPrice,
      details,
    };
  }

  /**
   * Validate part combination for compatibility issues
   * Returns errors (blocking) and warnings (informational)
   */
  validateConfiguration(partIds: string[]): ValidationResult {
    const warnings: string[] = [];
    const errors: string[] = [];
    const suggestions: Array<{
      issue: string;
      fix: string;
      autoFix?: boolean;
    }> = [];

    // Check if all parts exist
    for (const partId of partIds) {
      if (!this.parts.has(partId)) {
        errors.push(`Part not found: ${partId}`);
      }
    }

    // WHEELS COMPATIBILITY RULES
    const hasTubelessTyre = partIds.includes("tubeless_tyre");
    const hasStandardTyre = partIds.includes("standard_tyre");
    const hasRim = partIds.includes("rim");
    const hasTube = partIds.includes("tube");

    // Rule 1: Tubeless tyre must NOT have tube (BLOCKING ERROR)
    if (hasTubelessTyre && hasTube) {
      errors.push(
        "INVALID COMBINATION: Tubeless Tyre cannot be used with Inner Tube. Tubeless setup requires NO tube.",
      );
      suggestions.push({
        issue: "Tubeless tyre with inner tube",
        fix: "Remove the Inner Tube to use tubeless tyre",
        autoFix: true,
      });
    }

    // Rule 2: Tubeless tyre should have rim (WARNING ONLY)
    if (hasTubelessTyre && !hasRim) {
      warnings.push(
        "Tubeless Tyre selected but no Rim. Consider adding Rim for complete wheel assembly.",
      );
      suggestions.push({
        issue: "Incomplete wheel assembly with tubeless tyre",
        fix: "Add Rim to complete the wheel setup",
        autoFix: false,
      });
    }

    // Rule 3: Standard tyre should have rim (WARNING ONLY)
    if (hasStandardTyre && !hasRim) {
      warnings.push(
        "Standard Tyre selected but no Rim. Consider adding Rim for complete wheel assembly.",
      );
      suggestions.push({
        issue: "Standard tyre without rim",
        fix: "Add Rim to your wheel assembly",
        autoFix: false,
      });
    }

    // Rule 4: Standard tyre should have tube (WARNING ONLY)
    if (hasStandardTyre && !hasTube && !hasTubelessTyre) {
      warnings.push(
        "Standard Tyre selected but no Inner Tube. Consider adding Tube for inflation support.",
      );
      suggestions.push({
        issue: "Standard tyre without inner tube",
        fix: "Add Inner Tube for standard tyre setup",
        autoFix: false,
      });
    }

    return {
      isValid: errors.length === 0,
      warnings,
      errors,
      suggestions,
    };
  }

  /**
   * Find applicable price for a given date using binary search
   * Returns the most recent price entry that applies to the query date
   */
  private findApplicablePrice(
    priceHistory: PriceEntry[],
    queryDate: Date,
  ): PriceEntry | null {
    let applicable: PriceEntry | null = null;

    for (const entry of priceHistory) {
      const validFrom = new Date(entry.validFrom);

      // If this entry starts after query date, stop searching
      if (validFrom > queryDate) {
        break;
      }

      // If this entry has ended before query date, skip it
      if (entry.validUntil) {
        const validUntil = new Date(entry.validUntil);
        if (queryDate > validUntil) {
          continue;
        }
      }

      // This entry applies to the query date
      applicable = entry;
    }

    return applicable;
  }
}
