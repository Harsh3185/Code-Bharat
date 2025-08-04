const express = require('express');
const app = express();
const { generateFile } = require('./generateFile');
const { generateInputFile } = require('./generateInputFile');
const cors = require('cors');
const { aiCodeReview } = require('./aiCodeReview.js');
const { executeCpp } = require('./executeCpp');
const { executePython } = require('./executePython');
const { executeJs } = require('./executeJs');
const { executeGo } = require('./executeGo');
const { executeC } = require('./executeC.js');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ online: 'compiler' });
});

app.post("/run", async (req, res) => {
    const { language = 'cpp', code, input = '' } = req.body;

    if (code === undefined || code.trim() === '') {
        return res.status(400).json({
            success: false,
            error: "Empty code! Please provide some code to execute."
        });
    }

    try {
        const filePath = await generateFile(language, code);

        const inputPath = await generateInputFile(input);

        let output;

        if (language === "cpp") {
            output = await executeCpp(filePath, inputPath);
        } else if (language === "c") {
            output = await executeC(filePath, inputPath);
        } else if (language === "python") {
            output = await executePython(filePath, inputPath);
        } else if (language === "javascript") {
            output = await executeJs(filePath, inputPath);
        } else if (language === "go") {
            output = await executeGo(filePath, inputPath);
        } else {
            throw new Error("Unsupported language");
        }

        res.json({
            success: true,
            filePath,
            inputPath,
            output
        });
    } catch (error) {
        console.error('Error executing code:', error);

        res.status(500).json({
            success: false,
            error: error.message || error.toString() || 'An error occurred while executing the code'
        });
    }
});

app.post("/ai-review", async (req, res) => {
    const { code } = req.body;
    console.log("Code received for review:", code);

    if (!code) {
        return res.status(400).json({ error: "Code is required" });
    }

    try {
        const review = await aiCodeReview(code);
        console.log("AI Review output:", review);
        res.json({ review });
    } catch (error) {
        console.error("AI Review error:", error);
        res.status(500).json({ error: "AI Review failed: " + error.message });
    }
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}!`);
});