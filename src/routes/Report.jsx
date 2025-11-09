import React, { useState } from "react";

export default function ReportForm() {
  const [form, setForm] = useState({ prompt: "", reply: "", whyUnsafe: "" });
  const [status, setStatus] = useState({ sending: false, ok: null, msg: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ sending: true, ok: null, msg: "" });

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setStatus({ sending: false, ok: true, msg: "✅ Report submitted successfully." });
        setForm({ prompt: "", reply: "", whyUnsafe: "" });
      } else {
        setStatus({ sending: false, ok: false, msg: data.error || "Submission failed." });
      }
    } catch (err) {
      console.error(err);
      setStatus({ sending: false, ok: false, msg: "Network error." });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">Report a risky chatbot interaction</h1>
      <p className="text-slate-600 mb-6">
        Please describe the interaction that raised concerns. Do not include personal data, emails, or handles.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Prompt or message you sent</label>
          <textarea
            name="prompt"
            value={form.prompt}
            onChange={handleChange}
            rows="3"
            className="w-full border border-slate-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Chatbot’s reply (or summary)</label>
          <textarea
            name="reply"
            value={form.reply}
            onChange={handleChange}
            rows="3"
            className="w-full border border-slate-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Why do you think this was unsafe or concerning?
          </label>
          <textarea
            name="whyUnsafe"
            value={form.whyUnsafe}
            onChange={handleChange}
            rows="4"
            className="w-full border border-slate-300 rounded-md p-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={status.sending}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 disabled:opacity-50"
        >
          {status.sending ? "Submitting..." : "Submit report"}
        </button>
      </form>

      {status.msg && (
        <div
          className={`mt-4 text-sm p-3 rounded-md ${
            status.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {status.msg}
        </div>
      )}
    </div>
  );
}