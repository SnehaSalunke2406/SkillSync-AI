import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const analyzeResume = async () => {
    if (!file) {
      alert("Please upload a PDF file first");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("http://localhost:5001/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("FRONTEND ATS RESPONSE RECEIVED:", data);
      setResult(data);
    } catch (error) {
      console.error("Resume compilation network error channel exception:", error);
      alert("Error analyzing resume structure. Ensure your backend server is active on port 5001.");
    } finally {
      setLoading(false);
    }
  };

  // Circular dashboard SVG ring metric math calculations
  const score = result?.atsScore || 0;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="min-h-screen bg-black text-white p-10 font-sans selection:bg-cyan-500/30">
      
      {/* GLOBAL TOP NAVIGATION HEADER BAR */}
      <nav className="p-6 border-b border-zinc-900 bg-zinc-950/40 flex justify-between items-center max-w-7xl mx-auto mb-10 rounded-2xl">
        <div 
          onClick={() => navigate("/")} 
          className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 cursor-pointer select-none"
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

      {/* CORE CONTAINER INTERFACE PANEL */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-cyan-400 flex items-center gap-3">
          Resume Analyzer <span className="animate-pulse">📄</span>
        </h1>
        <p className="text-zinc-500 mt-2 text-sm">
          Upload your profile to execute real-time structural ATS validation parses.
        </p>

        {/* FILE INPUT BLOCK STRIPS */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 max-w-xl">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 text-sm flex-1 text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-black hover:file:bg-cyan-400 cursor-pointer"
          />
          <button
            onClick={analyzeResume}
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-zinc-800 text-black disabled:text-zinc-500 px-6 py-4 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/10 cursor-pointer"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {/* METRICS ANALYTICS PANEL HOOK GRID */}
        {result && (
          <div className="mt-10 bg-zinc-950 p-8 rounded-3xl border border-zinc-900 shadow-2xl animate-fade-in">
            
            {/* SCORE DISPLAY ROW MATRIX */}
            <div className="flex flex-col md:flex-row items-center gap-10 border-b border-zinc-900 pb-8">
              
              {/* RADIAL CHART CONTAINER METRIC RING */}
              <div className="relative flex items-center justify-center flex-shrink-0">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r={radius}
                    className="stroke-current text-zinc-900"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r={radius}
                    className={`stroke-current transition-all duration-1000 ease-out ${
                      score >= 75 ? "text-green-400" : score >= 50 ? "text-yellow-400" : "text-red-400"
                    }`}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-4xl font-black tracking-tight text-white">{score}%</span>
                  <span className="text-[10px] block text-zinc-500 font-bold tracking-widest uppercase mt-0.5">ATS Match</span>
                </div>
              </div>

              {/* EDITORIAL SUMMARY LOGIC */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-white tracking-tight">Analysis Breakdown</h3>
                <p className="text-zinc-400 mt-2 text-sm leading-relaxed font-medium">
                  {score >= 75 
                    ? "Excellent match layout! Your structural keyword density aligns well with standard tracking algorithms. See minor optimization suggestions below." 
                    : "Moderate keyword alignment detected. Injecting the missing core operational technologies highlighted below will significantly boost parsing visibility."}
                </p>
              </div>
            </div>

            {/* DUAL COMPETENCY BADGES MATRIX GRID */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* BADGES SECTION A: SKILLS FOUND */}
              <div className="bg-zinc-900/10 p-5 rounded-2xl border border-zinc-900/60">
                <h4 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                  <span className="h-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50"></span> Identified Core Competencies
                </h4>
                <div className="flex flex-wrap gap-2 mt-4">
                  {result.foundSkills && result.foundSkills.length > 0 ? (
                    result.foundSkills.map((tag, i) => (
                      <span key={i} className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs px-3 py-1.5 rounded-xl font-medium shadow-sm">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-zinc-600 italic">No verified technical skill tags isolated.</span>
                  )}
                </div>
              </div>

              {/* BADGES SECTION B: MISSING SKILLS */}
              <div className="bg-zinc-900/10 p-5 rounded-2xl border border-zinc-900/60">
                <h4 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                  <span className="h-2 h-2 rounded-full bg-red-400 shadow-lg shadow-red-400/50"></span> Missing High-Priority Keywords
                </h4>
                <div className="flex flex-wrap gap-2 mt-4">
                  {result.missingSkills && result.missingSkills.length > 0 ? (
                    result.missingSkills.map((tag, i) => (
                      <span key={i} className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-1.5 rounded-xl font-medium shadow-sm">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-zinc-600 italic">No missing critical skills detected.</span>
                  )}
                </div>
              </div>
            </div>

            {/* UPGRADED SUGGESTIONS MODULE STRIPS */}
            <div className="mt-8 pt-6 border-t border-zinc-900">
              <h4 className="text-lg font-bold text-zinc-200 tracking-tight">Strategic Optimization Roadmap</h4>
              <ul className="mt-4 space-y-3">
                {result.suggestions && result.suggestions.length > 0 ? (
                  result.suggestions.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-400 leading-relaxed font-medium">
                      <span className="text-cyan-400 font-bold mt-0.5">▪</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-zinc-600 italic">No additional formatting optimizations required.</li>
                )}
              </ul>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}