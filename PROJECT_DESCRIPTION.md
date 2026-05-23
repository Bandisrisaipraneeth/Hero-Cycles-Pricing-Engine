# Hero Cycles Pricing Engine — Project Description

## Overview

**Hero Cycles Pricing Engine** is a full-stack web application designed to enable salespeople at Hero Cycles to configure custom bicycles and instantly calculate accurate prices with **time-sensitive pricing support**. The system handles price variations across different time periods (2016-2026), allowing salespeople to quote prices for any historical date.

## Business Problem

Hero Cycles manufactures thousands of bicycle configurations with varying prices that change every few months. Previously, salespeople used:

- ❌ Excel spreadsheets to track prices (slow, error-prone)
- ❌ Manual calculations for each quote (time-consuming)
- ❌ No validation for incompatible part combinations (risky)
- ❌ No historical pricing data (can't quote for past dates)

**Result:** Slow quoting process, calculation errors, missed sales.

## Solution

A modern **dual-interface pricing engine** that:

- ✅ Instantly calculates cycle prices with time-sensitive pricing
- ✅ Validates combinations to prevent invalid part pairings
- ✅ Shows real-time breakdown by component for customer explanations
- ✅ Supports historical pricing queries (2016-2026)
- ✅ Handles multiple quantities of same part
- ✅ Provides both CLI and Web UI for different user preferences

---

## Key Features

### 1. **Time-Sensitive Pricing** (Core Feature)

- Parts have **different prices across time periods**
- Example: Tubeless Tyre was ₹200 in Jan 2016, ₹395 in Feb 2024
- System finds **correct price for any query date**
- Historical data spans **10 years (2016-2026)**

### 2. **Intelligent Validation**

- **ERRORS** (Red, blocking):
  - Tubeless Tyre + Inner Tube = Invalid (mutually exclusive)
  - Prevents calculation with clear explanation
- **WARNINGS** (Yellow, informational):
  - Tubeless Tyre without Rim = Incomplete
  - Standard Tyre without Tube = Incomplete
  - Allows calculation but alerts salesperson

### 3. **Dual Interface**

**Web UI:** User-friendly salesperson interface
**CLI Tool:** Scriptable for automation/batch processing

### 4. **Multiple Quantity Support**

- Select 2+ of same part (e.g., 3x Steel Frame)
- Quantity controls: [−] and [+] buttons
- Max 999 per item, 10,000 total parts

### 5. **Real-Time Price Breakdown**

Shows component subtotals and grand total with Indian currency formatting (₹).

---

## Technical Architecture

### Backend (TypeScript + Node.js)

- **PricingEngine:** Time-sensitive price lookups with binary search
- **Parts Database:** 23 parts with 10 years of price history
- **Validation:** Real-time combination checking
- **REST API:** Three endpoints for parts, validation, calculation

### Frontend (HTML + CSS + Vanilla JS)

- **No dependencies:** Pure web standards
- **Real-time updates:** Live validation and price recalculation
- **Responsive:** Mobile, tablet, desktop
- **Accessible:** WCAG guidelines followed

---

## Documentation Files

- **README.md** — Quick start & overview
- **THINKING.md** — Problem analysis & data modeling
- **UI_NOTES.md** — UI/UX design & validation approach
- **PROJECT_DESCRIPTION.md** — This file
- **wireframes/WIREFRAMES.md** — Screen layouts & interactions

---

## Getting Started

```bash
npm install
npm run build
npm start  # Open http://localhost:3000
npm test
```

---

## Success Metrics

- ✓ Salespeople generate quotes in <30 seconds
- ✓ No manual calculation errors
- ✓ Can quote for any date (2016-2026)
- ✓ Prevents invalid combinations
- ✓ Clear breakdown for customer explanations
- ✓ Minimal training needed

---

## License

MIT
