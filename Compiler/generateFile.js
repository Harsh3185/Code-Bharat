const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirCodes = path.join(__dirname, 'codes');

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = (format, content) => {
  const jobID = uuid();
  const extensionMap = {
    c: "c",
    cpp: "cpp",
    java: "java",
    javascript: "js",
    python: "py",
    go: "go",
  };
  const extension = extensionMap[format] || format;
  const javaDir = path.join(dirCodes, jobID);
  const filePath = format === "java"
    ? path.join(javaDir, "Main.java")
    : path.join(dirCodes, `${jobID}.${extension}`);

  if (format === "java" && !fs.existsSync(javaDir)) {
    fs.mkdirSync(javaDir, { recursive: true });
  }

  fs.writeFileSync(filePath, content);
  return filePath;
};

module.exports = {
    generateFile,
};
