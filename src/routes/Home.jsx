import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="p-7 rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white/80 to-slate-50/60 dark:from-slate-900/60 dark:to-slate-800/60 shadow-sm">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Protecting youth from unsafe AI mental-health advice
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-3xl">
          We collect PII-safe reports of risky chatbot interactions, verify cases from news and research, and share practical guidance
          for families and schools. Our goal is simple: safer AI, better guardrails, informed adults.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/report" className="btn-primary">Report a case</Link>
          <Link to="/cases" className="btn-ghost">See cases</Link>
          <Link to="/youth" className="btn-ghost">Youth & Educators</Link>
        </div>
      </section>

      <section id="how" className="grid md:grid-cols-3 gap-4">
        <Card title="Collect">
          PII-safe community reports plus curated incidents from news and academic papers.
        </Card>
        <Card title="Verify">
          We de-identify, review, and when possible replicate. We never publish quotes without permission.
        </Card>
        <Card title="Inform">
          Aggregate findings, red flags to watch for, and guidance tailored to schools and parents.
        </Card>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <Blurb
          title="If a chatbot worries you"
          items={[
            "Stop the chat. Screenshot if safe to do so.",
            "Talk to a trusted adult, counselor, or health professional.",
            "Red flags: discouraging help-seeking, diagnosis claims, glamorizing self-harm, minimizing feelings.",
          ]}
        />
        <Blurb
          title="For parents & educators"
          items={[
            "AI is for drafts, not health advice.",
            "Use shared/visible screens; set time and content boundaries.",
            "Teach “Pause–Check–Ask”: pause, check a trusted source, ask a human.",
          ]}
        />
      </section>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/50">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">{children}</p>
    </div>
  );
}

function Blurb({ title, items }) {
  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
      <h3 className="font-semibold mb-2">{title}</h3>
      <ul className="list-disc ml-5 text-sm space-y-1">
        {items.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  );
}