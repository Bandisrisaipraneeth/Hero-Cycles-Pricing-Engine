import { PricingEngine } from "../src/core/pricing-engine";
import { Part, ComponentType } from "../src/core/types";

describe("PricingEngine", () => {
  let engine: PricingEngine;
  let parts: Part[];

  beforeEach(() => {
    parts = [
      {
        id: "steel_frame",
        name: "Steel Frame",
        component: ComponentType.FRAME,
        priceHistory: [
          {
            validFrom: new Date("2016-01-01"),
            validUntil: null,
            price: 1200,
          },
        ],
      },
      {
        id: "tubeless_tyre",
        name: "Tubeless Tyre",
        component: ComponentType.WHEELS,
        priceHistory: [
          {
            validFrom: new Date("2016-01-01"),
            validUntil: new Date("2016-11-30"),
            price: 200,
          },
          {
            validFrom: new Date("2016-12-01"),
            validUntil: null,
            price: 230,
          },
        ],
      },
      {
        id: "standard_rim",
        name: "Standard Rim",
        component: ComponentType.WHEELS,
        priceHistory: [
          {
            validFrom: new Date("2016-01-01"),
            validUntil: null,
            price: 400,
          },
        ],
      },
      {
        id: "tube",
        name: "Inner Tube",
        component: ComponentType.WHEELS,
        priceHistory: [
          {
            validFrom: new Date("2016-01-01"),
            validUntil: null,
            price: 120,
          },
        ],
      },
    ];

    engine = new PricingEngine(parts);
  });

  describe("Time-Sensitive Pricing", () => {
    test("should return correct price before date transition", () => {
      const price = engine.getPriceForPart(
        "tubeless_tyre",
        new Date("2016-06-15"),
      );
      expect(price).toBe(200);
    });

    test("should return correct price after date transition", () => {
      const price = engine.getPriceForPart(
        "tubeless_tyre",
        new Date("2016-12-15"),
      );
      expect(price).toBe(230);
    });

    test("should fail for date before any price entry", () => {
      expect(() => {
        engine.getPriceForPart("tubeless_tyre", new Date("2015-12-31"));
      }).toThrow("No price found");
    });

    test("should return exact price on transition date", () => {
      const price = engine.getPriceForPart(
        "tubeless_tyre",
        new Date("2016-12-01"),
      );
      expect(price).toBe(230);
    });
  });

  describe("Price Breakdown", () => {
    test("should calculate correct breakdown for single component", () => {
      const breakdown = engine.calculateBreakdown(
        ["steel_frame"],
        new Date("2016-12-15"),
      );
      expect(breakdown.breakdown.get(ComponentType.FRAME)).toBe(1200);
      expect(breakdown.totalPrice).toBe(1200);
    });

    test("should group multiple parts by component", () => {
      const breakdown = engine.calculateBreakdown(
        ["steel_frame", "tubeless_tyre", "standard_rim"],
        new Date("2016-12-15"),
      );

      expect(breakdown.breakdown.get(ComponentType.FRAME)).toBe(1200);
      // tyre (230) + rim (400) = 630
      expect(breakdown.breakdown.get(ComponentType.WHEELS)).toBe(630);
      // 1200 + 630 = 1830
      expect(breakdown.totalPrice).toBe(1830);
    });

    test("should use correct historical prices in breakdown", () => {
      const breakdown1 = engine.calculateBreakdown(
        ["tubeless_tyre", "standard_rim"],
        new Date("2016-06-15"),
      );
      // June 2016: tyre (200) + rim (400) = 600
      expect(breakdown1.breakdown.get(ComponentType.WHEELS)).toBe(600);
      expect(breakdown1.totalPrice).toBe(600);

      const breakdown2 = engine.calculateBreakdown(
        ["tubeless_tyre", "standard_rim"],
        new Date("2016-12-15"),
      );
      // Dec 2016: tyre (230) + rim (400) = 630
      expect(breakdown2.breakdown.get(ComponentType.WHEELS)).toBe(630);
      expect(breakdown2.totalPrice).toBe(630);
    });

    test("should handle multiple quantities of same part", () => {
      const breakdown = engine.calculateBreakdown(
        ["steel_frame", "steel_frame", "steel_frame"],
        new Date("2016-12-15"),
      );
      // 3x ₹1200 = ₹3600
      expect(breakdown.breakdown.get(ComponentType.FRAME)).toBe(3600);
      expect(breakdown.totalPrice).toBe(3600);

      // Check details include quantity
      const frameDetail = breakdown.details.find(
        (d) => d.partId === "steel_frame",
      );
      expect(frameDetail?.quantity).toBe(3);
      expect(frameDetail?.totalPrice).toBe(3600);
    });
  });

  describe("Validation", () => {
    test("should identify invalid part combinations (tubeless + tube)", () => {
      const validation = engine.validateConfiguration([
        "tubeless_tyre",
        "tube",
      ]);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.errors[0]).toContain("INVALID COMBINATION");
    });

    test("should allow valid part combinations", () => {
      const validation = engine.validateConfiguration([
        "steel_frame",
        "standard_rim",
      ]);
      expect(validation.isValid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });

    test("should warn about incomplete tubeless setup without rim", () => {
      const validation = engine.validateConfiguration(["tubeless_tyre"]);
      expect(validation.warnings.length).toBeGreaterThan(0);
      expect(validation.warnings[0]).toContain("no Rim");
    });

    test("should warn about incomplete standard tyre setup without rim", () => {
      const validation = engine.validateConfiguration([
        "tubeless_tyre",
        "steel_frame",
      ]);
      expect(validation.warnings.length).toBeGreaterThan(0);
    });

    test("should provide suggestions for fixing issues", () => {
      const validation = engine.validateConfiguration([
        "tubeless_tyre",
        "tube",
      ]);
      expect(validation.suggestions.length).toBeGreaterThan(0);
      expect(validation.suggestions[0].fix).toBeDefined();
    });

    test("should handle non-existent parts gracefully", () => {
      const validation = engine.validateConfiguration(["non_existent_part"]);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });
  });
});
