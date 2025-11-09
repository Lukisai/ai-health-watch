export default function Privacy() {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Privacy & Ethics</h1>
        <ul className="list-disc ml-5 text-sm space-y-1">
          <li>We do not want PII. Please redact names, emails, phone numbers, usernames, and locations.</li>
          <li>We store de-identified submissions up to 12 months unless you request deletion.</li>
          <li>We never publish quotes without explicit permission.</li>
          <li>To request deletion: <a className="underline" href="mailto:privacy@yourdomain">privacy@yourdomain</a></li>
        </ul>
      </div>
    );
  }