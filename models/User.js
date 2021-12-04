const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
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
        examinationsOf: String,
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

const User = mongoose.model("User", userSchema);
module.exports = User;
