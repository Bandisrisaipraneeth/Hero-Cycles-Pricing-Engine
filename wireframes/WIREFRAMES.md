# Wireframes — Hero Cycles Price Configurator

## Overview

The cycle price configurator is a responsive web application with a clean 50-50 split layout:

- **Left Side**: Component selection, quantity controls, date picker, validation warnings
- **Right Side**: Real-time price breakdown with component subtotals

---

## Screen 1: Main Configurator Screen

```
┌─────────────────────────────────────────────────────────────────┐
│  🚴 Hero Cycles — Price Configurator                            │
│  Configure your bicycle and get instant pricing                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  LEFT PANEL (50%)           │  RIGHT PANEL (50%)                 │
│  ───────────────────────   │  ─────────────────────────────     │
│                             │                                     │
│  Pricing Date:              │  📋 PRICE BREAKDOWN                 │
│  [📅 15 Dec 2016]           │  ─────────────────────────────     │
│                             │                                     │
│  ⚠️ WARNINGS (if any)       │  Frame                              │
│  ┌─────────────────────┐   │    └─ Steel Frame ₹1,850            │
│  │ Tubeless Tyre       │   │    └─ Quantity: 1                   │
│  │ selected but no     │   │  Frame Subtotal    ₹1,850            │
│  │ Rim. Consider       │   │                                     │
│  │ adding Rim for      │   │  Handle Bar/Brakes                  │
│  │ complete wheel      │   │    └─ V-Brakes ₹350                │
│  │ assembly.           │   │    └─ Quantity: 1                   │
│  └─────────────────────┘   │  Subtotal          ₹350             │
│                             │                                     │
│  [TABS]                     │  Seating                            │
│  ┌────┬──────┬────┬───┬───┐ │    └─ Basic Saddle ₹300           │
│  │Fram│Brake │Seat│Whl│Chn│ │  Subtotal          ₹300            │
│  └────┴──────┴────┴───┴───┘ │                                     │
│                             │  Wheels                             │
│  [FRAME TAB - SELECTED]     │    └─ Rim ₹400                     │
│  ☑ Steel Frame      ₹1,850  │    └─ Quantity: 1                   │
│    [−] 1 [+]                │    └─ Tubeless Tyre ₹395           │
│                             │    └─ Quantity: 1                   │
│  ☐ Aluminium Frame ₹2,000   │  Wheels Subtotal   ₹795            │
│    [−] 1 [+]                │                                     │
│                             │  Chain Assembly                     │
│  [Calculate Price]          │    └─ 4-Gear Assy ₹950            │
│  [Reset All]                │  Subtotal          ₹950            │
│                             │                                     │
│                             │  ─────────────────────────────     │
│                             │  TOTAL             ₹4,245          │
│                             │                                     │
└─────────────────────────────────────────────────────────────────┘
```

### Key Components:

1. **Header**
   - Title: "🚴 Hero Cycles — Price Configurator"
   - Subtitle: "Configure your bicycle and get instant pricing"

2. **Left Panel - Selection Area**
   - Date Picker (top): Default "2016-12-15"
   - Warning/Error Box: Real-time validation messages
   - Tabs: 5 component categories
   - Parts List: Checkboxes with prices and quantity controls
   - Action Buttons: "Calculate Price" and "Reset All"

3. **Right Panel - Price Breakdown**
   - Live breakdown by component
   - Individual part prices with quantities
   - Component subtotals
   - Grand total (highlighted)

---

## Screen 2: Warnings & Validation States

### State A: No Warnings (Valid Setup)

```
✓ Everything looks good
No warnings or errors
```

- Breakdown visible and calculation allowed

### State B: Yellow Warning (Incomplete Setup)

```
⚠️ Tubeless Tyre selected but no Rim.
   Consider adding Rim for complete wheel assembly.
```

