const { exec } = require("child_process");
const { cleanupFiles } = require("./utils/cleanup");
const { resolveCommand } = require("./utils/resolveCommand");

const goCommand = resolveCommand([
  { command: "go", checkArgs: ["version"], shellCommand: "go" },
]);

const executeGo = (filepath, inputPath) => {
  return new Promise((resolve, reject) => {
    if (!goCommand) {
      cleanupFiles([filepath, inputPath]);
      return reject(new Error("Go toolchain is not installed or not available on PATH."));
    }

    exec(`${goCommand.shellCommand} run "${filepath}" < "${inputPath}"`, (error, stdout, stderr) => {
      cleanupFiles([filepath, inputPath]);
      if (error) return reject({ error: error.message, stderr });
      resolve(stdout);
    });
  });
};

module.exports = { executeGo };
