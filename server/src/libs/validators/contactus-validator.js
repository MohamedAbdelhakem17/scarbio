const { check } = require("express-validator");
const validatorMiddleware = require("../middleware/validator.middleware");

const newContactUsValidator = [
  check("first_name")
    .notEmpty()
    .withMessage("First name cannot be blank")
    .isLength({ min: 3, max: 20 })
    .withMessage("First name must be between 3 and 20 characters")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("First name should only contain letters"),

  check("last_name")
    .notEmpty()
    .withMessage("Last name cannot be blank")
    .isLength({ min: 3, max: 20 })
    .withMessage("Last name must be between 3 and 20 characters")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Last name should only contain letters"),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),

  check("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 10, max: 15 })
    .withMessage("Phone number must be between 10 and 15 digits"),

  check("message")
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage("Message must be between 10 and 500 characters"),

  validatorMiddleware,
];

module.exports = newContactUsValidator;
