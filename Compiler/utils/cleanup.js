const fs = require("fs");

const cleanupFiles = (paths = []) => {
  for (const p of paths) {
    fs.unlink(p, (err) => {
      if (err && err.code !== 'ENOENT') {
        console.error(`Failed to delete ${p}:`, err.message);
      }
    });
  }
};

module.exports = { cleanupFiles };