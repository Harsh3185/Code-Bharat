const { exec } = require("child_process");
const { cleanupFiles } = require("./utils/cleanup");
const { resolveCommand } = require("./utils/resolveCommand");

const pythonCommand = resolveCommand([
  { command: "python3", checkArgs: ["--version"], shellCommand: "python3" },
  { command: "python", checkArgs: ["--version"], shellCommand: "python" },
  { command: "py", checkArgs: ["-3", "--version"], shellCommand: "py -3" },
  { command: "py", checkArgs: ["--version"], shellCommand: "py" },
]);

const executePython = (filepath, inputPath) => {
  return new Promise((resolve, reject) => {
    if (!pythonCommand) {
      cleanupFiles([filepath, inputPath]);
      return reject(new Error("Python runtime is not installed or not available on PATH."));
    }

    exec(`${pythonCommand.shellCommand} "${filepath}" < "${inputPath}"`, (error, stdout, stderr) => {
      cleanupFiles([filepath, inputPath]);
      if (error) return reject({ error: error.message, stderr });
      resolve(stdout);
    });
  });
};

module.exports = { executePython };
