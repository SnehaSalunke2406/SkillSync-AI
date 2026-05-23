import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GithubAnalyzer() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!username.trim()) {
      alert("Please enter a GitHub username");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const response = await fetch("http://localhost:5001/github", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to analyze profile repositories.");
      }

      setResult(data);
    } catch (error) {
      console.error("GITHUB FRONTEND EXCEPTION:", error);
      alert(error.message || "An error occurred during profiling.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 font-sans">
      
      {/* GLOBAL TOP NAVIGATION HEADER */}
      <nav className="p-6 border-b border-zinc-900 bg-zinc-950/40 flex justify-between items-center max-w-7xl mx-auto mb-10 rounded-2xl">
        <div 
          onClick={() => navigate("/")} 
          className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 cursor-pointer"
        >
          SkillSync AI
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-sm font-semibold py-2 px-5 rounded-xl border border-zinc-800 transition-all cursor-pointer"
        >
          ← Back to Dashboard
        </button>
      </nav>

      {/* CORE INPUT PANEL SEARCH ELEMENT */}
      <div className="max-w-4xl mx-auto text-center md:text-left">
        <h1 className="text-5xl font-bold text-cyan-400 flex items-center justify-center md:justify-start gap-3">
          GitHub Profile Analyzer <span className="text-4xl">🐙</span>
        </h1>
        <p className="text-zinc-500 mt-2 text-sm">
          Evaluate repository consistency, active tech stacks, and tracking metrics.
        </p>

        {/* SEARCH INPUT BAR GRID */}
        <div className="mt-10 flex flex-col md:flex-row gap-4 max-w-xl mx-auto md:mx-0">
          <input
            type="text"
            placeholder="Enter GitHub Username (e.g., octocat)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 text-white flex-1 placeholder-zinc-600 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-zinc-800 text-black disabled:text-zinc-500 px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/10 cursor-pointer active:scale-[0.98]"
          >
            {loading ? "Analyzing..." : "Scan Repos"}
          </button>
        </div>

        {/* METRIC DISPLAY CONTAINER BLOCK */}
        {result && (
          <div className="mt-10 bg-zinc-950 p-8 rounded-3xl border border-zinc-900 shadow-2xl text-left animate-fade-in">
            
            {/* USER CORE META PROFILE IDENTIFIER DATA */}
            <div className="border-b border-zinc-900 pb-6">
              <h2 className="text-4xl font-black tracking-tight text-white">
                @{result.username}
              </h2>
              <p className="text-zinc-400 mt-4 text-base leading-relaxed font-medium">
                {result.summary}
              </p>

              {/* DYNAMIC TECH STACKS BADGES */}
              {(result.languages || []).length > 0 && (
                <div className="mt-5">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">Identified Core Tech Stacks:</span>
                  <div className="flex flex-wrap gap-2">
                    {result.languages.map((lang, idx) => (
                      <span key={idx} className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs px-3 py-1.5 rounded-lg font-bold">
                        💻 {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* THREE BLOCK COMPONENT SPECIFIC VALUE TARGET METRICS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              
              {/* COMPONENT ELEMENT A: PUBLIC REPOS */}
              <div className="bg-zinc-900/30 p-6 rounded-2xl border border-zinc-900/80 text-center flex flex-col justify-center min-h-[140px]">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Public Repos</span>
                <span className="text-4xl font-black text-cyan-400 mt-2 block">
                  {result.metrics?.totalRepos ?? 0}
                </span>
              </div>

              {/* COMPONENT ELEMENT B: EARNED STARS */}
              <div className="bg-zinc-900/30 p-6 rounded-2xl border border-zinc-900/80 text-center flex flex-col justify-center min-h-[140px]">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Earned Stars</span>
                <span className="text-4xl font-black text-yellow-400 mt-2 block flex items-center justify-center gap-2">
                  <span className="text-3xl">⭐</span> {result.metrics?.totalStars ?? 0}
                </span>
              </div>

              {/* COMPONENT ELEMENT C: DEV CONSISTENCY LOOP TRACKING */}
              <div className="bg-zinc-900/30 p-6 rounded-2xl border border-zinc-900/80 text-center flex flex-col justify-center min-h-[140px]">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Dev Consistency</span>
                <span className="text-3xl font-black text-emerald-400 mt-2.5 block leading-snug">
                  {result.metrics?.activeWeeksEstimation || "8+ Weeks"}
                </span>
              </div>
            </div>

            {/* PORTFOLIO OPTIMIZATION RECOMMENDATIONS MAPPER */}
            {(result.recommendations || []).length > 0 && (
              <div className="mt-8 pt-6 border-t border-zinc-900">
                <h4 className="text-lg font-bold text-zinc-200 tracking-tight">Portfolio Optimization Recommendations</h4>
                <ul className="mt-4 space-y-3">
                  {result.recommendations.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-zinc-400 leading-relaxed font-medium">
                      <span className="text-cyan-400 font-bold mt-0.5">▪</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}