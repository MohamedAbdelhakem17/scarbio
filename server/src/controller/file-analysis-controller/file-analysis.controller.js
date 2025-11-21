// file-analysis.controller.js
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function analyzeFileController(req, res, pyScriptPath, uploadDir, resultsDir) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: "No file uploaded",
    });
  }

  const uploadedFilePath = req.file.path;
  const filterOption = req.body.filterOption || "all";

  // Verify file exists before processing
  if (!fs.existsSync(uploadedFilePath)) {
    return res.status(400).json({
      success: false,
      error: "Uploaded file not found",
    });
  }

  // Verify Python script exists
  if (!fs.existsSync(pyScriptPath)) {
    return res.status(500).json({
      success: false,
      error: "Python script not found",
      path: pyScriptPath,
    });
  }

  // Ensure results directory exists
  ensureDir(resultsDir);

  console.log("[INFO] Starting analysis...");
  console.log(`[INFO] File: ${uploadedFilePath}`);
  console.log(`[INFO] Filter: ${filterOption}`);
  console.log(`[INFO] Results dir: ${resultsDir}`);

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
    const chunk = data.toString();
    stderrData += chunk;
    // Log stderr in real-time for debugging
    console.error("[PYTHON STDERR]", chunk);
  });

  python.on("close", (code) => {
    console.log(`[INFO] Python script exited with code ${code}`);
    console.log(`[DEBUG] stdout length: ${stdoutData.length} bytes`);
    console.log(`[DEBUG] stderr length: ${stderrData.length} bytes`);

    // Function to clean up uploaded file
    const cleanupFile = () => {
      try {
        if (fs.existsSync(uploadedFilePath)) {
          fs.unlinkSync(uploadedFilePath);
          console.log("[INFO] Cleaned up uploaded file");
        }
      } catch (err) {
        console.error("[ERROR] Failed to delete uploaded file:", err);
      }
    };

    if (code !== 0) {
      console.error("[ERROR] Python script failed");
      console.error("[ERROR] stderr:", stderrData);
      cleanupFile();
      return res.status(500).json({
        success: false,
        error: "Python script failed",
        details: stderrData || "Script exited with non-zero code",
        exit_code: code,
      });
    }

    // Check if stdout is empty
    if (!stdoutData || stdoutData.trim().length === 0) {
      console.error("[ERROR] Python script produced no output");
      cleanupFile();
      return res.status(500).json({
        success: false,
        error: "Python script produced no output",
        details: "The analysis script did not return any results",
        stderr: stderrData,
      });
    }

    try {
      // Log the raw output for debugging
      console.log("[DEBUG] Raw stdout:", stdoutData.substring(0, 500));

      // Try to find JSON in the output (in case there's extra text)
      let jsonStr = stdoutData.trim();

      // Find the first '{' and last '}'
      const firstBrace = jsonStr.indexOf("{");
      const lastBrace = jsonStr.lastIndexOf("}");

      if (firstBrace !== -1 && lastBrace !== -1) {
        jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
      }

      // Parse JSON output from Python
      const result = JSON.parse(jsonStr);
      console.log("[INFO] Successfully parsed JSON result");

      if (!result.success) {
        console.error("[ERROR] Analysis failed:", result.error);
        cleanupFile();
        return res.status(400).json(result);
      }

      // Verify Excel file was created
      const excelPath = path.join(resultsDir, result.excel_file);
      if (!fs.existsSync(excelPath)) {
        console.error("[ERROR] Excel file not found:", excelPath);
        cleanupFile();
        return res.status(500).json({
          success: false,
          error: "Excel file was not created",
          expected_path: excelPath,
        });
      }

      console.log("[SUCCESS] Analysis completed successfully");
      console.log(`[INFO] Excel file created: ${result.excel_file}`);
      console.log(
        `[INFO] Total keywords: ${result.summary?.total_keywords || "N/A"}`
      );

      // Clean up uploaded file AFTER successful processing
      cleanupFile();

      // Send response with download link and data
      res.json({
        success: true,
        message: "Analysis completed successfully",
        downloadUrl: `/api/v1/analysis/download/${result.excel_file}`,
        excelFile: result.excel_file,
        dataSource: result.data_source,
        summary: result.summary,
        onpageResults: result.onpage_results || [],
        keywordMapping: result.keyword_mapping || [],
      });
    } catch (parseError) {
      console.error("[ERROR] Failed to parse JSON:", parseError.message);
      console.error("[ERROR] stdout was:", stdoutData.substring(0, 1000));
      cleanupFile();
      res.status(500).json({
        success: false,
        error: "Failed to parse analysis results",
        details: parseError.message,
        raw_output: stdoutData.substring(0, 1000), // First 1000 chars for debugging
        stderr: stderrData,
      });
    }
  });

  python.on("error", (err) => {
    console.error("[ERROR] Failed to spawn Python process:", err);

    // Clean up uploaded file on error
    try {
      if (fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
    } catch (unlinkErr) {
      console.error("[ERROR] Failed to delete uploaded file:", unlinkErr);
    }

    res.status(500).json({
      success: false,
      error: "Failed to execute Python script",
      details: err.message,
      hint: "Make sure Python is installed and in PATH",
    });
  });

  // Set a timeout (e.g., 10 minutes)
  const timeout = setTimeout(() => {
    console.error("[ERROR] Analysis timeout - killing Python process");
    python.kill();

    try {
      if (fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
    } catch (err) {
      console.error("[ERROR] Failed to delete uploaded file:", err);
    }

    res.status(504).json({
      success: false,
      error: "Analysis timeout",
      details: "The analysis took too long and was terminated",
    });
  }, 600000); // 10 minutes

  // Clear timeout if process completes
  python.on("close", () => {
    clearTimeout(timeout);
  });
}

module.exports = {
  analyzeFileController,
  ensureDir,
};
