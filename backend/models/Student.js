const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    enrollmentNumber: {
      type: String,
      required: [true, "Enrollment number is required"],
      unique: true,
      match: [/^\d{9}$/, "Enrollment number must be exactly 9 digits"],
      trim: true,
    },
    division: {
      type: String,
      required: [true, "Division is required"],
      enum: [
        "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "C11",
        "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8",
      ],
    },
    subDivision: {
      type: String,
      required: [true, "Sub-division is required"],
      enum: ["X", "Y"],
    },
    partnerFullName: {
      type: String,
      required: [true, "Partner full name is required"],
      trim: true,
    },
    partnerEnrollment: {
      type: String,
      required: [true, "Partner enrollment number is required"],
      match: [/^\d{9}$/, "Partner enrollment number must be exactly 9 digits"],
      trim: true,
    },
    projectTitle: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    technology: {
      type: String,
      required: [true, "Technology is required"],
      trim: true,
    },
    // BCA divisions
    C1: { type: String, trim: true },
    C2: { type: String, trim: true },
    C3: { type: String, trim: true },
    C4: { type: String, trim: true },
    C5: { type: String, trim: true },
    C6: { type: String, trim: true },
    C7: { type: String, trim: true },
    C8: { type: String, trim: true },
    C9: { type: String, trim: true },
    C10: { type: String, trim: true },
    C11: { type: String, trim: true },
    // BSc IT divisions
    F1: { type: String, trim: true },
    F2: { type: String, trim: true },
    F3: { type: String, trim: true },
    F4: { type: String, trim: true },
    F5: { type: String, trim: true },
    F6: { type: String, trim: true },
    F7: { type: String, trim: true },
    F8: { type: String, trim: true },
    submissionDate: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
  },
  { timestamps: true }
);

// Helper to convert to Camel Case
studentSchema.pre("save", function (next) {
  const toCamelCase = (str) =>
    str
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  this.fullName = toCamelCase(this.fullName);
  if (this.partnerFullName) {
    this.partnerFullName = toCamelCase(this.partnerFullName);
  }
  next();
});

module.exports = mongoose.model("Student", studentSchema);
