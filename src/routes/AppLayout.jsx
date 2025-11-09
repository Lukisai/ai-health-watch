import { Outlet, NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AppLayout() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const link = (to, label) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-2 py-1 rounded-lg ${isActive ? "bg-slate-200 dark:bg-slate-800" : "hover:bg-slate-100 dark:hover:bg-slate-800/60"}`
      }
    >
      {label}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-20 backdrop-blur border-b border-slate-200/70 dark:border-slate-700/60">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-2xl grid place-items-center bg-gradient-to-br from-indigo-600 to-blue-500 text-white">※</div>
            <span className="font-semibold tracking-tight">AI Health Watch</span>
            <span className="ml-3 text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">beta</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            {link("/", "Home")}
            {link("/report", "Report Harm")}
            {link("/cases", "Cases")}
            {link("/youth", "Youth & Educators")}
            {link("/methodology", "Methodology")}
            {link("/get-involved", "Get Involved")}
            {link("/privacy", "Privacy")}
          </nav>
          <button onClick={() => setDark(d => !d)} className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700">
            {dark ? "🌙" : "☀️"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <CrisisBanner />
        <Outlet />
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-10 text-xs text-slate-500 space-y-2">
        <p>This site evaluates chatbot safety signals. It is not a diagnostic or emergency service.</p>
        <p>© {new Date().getFullYear()} AI Health Watch — <Link className="underline" to="/privacy">Privacy & Ethics</Link></p>
      </footer>
    </div>
  );
}

function CrisisBanner() {
  return (
    <div className="mb-6 p-3 rounded-2xl border border-amber-300 bg-amber-50 text-amber-900">
      If you’re in immediate danger or thinking about self-harm, call local emergency services. In the U.S., dial <strong>988</strong>.
    </div>
  );
}