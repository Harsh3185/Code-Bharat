const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

const aiCodeReview = async (code) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Analyze and review the following code. Suggest improvements:\n\n${code}`,
  });

  return response.text;
};

module.exports = { aiCodeReview };