- Yellow background (#fff3cd)
- Can still calculate
- Informational only

### State C: Red Error (Invalid Combination)

```
🚫 INVALID COMBINATION: Tubeless Tyre cannot be used with Inner Tube.
   Tubeless setup requires NO tube.
```

- Red background (#f8d7da)
- Blocks calculation
- Shows suggestions to fix

---

## Screen 3: Quantity Controls

### Layout of Each Part Option:

```
┌─────────────────────────────────────────┐
│ ☑ Part Name                    ₹Price  │
│ [−] Quantity [+]                       │
└─────────────────────────────────────────┘
```

### Interaction Flow:

1. **Unselected**: Checkbox unchecked, quantity buttons disabled
2. **Selected**: Checkbox checked, quantity buttons enabled, default qty = 1
3. **Increasing**: Click [+] to increment (max 999)
4. **Decreasing**: Click [−] to decrement (min 1)
5. **Warning**: Max exceeded shows alert: "⚠️ Quantity Limit Exceeded!"

---

## Screen 4: Component Tabs

### 5 Tabs Available:

```
┌────┬──────────┬────────┬───────┬──────────┐
│Fram│Handle Bar│Seating │Wheels │Chain Ass │
│    │& Brakes  │        │       │embly     │
└────┴──────────┴────────┴───────┴──────────┘
```

### Tab Behavior:

- **Active Tab**: Blue background, white text
- **Inactive Tabs**: Gray background, dark text
- **On Click**: Switch displayed parts to selected component

### Tab Contents:

**Frame Tab:**

- Steel Frame (₹)
- Aluminium Frame (₹)

**Handle Bar & Brakes Tab:**

- Standard Handlebar (₹)
- V-Brakes (₹)
- Disc Brakes (₹)

**Seating Tab:**

- Basic Saddle (₹)
- Ergonomic Saddle (₹)

**Wheels Tab:**

- Rim (₹)
- Tube (₹)
- Standard Tyre (₹)
- Tubeless Tyre (₹)
- Spokes (₹)

**Chain Assembly Tab:**

- Single-Speed Chain (₹)
- 4-Gear Assembly (₹)
- 7-Gear Assembly (₹)

---

## Screen 5: Price Breakdown Detail

### Breakdown Structure:

```
Frame
  └─ Steel Frame                1x ₹1,850 = ₹1,850
Frame Subtotal                          ₹1,850

Wheels
  └─ Rim                        1x ₹400 = ₹400
  └─ Tubeless Tyre             1x ₹395 = ₹395
  └─ Spokes                     1x ₹610 = ₹610
Wheels Subtotal                         ₹1,405

─────────────────────────────────────────
TOTAL                                   ₹5,055
```

### Display Features:

- Component headers in blue (#667eea)
- Individual parts with 2-space indent
- Quantity format: "2x ₹300 = ₹600"
- Component subtotals highlighted
- Grand total in large font, gradient background

---

## Design System

### Colors:

- **Primary**: #667eea (Blue) — Active tabs, buttons, price highlights
- **Secondary**: #764ba2 (Purple) — Gradient accents
- **Success**: #4caf50 (Green) — Valid states
- **Warning**: #ffc107 (Amber) — Warnings only
- **Error**: #f5222d (Red) — Blocking errors
- **Background**: #f9f9f9 (Light gray) — Content areas
- **Text**: #333333 (Dark gray) — Primary text

### Typography:

- **Header**: 32px, Bold
- **Section Titles**: 20px, Bold
- **Labels**: 14px, Medium
- **Body Text**: 13-14px, Regular
- **Prices**: 14-18px, Bold, Blue

### Spacing:

- Padding: 10-20px (sections), 8-12px (items)
- Gap between items: 8-12px
- Margin top/bottom: 15-20px

### Borders & Shadows:

- Border radius: 4-6px
- Box shadow: 0 2px 4px rgba(0,0,0,0.1) on hover
- Border: 2px solid #ddd (inputs/controls)

---

## Responsive Behavior

### Desktop (1200px+):

- 50-50 split layout
- All tabs visible
- Full price breakdown

### Tablet (768px-1199px):

- Stacked layout (left panel above right)
- Tabs with reduced padding
- Adjusted font sizes

### Mobile (<768px):

- Single column
- Tabs wrap to 2 rows
- Simplified quantity display
- Price breakdown collapsible

---

## User Interactions

### Checkbox Selection:

- Click checkbox → Select/deselect part
- Quantity buttons become enabled/disabled
- Real-time warning validation
- Price updates automatically

### Quantity Control:

- [−] Button → Decrement quantity (min 1)
- [+] Button → Increment quantity (max 999)
- Display updates instantly
- Breakdown recalculates live

### Date Change:

- Click date input → Change pricing date
- All prices update automatically
- Component prices recalculated
- New breakdown displayed

### Tab Navigation:

- Click tab → Switch component view
- Part list updates
- Warnings check new selections
- Prices fetch for selected date

### Calculate:

- Click "Calculate Price" → Validate configuration
- If errors: Show alert with suggestions
- If valid: Display price breakdown
- Breakdown updates in real-time

### Reset:

- Click "Reset All" → Clear all selections
- Uncheck all checkboxes
- Clear quantity controls
- Hide all warnings
- Show placeholder text
