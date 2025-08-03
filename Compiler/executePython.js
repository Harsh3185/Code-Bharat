const { exec } = require("child_process");
const { cleanupFiles } = require("./utils/cleanup");

const executePython = (filepath, inputPath) => {
  return new Promise((resolve, reject) => {
    exec(`python3 "${filepath}" < "${inputPath}"`, (error, stdout, stderr) => {
      cleanupFiles([filepath, inputPath]);
      if (error) return reject({ error: error.message, stderr });
      resolve(stdout);
    });
  });
};

module.exports = { executePython };
