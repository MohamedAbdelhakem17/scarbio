const mongoose = require("mongoose");

const contactUSSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "First name is required"],
      minlength: [3, "First name must be at least 3 characters"],
      maxlength: [20, "First name must not exceed 20 characters"],
      match: [/^[A-Za-z\s]+$/, "First name should only contain letters"],
      trim: true,
    },
    last_name: {
      type: String,
      required: [true, "Last name is required"],
      minlength: [3, "Last name must be at least 3 characters"],
      maxlength: [20, "Last name must not exceed 20 characters"],
      match: [/^[A-Za-z\s]+$/, "Last name should only contain letters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      minlength: [10, "Phone number must be at least 10 digits"],
      maxlength: [15, "Phone number must not exceed 15 digits"],
      trim: true,
    },
    message: {
      type: String,
      minlength: [10, "Message should be at least 10 characters"],
      maxlength: [500, "Message should not exceed 500 characters"],
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent OverwriteModelError if the model is already compiled
const ContactUSModel =
  mongoose.models.Contacts || mongoose.model("Contacts", contactUSSchema);

module.exports = ContactUSModel;
