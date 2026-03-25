const { spawnSync } = require("child_process");

const isUsableCommand = (command, args = ["--version"]) => {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    shell: process.platform === "win32",
  });

  return !result.error && result.status === 0;
};

const resolveCommand = (candidates = []) => {
  for (const candidate of candidates) {
    if (isUsableCommand(candidate.command, candidate.checkArgs)) {
      return candidate;
    }
  }

  return null;
};

module.exports = { resolveCommand };
