// server.js
require("dotenv").config({
  path: require("path").join(__dirname, "../.env.local"),
});

const express = require("express");
const http = require("http");
const cors = require("cors");

const databaseConnect = require("./config/database-connection");
const HTTP_STATUS_TEXT = require("./libs/constant/http-status.constant");
const errorMiddlewareHandler = require("./libs/middleware/error-handler.middleware");
const AppError = require("./libs/utils/app-error");
const AppRouter = require("./routes");

const app = express();
const server = http.createServer(app);

databaseConnect();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:7000",
      "http://localhost:3000",
      "http://127.0.0.1:5500",
      "http://127.0.0.1:5501",
      "https://scarabio.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const pyScriptPath = require("path").join(__dirname, "../service/analyser.py");

// ========== APP ROUTER ==========
AppRouter(app);

// ========== ROUTE NOT FOUND ==========
app.all(/.*/, (req, res, next) => {
  next(
    new AppError(
      404,
      HTTP_STATUS_TEXT.ERROR,
      `This route ${req.originalUrl} not found.`
    )
  );
});

// ========== GLOBAL ERROR HANDLER ==========
app.use(errorMiddlewareHandler);

// ========== START SERVER ==========
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

process.on("unhandledRejection", (error) => {
  console.error(`❌ Unhandled Rejection: ${error.name} | ${error.message}`);
  server.close(() => process.exit(1));
});
