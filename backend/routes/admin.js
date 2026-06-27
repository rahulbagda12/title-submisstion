const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const XLSX = require("xlsx");

// GET /api/admin/submissions — Fetch all with optional search
router.get("/submissions", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { partnerFullName: { $regex: search, $options: "i" } },
          { enrollmentNumber: { $regex: search, $options: "i" } },
          { division: { $regex: search, $options: "i" } },
          { subDivision: { $regex: search, $options: "i" } },
          { projectTitle: { $regex: search, $options: "i" } },
        ],
      };
    }
    const students = await Student.find(query).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

// PUT /api/admin/submissions/:id — Edit a submission
router.put("/submissions/:id", async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "Record not found." });
    res.json({ message: "Updated successfully.", data: updated });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

// DELETE /api/admin/submissions/:id — Delete a submission
router.delete("/submissions/:id", async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Record not found." });
    res.json({ message: "Deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

// GET /api/admin/export — Export all submissions as XLSX
router.get("/export", async (req, res) => {
  try {
    const students = await Student.find().sort({ submissionDate: 1 });

    const data = students.map((s, i) => ({
      "#": i + 1,
      "Full Name": s.fullName,
      "Enrollment Number": s.enrollmentNumber,
      Division: s.division,
      "Sub-Division": s.subDivision,
      "Partner Name": s.partnerFullName,
      "Partner Enrollment": s.partnerEnrollment,
      "Project Title": s.projectTitle,
      Technology: s.technology,
      "Submission Date": s.submissionDate,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    // Auto column widths
    const colWidths = [
      { wch: 5 },   // #
      { wch: 25 },  // Full Name
      { wch: 18 },  // Enrollment
      { wch: 10 },  // Division
      { wch: 12 },  // Sub-Division
      { wch: 25 },  // Partner Name
      { wch: 18 },  // Partner
      { wch: 60 },  // Title
      { wch: 30 },  // Technology
      { wch: 16 },  // Date
    ];
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=project-submissions.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: "Export failed." });
  }
});

module.exports = router;
