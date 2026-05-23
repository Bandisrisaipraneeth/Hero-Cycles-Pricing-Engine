# UI Design Notes — Cycle Price Configurator

## Design Goals

- **Speed**: Salesperson needs quotes in under 30 seconds
- **Clarity**: Breakdown must be obvious to explain to customers
- **Safety**: Prevent invalid part combinations without friction

---

## Core UX Decisions

### 1. 50-50 Split Layout

**Left Panel (50%):**

- Date picker
- Component tabs
- Part selection with prices
- Quantity controls (+/-)
- Calculate and Reset buttons

**Right Panel (50%):**

- Price breakdown by component
- Component subtotals
- Grand total (highlighted)
- Real-time updates

**Why?** Salesperson can select parts on left while watching prices update on right.

---

### 2. Tab-Based Component Navigation

**5 Tabs:**

- Frame
- Handle Bar & Brakes
- Seating
- Wheels
- Chain Assembly

**Why?** Easier than scrolling through 23 parts at once. Salesperson clicks tab → sees 2-5 options → selects.

---

### 3. Checkboxes Instead of Radio Buttons

**Why?** Allow multiple selections of same part:

- "I want 2x Steel Frame and 3x Basic Saddle"
- Quantity controls (+/-) show how many

---

### 4. Real-Time Price Display

**Each part shows:** Name + Current Price (₹)

Example:

```
☑ Steel Frame          ₹1,850
  [−] 1 [+]

☐ Aluminium Frame      ₹2,000
  [−] 1 [+]
```

**Why?** Salesperson sees prices instantly. No surprises at calculation.

---

### 5. Validation: Two Levels

**ERRORS (Red, Blocking):**

```
🚫 INVALID COMBINATION: Tubeless Tyre cannot be used with Inner Tube.
   Tubeless setup requires NO tube.
```

- Cannot click "Calculate Price"
- Shows suggestions to fix

**WARNINGS (Yellow, Informational):**

```
⚠️ Tubeless Tyre selected but no Rim. Consider adding Rim for complete wheel assembly.
```

- Can still calculate
- Just alerts salesperson

---

### 6. Quantity Controls: +/- Buttons

**Why not text input?**

- Faster to click +/+ than type "3"
- No accidental typos
- Max/min enforced automatically
- Visual feedback (button disabled when unchecked)

---

## Component Breakdown Display

### Structure:

```
Frame
  └─ Steel Frame                1x ₹1,850 = ₹1,850
Frame Subtotal                            ₹1,850

Wheels
  └─ Rim                        1x ₹400 = ₹400
  └─ Tubeless Tyre             1x ₹395 = ₹395
  └─ Spokes                     1x ₹610 = ₹610
Wheels Subtotal                           ₹1,405

──────────────────────────────────────────
TOTAL                                     ₹4,255
```

**Why?** Shows exactly what salesperson quoted. Easy to explain to customer.

---

## Accessibility & Usability

✅ **Color + Icons** — Not just color for errors/warnings
✅ **Clear Labels** — All buttons have text labels
✅ **Logical Tab Order** — Date → Tabs → Parts → Calculate
✅ **Keyboard Support** — Tab through controls, Enter to calculate
✅ **Mobile Responsive** — Works on tablet/phone
✅ **Plain Language** — No jargon in error messages
✅ **Fast Feedback** — Real-time validation (no page reload)

---

## Interaction Flows

### Happy Path (Valid Configuration):

1. Select date → 2016-12-15
2. Click "Frame" tab → See 2 frames
3. Check "Steel Frame" → Price appears
4. Click "Wheels" tab → See 5 options
5. Check "Rim", "Tubeless Tyre", "Spokes" → Prices appear
6. Click "Chain Assembly" tab → Check "4-Gear" → Price appears
7. Click "Calculate Price" → Breakdown shows on right
8. Done! Salesperson can quote ₹4,255

**Time:** ~20 seconds

### Error Path (Invalid Combination):

1. Select "Tubeless Tyre" + "Inner Tube"
2. ⚠️ Yellow warning appears: "Tubeless Tyre selected but no Rim..."
3. Can still calculate (just a warning)
4. Click "Calculate Price"
5. ❌ Red error blocks it: "INVALID COMBINATION..."
6. Suggestion: "Remove Inner Tube"
7. Uncheck "Inner Tube"
8. Click "Calculate Price" again → Works

**Time:** ~30 seconds (includes fixing)

---

## Design System

### Colors:

- **Primary:** #667eea (Blue) — Active tabs, buttons, prices
- **Secondary:** #764ba2 (Purple) — Gradients
- **Success:** #4caf50 (Green) — Valid states
- **Warning:** #ffc107 (Amber) — Warnings only
- **Error:** #f5222d (Red) — Blocking errors
- **Background:** #f9f9f9 (Light gray) — Content areas

### Typography:

- **Header:** 32px, Bold
- **Section Titles:** 20px, Bold
- **Labels:** 14px, Medium
- **Body:** 13-14px, Regular
- **Prices:** 14-18px, Bold, Blue (#667eea)

### Spacing:

- Padding: 10-20px (sections), 8-12px (items)
- Gap: 8-12px between items
- Margin: 15-20px top/bottom

---

## Testing Criteria

When testing with actual salespeople, validate:

1. ✓ Can generate quote in <30 seconds?
2. ✓ Understand why combination is invalid?
3. ✓ Price breakdown clear enough for customer?
4. ✓ Easy to adjust quantities and dates?
5. ✓ Warnings help without blocking workflow?
6. ✓ Real-time validation helpful?
