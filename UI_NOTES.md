# UI Design Notes — Cycle Price Configurator

## Design Goals

- **Speed**: Salesperson needs quotes in under 30 seconds
- **Clarity**: Breakdown must be obvious to explain to customers
- **Safety**: Prevent invalid part combinations without friction

---

## Answer to Core Questions

### 1. What is the Most Important Thing on the Configurator Screen?

**The Price Breakdown — Not the Form**

A salesperson's job is to quote prices accurately. The form is just a means to that end. Therefore:

- The price breakdown should be **prominent, large, and updated in real-time**
- Component breakdown (Frame ₹X, Wheels ₹Y, etc.) matters more than individual part details
- Total price should be **highlighted in color** (e.g., larger font, contrasting background)

**Layout:** 50% left side (form), 50% right side (live breakdown)

---

### 2. Fast & Easy for 20+ Uses Per Day

**Optimization 1: Pre-selected Defaults**

- When page loads, select the most popular/standard configuration (e.g., "Steel frame, standard handlebar, basic saddle, standard wheels, 4-gear")
- Shows an instant quote without any clicks
- Salesperson can modify from there

**Optimization 2: Component Tabs (Not Scrolling)**

- Organize parts into 5 tabs (Frame, Handle Bar & Brakes, Seating, Wheels, Chain Assembly)
- Only one tab visible at a time
- Quick navigation between components

**Optimization 3: Date Picker with Smart Defaults**

- Default to "2016-12-15" (standard test date)
- Salesperson can change to query prices on different dates
- Prices update automatically when date changes

**Optimization 4: Quantity Controls**

- Easy +/− buttons for each part to increase/decrease quantity
- Allows selecting multiple units of same part
- Max quantity per item: 999
- Max total parts: 10,000

---

### 3. Handling Invalid Combinations

**Problem Scenario:**

- Salesperson selects "Tubeless Tyre" but no Rim is selected
- System must warn and prevent invalid calculations

**Our Approach: Real-Time Validation with Clear Feedback**

**Warning Types:**

1. **ERRORS (Red) - Block Calculation**

   ```
   ❌ INVALID COMBINATION: Tubeless Tyre cannot be used with Inner Tube.
      Tubeless setup requires NO tube.
   ```

   - Prevents clicking Calculate button
   - Shows suggestions to fix

2. **WARNINGS (Yellow) - Informational Only**

   ```
   ⚠️ Tubeless Tyre selected but no Rim. Consider adding Rim for complete wheel assembly.
   ```

   - Allows calculation to proceed
   - Informs salesperson of incomplete setup
   - User can choose to proceed if they want

**Key UX Principles:**

1. **Don't block silently** — Show WHY the combo is invalid
2. **Offer a fix** — Provide clear suggestions
3. **Distinguish severity** — Errors (blocking) vs Warnings (informational)
4. **Visual feedback** — Red for errors, yellow for warnings
5. **Real-time validation** — Updates as user selects/deselects parts

**Example States:**

- ✓ Valid combination → Normal display, can calculate
- ⚠️ Warning (incomplete setup) → Yellow alert, can still calculate
- 🚫 Error (incompatible parts) → Red alert, cannot calculate
- 💡 Suggestion provided → Clear fix offered to salesperson

**Compatibility Rules Implemented:**

1. **Tubeless Tyre + Inner Tube = ERROR** (mutually exclusive)
2. **Tubeless Tyre without Rim = WARNING** (incomplete)
3. **Standard Tyre without Rim = WARNING** (incomplete)
4. **Standard Tyre without Tube = WARNING** (incomplete)
5. **No wheel components selected = WARNING** (incomplete)

---

### 4. One Thing We Would Improve (If More Time)

**Multi-Cycle Quote Comparison**

**Current State:** Salesperson configures one cycle at a time.

**Improvement:** "Create multiple quotes side-by-side"

- Compare prices: Standard bike vs Premium bike
- Show cost delta: "Premium config costs ₹2,100 more"
- Export as PDF: Sales rep sends to customer

