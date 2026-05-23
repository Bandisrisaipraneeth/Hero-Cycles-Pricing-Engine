import express, { Express, Request, Response } from "express";
import path from "path";
import { PricingEngine } from "../core/pricing-engine";
import { partsDatabase } from "../data/parts-database";
import { ComponentType } from "../core/types";

const app: Express = express();
const port = 3000;

const engine = new PricingEngine(partsDatabase);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "views")));

/**
 * GET /api/parts
 * Returns all parts grouped by component
 */
app.get("/api/parts", (req: Request, res: Response) => {
  try {
    const partsByComponent: Record<string, any[]> = {};

    Object.values(ComponentType).forEach((component) => {
      partsByComponent[component] = partsDatabase
        .filter((part) => part.component === component)
        .map((part) => ({
          id: part.id,
          name: part.name,
          component: part.component,
        }));
    });

    res.json(partsByComponent);
  } catch (error) {
    console.error("Error in GET /api/parts:", error);
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * POST /api/validate
 * Validates part combination for compatibility issues
 */
app.post("/api/validate", (req: Request, res: Response) => {
  try {
    const { parts } = req.body;

    if (!Array.isArray(parts)) {
      return res.status(400).json({ error: "Parts must be an array" });
    }

    const validation = engine.validateConfiguration(parts);

    res.json(validation);
  } catch (error) {
    console.error("Error in POST /api/validate:", error);
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * POST /api/calculate
 * Calculates price breakdown for given parts and date
 * Blocks calculation if validation errors exist
 */
app.post("/api/calculate", (req: Request, res: Response) => {
  try {
    const { date, parts } = req.body;

    // Validate input
    if (!date || !Array.isArray(parts) || parts.length === 0) {
      return res.status(400).json({ error: "Missing date or parts" });
    }

    const queryDate = new Date(date);
    if (isNaN(queryDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // Validate configuration
    const validation = engine.validateConfiguration(parts);

    // Block calculation if errors exist
    if (!validation.isValid) {
      return res.status(400).json({
        error: "Invalid configuration",
        errors: validation.errors,
        suggestions: validation.suggestions,
      });
    }

    // Calculate breakdown
    const breakdown = engine.calculateBreakdown(parts, queryDate);

    res.json({
      date: breakdown.date,
      details: breakdown.details,
      totalPrice: breakdown.totalPrice,
      isValid: validation.isValid,
      warnings: validation.warnings,
      suggestions: validation.suggestions,
    });
  } catch (error) {
    console.error("Error in POST /api/calculate:", error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Serve index.html for root path
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  console.log(`📋 Open browser and navigate to http://localhost:${port}`);
});
