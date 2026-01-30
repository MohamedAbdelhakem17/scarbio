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

// databaseConnect();

app.use(express.json());

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: corsOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

// ========== APP ROUTER ==========
AppRouter(app);

// ========== ROUTE NOT FOUND ==========
app.all(/.*/, (req, res, next) => {
  next(
    new AppError(
      404,
      HTTP_STATUS_TEXT.ERROR,
      `This route ${req.originalUrl} not found.`,
    ),
  );
});

// ========== GLOBAL ERROR HANDLER ==========
app.use(errorMiddlewareHandler);

// ========== START SERVER ==========
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  // Server started successfully
});

process.on("unhandledRejection", (error) => {
  server.close(() => process.exit(1));
});
