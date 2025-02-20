const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema(
  {
    registerNumber: {
      type: String,
      unique: true,
    },
    name: String,
    results: [
      {
        registrationNumber: String,
        studentName: String,
        degree: String,
        course: String,
        college: String,
        examinationsOf: {
          type: String,
          unique: true,
          required: true,
        },
        pdfDownloadUrl: String,
        markSheet: [
          {
            semester: String,
            subjectName: String,
            subjectCode: String,
            component: String,
            marks: String,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
    strict: false,
  }
);

const User = mongoose.model("Student", ResultSchema);
module.exports = User;
