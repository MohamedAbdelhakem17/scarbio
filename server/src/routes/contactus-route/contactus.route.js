const express = require("express");

const {
  saveContactMessage,
} = require("../../controller/contactus-controller/contactus.controller");
const newContactUsValidator = require("../../libs/validators/contactus-validator");

const router = express.Router();

router.route("/").post(newContactUsValidator, async (req, res) => {
  return "none";
});

module.exports = router;
