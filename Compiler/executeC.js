const { exec } = require("child_process");
const path = require("path");
const { cleanupFiles } = require("./utils/cleanup");

const executeC = (filepath, inputPath) => {
  const dir = path.dirname(filepath);
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(dir, `${jobId}.out`);

  return new Promise((resolve, reject) => {
    const compileCmd = `gcc "${filepath}" -o "${outPath}"`;
    const runCmd = `"${outPath}" < "${inputPath}"`;

    exec(`${compileCmd} && ${runCmd}`, (error, stdout, stderr) => {
      cleanupFiles([filepath, inputPath, outPath]);

      if (error) {
        return reject({ error: error.message, stderr });
      }

      resolve(stdout);
    });
  });
};

module.exports = {
  executeC,
};
