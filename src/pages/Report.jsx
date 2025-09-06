import React from "react";

export default function Report() {
  const reports = JSON.parse(localStorage.getItem("drillReports")) || [];

  return (
    <div style={{ padding: 24, fontFamily: "Segoe UI, sans-serif" }}>
      <h1>📊 Drill Completion Report</h1>
      {reports.length === 0 ? (
        <p>No drills completed yet.</p>
      ) : (
        <ul>
          {reports.map((r, idx) => (
            <li key={idx}>
              <b>{r.drillTitle}</b> ({r.category}) – <i>{r.date}</i>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
