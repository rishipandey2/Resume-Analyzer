const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

let parseResume, analyzeWithAI;
try {
  const fileParser = require("../services/fileParser");
  const aiAnalyzer = require("../services/aiAnalyzer");
  parseResume = fileParser.parseResume;
  analyzeWithAI = aiAnalyzer.analyzeWithAI;
} catch (error) {
  console.error("Error loading services:", error);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

router.get("/test", (req, res) => {
  res.json({
    message: "API working",
    services: {
      fileParser: !!parseResume,
      aiAnalyzer: !!analyzeWithAI,
    },
  });
});

router.post("/analyze", upload.single("resume"), async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    filePath = req.file.path;
    const jobDescription = req.body.jobDescription || "";

    const resumeText = await parseResume(filePath, req.file.mimetype);

    if (!resumeText) {
      return res.status(400).json({ error: "Could not extract text" });
    }

    const analysis = await analyzeWithAI(resumeText, jobDescription);
    res.json(analysis);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Analysis failed" });
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
});

module.exports = router;
