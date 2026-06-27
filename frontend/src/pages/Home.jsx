import StudentForm from "../components/StudentForm";

const TECH_ICONS = [
  {
    name: "React",
    color: "#61dafb",
    svg: (
      <svg viewBox="0 0 64 64" className="w-10 h-10" aria-hidden="true">
        <circle cx="32" cy="32" r="4" fill="#61dafb" />
        <ellipse cx="32" cy="32" rx="22" ry="9" fill="none" stroke="#61dafb" strokeWidth="3" />
        <ellipse cx="32" cy="32" rx="22" ry="9" transform="rotate(60 32 32)" fill="none" stroke="#61dafb" strokeWidth="3" />
        <ellipse cx="32" cy="32" rx="22" ry="9" transform="rotate(120 32 32)" fill="none" stroke="#61dafb" strokeWidth="3" />
      </svg>
    ),
  },
  {
    name: "Node.js",
    color: "#8cc84b",
    svg: (
      <svg viewBox="0 0 64 64" className="w-10 h-10" aria-hidden="true">
        <path d="M32 5 54 17v30L32 59 10 47V17L32 5Z" fill="none" stroke="#8cc84b" strokeWidth="4" />
        <path d="M32 20v24m-10-8 10 8 10-8" stroke="#8cc84b" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "MongoDB",
    color: "#00ed64",
    svg: (
      <svg viewBox="0 0 64 64" className="w-10 h-10" aria-hidden="true">
        <path d="M32 8c6 8 10 17 10 27 0 10-4 17-10 21-6-4-10-11-10-21 0-10 4-19 10-27Z" fill="none" stroke="#00ed64" strokeWidth="4" />
        <path d="M32 12v40" stroke="#00ed64" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Python",
    color: "#ffd43b",
    svg: (
      <svg viewBox="0 0 64 64" className="w-10 h-10" aria-hidden="true">
        <rect x="12" y="12" width="24" height="20" rx="8" fill="none" stroke="#ffd43b" strokeWidth="4" />
        <rect x="28" y="32" width="24" height="20" rx="8" fill="none" stroke="#3776ab" strokeWidth="4" />
        <circle cx="24" cy="22" r="2.5" fill="#ffd43b" />
        <circle cx="40" cy="42" r="2.5" fill="#3776ab" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="rounded-3xl p-6 md:p-10 border border-base-700 bg-base-800/70 backdrop-blur-sm relative overflow-hidden hero-enter">
        <div className="hero-mesh" />
        <div className="relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-base-600 bg-base-900/70 text-xs uppercase tracking-[0.18em] text-gray-300">
            ATMIYA UNIVERSITY
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Submit Your Project Title</h2>
            <p className="text-gray-300 md:text-lg max-w-3xl">
              Register your project in one place with accurate student, partner, and technology details.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-2">
            {TECH_ICONS.map((tech, index) => (
              <div
                key={tech.name}
                className="tech-card"
                style={{ "--delay": `${index * 120}ms`, "--tech-color": tech.color }}
              >
                <div className="tech-orb">{tech.svg}</div>
                <p className="text-sm font-semibold text-gray-100">{tech.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-base-800 p-6 md:p-8 rounded-2xl shadow-xl border border-base-700 backdrop-blur-sm relative overflow-hidden form-enter">
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <StudentForm />
      </div>
    </div>
  );
}
