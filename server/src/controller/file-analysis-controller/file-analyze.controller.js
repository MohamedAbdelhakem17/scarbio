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
  let uploadedFilePath = null;

  // ✅ OPTION 1: File uploaded normally
  if (req.file) {
    uploadedFilePath = req.file.path;
  }

  // ✅ OPTION 2: Use existing file from uploads
  else if (req.body.filename) {
    const filePathFromUploads = path.join(uploadDir, req.body.filename);

    if (!fs.existsSync(filePathFromUploads)) {
      return res.status(400).json({
        success: false,
        error: "File not found in uploads folder",
        filename: req.body.filename,
      });
    }

    uploadedFilePath = filePathFromUploads;
  }

  // ❌ No file source
  else {
    return res.status(400).json({
      success: false,
      error: "No file uploaded or filename provided",
    });
  }
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

const getSites = async (req, res) => {
  const { tokens } = req.body;
  if (!tokens)
    return res.status(400).json({ status: "error", message: "Missing tokens" });

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials(tokens);

  const webmasters = google.webmasters({ version: "v3", auth: oauth2Client });

  try {
    const response = await webmasters.sites.list();
    res.json({ status: "success", sites: response.data.siteEntry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res
        .status(400)
        .json({ status: "error", message: "No code provided" });
    }

    if (!process.env.G_CLIENT_ID || !process.env.G_CLIENT_SECRET) {
      return res
        .status(500)
        .json({ status: "error", message: "Missing OAuth credentials" });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.G_CLIENT_ID,
      process.env.G_CLIENT_SECRET,
      "http://localhost:3000/success/"
    );

    const { tokens } = await oauth2Client.getToken(code);

    // Optionally: run Python script if needed
    const pyFile = path.join(
      __dirname,
      "../../service/analyze-with-google/gsc_step1.py"
    );

    const py = spawn("python", [pyFile], { stdio: ["pipe", "pipe", "pipe"] });
    py.stdin.write(JSON.stringify(tokens));
    py.stdin.end();

    let data = "",
      errorData = "";
    py.stdout.on("data", (chunk) => (data += chunk.toString()));
    py.stderr.on("data", (err) => (errorData += err.toString()));

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
        res.json({ status: "success", tokens, python: pythonResponse });
      } catch {
        res.status(500).json({
          status: "error",
          message: "Failed to parse Python output",
          details: data,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const getDataWithGoogle = async (req, res) => {
  try {
    const { url, tokens, start_date, end_date } = req.body;

    // ✅ Validation
    if (!url || !tokens?.access_token || !tokens?.refresh_token) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters",
      });
    }

    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
    }

    // ✅ Prepare input data
    const inputData = JSON.stringify({
      site_url: url,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      start_date,
      end_date,
    });

    // ✅ Python file path - استخدم مسار نسبي من جذر المشروع
    const pyFile = path.join(
      process.cwd(),
      "src/service/analyze-with-google/gsc_step2.py"
    );

    console.log("🔍 Checking Python file at:", pyFile);
    console.log("📂 Current directory (__dirname):", __dirname);
    console.log("📁 Process working directory:", process.cwd());

    // ✅ Check if Python file exists - استخدم existsSync بدلاً من async access
    if (!fs.existsSync(pyFile)) {
      return res.status(500).json({
        success: false,
        message: "Python script not found",
        path: pyFile,
        cwd: process.cwd(),
        __dirname,
      });
    }

    console.log("✅ Python file found!");

    // ✅ Spawn Python process
    const py = spawn("python", [pyFile], {
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, PYTHONIOENCODING: "utf-8" },
    });

    let output = "";
    let errorOutput = "";
    let jsonOutput = "";

    // ✅ Collect stdout
    py.stdout.on("data", (data) => {
      const chunk = data.toString();
      output += chunk;

      // محاولة استخراج JSON من الناتج
      const jsonMatch = chunk.match(/\{[\s\S]*"success"[\s\S]*\}/);
      if (jsonMatch) {
        jsonOutput = jsonMatch[0];
      }
    });

    // ✅ Collect stderr
    py.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    // ✅ Send input to Python
    py.stdin.write(inputData);
    py.stdin.end();

    // ✅ Timeout after 60 seconds
    const timeout = setTimeout(() => {
      py.kill();
      res.status(408).json({
        success: false,
        message: "Request timeout - Process took too long",
      });
    }, 60000);

    // ✅ Handle process completion
    py.on("close", async (code) => {
      clearTimeout(timeout);

      console.log("📊 Python Process Closed:");
      console.log("Exit Code:", code);
      console.log("Output Length:", output.length);
      console.log("Error Output:", errorOutput);

      if (code !== 0) {
        return res.status(500).json({
          success: false,
          message: "Python process failed",
          exitCode: code,
          error: errorOutput || "Unknown error",
          output: output.substring(0, 500),
        });
      }

      try {
        // محاولة استخراج JSON من الناتج
        let result;

        if (jsonOutput) {
          result = JSON.parse(jsonOutput);
        } else {
          // محاولة إيجاد آخر JSON في الناتج
          const lines = output.split("\n");
          for (let i = lines.length - 1; i >= 0; i--) {
            if (lines[i].trim().startsWith("{")) {
              try {
                result = JSON.parse(lines[i]);
                break;
              } catch (e) {
                continue;
              }
            }
          }
        }

        if (!result) {
          throw new Error("No valid JSON found in output");
        }

        if (!result.success) {
          return res.status(400).json(result);
        }

        // ✅ Check if file was created
        const filename = result.filename;
        if (filename) {
          const filePath = path.join(process.cwd(), filename);

          try {
            const fileStats = await fsPromises.stat(filePath);
            result.file = {
              path: filePath,
              name: filename,
              size: fileStats.size,
              sizeKB: (fileStats.size / 1024).toFixed(2),
              created: fileStats.birthtime,
            };
          } catch (err) {
            console.warn("⚠️ File not found:", filePath);
          }
        }

        // ✅ Return success response
        res.json({
          success: true,
          message: "Data fetched and saved successfully",
          ...result,
          logs: output
            .split("\n")
            .filter(
              (line) =>
                line.includes("✅") ||
                line.includes("📊") ||
                line.includes("📁")
            ),
        });
      } catch (err) {
        console.error("❌ Parse Error:", err);

        res.status(500).json({
          success: false,
          message: "Failed to parse Python output",
          error: err.message,
          rawOutput: output.substring(0, 1000),
          errorOutput: errorOutput,
        });
      }
    });

    // ✅ Handle process error
    py.on("error", (err) => {
      clearTimeout(timeout);
      console.error("❌ Python Process Error:", err);

      res.status(500).json({
        success: false,
        message: "Failed to start Python process",
        error: err.message,
      });
    });
  } catch (error) {
    console.error("❌ Controller Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  analyzeFileController,
  ensureDir,
  getSites,
  getDataWithGoogle,
  login,
};
