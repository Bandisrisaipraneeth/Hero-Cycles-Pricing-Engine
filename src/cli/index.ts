import { PricingEngine } from "../core/pricing-engine";
import { partsDatabase } from "../data/parts-database";
import * as fs from "fs";
import * as path from "path";

interface PricingRequest {
  date: string;
  parts: string[];
}

function main(): void {
  const args = process.argv.slice(2);
  let request: PricingRequest | null = null;

  // Check for --config flag
  if (args.includes("--config")) {
    const configIndex = args.indexOf("--config");
    const configPath = args[configIndex + 1];

    if (!configPath) {
      console.error("Error: --config requires a file path");
      process.exit(1);
    }

    try {
      const fullPath = path.resolve(configPath);
      const fileContent = fs.readFileSync(fullPath, "utf-8");
      request = JSON.parse(fileContent);
    } catch (error) {
      console.error(`Error reading config file: ${configPath}`);
      console.error((error as Error).message);
      process.exit(1);
    }
  }
  // Check for --date and --parts arguments
  else if (args.includes("--date") && args.includes("--parts")) {
    const dateIndex = args.indexOf("--date");
    const partsIndex = args.indexOf("--parts");

    const date = args[dateIndex + 1];
    const partsString = args[partsIndex + 1];

    if (!date || !partsString) {
      console.error("Error: --date and --parts require values");
      process.exit(1);
    }

    request = {
      date,
      parts: partsString.split(",").map((part) => part.trim()),
    };
  } else {
    console.log("Usage:");
    console.log("  Using config file:");
    console.log("    node dist/cli/index.js --config sample-config.json");
    console.log("");
    console.log("  Using arguments:");
    console.log(
      '    node dist/cli/index.js --date "2016-12-15" --parts "steel_frame,v_brakes,basic_saddle,rim,tubeless_tyre,spokes,4_gear_assembly"',
    );
    process.exit(0);
  }

  if (!request) {
    console.error("Error: No pricing request provided");
    process.exit(1);
  }

  try {
    // Create pricing engine
    const engine = new PricingEngine(partsDatabase);

    // Parse date
    const queryDate = new Date(request.date);
    if (isNaN(queryDate.getTime())) {
      console.error(`Error: Invalid date format: ${request.date}`);
      process.exit(1);
    }

    // Validate configuration
    const validation = engine.validateConfiguration(request.parts);

    // Show warnings
    if (validation.warnings.length > 0) {
      console.log("\n⚠️  WARNINGS:");
      validation.warnings.forEach((warning) => {
        console.log(`  - ${warning}`);
      });
      console.log("");
    }

    // Block if errors
    if (!validation.isValid) {
      console.log("\n❌ ERRORS:");
      validation.errors.forEach((error) => {
        console.log(`  - ${error}`);
      });

      if (validation.suggestions.length > 0) {
        console.log("\n💡 SUGGESTIONS:");
        validation.suggestions.forEach((suggestion) => {
          console.log(`  - ${suggestion.fix}`);
        });
      }

      process.exit(1);
    }

    // Calculate breakdown
    const breakdown = engine.calculateBreakdown(request.parts, queryDate);

    // Format and display output
    displayBreakdown(breakdown);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

function displayBreakdown(breakdown: any): void {
  const componentNames: { [key: string]: string } = {
    FRAME: "Frame",
    HANDLEBAR_BRAKES: "Handle Bar/Brakes",
    SEATING: "Seating",
    WHEELS: "Wheels",
    CHAIN_ASSEMBLY: "Chain Assembly",
  };

  const dateStr = breakdown.date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  console.log("\n" + "=".repeat(50));
  console.log(`Cycle Price Breakdown — ${dateStr}`);
  console.log("=".repeat(50));

  const sortedComponents = [
    "FRAME",
    "HANDLEBAR_BRAKES",
    "SEATING",
    "WHEELS",
    "CHAIN_ASSEMBLY",
  ];

  sortedComponents.forEach((component) => {
    const price = breakdown.breakdown.get(component);
    if (price && price > 0) {
      const componentName = componentNames[component] || component;
      console.log(
        `${componentName.padEnd(20)} : ₹${price.toLocaleString("en-IN")}`,
      );
    }
  });

  console.log("-".repeat(50));
  console.log(
    `${"TOTAL".padEnd(20)} : ₹${breakdown.totalPrice.toLocaleString("en-IN")}`,
  );
  console.log("=".repeat(50) + "\n");
}

main();
