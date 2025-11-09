import React, { useState } from "react";

export default function ReportForm() {
  const [form, setForm] = useState({
    prompt: "",
    reply: "",
    whyUnsafe: "",
    consentStore: false,        // required
    consentFollowup: false,     // optional
    contactEmail: "",           // only if consentFollowup === true
  });
  const [status, setStatus] = useState({ sending: false, ok: null, msg: "" });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  async function submit(e) {
    e.preventDefault();
    setStatus({ sending: true, ok: null, msg: "" });

    if (!form.consentStore) {
      setStatus({ sending: false, ok: false, msg: "Please consent to de-identified storage to submit." });
      return;
    }
    if (!form.consentFollowup) {
      // ensure we don't accidentally send an email when user didn't consent
      form.contactEmail = "";
    }

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus({ sending: false, ok: true, msg: "✅ Report submitted successfully." });
        setForm({ prompt:"", reply:"", whyUnsafe:"", consentStore:false, consentFollowup:false, contactEmail:"" });
      } else {
        setStatus({ sending: false, ok: false, msg: data.error || "Submission failed." });
      }
    } catch (err) {
      setStatus({ sending: false, ok: false, msg: "Network error." });
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Report a risky chatbot interaction (no PII)</h1>
      <p className="text-slate-600">
        Do not include personal data (emails, phone numbers, usernames, real names, schools, or locations).
      </p>

      <form onSubmit={submit} className="space-y-4">
        <Field label="Prompt or message you sent">
          <textarea name="prompt" rows={3} className="w-full border border-slate-300 rounded-md p-2"
            value={form.prompt} onChange={onChange} required />
        </Field>

        <Field label="Chatbot’s reply (or a brief summary)">
          <textarea name="reply" rows={3} className="w-full border border-slate-300 rounded-md p-2"
            value={form.reply} onChange={onChange} required />
        </Field>

        <Field label="Why do you think this was unsafe or concerning?">
          <textarea name="whyUnsafe" rows={4} className="w-full border border-slate-300 rounded-md p-2"
            value={form.whyUnsafe} onChange={onChange} required />
        </Field>

        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="consentStore" checked={form.consentStore} onChange={onChange} />
            I consent to de-identified storage of this report for research & aggregate analysis.
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" name="consentFollowup" checked={form.consentFollowup} onChange={onChange} />
            I’m open to private follow-up (optional).
          </label>

          <input
            type="email"
            name="contactEmail"
            placeholder="Optional email for follow-up"
            className="w-full border border-slate-300 rounded-md p-2 disabled:opacity-50"
            value={form.contactEmail}
            onChange={onChange}
            disabled={!form.consentFollowup}
          />
        </div>

        <button type="submit" disabled={status.sending}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 disabled:opacity-50">
          {status.sending ? "Submitting…" : "Submit report"}
        </button>
      </form>

      {status.msg && (
        <div className={`text-sm p-3 rounded-md ${status.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {status.msg}
        </div>
      )}
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