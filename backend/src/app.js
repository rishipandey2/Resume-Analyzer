const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Resume Analyzer API is running",
    timestamp: new Date().toISOString(),
  });
});

try {
  const analyzeRouter = require("./routes/analyze");
  app.use("/api", analyzeRouter);
  console.log("Routes loaded successfully");
} catch (error) {
  console.error("Error loading routes:", error);
}

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `OpenAI API Key: ${process.env.OPENAI_API_KEY ? "Set" : "Missing"}`
  );
});