**Why Important?** Real-world scenario — customer asks "what if I upgraded to disc brakes?" Salesperson needs to compare instant, not reconfigure.

**Time Investment:** 1–2 hours (new UI layout, comparison logic)

---

## Screen Layout Description

### Main Configurator Screen

```
┌─────────────────────────────────────────────────────────────┐
│ Hero Cycles — Price Configurator                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  LEFT (50%)              │  RIGHT (50%)                      │
│  ──────────────────────  │  ──────────────────────────────  │
│                          │                                   │
│  [Date Picker]           │  📋 PRICE BREAKDOWN               │
│  📅 15 Dec 2016          │  ─────────────────────────────   │
│                          │                                   │
│  ⚠️ [Warning Box]        │  Frame          ₹1,200            │
│  Tubeless Tyre selected  │  Handle Bar     ₹850              │
│  but no Rim. Consider    │  Seating        ₹400              │
│  adding Rim...           │  Wheels         ₹1,580            │
│                          │  Chain          ₹950              │
│  [Tabs]                  │                                   │
│  ┌────┬──────┬────┬──┬──┐ │  ─────────────────────────────   │
│  │FRM │BRAKE │SEAT│WHL│CH│ │  TOTAL          ₹5,980            │
│  └────┴──────┴────┴──┴──┘ │                                   │
│                          │  [Calculate] [Reset]              │
│  [Frame]                 │                                   │
│  ☑ Steel Frame ₹1,850   │                                   │
│    [−] 1 [+]             │                                   │
│                          │                                   │
│  ☐ Aluminium ₹2,000     │                                   │
│    [−] 1 [+]             │                                   │
│                          │                                   │
│  [Calculate Price]       │                                   │
│  [Reset All]             │                                   │
│                          │                                   │
└─────────────────────────────────────────────────────────────┘
```

### Key Features Shown

1. **Top-left**: Date selection (default: 2016-12-15)
2. **Warning/Error Box**: Real-time validation messages
3. **Tab navigation**: Quick switching between 5 components
4. **Part selection**: Checkboxes for multiple selections
5. **Price display**: ₹ price shown next to each part
6. **Quantity controls**: +/− buttons for easy quantity adjustment
7. **Right panel**: Live price breakdown with component subtotals
8. **Action buttons**: Calculate Price and Reset All

---

## Implementation Features

### Real-Time Validation

- ✅ Errors (red) block calculation
- ✅ Warnings (yellow) allow calculation
- ✅ Suggestions provided for each issue
- ✅ Updates instantly as user selects/deselects parts

### Multiple Selections

- ✅ Checkboxes instead of radio buttons
- ✅ Can select 2+ of same part
- ✅ Quantity shown with +/− buttons
- ✅ Max 999 per item, 10,000 total

### Time-Sensitive Pricing

- ✅ All parts show prices for selected date
- ✅ Date change updates all prices automatically
- ✅ Historical data from 2016-2026 available
- ✅ Prices display beside each part name

### Price Breakdown

- ✅ Grouped by component (Frame, Wheels, etc.)
- ✅ Shows individual part prices with quantities
- ✅ Component subtotals
- ✅ Grand total highlighted
- ✅ ₹ formatting with comma separators

---

## Accessibility Notes

- ✓ Color is not the only indicator (use icons + text)
- ✓ Tab order follows logical flow (date → components → summary)
- ✓ All buttons have clear labels
- ✓ Warning messages use plain language, not jargon
- ✓ Error messages in red, warnings in yellow
- ✓ Clear visual distinction between severity levels

---

## Testing Criteria

When testing with actual salespeople, validate:

- Can they configure a cycle in under 30 seconds? ✓
- Do they understand why a combination is invalid? ✓
- Is the price breakdown clear enough to quote to a customer? ✓
- Can they easily adjust quantities and dates? ✓
- Do warnings help without blocking their workflow? ✓
- Is the real-time validation helpful? ✓
