import fs from "fs-extra";
import * as terser from "terser";
import JavaScriptObfuscator from "javascript-obfuscator";
import CleanCSS from "clean-css";
import htmlMinifier from "html-minifier";
import path from "path";

const directory = "dist"; // Process everything inside "dist/"

// List of JS files to skip obfuscation (e.g., service worker, manifest, storage)
const skipObfuscation = ["sw.js", "manifest.json"];

// Minify and safely obfuscate JavaScript files
function minifyJSFiles(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      minifyJSFiles(filePath); // Recursively process subfolders
    } else if (file.endsWith(".js")) {
      const code = fs.readFileSync(filePath, "utf8");
      terser.minify(code, {
        compress: true,
        mangle: true,
        format: { comments: false },
      }).then((result) => {
        if (!result.code) {
          console.error(`Failed to minify: ${filePath}`);
          return;
        }
        // Only obfuscate if not in skip list
        if (!skipObfuscation.includes(file)) {
          const obfuscated = JavaScriptObfuscator.obfuscate(result.code, {
            compact: true,
            controlFlowFlattening: false, // Safe: do not enable
            deadCodeInjection: false,     // Safe: do not enable
            debugProtection: false,
            disableConsoleOutput: true,
            identifierNamesGenerator: "hexadecimal",
            renameGlobals: false,
            rotateStringArray: true,
            selfDefending: false,         // Safe: do not enable
            stringArray: true,
            stringArrayEncoding: [],      // No encoding for best compatibility
            stringArrayThreshold: 0.2,    // Lower threshold for less aggressive obfuscation
            unicodeEscapeSequence: false,
          }).getObfuscatedCode();
          fs.writeFileSync(filePath, obfuscated, "utf8");
          console.log(`Minified & obfuscated JS: ${filePath}`);
        } else {
          fs.writeFileSync(filePath, result.code, "utf8");
          console.log(`Minified JS (no obfuscation): ${filePath}`);
        }
      }).catch((err) => {
        console.error(`Terser error in ${filePath}:`, err);
      });
    }
  });
}

// Minify CSS files
function minifyCSSFiles(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      minifyCSSFiles(filePath);
    } else if (file.endsWith(".css")) {
      const code = fs.readFileSync(filePath, "utf8");
      const minified = new CleanCSS().minify(code).styles;
      fs.writeFileSync(filePath, minified, "utf8");
      console.log(`Minified CSS: ${filePath}`);
    }
  });
}

// Remove all comments from HTML files (HTML and JS in <script> tags), but do not minify or collapse whitespace
function stripCommentsFromHTMLFiles(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      stripCommentsFromHTMLFiles(filePath);
    } else if (file.endsWith(".html")) {
      let code = fs.readFileSync(filePath, "utf8");
      // Remove HTML comments
      code = code.replace(/<!--([\s\S]*?)-->/g, "");
      // Remove JS comments inside <script> tags
      code = code.replace(/(<script[^>]*>)([\s\S]*?)(<\/script>)/gi, (match, open, js, close) => {
        // Remove /* ... */ and // ... comments
        let cleaned = js
          .replace(/\/\*[\s\S]*?\*\//g, '') // multi-line
          .replace(/(^|\n|\r)\s*\/\/.*(?=\n|\r|$)/g, ''); // single-line
        return open + cleaned + close;
      });
      fs.writeFileSync(filePath, code, "utf8");
      console.log(`Stripped comments from HTML: ${filePath}`);
    }
  });
}

// Run all minification functions
minifyJSFiles(directory);
minifyCSSFiles(directory);
stripCommentsFromHTMLFiles(directory);
