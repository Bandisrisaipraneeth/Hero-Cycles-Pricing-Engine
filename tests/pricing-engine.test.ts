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
  });

  describe("Validation", () => {
    test("should identify invalid part combinations", () => {
      const validation = engine.validateConfiguration([
        "tubeless_tyre",
        "standard_rim",
      ]);
      expect(validation.isValid).toBe(false);
      expect(validation.warnings.length).toBeGreaterThan(0);
    });

    test("should allow valid part combinations", () => {
      const validation = engine.validateConfiguration([
        "steel_frame",
        "standard_rim",
      ]);
      expect(validation.isValid).toBe(true);
      expect(validation.warnings.length).toBe(0);
    });
  });
});
