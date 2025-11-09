import React, { useEffect, useMemo, useState } from "react";

const MAX = { prompt: 2000, reply: 2000, why: 2000 };

export default function ReportForm() {
  const [form, setForm] = useState(() => {
    // restore draft
    const saved = localStorage.getItem("reportDraft");
    return (
      saved
        ? JSON.parse(saved)
        : {
            provider: "",            // optional metadata (non-PII)
            ageBand: "",             // under-21 awareness
            prompt: "",
            reply: "",
            whyUnsafe: "",
            consentStore: false,     // required
            consentFollowup: false,  // optional
            contactEmail: "",        // only if consentFollowup
            website: "",             // honeypot (should stay empty)
          }
    );
  });

  const [status, setStatus] = useState({ sending: false, ok: null, msg: "", errors: {} });

  // Save draft automatically
  useEffect(() => {
    localStorage.setItem("reportDraft", JSON.stringify(form));
  }, [form]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  // Simple client-side PII guard (same spirit as backend)
  const pii = useMemo(() => {
    const email = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
    const phone = /\b\d{3}[-\s]?\d{3}[-\s]?\d{4}\b/;
    const handle = /@[a-z0-9_]{3,}/i;
    const fields = [form.prompt, form.reply, form.whyUnsafe, form.contactEmail];
    const hit = fields.find((s) => email.test(s) || phone.test(s) || handle.test(s));
    return !!hit;
  }, [form]);

  async function submit(e) {
    e.preventDefault();

    // Frontend validation
    const errors = {};
    if (!form.prompt.trim()) errors.prompt = "Required";
    if (!form.reply.trim()) errors.reply = "Required";
    if (!form.whyUnsafe.trim()) errors.whyUnsafe = "Required";
    if (!form.consentStore) errors.consent = "Please consent to de-identified storage.";
    if (pii) errors.pii = "PII detected. Remove emails, phone numbers, or @handles.";
    if (form.website) errors.honeypot = "Bot detected."; // honeypot filled

    if (Object.keys(errors).length) {
      setStatus({ sending: false, ok: false, msg: "Please fix the highlighted issues.", errors });
      return;
    }

    setStatus({ sending: true, ok: null, msg: "", errors: {} });

    // Don’t send email if user didn't consent to follow-up
    const payload = {
      ...form,
      contactEmail: form.consentFollowup ? form.contactEmail : "",
    };

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus({ sending: false, ok: true, msg: "✅ Report submitted successfully.", errors: {} });
        // Clear form & draft
        const cleared = {
          provider: "",
          ageBand: "",
          prompt: "",
          reply: "",
          whyUnsafe: "",
          consentStore: false,
          consentFollowup: false,
          contactEmail: "",
          website: "",
        };
        setForm(cleared);
        localStorage.removeItem("reportDraft");
      } else {
        setStatus({ sending: false, ok: false, msg: data.error || "Submission failed.", errors: {} });
      }
    } catch {
      setStatus({ sending: false, ok: false, msg: "Network error.", errors: {} });
    }
  }

  const counter = (name, val) => (
    <div className="text-xs text-slate-500 mt-1 text-right">{val.length}/{MAX[name]}</div>
  );

  const fieldClass = (err) =>
    `w-full border rounded-md p-2 ${err ? "border-red-400" : "border-slate-300"}`;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Report a risky chatbot interaction (no PII)</h1>
      <p className="text-slate-600">
        Do not include personal data (emails, phone numbers, usernames, real names, schools, or locations).
      </p>

      {status.msg && (
        <div
          className={`text-sm p-3 rounded-md ${
            status.ok ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-800"
          }`}
          role="status"
        >
          {status.msg}
          {status.errors.pii && <div className="mt-1">• {status.errors.pii}</div>}
          {status.errors.consent && <div className="mt-1">• {status.errors.consent}</div>}
        </div>
      )}

      <form onSubmit={submit} className="space-y-5">
        {/* Non-PII metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="block text-sm">
            <span className="block mb-1 font-medium">AI provider / app (optional)</span>
            <input
              name="provider"
              value={form.provider}
              onChange={onChange}
              className="w-full border border-slate-300 rounded-md p-2"
              placeholder="e.g., ChatGPT, Copilot, Schoolbot"
            />
          </label>

          <label className="block text-sm">
            <span className="block mb-1 font-medium">Age band (optional)</span>
            <select
              name="ageBand"
              value={form.ageBand}
              onChange={onChange}
              className="w-full border border-slate-300 rounded-md p-2 bg-white dark:bg-slate-900"
            >
              <option value="">Prefer not to say</option>
              <option value="under13">Under 13</option>
              <option value="13-15">13–15</option>
              <option value="16-17">16–17</option>
              <option value="18-20">18–20</option>
              <option value="21plus">21+</option>
            </select>
          </label>
        </div>

        <Field label="Prompt or message you sent" error={status.errors.prompt}>
          <textarea
            name="prompt"
            rows={3}
            maxLength={MAX.prompt}
            className={fieldClass(status.errors.prompt)}
            value={form.prompt}
            onChange={onChange}
            required
          />
          {counter("prompt", form.prompt)}
        </Field>

        <Field label="Chatbot’s reply (or a brief summary)" error={status.errors.reply}>
          <textarea
            name="reply"
            rows={3}
            maxLength={MAX.reply}
            className={fieldClass(status.errors.reply)}
            value={form.reply}
            onChange={onChange}
            required
          />
          {counter("reply", form.reply)}
        </Field>

        <Field label="Why do you think this was unsafe or concerning?" error={status.errors.whyUnsafe}>
          <textarea
            name="whyUnsafe"
            rows={4}
            maxLength={MAX.why}
            className={fieldClass(status.errors.whyUnsafe)}
            value={form.whyUnsafe}
            onChange={onChange}
            required
          />
          {counter("why", form.whyUnsafe)}
        </Field>

        {/* Consent & optional follow-up */}
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

          {/* Honeypot (hidden from humans) */}
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={onChange}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          disabled={status.sending || !form.consentStore}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 disabled:opacity-50"
        >
          {status.sending ? "Submitting…" : "Submit report"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block text-sm">
      <span className="block mb-1 font-medium">{label}</span>
      {children}
      {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
    </label>
  );
}