// /api/report.ts (Vercel) or netlify/functions/report.ts (Netlify)
import type { VercelRequest, VercelResponse } from "@vercel/node";

function containsPII(s = "") {
  const email = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
  const phone = /(?:\+?\d[\\s-]?)?(?:\\(?\\d{3}\\)?[\\s-]?)?\\d{3}[\\s-]?\\d{4}/;
  const handle = /@[a-z0-9_]{3,}/i;
  return email.test(s) || phone.test(s) || handle.test(s);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");
  const body = req.body || {};
  for (const k of ["prompt","reply","whyUnsafe"]) {
    if (containsPII(body[k])) return res.status(400).json({ error: "PII detected. Please redact and resubmit." });
  }
  // TODO: persist to DB (Supabase) with minimal fields
  // TODO: send notification email via Resend
  return res.status(200).json({ ok: true });
}