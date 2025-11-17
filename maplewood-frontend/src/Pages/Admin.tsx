import React, { useState } from "react";

export default function Admin({ semesterId = 1 }: { semesterId?: number }) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);

  function generate() {
    setRunning(true);
    fetch("/api/schedule/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ semesterId })
    }).then(r => r.json()).then(j => { setResult(j); setRunning(false); })
      .catch(e => { console.error(e); setRunning(false); });
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Admin: Generate Master Schedule</h2>
      <button onClick={generate} disabled={running} className="px-4 py-2 bg-blue-600 text-white rounded">
        {running ? "Generating..." : "Generate Master Schedule"}
      </button>
      {result && <pre className="mt-4 bg-gray-100 p-2">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
