import fs from "fs-extra";
import path from "path";

const directory = "dist"; // Fix all HTML files inside "dist/"

// Function to update script tags
function fixHTMLFiles(dir) {
  fs.readdir(dir, (err, files) => {
    if (err) return console.error(`Error reading ${dir}:`, err);

    files.forEach((file) => {
      const filePath = path.join(dir, file);

      fs.stat(filePath, (err, stats) => {
        if (err) return console.error(`Error reading ${filePath}:`, err);

        if (stats.isDirectory()) {
          fixHTMLFiles(filePath); // Recursively fix all subfolders
        } else if (file.endsWith(".html")) {
          let content = fs.readFileSync(filePath, "utf8");

          // Add type="module" to all <script> tags
          content = content.replace(/<script\s+src="([^"]+)">/g, `<script src="$1" type="module">`);

          // Fix CSS links if needed
          content = content.replace(/<link\s+rel="stylesheet"\s+href="([^"]+)">/g, `<link rel="stylesheet" href="$1">`);

          fs.writeFileSync(filePath, content, "utf8");
          console.log(`Fixed: ${filePath}`);
        }
      });
    });
  });
}

fixHTMLFiles(directory);
