const { exec } = require("child_process");
const { cleanupFiles } = require("./utils/cleanup");

const executeJs = (filepath, inputPath) => {
  return new Promise((resolve, reject) => {
    exec(`node "${filepath}" < "${inputPath}"`, (error, stdout, stderr) => {
      cleanupFiles([filepath, inputPath]);
      if (error) return reject({ error: error.message, stderr });
      resolve(stdout);
    });
  });
};

module.exports = { executeJs };
