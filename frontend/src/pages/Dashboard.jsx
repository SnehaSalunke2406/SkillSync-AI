import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const cards = [
    {
      id: "roadmap",
      title: "AI Roadmap",
      icon: "🚀",
      desc: "Generate personalized technical learning tracks structured across real-world milestones.",
      path: "/roadmap"
    },
    {
      id: "resume",
      title: "Resume Analyzer",
      icon: "📄",
      desc: "Upload your PDF profile template to execute real-time structural ATS validation parses.",
      path: "/resume-analyzer"
    },
    {
      id: "github",
      title: "GitHub Analyzer",
      icon: "💻",
      desc: "Analyze codebase consistency architectures and public tech stack repository distributions.",
      path: "/github-analyzer"
    }
  ];

  const filteredCards = cards.filter(card => 
    card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-10 font-sans selection:bg-violet-500/30">
      
      {/* HEADER HUD BAR */}
      <div className="flex justify-between items-center border-b border-white/5 pb-8 flex-wrap gap-4 max-w-7xl mx-auto">
        <div>
          <h1 className="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
            Dashboard 🚀
          </h1>
          <p className="text-zinc-500 mt-2 text-sm font-medium">Welcome to the SkillSync AI core platform terminal workspace.</p>
        </div>

        <div className="flex items-center gap-4">
          {/* FEATURE ACCELERATOR: REALTIME CARD INPUT FILTER */}
          <input 
            type="text" 
            placeholder="Search tools..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-zinc-900/60 border border-white/5 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-violet-500 transition-colors w-48 md:w-64 placeholder-zinc-600"
          />
          <button
            onClick={() => navigate("/")}
            className="bg-white text-black hover:bg-zinc-200 font-bold px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-95 text-sm"
          >
            Home
          </button>
        </div>
      </div>

      {/* CARDS CONTAINER SECTION */}
      <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-7xl mx-auto">
        {filteredCards.length > 0 ? (
          filteredCards.map((card) => (
            <div
              key={card.id}
              onClick={() => navigate(card.path)}
              className="bg-zinc-950 border border-white/5 p-8 rounded-3xl cursor-pointer hover:border-violet-500/40 hover:bg-white/[0.01] transition-all duration-300 shadow-xl relative group overflow-hidden"
            >
              <div className="absolute -inset-px bg-gradient-to-br from-violet-600/10 to-indigo-600/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{card.icon}</div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-100 group-hover:text-violet-400 transition-colors">{card.title}</h2>
              <p className="text-zinc-500 mt-3 text-sm leading-relaxed font-medium">{card.desc}</p>
            </div>
          ))
        ) : (
          <div className="text-zinc-600 col-span-3 py-10 text-center text-sm font-medium border border-dashed border-white/5 rounded-2xl">
            No matching tools found. Refine your query parameters.
          </div>
        )}
      </div>

      {/* FOOTER STATS INJECTION BAR */}
      <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-7xl mx-auto">
        <div className="bg-zinc-950 border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-violet-600"></div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">12+</h2>
          <p className="text-zinc-500 text-xs font-semibold uppercase mt-1 tracking-wider">AI Features Running</p>
        </div>
        <div className="bg-zinc-950 border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">24/7</h2>
          <p className="text-zinc-500 text-xs font-semibold uppercase mt-1 tracking-wider">Placement Diagnostics</p>
        </div>
        <div className="bg-zinc-950 border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-600"></div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">AI</h2>
          <p className="text-zinc-500 text-xs font-semibold uppercase mt-1 tracking-wider">Model Tuning Loaded</p>
        </div>
      </div>

    </div>
  );
}