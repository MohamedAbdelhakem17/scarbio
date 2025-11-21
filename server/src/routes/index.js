const ContactusRouter = require("./contactus-route/contactus.route");

const { initAnalysisRouter } = require("./analysis-router/analysis-router");

let pyScriptPath = require("path").join(__dirname, "../service/analyser.py");

const AppRouter = (app, server) => {
  app.use("/api/v1/contactus", ContactusRouter);
  app.use("/api/v1/analysis", initAnalysisRouter(pyScriptPath));
};

module.exports = AppRouter;
