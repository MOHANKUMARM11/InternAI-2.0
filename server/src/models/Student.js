const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    college: {
      type: String,
      default: "",
    },

    department: {
      type: String,
      default: "",
    },

    cgpa: {
      type: Number,
      default: 0,
    },

    skills: [
      {
        type: String,
      },
    ],

    education: [
      {
        degree: String,
        institution: String,
        year: String,
      },
    ],

    projects: [
      {
        title: String,
        description: String,
        technologies: [String],
      },
    ],

    resumeUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);