import {
  Part,
  ComponentType,
  PriceEntry,
  PriceBreakdownResult,
  BreakdownDetail,
} from "./types";

export class PricingEngine {
  private parts: Map<string, Part>;

  constructor(parts: Part[]) {
    this.parts = new Map();
    parts.forEach((part) => {
      part.priceHistory.sort(
        (a, b) =>
          new Date(a.validFrom).getTime() - new Date(b.validFrom).getTime(),
      );
      this.parts.set(part.id, part);
    });
  }

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

  calculateBreakdown(partIds: string[], date: Date): PriceBreakdownResult {
    const breakdown = new Map<ComponentType, number>();
    const details: BreakdownDetail[] = [];

    Object.values(ComponentType).forEach((component) => {
      breakdown.set(component as ComponentType, 0);
    });

    // Group parts by ID to count quantities
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

      const currentTotal = breakdown.get(part.component) || 0;
      breakdown.set(part.component, currentTotal + totalPrice);

      details.push({
        partId,
        partName: part.name,
        component: part.component,
        price: unitPrice,
        quantity,
        totalPrice,
      });
    });

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

  validateConfiguration(partIds: string[]): {
    isValid: boolean;
    warnings: string[];
    errors: string[];
    suggestions: Array<{ issue: string; fix: string; autoFix?: boolean }>;
  } {
    const warnings: string[] = [];
    const errors: string[] = [];
    const suggestions: Array<{
      issue: string;
      fix: string;
      autoFix?: boolean;
    }> = [];

    // Check if parts exist
    for (const partId of partIds) {
      if (!this.parts.has(partId)) {
        errors.push(`Part not found: ${partId}`);
      }
    }

    // ONLY CHECK WHEELS COMPATIBILITY - Ignore other components
    const hasTubelessTyre = partIds.includes("tubeless_tyre");
    const hasStandardTyre = partIds.includes("standard_tyre");
    const hasRim = partIds.includes("rim");
    const hasTube = partIds.includes("tube");

    // Only validate if ANY wheel component is selected
    const wheelParts = [
      "rim",
      "tube",
      "standard_tyre",
      "tubeless_tyre",
      "spokes",
    ];
    const hasAnyWheelPart = wheelParts.some((part) => partIds.includes(part));

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

    // Rule 2: Tubeless tyre should have rim (WARNING ONLY - only if tubeless tyre is selected)
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

    // Rule 3: Standard tyre should have rim (WARNING ONLY - only if standard tyre is selected)
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

    // Rule 4: Standard tyre should have tube (WARNING ONLY - only if standard tyre is selected)
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

    // Rule 5: No wheel components selected (WARNING ONLY - only show if some wheel part was selected)
    if (hasAnyWheelPart) {
      // Only warn about missing components if at least one wheel part is selected
      if (!hasRim && (hasTubelessTyre || hasStandardTyre || hasTube)) {
        // Already covered by rules 2 and 3
      } else if (
        !hasRim &&
        !hasTubelessTyre &&
        !hasStandardTyre &&
        hasAnyWheelPart
      ) {
        warnings.push(
          "No wheel components selected. You need at least a Rim and Tyre.",
        );
      }
    }

    return {
      isValid: errors.length === 0,
      warnings,
      errors,
      suggestions,
    };
  }

  private findApplicablePrice(
    priceHistory: PriceEntry[],
    queryDate: Date,
  ): PriceEntry | null {
    let applicable: PriceEntry | null = null;

    for (const entry of priceHistory) {
      const validFrom = new Date(entry.validFrom);

      if (validFrom > queryDate) {
        break;
      }

      if (entry.validUntil) {
        const validUntil = new Date(entry.validUntil);
        if (queryDate > validUntil) {
          continue;
        }
      }

      applicable = entry;
    }

    return applicable;
  }
}
