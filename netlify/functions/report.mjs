export async function handler(event) {
  // Visible GET probe
  if (event.httpMethod === "GET") {
    return { statusCode: 200, headers: { "content-type": "text/plain" }, body: "report OK (GET)" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  // Parse JSON
  let body = {};
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  // Minimal PII checks
  const emailRe  = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
  const phoneRe  = /\b\d{3}[-\s]?\d{3}[-\s]?\d{4}\b/;
  const handleRe = /@[a-z0-9_]{3,}/i;
  const containsPII = (s = "") => emailRe.test(s) || phoneRe.test(s) || handleRe.test(s);

  for (const k of ["prompt", "reply", "whyUnsafe"]) {
    if (containsPII(body[k])) return json(400, { error: "PII detected. Please redact and resubmit." });
  }

  // Require consent to store
  if (!body.consentStore) {
    return json(400, { error: "Consent to de-identified storage is required." });
  }
  // If no follow-up consent, erase email defensively
  if (!body.consentFollowup) {
    body.contactEmail = "";
  }

  // Metadata (server-side)
  const now = new Date().toISOString();
  const userAgent = event.headers["user-agent"] || "";
  const ip =
    event.headers["x-nf-client-connection-ip"] ||
    event.headers["x-forwarded-for"] ||
    event.ip ||
    "unknown";

  const record = {
    timestamp: now,
    ip,
    userAgent,
    prompt: body.prompt || "",
    reply: body.reply || "",
    whyUnsafe: body.whyUnsafe || "",
    consentStore: !!body.consentStore,
    consentFollowup: !!body.consentFollowup,
    contactEmail: body.contactEmail || "",
  };

  // TODO: Persist to DB (e.g., Supabase) here if you want.
  // await saveToDB(record)

  // Optional: send email notification via Resend (no SDK needed)
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const TO_EMAIL = process.env.TO_EMAIL; // set this in Netlify env
  if (RESEND_API_KEY && TO_EMAIL) {
    const text = [
      `New AI Health Watch report`,
      `Time: ${record.timestamp}`,
      `IP: ${record.ip}`,
      `UA: ${record.userAgent}`,
      `Consent follow-up: ${record.consentFollowup ? "yes" : "no"}`,
      record.contactEmail ? `Contact: ${record.contactEmail}` : null,
      "",
      `--- Prompt ---`,
      record.prompt,
      "",
      `--- Reply ---`,
      record.reply,
      "",
      `--- Why Unsafe ---`,
      record.whyUnsafe,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const resp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "AI Health Watch <reports@ai-healthwatch.dev>", // can be any verified domain/sender in Resend
          to: [TO_EMAIL],
          subject: "New report submitted",
          text,
        }),
      });
      // Swallow non-2xx, but log status for debugging
      if (!resp.ok) {
        console.warn("Resend API non-OK:", resp.status, await safeText(resp));
      }
    } catch (e) {
      console.warn("Resend API error:", e);
    }
  }

  return json(200, { ok: true });
}

function json(code, obj) {
  return { statusCode: code, headers: { "content-type": "application/json" }, body: JSON.stringify(obj) };
}
async function safeText(resp) {
  try { return await resp.text(); } catch { return "<no body>"; }
}