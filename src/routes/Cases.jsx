export default function Cases() {
    const items = [
      {
        title: "Example: Bot discouraged help-seeking",
        source: "News report",
        tags: ["discourage_help", "youth"],
        link: "#",
        summary: "A chatbot minimized distress and did not suggest talking to a trusted adult."
      },
      {
        title: "Example: Diagnosis claim in chat",
        source: "Academic paper",
        tags: ["diagnosis_claim"],
        link: "#",
        summary: "The bot suggested a diagnosis and treatment plan without disclaimers."
      }
    ];
  
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Cases & Evidence</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Curated incidents from news and research. We aim to replicate or invite submitters to share de-identified details.
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {items.map((it, i) => (
            <div key={i} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-medium">{it.title}</h3>
                <span className="badge">{it.source}</span>
              </div>
              <p className="text-sm mt-1">{it.summary}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {it.tags.map(t => <span key={t} className="badge">#{t}</span>)}
              </div>
              {it.link && <a className="text-sm underline mt-2 inline-block" href={it.link} target="_blank" rel="noreferrer">Read more</a>}
            </div>
          ))}
        </div>
      </div>
    );
  }