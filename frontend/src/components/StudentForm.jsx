import { useState, useEffect } from "react";
import axios from "axios";
import { FiCheckCircle, FiAlertCircle, FiLoader } from "react-icons/fi";
import clsx from "clsx";

const API_BASE = import.meta.env.VITE_API_BASE || (window.location.hostname === "localhost" ? "http://localhost:5000/api" : "/api");
// BCA Semester 5: C1–C11 | BSc IT Semester 5: F1–F8
const DIVISIONS = [
  "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "C11",
  "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8",
];
const SUB_DIVISIONS = ["X", "Y"];

const toCamelCase = (str) =>
  str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

const wordCount = (value) => value.trim().split(/\s+/).filter(Boolean).length;

export default function StudentForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    enrollmentNumber: "",
    division: "",
    subDivision: "",
    partnerFullName: "",
    partnerEnrollment: "",
    projectTitle: "",
    technology: "",
    // BCA divisions
    C1: "", C2: "", C3: "", C4: "", C5: "",
    C6: "", C7: "", C8: "", C9: "", C10: "", C11: "",
    // BSc IT divisions
    F1: "", F2: "", F3: "", F4: "", F5: "",
    F6: "", F7: "", F8: "",
  });

  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch partners when division or sub-division changes
  useEffect(() => {
    if (formData.division && formData.subDivision) {
      axios
        .get(
          `${API_BASE}/students/division/${formData.division}?subDiv=${formData.subDivision}`
        )
        .then((res) => setPartners(res.data))
        .catch(() => setPartners([]));
    } else {
      setPartners([]);
    }
    // reset partner fields when division/sub-division changes
    setFormData((prev) => ({ ...prev, partnerEnrollment: "", partnerFullName: "" }));
  }, [formData.division, formData.subDivision]);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "fullName" || name === "partnerFullName") {
      setFormData((prev) => ({ ...prev, [name]: toCamelCase(value) }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (wordCount(formData.fullName) < 3) {
      return setError("Full name must contain at least 3 words.");
    }
    if (wordCount(formData.partnerFullName) < 3) {
      return setError("Partner full name must contain at least 3 words.");
    }
    // Basic frontend validation to show immediate errors
    if (!/^\d{9}$/.test(formData.enrollmentNumber)) {
      return setError("Enrollment number must be exactly 9 digits.");
    }
    if (formData.projectTitle.trim().split(/\s+/).length < 10) {
      return setError("Project title is too short. Please provide a detailed descriptive title (min 10 words).");
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/students`, formData);
      setSuccess(true);
      setFormData({
        fullName: "",
        enrollmentNumber: "",
        division: "",
        subDivision: "",
        partnerFullName: "",
        partnerEnrollment: "",
        projectTitle: "",
        technology: "",
        // BCA divisions
        C1: "", C2: "", C3: "", C4: "", C5: "",
        C6: "", C7: "", C8: "", C9: "", C10: "", C11: "",
        // BSc IT divisions
        F1: "", F2: "", F3: "", F4: "", F5: "",
        F6: "", F7: "", F8: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred while submitting."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-base-900 border border-base-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition";
  const labelClass = "block text-sm font-medium text-gray-400 mb-1";

  if (success) {
    return (
      <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in duration-500">
        <FiCheckCircle className="mx-auto text-success-500 w-16 h-16" />
        <h3 className="text-2xl font-bold text-white">Submission Successful!</h3>
        <p className="text-gray-400">Your project details have been recorded.</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 bg-primary-600 hover:bg-primary-500 text-white font-medium py-2 px-6 rounded-lg transition"
        >
          Submit Another Project
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-error-500/10 border border-error-500/50 text-error-500 p-4 rounded-lg flex items-start gap-3">
          <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className={labelClass}>Full Name</label>
          <input
            required
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass}
            placeholder="Enter full name with 3 words"
          />
          <p className="mt-1 text-xs text-gray-500">Use a 3-word name, for example: John Robert Doe.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={labelClass}>Enrollment Number</label>
          <input
            required
            name="enrollmentNumber"
            value={formData.enrollmentNumber}
            onChange={handleChange}
            placeholder="e.g. 230120345"
            maxLength={9}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Division</label>
          <select
            required
            name="division"
            value={formData.division}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="" disabled>Select Division</option>
            <optgroup label="B.C.A – Semester 5">
              {["C1","C2","C3","C4","C5","C6","C7","C8","C9","C10","C11"].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </optgroup>
            <optgroup label="B.Sc. I.T. – Semester 5">
              {["F1","F2","F3","F4","F5","F6","F7","F8"].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </optgroup>
          </select>
        </div>
        <div>
          <label className={labelClass}>Sub-Division</label>
          <select
            required
            name="subDivision"
            value={formData.subDivision}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="" disabled>Select Sub-Division</option>
            {SUB_DIVISIONS.map((subDivision) => (
              <option key={subDivision} value={subDivision}>{subDivision}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={labelClass}>Project Partner</label>
          {formData.division && formData.subDivision && (
            <span className="text-xs font-bold bg-primary-500/20 text-primary-300 px-2 py-0.5 rounded">
              Group {formData.division}-{formData.subDivision} only
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Partner Division</label>
            <input
              type="text"
              readOnly
              value={formData.division || "Not selected"}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Partner Sub-Division</label>
            <input
              type="text"
              readOnly
              value={formData.subDivision || "Not selected"}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Partner Full Name</label>
            <input
              required
              name="partnerFullName"
              value={formData.partnerFullName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass}
              placeholder="Enter partner full name with 3 words"
            />
            {/* <p className="mt-1 text-xs text-gray-500">Partner name should also use 3 words.</p> */}
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Partner Enrollment Number</label>
            <input
              required
              name="partnerEnrollment"
              value={formData.partnerEnrollment}
              onChange={handleChange}
              placeholder="e.g. 230120346"
              maxLength={9}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass}>Project Title</label>
        <textarea
          required
          name="projectTitle"
          value={formData.projectTitle}
          onChange={handleChange}
          rows={3}
          className={inputClass}
          placeholder="An integrated e-commerce web application for automated online retail shopping and order management..."
        />
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>Must be at least 10 words.</span>
          <span className={clsx(
            formData.projectTitle.trim().split(/\s+/).filter(x => x).length < 10 ? "text-error-500" : "text-success-500"
          )}>
            Words: {formData.projectTitle.trim().split(/\s+/).filter(x => x).length}
          </span>
        </div>
      </div>

      <div>
        <label className={labelClass}>Technology Used</label>
        <input
          required
          name="technology"
          value={formData.technology}
          onChange={handleChange}
          className={inputClass}
          placeholder="e.g. MERN Stack, Django, etc."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold text-lg hover:from-primary-500 hover:to-purple-500 focus:ring-4 focus:ring-primary-500/50 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/25"
      >
        {loading ? <FiLoader className="animate-spin w-5 h-5" /> : "Submit Project"}
      </button>
    </form>
  );
}
