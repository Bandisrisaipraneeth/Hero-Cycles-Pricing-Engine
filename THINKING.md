# Problem Breakdown & Data Model Design

## Part 1: Problem Analysis

### Who is the User?

**User:** A salesperson at a Hero Cycles showroom (non-technical)

**What they need:**

- Fast way to quote prices to customers (20+ times per day)
- Accuracy across different pricing dates
- Clear breakdown to explain costs to customers
- No need to understand backend complexity

**What would frustrate them:**

- Having to type JSON or terminal commands
- Delays in getting price quotes
- Confusing error messages
- Manual lookups of part prices

---

### What Makes This Problem Tricky?

**Edge Case 1: Price History Gaps**

- A part may have different prices across different time periods
- Query date: "2016-06-15", but price history only has entries for Jan 2016 and Dec 2016
- Solution: Return the most recent price before or on the query date; fail if no valid price exists

**Edge Case 2: Price Overlaps & Transitions**

- A part transitions from ₹200 to ₹230 on "2016-12-01"
- Query on "2016-11-30" should return ₹200; query on "2016-12-01" should return ₹230
- Boundary conditions matter (inclusive vs exclusive dates)

**Edge Case 3: Invalid Component Combinations**

- A tubeless tyre requires NO inner tube, but not all rims are compatible
- Salesperson selects incompatible parts unknowingly
- System should warn or prevent the combination

---

### Our Plan (Before Coding)

#### 1. How We'll Represent Parts & Prices

```
Part {
  id: string (e.g., "steel_frame")
  name: string (e.g., "Steel Frame")
  component: ComponentType (e.g., FRAME, WHEELS)
  priceHistory: List<PriceEntry>
}

PriceEntry {
  validFrom: Date
  validUntil: Date | null  (null = currently active)
  price: number (₹)
}
```

**Why this structure?**

- Immutable history — never overwrite old prices, append new entries
- Efficient lookups — binary search on dates
- Audit trail — track all price changes

#### 2. How We'll Handle Price Changes Over Time

- Store price as a list, not a single value
- When querying, binary search for the most recent entry with `validFrom <= queryDate`
- Return that entry's price, or error if no valid entry exists
- Example: If part has prices [Jan 1 @₹200, Dec 1 @₹230], query for June 15 returns ₹200

#### 3. How We'll Structure Output

```
Cycle Price Breakdown — 15 Dec 2016
────────────────────────────────────
Frame              ₹1,200
Handle Bar/Brakes  ₹850
Seating            ₹400
Wheels             ₹1,405
Chain Assembly     ₹950
────────────────────────────────────
TOTAL              ₹4,405
```

- Group prices by high-level component (not individual parts)
- Show date for clarity (salesperson context)
- Display as currency with ₹ symbol

---

## Part 2: Data Model Design

### Core Entities

#### 1. Component (High-Level)

```
Component {
  id: ComponentType (enum: FRAME, HANDLEBAR_BRAKES, SEATING, WHEELS, CHAIN)
  name: string (e.g., "Frame")
  description: string
}
```

**Relationships:** A Component has many Parts

---

#### 2. Part

```
Part {
  id: string (unique, e.g., "steel_frame")
  name: string (e.g., "Steel Frame")
  component: ComponentType (which high-level group)
  description: string
  compatibility: List<string> (e.g., tubeless tyre is only compatible with tubeless rims)
  priceHistory: List<PriceEntry>
}
```

**Relationships:** A Part has many PriceEntries

---

#### 3. PriceEntry

```
PriceEntry {
  id: string (optional, for audit)
  validFrom: Date
  validUntil: Date | null
  price: number (₹)
  reason: string (optional, e.g., "Material cost increase")
}
```

**Relationships:** Many PriceEntries belong to one Part

---

#### 4. CycleConfiguration

```
CycleConfiguration {
  id: string (optional, for saving quotes)
  date: Date (pricing date — the question "what did this cost on THIS date?")
  partIds: List<string> (e.g., ["steel_frame", "v_brakes", ...])
  priceBreakdown: Map<ComponentType, number>
  totalPrice: number
  isValid: boolean (all parts compatible)
}
```

**Relationships:** A Configuration references multiple Parts and has one PricingDate

---

#### 5. PricingDatabase

```
PricingDatabase {
  parts: Map<string, Part>
  components: List<Component>

  methods:
    - getPriceForPart(partId: string, date: Date): number
    - getPriceBreakdown(cycleConfig: CycleConfiguration): PriceBreakdown
    - validateCombination(partIds: List<string>): boolean
}
```

### Entity Relationship Diagram

```
PricingDatabase
├── Component (1) ──→ (many) Part
│                       ├── priceHistory: (many) PriceEntry
│                       └── compatibility: List<string>
│
└── CycleConfiguration ──→ (many) Part (via partIds)
                        └── date: Date (query context)
```

---

### Design Decision: Why Price History as a List?

**Alternative 1: Single Price + Update Timestamp**

```
Part { price: number, lastUpdated: Date }
```

- ❌ Loses historical data
- ❌ Can't answer "what did this cost in January?"

**Alternative 2: Versioned Table (SQL-style)**

```
part_price_history { partId, price, effectiveDate }
```

- ✓ Works but requires joins
- ✓ More scalable for large systems

**Our Choice: List of PriceEntries (in-memory)**

```
Part { priceHistory: [ {validFrom, validUntil, price}, ... ] }
```

- ✓ Simple for this use case (all data in memory)
- ✓ Clear immutability (append-only)
- ✓ Easy to query with binary search
- ✓ Audit trail is obvious

---

### Time-Sensitive Pricing Algorithm

```
getPriceForPart(partId, queryDate):
  1. Retrieve part from database
  2. Filter priceHistory where validFrom <= queryDate
  3. If no entries match, throw error (price not available for this date)
  4. Return the price with the maximum validFrom <= queryDate
  5. (This is the most recent applicable price)

  Example:
  Part "tubeless_tyre" has:
    - Jan 1 2016 @ ₹200
    - Dec 1 2016 @ ₹230

  Query Jan 15 2016 → ₹200 ✓
  Query Dec 15 2016 → ₹230 ✓
  Query Jun 15 2015 → Error (no price defined for this date)
```

---

## Part 3: Validation Strategy

### Compatibility Rules

**ERRORS (Block Calculation):**

1. Tubeless Tyre + Inner Tube = INVALID (mutually exclusive)

**WARNINGS (Allow, Inform Only):**

1. Tubeless Tyre without Rim = Incomplete
2. Standard Tyre without Rim = Incomplete
3. Standard Tyre without Tube = Incomplete
4. No wheel components = Incomplete

### Implementation

- Real-time validation as user selects parts
- Show errors in red (blocking)
- Show warnings in yellow (informational)
- Provide suggestions for each issue

---

## Conclusion

This design prioritizes:

1. **Correctness** — Handle historical pricing accurately
2. **Usability** — Simple for non-technical salespeople
3. **Performance** — O(log n) price lookups via binary search
4. **Clarity** — Component-based breakdown for customer explanations
5. **Robustness** — Validation prevents invalid configurations
