// file-C.controller.js
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

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

// analyze with google
const getCode = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        status: "error",
        message: "No authorization code provided",
      });
    }

    console.log("Received code:", code.substring(0, 10) + "...");

    // Verify environment variables
    if (!process.env.G_CLIENT_ID || !process.env.G_CLIENT_SECRET) {
      return res.status(500).json({
        status: "error",
        message: "Missing OAuth credentials in environment variables",
      });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.G_CLIENT_ID,
      process.env.G_CLIENT_SECRET,
      process.env.G_REDIRECT_URL
    );

    console.log("Attempting to exchange code for tokens...");
    const { tokens } = await oauth2Client.getToken(code);
    console.log("Successfully received tokens");

    // Run Python Step 1
    const pyFile = path.join(
      __dirname,
      "../../service/analyze-with-google/gsc_step1.py"
    );

    const py = spawn("python", [pyFile], { stdio: ["pipe", "pipe", "pipe"] });

    py.stdin.write(JSON.stringify(tokens));
    py.stdin.end();

    let data = "";
    let errorData = "";

    py.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    py.stderr.on("data", (err) => {
      errorData += err.toString();
      console.error("Python stderr:", err.toString());
    });

    py.on("close", (exitCode) => {
      if (exitCode !== 0) {
        return res.status(500).json({
          status: "error",
          message: "Python script failed",
          details: errorData,
        });
      }

      try {
        const pythonResponse = JSON.parse(data);

        return res.json({
          status: "success",
          python: pythonResponse,
          tokens: tokens,
        });
      } catch (parseError) {
        return res.status(500).json({
          status: "error",
          message: "Failed to parse Python output",
          details: data,
        });
      }
    });
  } catch (error) {
    console.error("OAuth error:", error);

    if (error.code === "invalid_grant") {
      return res.status(400).json({
        status: "error",
        message:
          "Authorization code is invalid or expired. Please authenticate again.",
        hint: "The code may have already been used or has expired",
      });
    }

    res.status(500).json({
      status: "error",
      message: error.message || "Failed to exchange authorization code",
      details: error.response?.data || error.toString(),
    });
  }
};

const getDataWithGoogle = async (req, res) => {
  try {
    const { url, tokens, start_date, end_date } = req.body;

    const inputData = JSON.stringify({
      site_url: url,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      start_date,
      end_date,
    });

    const pyFile = path.join(
      __dirname,
      "../../service/analyze-with-google/gsc_step2.py"
    );

    const py = spawn("python", [pyFile], { stdio: ["pipe", "pipe", "pipe"] });

    let output = "";
    let errorOutput = "";

    py.stdout.on("data", (data) => {
      output += data.toString();
    });

    py.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    py.stdin.write(inputData);
    py.stdin.end();

    py.on("close", (code) => {
      if (errorOutput) {
        return res.status(500).json({
          success: false,
          message: "Python script error",
          details: errorOutput,
        });
      }

      try {
        const result = JSON.parse(output);
        res.json(result);
      } catch (err) {
        res.status(500).json({
          success: false,
          message: "Failed to parse Python output",
          details: output,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  analyzeFileController,
  ensureDir,
  getCode,
  getDataWithGoogle,
};
