import React, { useEffect, useMemo, useRef, useState } from "react";

// Simple, modern starter that feels like a website today and can grow into a web app.
// ✓ Dark mode with localStorage
// ✓ Interactive sections (accordion, modal)
// ✓ Tiny "app" feature: Notes with persistence + quick search
// ✓ Keyboard shortcuts (N = new note, / = search)
// ✓ Responsive layout, clean Tailwind styling

export default function App() {
  // Theme
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("theme") ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? "dark" : "light");
  });
  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  // Notes app state
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("notes-v1");
      return saved ? JSON.parse(saved) : [
        { id: cryptoRandom(), text: "Welcome! Click a note to edit it." },
        { id: cryptoRandom(), text: "Use N to create a new note, / to search." },
      ];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem("notes-v1", JSON.stringify(notes));
  }, [notes]);

  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(null);
  const activeNote = useMemo(() => notes.find(n => n.id === activeId) || null, [notes, activeId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(n => n.text.toLowerCase().includes(q));
  }, [notes, query]);

  function addNote() {
    const n = { id: cryptoRandom(), text: "" };
    setNotes([n, ...notes]);
    setActiveId(n.id);
    setShowDrawer(true);
  }

  function removeNote(id) {
    setNotes(notes.filter(n => n.id !== id));
    if (activeId === id) setActiveId(null);
  }

  function updateActive(text) {
    setNotes(notes.map(n => (n.id === activeId ? { ...n, text } : n)));
  }

  // Modal + Drawer
  const [showModal, setShowModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  // Keyboard shortcuts
  const searchRef = useRef(null);
  useEffect(() => {
    function onKey(e) {
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key.toLowerCase() === "n") {
        addNote();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowModal(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [notes]);

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 border-b border-slate-200/70 dark:border-slate-700/60">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="font-semibold tracking-tight">My Simple App</span>
            <span className="ml-3 text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">alpha</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes… (/ )"
              className="hidden md:block text-sm px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
            >
              Quick actions ⌘K
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: hero & features */}
        <section className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white/80 to-slate-50/60 dark:from-slate-900/60 dark:to-slate-800/60 shadow-sm">
            <h1 className="text-2xl font-semibold">A simple site that grows with you</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Start as a minimalist page. Add interactions. Evolve into a small web app without a rewrite.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="badge">Fast</span>
              <span className="badge">Accessible</span>
              <span className="badge">Responsive</span>
              <span className="badge">PWA-ready*</span>
            </div>
            <div className="mt-5 flex gap-2">
              <button onClick={addNote} className="btn-primary">New note (N)</button>
              <button onClick={() => setShowDrawer(true)} className="btn-ghost">Open editor</button>
            </div>
          </div>

          <Accordion title="What can I do here?">
            <ul className="list-disc ml-5 space-y-1 text-sm">
              <li>Toggle dark mode (saved to your device).</li>
              <li>Capture quick notes with instant search and local persistence.</li>
              <li>Open the command palette (⌘K / Ctrl+K) for shortcuts.</li>
            </ul>
          </Accordion>

          <Accordion title="How do I deploy this?">
            <ol className="list-decimal ml-5 space-y-1 text-sm">
              <li>Use the code as a starter in a React/Vite project.</li>
              <li>Deploy to Netlify/Vercel/GitHub Pages.</li>
              <li>Point your Namecheap domain via DNS (CNAME or A record).</li>
            </ol>
          </Accordion>
        </section>

        {/* Middle column: notes list */}
        <section className="lg:col-span-1 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/50">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Notes</h2>
            <button className="btn-ghost" onClick={() => setNotes([])}>Clear</button>
          </div>
          <div className="flex gap-2 mb-3 md:hidden">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes… (/ )"
              className="flex-1 text-sm px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70"
            />
            <button className="btn-primary" onClick={addNote}>New</button>
          </div>
          <ul className="space-y-2">
            {filtered.length === 0 && (
              <li className="text-sm text-slate-500">No notes found.</li>
            )}
            {filtered.map(n => (
              <li key={n.id} className={`group rounded-xl border border-slate-200 dark:border-slate-700 p-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/70 cursor-pointer ${activeId===n.id?"ring-2 ring-indigo-500":''}`}
                  onClick={() => {setActiveId(n.id); setShowDrawer(true);}}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {n.text.trim() || <span className="italic text-slate-400">(empty note)</span>}
                  </p>
                  <button
                    className="opacity-0 group-hover:opacity-100 transition btn-ghost"
                    onClick={(e) => { e.stopPropagation(); removeNote(n.id); }}
                    aria-label="Delete note"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Right column: mini widgets */}
        <section className="lg:col-span-1 space-y-6">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold mb-2">Counter</h3>
            <Counter />
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold mb-2">Contact (demo)</h3>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-8 text-xs text-slate-500">
        <p>Built with a tiny React starter. Ready to grow into a full app (routing, API, auth, and PWA can be added later).</p>
      </footer>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="space-y-3">
            <h3 className="font-semibold">Quick actions</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <button className="btn-primary" onClick={() => { addNote(); setShowModal(false); }}>New note</button>
              <button className="btn-ghost" onClick={() => { setShowDrawer(true); setShowModal(false); }}>Open editor</button>
              <button className="btn-ghost" onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); setShowModal(false); }}>Toggle theme</button>
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </Modal>
      )}

      {showDrawer && (
        <Drawer onClose={() => setShowDrawer(false)}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Editor</h3>
            <button className="btn-ghost" onClick={() => setShowDrawer(false)}>Close</button>
          </div>

          <div className="flex gap-2 mb-3">
            <select
              value={activeId || ""}
              onChange={(e) => setActiveId(e.target.value || null)}
              className="text-sm px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70"
            >
              <option value="">Select a note…</option>
              {notes.map(n => (
                <option key={n.id} value={n.id}>{(n.text || "(empty)").slice(0, 36)}</option>
              ))}
            </select>
            <button className="btn-primary" onClick={addNote}>New</button>
          </div>

          {activeNote ? (
            <textarea
              value={activeNote.text}
              onChange={(e) => updateActive(e.target.value)}
              placeholder="Write something…"
              className="w-full h-[40vh] text-sm px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70"
            />
          ) : (
            <p className="text-sm text-slate-500">Pick a note from the dropdown or create a new one.</p>
          )}
        </Drawer>
      )}

      {/* Utility styles */}
    </div>
  );
}

