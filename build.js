const fs = require("fs");
const path = require("path");

// Ensure dist/web/views directory exists
const viewsDir = path.join(__dirname, "dist", "web", "views");
if (!fs.existsSync(viewsDir)) {
  fs.mkdirSync(viewsDir, { recursive: true });
}

// Copy HTML file
fs.copyFileSync(
  path.join(__dirname, "src", "web", "views", "index.html"),
  path.join(__dirname, "dist", "web", "views", "index.html"),
);

// Copy CSS file
fs.copyFileSync(
  path.join(__dirname, "src", "web", "views", "styles.css"),
  path.join(__dirname, "dist", "web", "views", "styles.css"),
);

// Copy JS file
fs.copyFileSync(
  path.join(__dirname, "src", "web", "views", "app.js"),
  path.join(__dirname, "dist", "web", "views", "app.js"),
);

console.log("✅ View files copied to dist/web/views/");
