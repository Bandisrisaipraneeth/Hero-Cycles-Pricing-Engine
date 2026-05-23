import * as fs from "fs";
import * as path from "path";
import { PricingEngine } from "../core/pricing-engine";
import { partsDatabase } from "../data/parts-database";
import { ComponentType, PricingRequest } from "../core/types";

const engine = new PricingEngine(partsDatabase);

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

function loadConfigFromFile(filePath: string): PricingRequest {
  const fullPath = path.resolve(filePath);
  const content = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(content);
}

function getComponentName(component: ComponentType): string {
  const names: Record<ComponentType, string> = {
    [ComponentType.FRAME]: "Frame",
    [ComponentType.HANDLEBAR_BRAKES]: "Handle Bar/Brakes",
    [ComponentType.SEATING]: "Seating",
    [ComponentType.WHEELS]: "Wheels",
    [ComponentType.CHAIN_ASSEMBLY]: "Chain Assembly",
  };
  return names[component];
}

function main(): void {
  const args = process.argv.slice(2);

  let request: PricingRequest;

  if (args.includes("--config")) {
    const configIndex = args.indexOf("--config");
    const configPath = args[configIndex + 1];
    request = loadConfigFromFile(configPath);
  } else if (args.includes("--date") && args.includes("--parts")) {
    const dateIndex = args.indexOf("--date");
    const partsIndex = args.indexOf("--parts");
    const dateStr = args[dateIndex + 1];
    const partsStr = args[partsIndex + 1];

    request = {
      date: dateStr,
      parts: partsStr.split(","),
    };
  } else {
    console.error("Usage:");
    console.error("  node dist/cli/index.js --config <file.json>");
    console.error(
      "  node dist/cli/index.js --date <YYYY-MM-DD> --parts <part1,part2,...>",
    );
    process.exit(1);
  }

  try {
    const queryDate = new Date(request.date);
    if (isNaN(queryDate.getTime())) {
      throw new Error(`Invalid date format: ${request.date}. Use YYYY-MM-DD`);
    }

    const breakdown = engine.calculateBreakdown(request.parts, queryDate);
    const validation = engine.validateConfiguration(request.parts);

    console.log("\n" + "=".repeat(50));
    console.log(`Cycle Price Breakdown — ${formatDate(breakdown.date)}`);
    console.log("=".repeat(50));

    const sortedComponents = [
      ComponentType.FRAME,
      ComponentType.HANDLEBAR_BRAKES,
      ComponentType.SEATING,
      ComponentType.WHEELS,
      ComponentType.CHAIN_ASSEMBLY,
    ];

    sortedComponents.forEach((component) => {
      const price = breakdown.breakdown.get(component) || 0;
      if (price > 0) {
        console.log(
          `${getComponentName(component).padEnd(20)} : ${formatCurrency(price)}`,
        );
      }
    });

    console.log("-".repeat(50));
    console.log(
      `${"TOTAL".padEnd(20)} : ${formatCurrency(breakdown.totalPrice)}`,
    );
    console.log("=".repeat(50));

    if (validation.warnings.length > 0) {
      console.log("\n⚠️  Warnings:");
      validation.warnings.forEach((warning) => {
        console.log(`  - ${warning}`);
      });
    }

    console.log();
  } catch (error) {
    console.error("\n❌ Error:", (error as Error).message);
    process.exit(1);
  }
}

main();
