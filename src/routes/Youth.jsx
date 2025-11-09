export default function Youth() {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Guidance for Youth & Educators</h1>
        <Section title="If a chatbot worries you" items={[
          "Stop the chat. Screenshot if safe to do so.",
          "Talk to a trusted adult, counselor, or health professional.",
          "Look for red flags: discouraging help-seeking, medical/diagnostic claims, glamorizing self-harm, minimizing feelings."
        ]}/>
        <Section title="For parents & educators" items={[
          "AI is for drafts, not health advice.",
          "Keep use in shared/visible spaces; set time and content boundaries.",
          "Teach the “Pause–Check–Ask” rule."
        ]}/>
        <Section title="School-safe setup" items={[
          "Disable or log chats on school accounts; monitor for risk signals.",
          "Provide a list of approved tools and acceptable use guidance.",
          "Create an escalation path to school counselors."
        ]}/>
      </div>
    );
  }
  function Section({ title, items }) {
    return (
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold mb-2">{title}</h3>
        <ul className="list-disc ml-5 text-sm space-y-1">{items.map((t,i)=><li key={i}>{t}</li>)}</ul>
      </div>
    );
  }