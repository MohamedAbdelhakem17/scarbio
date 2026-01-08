const express = require("express");

const {
  getDataWithGoogle,
} = require("../controller/file-analysis-controller/file-analyze.controller");

const router = express.Router();

router.route("/").post(getDataWithGoogle);

module.exports = router;
