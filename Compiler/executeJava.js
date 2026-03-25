const { exec } = require("child_process");
const path = require("path");
const { cleanupFiles } = require("./utils/cleanup");

const executeJava = (filepath, inputPath) => {
  const dir = path.dirname(filepath);
  const className = "Main";

  const compileCmd = `javac "${filepath}"`;
  const runCmd = `java -cp "${dir}" ${className} < "${inputPath}"`;

  return new Promise((resolve, reject) => {
    exec(`${compileCmd} && ${runCmd}`, (error, stdout, stderr) => {
      cleanupFiles([
        inputPath,
        dir
      ]);

      if (error) return reject({ error: error.message, stderr });
      resolve(stdout);
    });
  });
};

module.exports = { executeJava };
