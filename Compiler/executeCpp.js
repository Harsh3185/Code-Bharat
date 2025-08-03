const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { cleanupFiles } = require("./utils/cleanup");

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });

const executeCpp = (filepath, inputPath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.exe`);

  return new Promise((resolve, reject) => {
    const compileCmd = `g++ "${filepath}" -o "${outPath}"`;
    const runCmd = `"${outPath}" < "${inputPath}"`;

    exec(`${compileCmd} && ${runCmd}`, (error, stdout, stderr) => {
      cleanupFiles([filepath, inputPath, outPath]);
      if (error) return reject({ error: error.message, stderr });
      resolve(stdout);
    });
  });
};

module.exports = { executeCpp };

