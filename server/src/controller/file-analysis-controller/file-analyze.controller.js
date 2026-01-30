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

  if (req.file) {
    uploadedFilePath = req.file.path;
  } else if (req.body.filename) {
    const filePathFromUploads = path.join(uploadDir, req.body.filename);

    if (!fs.existsSync(filePathFromUploads)) {
      return res.status(400).json({
        success: false,
        error: "File not found in uploads folder",
        filename: req.body.filename,
      });
    }

    uploadedFilePath = filePathFromUploads;
  } else {
    return res.status(400).json({
      success: false,
      error: "No file uploaded or filename provided",
    });
  }

  const filterOption = req.body.filterOption || "all";

  if (!fs.existsSync(uploadedFilePath)) {
    return res.status(400).json({
      success: false,
      error: "Uploaded file not found",
    });
  }

  if (!fs.existsSync(pyScriptPath)) {
    return res.status(500).json({
      success: false,
      error: "Python script not found",
      path: pyScriptPath,
    });
  }

  ensureDir(resultsDir);

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
    const cleanupFile = () => {
      try {
        if (fs.existsSync(uploadedFilePath)) {
          fs.unlinkSync(uploadedFilePath);
        }
      } catch (err) {
        console.error("Failed to delete uploaded file:", err);
      }
    };

    if (code !== 0) {
      cleanupFile();
      return res.status(500).json({
        success: false,
        error: "Python script failed",
        details: stderrData || "Script exited with non-zero code",
        exit_code: code,
      });
    }

    if (!stdoutData || stdoutData.trim().length === 0) {
      cleanupFile();
      return res.status(500).json({
        success: false,
        error: "Python script produced no output",
        details: "The analysis script did not return any results",
        stderr: stderrData,
      });
    }

    try {
      let jsonStr = stdoutData.trim();

      const firstBrace = jsonStr.indexOf("{");
      const lastBrace = jsonStr.lastIndexOf("}");

      if (firstBrace !== -1 && lastBrace !== -1) {
        jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
      }

      const result = JSON.parse(jsonStr);

      if (!result.success) {
        cleanupFile();
        return res.status(400).json(result);
      }

      const excelPath = path.join(resultsDir, result.excel_file);
      if (!fs.existsSync(excelPath)) {
        cleanupFile();
        return res.status(500).json({
          success: false,
          error: "Excel file was not created",
          expected_path: excelPath,
        });
      }

      cleanupFile();

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
      cleanupFile();
      res.status(500).json({
        success: false,
        error: "Failed to parse analysis results",
        details: parseError.message,
        raw_output: stdoutData.substring(0, 1000),
        stderr: stderrData,
      });
    }
  });

  python.on("error", (err) => {
    try {
      if (fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
    } catch (unlinkErr) {
      console.error("Failed to delete uploaded file:", unlinkErr);
    }

    res.status(500).json({
      success: false,
      error: "Failed to execute Python script",
      details: err.message,
      hint: "Make sure Python is installed and in PATH",
    });
  });

  const timeout = setTimeout(() => {
    python.kill();

    try {
      if (fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
    } catch (err) {
      console.error("Failed to delete uploaded file:", err);
    }

    res.status(504).json({
      success: false,
      error: "Analysis timeout",
      details: "The analysis took too long and was terminated",
    });
  }, 600000);

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
      "http://localhost:3000/",
    );

    const { tokens } = await oauth2Client.getToken(code);

    const pyFile = path.join(
      __dirname,
      "../../service/analyze-with-google/gsc_step1.py",
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
    res.status(500).json({ status: "error", message: error.message });
  }
};

const getDataWithGoogle = async (req, res) => {
  try {
    const { url, tokens, start_date, end_date } = req.body;

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

    const inputData = JSON.stringify({
      site_url: url,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      start_date,
      end_date,
    });

    const pyFile = path.join(
      process.cwd(),
      "src/service/analyze-with-google/gsc_step2.py",
    );

    if (!fs.existsSync(pyFile)) {
      return res.status(500).json({
        success: false,
        message: "Python script not found",
        path: pyFile,
      });
    }

    const py = spawn("python", [pyFile], {
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, PYTHONIOENCODING: "utf-8" },
    });

    let output = "";
    let errorOutput = "";
    let jsonOutput = "";

    py.stdout.on("data", (data) => {
      const chunk = data.toString();
      output += chunk;

      const jsonMatch = chunk.match(/\{[\s\S]*"success"[\s\S]*\}/);
      if (jsonMatch) {
        jsonOutput = jsonMatch[0];
      }
    });

    py.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    py.stdin.write(inputData);
    py.stdin.end();

    const timeout = setTimeout(() => {
      py.kill();
      res.status(408).json({
        success: false,
        message: "Request timeout - Process took too long",
      });
    }, 60000);

    py.on("close", async (code) => {
      clearTimeout(timeout);

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
        let result;

        if (jsonOutput) {
          result = JSON.parse(jsonOutput);
        } else {
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

        const filename = result.filename;
        if (filename) {
          const filePath = path.join(process.cwd(), filename);

          try {
            const fileStats = await fs.promises.stat(filePath);
            result.file = {
              path: filePath,
              name: filename,
              size: fileStats.size,
              sizeKB: (fileStats.size / 1024).toFixed(2),
              created: fileStats.birthtime,
            };
          } catch (err) {}
        }

        res.json({
          success: true,
          message: "Data fetched and saved successfully",
          filename: result.filename,
          rowCount: result.count || 0,
          ...result,
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          message: "Failed to parse Python output",
          error: err.message,
          rawOutput: output.substring(0, 1000),
          errorOutput: errorOutput,
        });
      }
    });

    py.on("error", (err) => {
      clearTimeout(timeout);

      res.status(500).json({
        success: false,
        message: "Failed to start Python process",
        error: err.message,
      });
    });
  } catch (error) {
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
