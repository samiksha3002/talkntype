const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Root route for test
app.get("/", (req, res) => {
  res.send("🌐 Translation API is running.");
});

// Translation route
app.post("/translate", async (req, res) => {
  const { text, targetLang } = req.body;

  if (!text || !targetLang) {
    return res.status(400).json({ error: "text and targetLang are required" });
  }

  const apiKey = process.env.GOOGLE_API_KEY;

  try {
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        q: text,
        target: targetLang,
        format: "text",
      }
    );

    const translatedText = response.data.data.translations[0].translatedText;
    res.json({ translatedText });
  } catch (error) {
    console.error(
      "❌ Translation error:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({
        error: "Translation failed",
        details: error.response?.data || error.message,
      });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is live on http://localhost:${PORT}`);
});
