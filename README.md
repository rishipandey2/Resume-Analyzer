# Live Link : https://resume-analyzer-2-1vi6.onrender.com

# 📄 Resume Analyzer

An AI-powered Resume Analyzer that helps job seekers evaluate their resumes against job descriptions.  

Built with **React (Vite + Tailwind)** for the frontend and **Node.js/Express** for the backend.  
Supports **PDF** and **DOCX** uploads, and provides instant feedback on resume quality and job match.

---

## 🚀 Features
- 📤 Upload **PDF/DOCX resumes** via drag & drop or file picker  
- 📝 Compare resume against a given **job description**  
- ⚡ Instant feedback powered by backend API  
- 🎨 Modern, responsive UI with Tailwind CSS  
- 🔗 Frontend + Backend deployed separately (monorepo setup)  

---

## 📂 Project Structure
resume-analyzer/
│
├── frontend/ # React (Vite + Tailwind) app
│ ├── src/
│ ├── public/
│ └── package.json
│
├── backend/ # Node.js + Express API
│ ├── server.js
│ └── package.json
│
└── README.mdresume-analyzer/
│
├── frontend/ # React (Vite + Tailwind) app
│ ├── src/
│ ├── public/
│ └── package.json
│
├── backend/ # Node.js + Express API
│ ├── server.js
│ └── package.json
│
└── README.md🚀 Deployment Guide
🔹 Backend (Render Web Service)

Create new Web Service on Render

Set Root Directory → backend

Build Command → npm install

Start Command → npm start

Add env variables (PORT=5000)

🔹 Frontend (Render Static Site / Vercel)

Create new Static Site

Set Root Directory → frontend

Build Command → npm run build

Publish Directory → dist

Add env variable:
