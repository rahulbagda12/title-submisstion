import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <header className="bg-base-800 border-b border-base-700 p-4 shadow-sm">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-500 to-purple-400 bg-clip-text text-transparent">
           Project Title Submission
            </h1>

          </div>
        </header>

        <main className="flex-1 container mx-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        <footer className="bg-base-900 border-t border-base-800 p-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} ATMIYA UNIVERSITY Project Portal
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
