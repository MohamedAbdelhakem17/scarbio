// file-analysis.controller.js
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function analyzeFileController(
  req,
  res,
  pyScriptPath,
  uploadDir,
  resultsDir
) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: "No file uploaded",
    });
  }

  const uploadedFilePath = req.file.path;
  const filterOption = req.body.filterOption || "recommended";

  // Execute Python script
  const python = spawn("python", [
    pyScriptPath,
    uploadedFilePath,
    filterOption,
    resultsDir,
  ]);

  let stdoutData = "";
  let stderrData = "";

  python.stdout.on("data", (data) => {
    stdoutData += data.toString();
  });

  python.stderr.on("data", (data) => {
    stderrData += data.toString();
  });

  python.on("close", (code) => {
    // Clean up uploaded file
    try {
      fs.unlinkSync(uploadedFilePath);
    } catch (err) {
      console.error("Failed to delete uploaded file:", err);
    }

    if (code !== 0) {
      return res.status(500).json({
        success: false,
        error: "Python script failed",
        details: stderrData,
      });
    }

    try {
      // Parse JSON output from Python
      const result = JSON.parse(stdoutData);

      if (!result.success) {
        return res.status(400).json(result);
      }

      // Send response with download link and data
      res.json({
        success: true,
        message: "Analysis completed successfully",
        downloadUrl: `/api/v1/analysis/download/${result.excel_file}`,
        excelFile: result.excel_file,
        dataSource: result.data_source,
        summary: result.summary,
        onpageResults: result.onpage_results,
        keywordMapping: result.keyword_mapping,
      });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        error: "Failed to parse analysis results",
        details: parseError.message,
        output: stdoutData,
      });
    }
  });

  python.on("error", (err) => {
    // Clean up uploaded file
    try {
      fs.unlinkSync(uploadedFilePath);
    } catch (unlinkErr) {
      console.error("Failed to delete uploaded file:", unlinkErr);
    }

    res.status(500).json({
      success: false,
      error: "Failed to execute Python script",
      details: err.message,
    });
  });
}

module.exports = {
  analyzeFileController,
  ensureDir,
};