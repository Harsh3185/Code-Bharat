const fs = require("fs");

const cleanupFiles = (paths = []) => {
  for (const p of paths) {
    fs.rm(p, { force: true, recursive: true }, (err) => {
      if (err && err.code !== "ENOENT") {
        console.error(`Failed to delete ${p}:`, err.message);
      }
    });
  }
};

module.exports = { cleanupFiles };
