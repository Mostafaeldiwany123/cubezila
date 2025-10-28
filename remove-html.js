import fs from "fs";
import path from "path";

const directory = "./dist"; // Change this if your built files are in another folder

function removeHtmlExtensions(filePath) {
    let content = fs.readFileSync(filePath, "utf8");
    // Remove .html from links, but keep actual file names unchanged
    content = content.replace(/href="([^"]+)\.html"/g, 'href="$1"');

    fs.writeFileSync(filePath, content, "utf8");
}

// Recursively scan the folder and apply the fix to all HTML files
function processFiles(dir) {
    fs.readdirSync(dir).forEach((file) => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processFiles(fullPath); // Recurse into subfolders
        } else if (file.endsWith(".html")) {
            removeHtmlExtensions(fullPath);
        }
    });
}

processFiles(directory);
console.log("✅ Removed .html from links in all HTML files!");
