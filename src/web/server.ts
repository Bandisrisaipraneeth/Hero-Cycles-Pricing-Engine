import express, { Express, Request, Response } from "express";
import path from "path";
import { PricingEngine } from "../core/pricing-engine";
import { partsDatabase } from "../data/parts-database";
import { ComponentType } from "../core/types";

const app: Express = express();
const port = 3000;

const engine = new PricingEngine(partsDatabase);

// Serve static files from views directory
const viewsPath = path.join(__dirname, "views");
console.log("📁 Serving from:", viewsPath);

app.use(express.static(viewsPath));
app.use(express.json());

/**
 * GET /api/parts
 * Returns all parts grouped by component
 */
app.get("/api/parts", (req: Request, res: Response): void => {
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
 * Validates part combination for compatibility
 */
app.post("/api/validate", (req: Request, res: Response): void => {
  try {
    const { parts } = req.body;

    if (!Array.isArray(parts)) {
      res.status(400).json({ error: "Parts must be an array" });
      return;
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
 */
app.post("/api/calculate", (req: Request, res: Response): void => {
  try {
    const { date, parts } = req.body;

    if (!date || !Array.isArray(parts) || parts.length === 0) {
      res.status(400).json({ error: "Missing date or parts" });
      return;
    }

    const queryDate = new Date(date);
    if (isNaN(queryDate.getTime())) {
      res.status(400).json({ error: "Invalid date format" });
      return;
    }

    // Validate configuration first
    const validation = engine.validateConfiguration(parts);

    // Block calculation if errors exist
    if (!validation.isValid) {
      res.status(400).json({
        error: "Invalid configuration",
        errors: validation.errors,
        suggestions: validation.suggestions,
      });
      return;
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
app.get("/", (req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  console.log(`📋 Open browser and navigate to http://localhost:${port}`);
});
