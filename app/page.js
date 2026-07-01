"use client";
// ✅ SIMPLE BUILT-IN UI COMPONENTS (no external dependencies)

const Card = ({ children }) => (
  <div
    style={{
      border: "1px solid #00ff88",
      padding: "12px",
      background: "#020617"
    }}
  >
    {children}
  </div>
);

const CardContent = ({ children }) => <div>{children}</div>;

const Button = ({ children, ...props }) => (
  <button
    {...props}
    style={{
      border: "1px solid #00ff88",
      padding: "8px 12px",
      marginTop: "8px",
      background: "#020617",
      color: "#00ff88",
      cursor: "pointer",
      display: "inline-block"
    }}
  >
    {children}
  </button>
);

const Input = (props) => (
  <input
    {...props}
    style={{
      width: "100%",
      padding: "6px",
      marginTop: "5px",
      background: "#020617",
      color: "#00ff88",
      border: "1px solid #00ff88"
    }}
  />
);

const Textarea = (props) => (
  <textarea
    {...props}
    style={{
      width: "100%",
      padding: "6px",
      marginTop: "5px",
      background: "#020617",
      color: "#00ff88",
      border: "1px solid #00ff88"
    }}
  />
);
import { useState, useEffect } from "react";

export default function StudyPlannerDashboard() {
  const [goal, setGoal] = useState("");

  // 🎮 Stats
  const [xp, setXp] = useState(0);
  const [rank, setRank] = useState("Recruit");

  // 🌳 Skills
  const [skills, setSkills] = useState({ analysis: 0, osint: 0, cyber: 0, psychology: 0 });

  // 🌍 News
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  // Modes
  const [redTeam, setRedTeam] = useState(false);
  const [eliteMode, setEliteMode] = useState(false);


  // 🕵️ Simulation
  const [scenario, setScenario] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(null);

  const steps = [
    "1. INTEL GATHERING",
    "2. ACTOR IDENTIFICATION",
    "3. RISK ASSESSMENT",
    "4. OUTCOME FORECAST"
  ];


  const ranks = [
    { name: "Recruit", xp: 0 },
    { name: "Analyst", xp: 50 },
    { name: "Operative", xp: 120 },
    { name: "Specialist", xp: 250 },
    { name: "Elite", xp: 500 }
  ];

  // 🌍 Fetch geopolitics
  useEffect(() => {
    fetch("https://api.gdeltproject.org/api/v2/doc/doc?query=geopolitics OR conflict&mode=ArtList&maxrecords=5&format=json")
      .then(res => res.json())
      .then(data => {
        setNews(data.articles?.map(a => a.title) || []);
        setLoadingNews(false);
      })
      .catch(() => {
        setNews(["INTEL FEED OFFLINE"]);
        setLoadingNews(false);
      });
  }, []);


  // 🧠 Scenario
  const generateScenario = () => {
    let base = news[0] || "UNKNOWN GLOBAL EVENT DETECTED";
    if (redTeam) base += " [WARNING: COMPROMISED DATA DETECTED]";
    if (eliteMode) base += " [HIGH UNCERTAINTY / TIME CRITICAL]";
    setScenario(base);
    setStepIndex(0);
    setAnswers(["", "", "", ""]);
    setFeedback("");
    setScore(null);
  };

  const updateAnswer = (val) => {
    const copy = [...answers];
    copy[stepIndex] = val;
    setAnswers(copy);
  };

  const nextStep = () => setStepIndex(s => Math.min(s + 1, 3));


  // 🧠 Evaluation
  const evaluate = () => {
    const text = answers.join(" ").toLowerCase();
    let s = 0;
    let weaknesses = [];

    if (text.length > 300) s += 20; else weaknesses.push("LOW DEPTH");
    if (text.includes("risk")) s += 20; else weaknesses.push("NO RISK ANALYSIS");
    if (text.includes("actor")) s += 20; else weaknesses.push("NO ACTOR IDENTIFICATION");
    if (text.includes("intel") || text.includes("data")) s += 20; else weaknesses.push("WEAK INTEL USE");
    if (text.includes("outcome")) s += 20; else weaknesses.push("NO FORECASTING");


    if (redTeam && !text.includes("verify")) {
      weaknesses.push("FAILED MISINFORMATION DETECTION");
      s -= 10;
    }


    s = Math.max(0, s);
    setScore(s);


    if (s < 40) {
      setFeedback(`❌ FAILURE
${weaknesses.join(" | ")}`);
    } else if (s < 70) {
      setFeedback(`⚠️ WARNING
${weaknesses.join(" | ")}`);
    } else {
      setFeedback(`✅ PASS
${weaknesses.join(" | ") || "NO MAJOR ISSUES"}`);
    }

    setXp(prev => {
      const newXp = prev + s;
      const newRank = ranks.slice().reverse().find(r => newXp >= r.xp);
      if (newRank) setRank(newRank.name);
      return newXp;
    });


    setSkills(prev => ({
      ...prev,
      analysis: prev.analysis + Math.floor(s / 25),
      osint: prev.osint + (weaknesses.includes("WEAK INTEL USE") ? 0 : 2),
      psychology: prev.psychology + (weaknesses.includes("NO ACTOR IDENTIFICATION") ? 0 : 2)
    }));
  };

  return (
  <div style={{
    minHeight: "100vh",
    background: "#020617",
    color: "#00ff88",
    padding: "20px",
    fontFamily: "monospace",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "15px"
  }}>

    {/* LEFT PANEL */}
    <Card>
      <CardContent>
        <h2>[PROFILE]</h2>
        <p>RANK: {rank}</p>
        <p>XP: {xp}</p>
      </CardContent>
    </Card>

    {/* CENTER PANEL */}
    <Card>
      <CardContent>
        <h2>[MISSION]</h2>
        <Input
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="DEFINE OBJECTIVE"
        />
      </CardContent>
    </Card>

    {/* RIGHT PANEL */}
    <Card>
      <CardContent>
        <h2>[SIMULATION]</h2>
        <Button onClick={generateScenario}>INIT</Button>

        {scenario && (
          <>
            <p>{scenario}</p>
            <p>{steps[stepIndex]}</p>

            <Textarea
              value={answers[stepIndex]}
              onChange={(e) => updateAnswer(e.target.value)}
            />

            {stepIndex < 3 ? (
              <Button onClick={nextStep}>NEXT</Button>
            ) : (
              <Button onClick={evaluate}>EVALUATE</Button>
            )}
          </>
        )}

        {score !== null && <p>SCORE: {score}/100</p>}
        {feedback && <p>{feedback}</p>}
      </CardContent>
    </Card>

  </div>
  );
}
