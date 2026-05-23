import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

// =========================================================================
// FEATURE 1: RESUME ANALYZER (UPGRADED RADIAL INTERACTION - FIXED SYNTAX)
// =========================================================================
function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!file) return alert("Please choose a PDF file first");
    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      setResult(null);
      const response = await fetch("http://localhost:5001/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Resume Analyzer Error:", err);
    } finally {
      // FIXED: Cleared out 'bits:' token to natively restore state tracking loop
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-10 font-sans selection:bg-violet-500/30">
      <nav className="p-6 border border-white/5 bg-zinc-950/40 backdrop-blur-md flex justify-between items-center max-w-7xl mx-auto mb-10 rounded-2xl shadow-2xl">
        <div onClick={() => navigate("/")} className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-500 cursor-pointer select-none">
          SkillSync AI
        </div>
        <button onClick={() => navigate("/dashboard")} className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-sm font-semibold py-2.5 px-5 rounded-xl border border-white/5 transition-all">
          ← Back to Dashboard
        </button>
      </nav>

      <div className="max-w-4xl mx-auto bg-zinc-950/50 border border-white/5 p-10 rounded-3xl backdrop-blur-xl shadow-2xl">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">Resume Analyzer 📄</h1>
        <p className="text-zinc-500 mt-1 text-sm">Upload your profile to parse ATS optimization scoring metrics.</p>
        
        <div className="mt-8 flex gap-4 max-w-xl">
          <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="bg-zinc-900 p-3 rounded-xl border border-white/5 text-sm flex-1 text-zinc-400" />
          <button onClick={handleAnalyze} className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-6 font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20">
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {result && (
          <div className="mt-10 border-t border-white/5 pt-8 animate-fade-in">
            <div className="flex items-center gap-6 bg-white/[0.02] p-6 rounded-2xl border border-white/5">
              <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 shadow-lg shadow-emerald-500/20">
                <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center font-black text-2xl text-emerald-400">
                  {result.atsScore}%
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">ATS Matching Score</h3>
                <p className="text-sm text-zinc-500 mt-0.5">Your structural keyword density aligns well with production filters.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white/[0.01] p-6 rounded-2xl border border-white/5">
                <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Identified Core Competencies</h4>
                <div className="flex flex-wrap gap-2 mt-3">
                  {result.foundSkills?.map((s, i) => (
                    <span key={i} className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1.5 rounded-lg font-medium border border-emerald-500/10">{s}</span>
                  ))}
                </div>
              </div>
              <div className="bg-white/[0.01] p-6 rounded-2xl border border-white/5">
                <h4 className="text-rose-400 text-xs font-bold uppercase tracking-wider">Missing Target Keywords</h4>
                <div className="flex flex-wrap gap-2 mt-3">
                  {result.missingSkills?.map((s, i) => (
                    <span key={i} className="bg-rose-500/10 text-rose-400 text-xs px-3 py-1.5 rounded-lg font-medium border border-rose-500/10">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// FEATURE 2: AI ROADMAP GENERATOR (PREMIUM INDIGO/VIOLET PATHWAYS)
// =========================================================================
function Roadmap() {
  const [skill, setSkill] = useState("");
  const [targetGoal, setTargetGoal] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!skill || !targetGoal) return alert("Please fill in both fields");
    try {
      setLoading(true);
      setRoadmap(null);
      const response = await fetch("http://localhost:5001/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill: skill.trim(), targetGoal: targetGoal.trim() }),
      });
      const data = await response.json();
      setRoadmap(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-10 font-sans selection:bg-violet-500/30">
      <nav className="p-6 border border-white/5 bg-zinc-950/40 backdrop-blur-md flex justify-between items-center max-w-7xl mx-auto mb-10 rounded-2xl shadow-2xl">
        <div onClick={() => navigate("/")} className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-500 cursor-pointer select-none">
          SkillSync AI
        </div>
        <button onClick={() => navigate("/dashboard")} className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-sm font-semibold py-2.5 px-5 rounded-xl border border-white/5 transition-all">
          ← Back to Dashboard
        </button>
      </nav>

      <div className="max-w-4xl mx-auto bg-zinc-950/50 border border-white/5 p-10 rounded-3xl backdrop-blur-xl shadow-2xl">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">AI Roadmap Generator 🚀</h1>
        <p className="text-zinc-500 mt-1 text-sm">Map custom sequential milestone pathways from foundational components.</p>
        
        <div className="mt-6 flex flex-col gap-4 max-w-xl">
          <input type="text" placeholder="Current Skill Set" value={skill} onChange={e => setSkill(e.target.value)} className="bg-zinc-900 p-4 rounded-xl border border-white/5 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors" />
          <input type="text" placeholder="Target Professional Career Milestone" value={targetGoal} onChange={e => setTargetGoal(e.target.value)} className="bg-zinc-900 p-4 rounded-xl border border-white/5 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors" />
          <button onClick={handleGenerate} disabled={loading} className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white p-4 rounded-xl font-bold tracking-wide transition-all active:scale-[0.98] shadow-lg shadow-violet-600/20 disabled:bg-zinc-800">
            {loading ? "Compiling Specialized Tracks..." : "Generate Custom Path"}
          </button>
        </div>

        {roadmap && (
          <div className="mt-10 pt-8 border-t border-white/5 animate-fade-in">
            <h2 className="text-2xl font-extrabold tracking-tight text-white mb-6">{roadmap.title}</h2>
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-zinc-800">
              {roadmap.phases?.map((phase, index) => (
                <div key={index} className="relative pl-10 group">
                  <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full bg-violet-500 ring-4 ring-black shadow-lg shadow-violet-500/50"></div>
                  <div className="bg-white/[0.01] p-6 rounded-2xl border border-white/5 hover:border-violet-500/30 transition-all">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-zinc-100 text-lg">{phase.phaseName}</h3>
                      <span className="text-xs text-violet-400 border border-violet-500/20 bg-violet-500/5 px-2.5 py-1 rounded-full font-bold">{phase.duration}</span>
                    </div>
                    <div className="mt-4 space-y-2">
                      {phase.topics?.map((t, i) => <p key={i} className="text-sm text-zinc-400 flex items-start gap-2"><span className="text-violet-500 font-bold">▪</span>{t}</p>)}
                    </div>
                    {phase.projectIdea && <p className="text-xs text-emerald-400 mt-4 border-t border-white/5 pt-3 font-semibold">Project Milestone: {phase.projectIdea}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// ROUTER INITIALIZATION PORTS
// =========================================================================
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import GithubAnalyzer from "./pages/GithubAnalyzer";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
        <Route path="/github-analyzer" element={<GithubAnalyzer />} />
      </Routes>
    </BrowserRouter>
  );
}