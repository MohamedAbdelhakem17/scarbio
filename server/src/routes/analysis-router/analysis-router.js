// analysis-router.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  analyzeFileController,
  ensureDir,
} = require("../../controller/file-analysis-controller/file-analyze.controller");

const DEFAULT_UPLOAD_DIR = path.join(process.cwd(), "uploads");
const DEFAULT_RESULTS_DIR = path.join(process.cwd(), "results");

const analysisRouter = express.Router();

function initAnalysisRouter(pyScriptPath) {
  ensureDir(DEFAULT_UPLOAD_DIR);
  ensureDir(DEFAULT_RESULTS_DIR);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, DEFAULT_UPLOAD_DIR),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      cb(
        null,
        `${unique}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`
      );
    },
  });

  const upload = multer({ storage });

  analysisRouter.post("/analyze-file", upload.single("file"), (req, res) => {
    analyzeFileController(
      req,
      res,
      pyScriptPath,
      DEFAULT_UPLOAD_DIR,
      DEFAULT_RESULTS_DIR
    );
  });

  analysisRouter.get("/download/:filename", (req, res) => {
    const filename = req.params.filename;
    const full = path.join(DEFAULT_RESULTS_DIR, filename);
    if (!fs.existsSync(full)) return res.status(404).send("File not found");
    res.download(full);
  });

  return analysisRouter;
}

module.exports = { initAnalysisRouter };