function Counter() {
  const [n, setN] = useState(0);
  return (
    <div className="flex items-center gap-2">
      <button className="btn-ghost" onClick={() => setN(n-1)}>-</button>
      <span className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 min-w-12 text-center">{n}</span>
      <button className="btn-ghost" onClick={() => setN(n+1)}>+</button>
      <button className="btn-primary" onClick={() => setN(0)}>Reset</button>
    </div>
  );
}

function ContactForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  function submit(e) {
    e.preventDefault();
    // Demo only. In production, POST to your API route.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email");
      return;
    }
    if (msg.trim().length < 5) {
      alert("Message is too short");
      return;
    }
    setSent(true);
    setTimeout(() => {
      setEmail(""); setMsg(""); setSent(false);
      alert("Thanks! (Simulated submit)");
    }, 500);
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <input
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70"
      />
      <textarea
        value={msg}
        onChange={(e)=>setMsg(e.target.value)}
        placeholder="Your message…"
        className="w-full h-28 text-sm px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70"
      />
      <button disabled={sent} className="btn-primary w-full" type="submit">{sent?"Sending…":"Send"}</button>
    </form>
  );
}

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
      <button className="w-full flex items-center justify-between" onClick={() => setOpen(!open)}>
        <span className="font-medium text-left">{title}</span>
        <span>{open ? "−" : "+"}</span>
      </button>
      {open && <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">{children}</div>}
    </div>
  );
}

function Modal({ children, onClose }) {
  useEffect(() => {
    function onEsc(e){ if(e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-lg">
        {children}
      </div>
      <button className="sr-only" onClick={onClose}>Close</button>
    </div>
  );
}

function Drawer({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-30 flex">
      <div className="ml-auto h-full w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 p-4 shadow-2xl overflow-auto">
        {children}
      </div>
      <button className="fixed inset-0 bg-black/30" aria-label="Close" onClick={onClose} />
    </div>
  );
}

function Logo() {
  return (
    <div className="w-8 h-8 rounded-2xl grid place-items-center bg-gradient-to-br from-indigo-600 to-blue-500 text-white">※</div>
  );
}

function cryptoRandom() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(1); crypto.getRandomValues(buf); return `n_${buf[0].toString(16)}`;
  }
  return `n_${Math.random().toString(16).slice(2)}`;
}