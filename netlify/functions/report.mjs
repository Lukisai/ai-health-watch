// ESM syntax because package.json has "type": "module"
export async function handler(event) {
  // Quick GET probe so you can see it working
  if (event.httpMethod === "GET") {
    return { statusCode: 200, headers: { "content-type": "text/plain" }, body: "report OK (GET)" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  let body = {};
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch {
    return { statusCode: 400, headers: { "content-type": "application/json" }, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const email  = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
  const phone  = /\b\d{3}[-\s]?\d{3}[-\s]?\d{4}\b/;
  const handle = /@[a-z0-9_]{3,}/i;
  const containsPII = (s = "") => email.test(s) || phone.test(s) || handle.test(s);

  for (const k of ["prompt","reply","whyUnsafe"]) {
    if (containsPII(body[k])) {
      return { statusCode: 400, headers: { "content-type":"application/json" }, body: JSON.stringify({ error: "PII detected" }) };
    }
  }

  return { statusCode: 200, headers: { "content-type":"application/json" }, body: JSON.stringify({ ok: true }) };
}