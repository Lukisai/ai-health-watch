import { useState } from "react";

export default function ReportForm() {
  const [form, setForm] = useState({
    ageRange: "",
    country: "",
    botName: "",
    when: "",
    prompt: "",
    reply: "",
    whyUnsafe: "",
    riskSignals: [],
    consentStore: false,
    consentFollowup: false,
    contactEmail: "",   // optional – treat as sensitive!
  });
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");

  const signals = [
    ["CRISIS", "Crisis/Self-harm language"],
    ["DIAGNOSIS", "Medical/diagnostic claim"],
    ["DISCOURAGE_HELP", "Discouraged help-seeking"],
    ["GLAMORIZE", "Glamorized self-harm/suicide"],
    ["ABUSIVE", "Toxic/abusive tone"],
    ["MISINFO", "Health misinformation"],
  ];

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    if (name === "riskSignals") {
      const next = new Set(form.riskSignals);
      checked ? next.add(value) : next.delete(value);
      setForm({ ...form, riskSignals: Array.from(next) });
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  // super simple “no obvious PII” check
  function containsPII(s) {
    if (!s) return false;
    const email = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
    const phone = /(?:\+?\d[\s-]?)?(?:\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}/;
    const handle = /@[a-z0-9_]{3,}/i;
    return email.test(s) || phone.test(s) || handle.test(s);
  }

  async function submit(e) {
    e.preventDefault();
    setErr(""); setOk(false);

    // redact check on free-text fields
    for (const key of ["prompt","reply","whyUnsafe"]) {
      if (containsPII(form[key])) {
        setErr("Please remove emails, phone numbers, usernames, or names from your text before submitting.");
        return;
      }
    }

    if (!form.consentStore) {
      setErr("Please consent to de-identified storage to submit.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: {"content-type":"application/json"},
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Submit failed");
      setOk(true);
      setForm({
        ageRange:"", country:"", botName:"", when:"",
        prompt:"", reply:"", whyUnsafe:"", riskSignals:[],
        consentStore:false, consentFollowup:false, contactEmail:""
      });
    } catch (e) {
      setErr("We couldn’t submit right now. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <CrisisBanner />

      <h1 className="text-2xl font-semibold">Report a risky chatbot interaction (no PII)</h1>
      <p className="text-sm text-slate-500">
        Remove names, emails, phone numbers, usernames, school names, and locations. We can’t process emergencies.
      </p>

      {err && <div className="p-3 rounded-xl border border-red-300 text-red-700 bg-red-50">{err}</div>}
      {ok &&  <div className="p-3 rounded-xl border border-green-300 text-green-800 bg-green-50">Thanks—your report was received.</div>}

      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Age range">
            <select name="ageRange" value={form.ageRange} onChange={onChange} className="input">
              <option value="">Select…</option>
              <option>Under 13</option><option>13–17</option><option>18–20</option><option>21+</option>
            </select>
          </Field>
          <Field label="Country/Region">
            <input name="country" value={form.country} onChange={onChange} className="input" placeholder="e.g., US" />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Chatbot / Platform">
            <input name="botName" value={form.botName} onChange={onChange} className="input" placeholder="(name if known)" />
          </Field>
          <Field label="When did this happen?">
            <input type="date" name="when" value={form.when} onChange={onChange} className="input" />
          </Field>
        </div>

        <Field label="What was asked (or a brief summary)">
          <textarea name="prompt" value={form.prompt} onChange={onChange} className="textarea" rows={4} />
        </Field>

        <Field label="What the chatbot replied (or a brief summary)">
          <textarea name="reply" value={form.reply} onChange={onChange} className="textarea" rows={4} />
        </Field>

        <Field label="Why was it unsafe or harmful?">
          <textarea name="whyUnsafe" value={form.whyUnsafe} onChange={onChange} className="textarea" rows={4} />
        </Field>

        <Field label="What risks apply?">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {signals.map(([val, label]) => (
              <label key={val} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="riskSignals" value={val} onChange={onChange} checked={form.riskSignals.includes(val)} />
                {label}
              </label>
            ))}
          </div>
        </Field>

        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="consentStore" checked={form.consentStore} onChange={onChange} />
            I consent to de-identified storage of this report for research.
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="consentFollowup" checked={form.consentFollowup} onChange={onChange} />
            I’m open to private follow-up (optional).
          </label>
          <input
            name="contactEmail"
            type="email"
            value={form.contactEmail}
            onChange={onChange}
            className="input"
            placeholder="Optional email (avoid school/personal identifiers if possible)"
            disabled={!form.consentFollowup}
          />
        </div>

        <button className="btn-primary" disabled={submitting} type="submit">
          {submitting ? "Submitting…" : "Submit report"}
        </button>
      </form>

      <style>{`
        .input { @apply w-full text-sm px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-800/80; }
        .textarea { @apply w-full text-sm px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-800/80; }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block text-sm">
      <span className="block mb-1 font-medium">{label}</span>
      {children}
    </label>
  );
}

function CrisisBanner() {
  return (
    <div className="p-3 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 mb-2">
      If you or someone else is in immediate danger or thinking about self-harm, please call local emergency services.
      In the U.S., dial <strong>988</strong> (Suicide & Crisis Lifeline).
      This website cannot provide emergency support or medical advice.
    </div>
  );
}