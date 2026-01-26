import fs from "fs-extra";
import path from "path";

const directory = "dist";

function fixHTMLFiles(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      fixHTMLFiles(filePath);
    } else if (file.endsWith(".html")) {
      let content = fs.readFileSync(filePath, "utf8");

      // Only add type="module" to scripts that are known to be modules if they don't have it
      // For now, let's just make sure we don't duplicate it and only apply to local scripts that might need it
      // But actually, it's safer to just NOT force it on everything.
      // Reverting the aggressive "type=module" addition as it breaks non-module scripts.

      // content = content.replace(/<script\s+src="([^"]+)">/g, `<script src="$1" type="module">`);

      fs.writeFileSync(filePath, content, "utf8");
      console.log(`Checked: ${filePath}`);
    }
  });
}

fixHTMLFiles(directory);

