import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans overflow-hidden selection:bg-violet-500/30 relative">
      
      {/* Background glowing mesh accents */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none"></div>

      {/* TOP NAVIGATION */}
      <nav className="p-6 max-w-7xl mx-auto flex justify-between items-center relative z-10">
        <div className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-500 select-none">
          SkillSync AI 🚀
        </div>
        <button 
          onClick={() => navigate("/dashboard")}
          className="bg-white hover:bg-zinc-200 text-black text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
        >
          Get Started
        </button>
      </nav>

      {/* HERO WRAPPER MAIN FRAME SECTION */}
      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 relative z-10 max-w-5xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.05] text-white">
          AI Powered <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-500">
            Career Growth Platform
          </span>
        </h1>
        
        <p className="text-zinc-500 text-base md:text-lg mt-8 max-w-2xl font-medium leading-relaxed">
          Analyze technical skills, compile progressive career roadmaps, improve resume keywords density, and optimize presentation structures for industrial criteria.
        </p>

        <div className="flex items-center gap-4 mt-12">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold px-8 py-4 rounded-xl shadow-xl shadow-violet-600/20 transition-all hover:scale-[1.02] active:scale-95 text-base tracking-wide"
          >
            Start Free
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-zinc-900/60 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-white/5 font-semibold px-8 py-4 rounded-xl transition-all active:scale-95 text-base"
          >
            Explore Options
          </button>
        </div>
      </div>
    </div>
  );
}