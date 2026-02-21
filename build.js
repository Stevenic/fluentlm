const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const dist = path.join(__dirname, "dist");

// Clean and create dist folder
if (fs.existsSync(dist)) fs.rmSync(dist, { recursive: true });
fs.mkdirSync(dist);

// --- CSS ---
const cssDir = path.join(__dirname, "css");
const cssComponentsDir = path.join(cssDir, "components");

// Collect all non-theme CSS files: tokens first, then base, then components
const cssParts = [
  fs.readFileSync(path.join(cssDir, "tokens.css"), "utf8"),
  fs.readFileSync(path.join(cssDir, "base.css"), "utf8"),
  ...fs.readdirSync(cssComponentsDir)
    .filter((f) => f.endsWith(".css"))
    .sort()
    .map((f) => fs.readFileSync(path.join(cssComponentsDir, f), "utf8")),
];

const combinedCss = cssParts.join("\n");
fs.writeFileSync(path.join(dist, "fluentlm.css"), combinedCss);

// Copy theme files
fs.readdirSync(cssDir)
  .filter((f) => f.startsWith("theme-") && f.endsWith(".css"))
  .sort()
  .forEach((f) => fs.copyFileSync(path.join(cssDir, f), path.join(dist, f)));

// Minify CSS
execSync(`npx --yes clean-css-cli -o "${path.join(dist, "fluentlm.min.css")}" "${path.join(dist, "fluentlm.css")}"`, { stdio: "inherit" });

// --- JS ---
const jsDir = path.join(__dirname, "js");
const jsComponentsDir = path.join(jsDir, "components");

// Collect all JS files: main module first, then icons, theme, then components
const jsParts = [
  fs.readFileSync(path.join(jsDir, "fluentlm.js"), "utf8"),
  fs.readFileSync(path.join(jsDir, "icons.js"), "utf8"),
  fs.readFileSync(path.join(jsDir, "theme.js"), "utf8"),
  ...fs.readdirSync(jsComponentsDir)
    .filter((f) => f.endsWith(".js"))
    .sort()
    .map((f) => fs.readFileSync(path.join(jsComponentsDir, f), "utf8")),
];

const combinedJs = jsParts.join("\n");
fs.writeFileSync(path.join(dist, "fluentlm.js"), combinedJs);

// --- Docs ---
fs.copyFileSync(path.join(__dirname, "fluentlm-instructions.md"), path.join(dist, "fluentlm-instructions.md"));

// Minify JS
execSync(`npx --yes terser "${path.join(dist, "fluentlm.js")}" -o "${path.join(dist, "fluentlm.min.js")}" --compress --mangle`, { stdio: "inherit" });

console.log("\nBuild complete! Files in dist/:");
fs.readdirSync(dist).forEach((f) => {
  const size = fs.statSync(path.join(dist, f)).size;
  console.log(`  ${f} (${(size / 1024).toFixed(1)} KB)`);
});
