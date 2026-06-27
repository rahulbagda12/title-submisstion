import { useState, useEffect } from "react";
import axios from "axios";
import { FiDownload, FiSearch, FiTrash2, FiEdit2, FiLoader } from "react-icons/fi";

const API_BASE = import.meta.env.VITE_API_BASE || (window.location.hostname === "localhost" ? "http://localhost:5000/api" : "/api");

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/admin/submissions`, {
        params: { search: search || undefined },
      });
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // debounce search
    const timer = setTimeout(() => {
      fetchSubmissions();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) return;
    try {
      await axios.delete(`${API_BASE}/admin/submissions/${id}`);
      fetchSubmissions();
    } catch (err) {
      alert("Failed to delete record.");
    }
  };

  const handleExport = () => {
    // Open in new tab to trigger download
    window.location.href = `${API_BASE}/admin/export`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Bar */}
      <div className="p-4 border-b border-base-700 bg-base-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, enrollment, division, sub-division..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-base-900 border border-base-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
        </div>
        
        <button
          onClick={handleExport}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-success-500 hover:bg-success-400 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          <FiDownload />
          Export to Excel
        </button>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-base-900 text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Enrollment</th>
              <th className="px-4 py-3">Div</th>
              <th className="px-4 py-3">Sub Div</th>
              <th className="px-4 py-3">Partner Name</th>
              <th className="px-4 py-3">Partner Enr.</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Tech</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-700">
            {loading ? (
              <tr>
                <td colSpan="9" className="px-4 py-12 text-center">
                  <FiLoader className="mx-auto animate-spin text-primary-500 w-8 h-8" />
                </td>
              </tr>
            ) : submissions.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-4 py-12 text-center text-gray-500">
                  No submissions found.
                </td>
              </tr>
            ) : (
              submissions.map((s) => (
                <tr key={s._id} className="hover:bg-base-700/50 transition">
                  <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                    {s.fullName}
                  </td>
                  <td className="px-4 py-3 text-primary-400">{s.enrollmentNumber}</td>
                  <td className="px-4 py-3"><span className="bg-base-900 border border-base-600 px-2 py-0.5 rounded text-xs font-bold">{s.division}</span></td>
                  <td className="px-4 py-3"><span className="bg-base-900 border border-base-600 px-2 py-0.5 rounded text-xs font-bold">{s.subDivision}</span></td>
                  <td className="px-4 py-3">{s.partnerFullName}</td>
                  <td className="px-4 py-3 text-primary-400">{s.partnerEnrollment}</td>
                  <td className="px-4 py-3 max-w-xs truncate" title={s.projectTitle}>{s.projectTitle}</td>
                  <td className="px-4 py-3">{s.technology}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => alert("Edit feature coming soon!")} className="p-1.5 text-gray-400 hover:text-white hover:bg-base-600 rounded transition">
                        <FiEdit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(s._id)} className="p-1.5 text-error-500 hover:text-white hover:bg-error-500 rounded transition">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
