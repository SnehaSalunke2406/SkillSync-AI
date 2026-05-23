import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Roadmap() {
  const [skill, setSkill] = useState("");
  const [targetGoal, setTargetGoal] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!skill.trim() || !targetGoal.trim()) {
      alert("Please fill in both fields");
      return;
    }

    try {
      setLoading(true);
      setRoadmap(null);

      const response = await fetch("http://localhost:5001/roadmap", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
          skill: skill.trim(), 
          targetGoal: targetGoal.trim() 
        }),
      });

      const data = await response.json();
      // FIXED: Cleared the corrupt setResult method call to let the layout render safely!
      setRoadmap(data);
    } catch (e) {
      console.error("Roadmap generation client error:", e);
      alert("Failed to connect to backend server. Make sure your server is running on port 5001.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-10 font-sans selection:bg-violet-500/30">
      
      {/* GLOBAL TOP NAVIGATION HEADER */}
      <nav className="p-6 border border-white/5 bg-zinc-950/40 backdrop-blur-md flex justify-between items-center max-w-7xl mx-auto mb-10 rounded-2xl shadow-2xl">
        <div 
          onClick={() => navigate("/")} 
          className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-500 cursor-pointer select-none"
        >
          SkillSync AI
        </div>
        <button 
          onClick={() => navigate("/dashboard")} 
          className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-sm font-semibold py-2.5 px-5 rounded-xl border border-white/5 transition-all cursor-pointer"
        >
          ← Back to Dashboard
        </button>
      </nav>

      {/* CORE GENERATOR INTERFACE CONTAINER */}
      <div className="max-w-4xl mx-auto bg-zinc-950/50 border border-white/5 p-10 rounded-3xl backdrop-blur-xl shadow-2xl">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 flex items-center gap-2">
          AI Roadmap Generator 🚀
        </h1>
        <p className="text-zinc-500 mt-1 text-sm">Map custom sequential milestone pathways starting from foundational components.</p>
        
        <div className="mt-8 flex flex-col gap-4 max-w-xl">
          <input 
            type="text" 
            placeholder="e.g., C++" 
            value={skill} 
            onChange={e => setSkill(e.target.value)} 
            className="bg-zinc-900 p-4 rounded-xl border border-white/5 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors" 
          />
          <input 
            type="text" 
            placeholder="e.g., DSA" 
            value={targetGoal} 
            onChange={e => setTargetGoal(e.target.value)} 
            className="bg-zinc-900 p-4 rounded-xl border border-white/5 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors" 
          />
          <button 
            onClick={handleGenerate} 
            disabled={loading}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white p-4 rounded-xl font-bold tracking-wide transition-all active:scale-[0.98] shadow-lg shadow-violet-600/20 disabled:bg-zinc-800 disabled:text-zinc-500 cursor-pointer"
          >
            {loading ? "Compiling Specialized Tracks..." : "Generate Custom Path"}
          </button>
        </div>

        {/* TIMELINE & NEW ADDED FEATURES DISPLAY */}
        {roadmap && (
          <div className="mt-10 pt-8 border-t border-white/5">
            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-6">{roadmap.title}</h2>
            
            {/* NEW ADDED FEATURE: CORE PREREQUISITE SKILLS BADGES MATRIX */}
            {roadmap.requiredSkills && roadmap.requiredSkills.length > 0 && (
              <div className="mb-8 bg-zinc-900/40 p-6 rounded-2xl border border-white/5">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Suggested Core Core Skill Requirements:</h4>
                <div className="flex flex-wrap gap-2 mt-3.5">
                  {roadmap.requiredSkills.map((badge, i) => (
                    <span key={i} className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-inner">
                      ✨ {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* TIMELINE TRACKS GENERATOR */}
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-zinc-800">
              {roadmap.phases?.map((phase, index) => (
                <div key={index} className="relative pl-10 group">
                  <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full bg-violet-500 ring-4 ring-black shadow-lg shadow-violet-500/50"></div>
                  
                  <div className="bg-white/[0.01] p-6 rounded-2xl border border-white/5 hover:border-violet-500/30 transition-all duration-300">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <h3 className="font-bold text-zinc-100 text-lg">{phase.phaseName}</h3>
                      <span className="text-xs text-violet-400 border border-violet-500/20 bg-violet-500/5 px-2.5 py-1 rounded-full font-bold">
                        {phase.duration}
                      </span>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Concepts to Master:</h4>
                      <div className="mt-2 space-y-2">
                        {phase.topics?.map((t, i) => (
                          <p key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                            <span className="text-violet-500 font-bold">▪</span>
                            <span>{t}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                    
                    {phase.projectIdea && (
                      <p className="text-xs text-emerald-400 mt-4 border-t border-white/5 pt-3 font-semibold">
                        Milestone Capstone: {phase.projectIdea}
                      </p>
                    )}
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