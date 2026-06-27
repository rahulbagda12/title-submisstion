const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

const VALID_DIVISIONS = [
  "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "C11",
  "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8",
];
const VALID_SUB_DIVISIONS = ["X", "Y"];

// Helper: word count validation
const isValidTitle = (title) => title.trim().split(/\s+/).length >= 10;

// Helper: enrollment regex
const isValidEnrollment = (enr) => /^\d{9}$/.test(enr);

// POST /api/students — Submit new project
router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      enrollmentNumber,
      division,
      subDivision,
      partnerFullName,
      partnerEnrollment,
      projectTitle,
      technology,
      // BCA divisions
      C1, C2, C3, C4, C5, C6, C7, C8, C9, C10, C11,
      // BSc IT divisions
      F1, F2, F3, F4, F5, F6, F7, F8,
    } = req.body;

    const normalizedDivision = (division || "").toString().trim().toUpperCase();
    const normalizedSubDivision = (subDivision || "").toString().trim().toUpperCase();

    // --- Field-level validation ---
    if (!fullName) {
      return res.status(400).json({ error: "Full name is required." });
    }
    if (!partnerFullName) {
      return res.status(400).json({ error: "Partner full name is required." });
    }
    if (!isValidEnrollment(enrollmentNumber)) {
      return res
        .status(400)
        .json({ error: "Enrollment number must be exactly 9 digits." });
    }
    if (!VALID_DIVISIONS.includes(normalizedDivision)) {
      return res.status(400).json({ error: "Invalid division. Must be C1-C11 or F1-F8." });
    }
    if (!VALID_SUB_DIVISIONS.includes(normalizedSubDivision)) {
      return res.status(400).json({ error: "Sub-division must be X or Y." });
    }
    if (!isValidEnrollment(partnerEnrollment)) {
      return res
        .status(400)
        .json({ error: "Partner enrollment number must be exactly 9 digits." });
    }
    if (enrollmentNumber === partnerEnrollment) {
      return res
        .status(400)
        .json({ error: "You cannot select yourself as a partner." });
    }
    if (!isValidTitle(projectTitle)) {
      return res.status(400).json({
        error:
          "Project title is too short. Please provide a detailed descriptive title of at least 10 words.",
      });
    }
    if (!technology || technology.trim() === "") {
      return res
        .status(400)
        .json({ error: "Please provide the technology used." });
    }

    // Prevent resubmission by the same enrollment number
    const existingSubmission = await Student.findOne({ enrollmentNumber });
    if (existingSubmission) {
      return res.status(409).json({
        error: "This enrollment number has already submitted a project and cannot resubmit.",
      });
    }

    // --- Division match check ---
    // If the partner exists in the DB, enforce division match
    const partner = await Student.findOne({ enrollmentNumber: partnerEnrollment });
    if (
      partner &&
      (partner.division !== normalizedDivision || partner.subDivision !== normalizedSubDivision)
    ) {
      return res.status(400).json({
        error: "Your partner is registered in a different division/sub-division. Partners must be from the same group.",
      });
    }

    // --- Save student ---
    const student = new Student({
      fullName,
      enrollmentNumber,
      division: normalizedDivision,
      subDivision: normalizedSubDivision,
      partnerFullName,
      partnerEnrollment,
      projectTitle,
      technology,
      // BCA divisions
      C1, C2, C3, C4, C5, C6, C7, C8, C9, C10, C11,
      // BSc IT divisions
      F1, F2, F3, F4, F5, F6, F7, F8,
      submissionDate: new Date().toISOString().split("T")[0],
    });

    await student.save();

    res.status(201).json({
      message: "Project submitted successfully!",
      data: student,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        error: "A submission with this enrollment number already exists. Duplicate submissions are not allowed.",
      });
    }
    console.error("❌ Error in student submission:", err);
    res.status(500).json({ error: `Server error: ${err.message}` });
  }
});

// GET /api/students/division/:div — Fetch students by division (for partner dropdown)
router.get("/division/:div", async (req, res) => {
  try {
    const normalizedDivision = (req.params.div || "").toString().trim().toUpperCase();
    const normalizedSubDivision = (req.query.subDiv || "").toString().trim().toUpperCase();

    if (!VALID_DIVISIONS.includes(normalizedDivision)) {
      return res.status(400).json({ error: "Invalid division." });
    }
    if (!VALID_SUB_DIVISIONS.includes(normalizedSubDivision)) {
      return res.status(400).json({ error: "Invalid sub-division." });
    }
    const students = await Student.find(
      { division: normalizedDivision, subDivision: normalizedSubDivision },
      { enrollmentNumber: 1, fullName: 1, _id: 0 }
    );
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
