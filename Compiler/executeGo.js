const { exec } = require("child_process");
const { cleanupFiles } = require("./utils/cleanup");

const executeGo = (filepath, inputPath) => {
  return new Promise((resolve, reject) => {
    exec(`go run "${filepath}" < "${inputPath}"`, (error, stdout, stderr) => {
      cleanupFiles([filepath, inputPath]);
      if (error) return reject({ error: error.message, stderr });
      resolve(stdout);
    });
  });
};

module.exports = { executeGo };
