import { useState } from "react";
import AdminDashboard from "../components/AdminDashboard";

const ADMIN_USERNAME = "rahul.bagda@atmiyauni.ac.in";
const ADMIN_PASSWORD = "Rahul@12";
const ADMIN_AUTH_KEY = "admin_authenticated";

export default function Admin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem(ADMIN_AUTH_KEY) === "true"
  );

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
      setIsAuthenticated(true);
      return;
    }

    setError("Invalid username or password.");
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    setError("");
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-base-800 rounded-2xl shadow-xl border border-base-700 p-6 md:p-8 space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-2xl font-extrabold tracking-tight">Admin Login</h2>
            <p className="text-gray-400 text-sm">Enter credentials to access the admin panel.</p>
          </div>

          {error && (
            <div className="bg-error-500/10 border border-error-500/40 text-error-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
              <input
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-base-900 border border-base-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                placeholder="Enter admin username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-base-900 border border-base-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                placeholder="Enter admin password"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight">Admin Portal</h2>
          <p className="text-gray-400">Manage submissions and export data.</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-base-700 hover:bg-base-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
      
      <div className="bg-base-800 rounded-2xl shadow-xl border border-base-700 overflow-hidden min-h-[500px]">
        <AdminDashboard />
      </div>
    </div>
  );
}
