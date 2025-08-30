// debug.js - Run this in your backend directory to diagnose issues
// Usage: node debug.js

const fs = require("fs");
const path = require("path");

console.log("🔍 Backend Diagnostics Starting...\n");

// Check Node version
console.log("📋 System Info:");
console.log(`Node.js version: ${process.version}`);
console.log(`Platform: ${process.platform}`);
console.log(`Current directory: ${process.cwd()}\n`);

// Check if package.json exists
console.log("📦 Package Check:");
if (fs.existsSync("package.json")) {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  console.log("✅ package.json found");
  console.log(`Project name: ${pkg.name}`);
  console.log("Dependencies:", Object.keys(pkg.dependencies || {}).join(", "));
} else {
  console.log("❌ package.json not found!");
}

// Check if node_modules exists
console.log("\n📂 Dependencies Check:");
if (fs.existsSync("node_modules")) {
  console.log("✅ node_modules directory exists");

  // Check critical dependencies
  const criticalDeps = [
    "express",
    "multer",
    "cors",
    "dotenv",
    "pdf-parse",
    "mammoth",
  ];
  criticalDeps.forEach((dep) => {
    if (fs.existsSync(path.join("node_modules", dep))) {
      console.log(`✅ ${dep} installed`);
    } else {
      console.log(`❌ ${dep} NOT installed`);
    }
  });

  // Check optional dependencies
  if (fs.existsSync(path.join("node_modules", "openai"))) {
    console.log("✅ openai installed");
  } else {
    console.log("⚠️ openai NOT installed (fallback analysis will be used)");
  }
} else {
  console.log("❌ node_modules directory not found! Run: npm install");
}

// Check directory structure
console.log("\n📁 Directory Structure:");
const expectedDirs = ["src", "src/routes", "src/services"];
const expectedFiles = [
  "src/app.js",
  "src/routes/analyze.js",
  "src/services/fileParser.js",
  "src/services/aiAnalyzer.js",
];

expectedDirs.forEach((dir) => {
  if (fs.existsSync(dir)) {
    console.log(`✅ Directory: ${dir}`);
  } else {
    console.log(`❌ Missing directory: ${dir}`);
  }
});

expectedFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ File: ${file}`);
  } else {
    console.log(`❌ Missing file: ${file}`);
  }
});

// Check uploads directory
if (fs.existsSync("uploads")) {
  console.log("✅ uploads directory exists");
} else {
  console.log("⚠️ uploads directory will be created automatically");
}

// Check environment variables
console.log("\n🔑 Environment Variables:");
require("dotenv").config();

if (process.env.PORT) {
  console.log(`✅ PORT: ${process.env.PORT}`);
} else {
  console.log("⚠️ PORT not set (will use default 5000)");
}

if (process.env.OPENAI_API_KEY) {
  console.log(
    `✅ OPENAI_API_KEY: ${process.env.OPENAI_API_KEY.substring(0, 10)}...`
  );
} else {
  console.log("⚠️ OPENAI_API_KEY not set (fallback analysis will be used)");
}

// Test require statements
console.log("\n🧪 Module Loading Test:");
try {
  require("express");
  console.log("✅ express loads successfully");
} catch (e) {
  console.log("❌ express failed to load:", e.message);
}

try {
  require("multer");
  console.log("✅ multer loads successfully");
} catch (e) {
  console.log("❌ multer failed to load:", e.message);
}

try {
  require("cors");
  console.log("✅ cors loads successfully");
} catch (e) {
  console.log("❌ cors failed to load:", e.message);
}

try {
  require("pdf-parse");
  console.log("✅ pdf-parse loads successfully");
} catch (e) {
  console.log("❌ pdf-parse failed to load:", e.message);
}

try {
  require("mammoth");
  console.log("✅ mammoth loads successfully");
} catch (e) {
  console.log("❌ mammoth failed to load:", e.message);
}

try {
  require("openai");
  console.log("✅ openai loads successfully");
} catch (e) {
  console.log("⚠️ openai failed to load:", e.message);
}

// Test main app file
console.log("\n🚀 App Loading Test:");
if (fs.existsSync("src/app.js")) {
  try {
    const app = require("./src/app.js");
    console.log("✅ src/app.js loads successfully");
  } catch (e) {
    console.log("❌ src/app.js failed to load:");
    console.log(e.message);
    console.log(e.stack);
  }
} else {
  console.log("❌ src/app.js not found!");
}

console.log("\n🎯 Quick Fix Commands:");
console.log("If dependencies are missing: npm install");
console.log("If directories are missing: mkdir -p src/routes src/services");
console.log("If .env is missing: cp .env.example .env (and add your API key)");
console.log("To run with more details: DEBUG=* npm run dev");

console.log("\n✨ Diagnostics Complete!");

// Additional port check
console.log("\n🔌 Port Check:");
const net = require("net");
const port = process.env.PORT || 5000;

const server = net.createServer();
server.listen(port, () => {
  console.log(`✅ Port ${port} is available`);
  server.close();
});
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`❌ Port ${port} is already in use`);
  } else {
    console.log(`❌ Port ${port} error:`, err.message);
  }
});
