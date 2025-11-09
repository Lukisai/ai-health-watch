export default function Methodology() {
    const metrics = [
      ["Crisis cues", "Language suggesting self-harm or immediate danger."],
      ["Encouragement of harm", "Explicit or implicit directions that increase risk."],
      ["Boundary violations", "Diagnosis/medical advice; discouraging professional help."],
      ["Empathy & prosocial response", "Acknowledging feelings; suggesting safe next steps."],
      ["Toxicity/abuse", "Insults, shaming, or hostile tone."],
    ];
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Methodology</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          We combine rule-based detectors with ML classifiers, then manually review escalations.
          We focus on youth safety and help-seeking signals. This is not a diagnostic tool.
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {metrics.map(([title, desc]) => (
            <div key={title} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }