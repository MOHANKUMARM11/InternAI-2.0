const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    mode: {
      type: String,
      enum: ["Onsite", "Remote", "Hybrid"],
      required: true,
    },

    stipend: {
      type: Number,
      required: true,
      min: 0,
    },

    duration: {
      type: String,
      required: true,
    },

    skillsRequired: [
      {
        type: String,
        trim: true,
      },
    ],

    eligibility: {
      type: String,
      default: "",
    },

    applicationDeadline: {
      type: Date,
      required: true,
    },

    openings: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["Open", "Closed", "Draft"],
      default: "Open",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Internship", internshipSchema);