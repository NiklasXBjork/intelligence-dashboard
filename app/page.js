"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [scenario, setScenario] = useState("");
  const [news, setNews] = useState([]);

  useEffect(() => {
    // simple working fake data
    setNews([
      "Global tensions rising",
      "Cyber threats increasing",
      "Economic instability detected"
    ]);
  }, []);

  const generateScenario = () => {
    setScenario("SIMULATION: Rising geopolitical conflict detected.");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#020617",
      color: "#00ff88",
      padding: "20px",
      fontFamily: "monospace"
    }}>

      <h1>INTELLIGENCE DASHBOARD</h1>

      {/* NEWS */}
      <h2>INTEL FEED</h2>
      {news.map((n, i) => (
        <p key={i}>- {n}</p>
      ))}

      {/* BUTTON */}
      <button
        onClick={generateScenario}
        style={{
          marginTop: "15px",
          padding: "10px",
          border: "1px solid #00ff88",
          background: "black",
          color: "#00ff88",
          cursor: "pointer"
        }}
      >
        INIT SIMULATION
      </button>

      {/* SCENARIO */}
      {scenario && (
        <p style={{ marginTop: "15px" }}>
          {scenario}
        </p>
      )}
    </div>
  );
}
