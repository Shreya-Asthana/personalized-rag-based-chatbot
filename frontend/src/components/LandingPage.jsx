import { useState } from "react";
import { FolderDown, Sparkles } from "lucide-react";

export default function LandingPage({ onStart }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url) onStart(url);
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-black text-white">
      {/* --- Animated Gradient Background --- */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-black opacity-70 animate-gradient-flow" />

      {/* --- Blur Glow Orbs --- */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-700/30 rounded-full blur-[180px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-700/20 rounded-full blur-[160px]" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Header */}
        <div className="text-center space-y-6 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-300 animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-glow">
              DocVerse AI
            </h1>
          </div>

          <p className="text-gray-300 text-md md:text-xl max-w-2xl leading-relaxed mx-auto">
            Upload or sync an entire Google Drive folder and interact with your
            documents using intelligent, context-aware chat.
          </p>
        </div>

        {/* Glass Card */}
        <div className="mt-14 w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-2xl shadow-black/40 animate-fade-in-up delay-150">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Input label */}
            <div className="space-y-2 text-left">
              <label className="text-sm font-semibold text-gray-200">
                Google Drive Folder URL
              </label>

              <input
                type="url"
                required
                placeholder="https://drive.google.com/drive/folders/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white 
                placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                outline-none transition-all"
              />
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 
              hover:from-purple-500 hover:to-blue-500 transition-all font-semibold
              transform hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center gap-2 shadow-lg"
            >
              <FolderDown className="w-5 h-5" />
              Begin Ingestion
            </button>
          </form>
        </div>
      </div>

      {/* --- Animations (Tailwind Extensions) --- */}
      <style>{`
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-flow {
          background-size: 200% 200%;
          animation: gradient-flow 12s ease infinite;
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease forwards;
        }
        .delay-150 {
          animation-delay: 0.15s;
        }
        .drop-shadow-glow {
          filter: drop-shadow(0 0 20px rgba(120, 90, 255, 0.4));
        }
      `}</style>
    </div>
  );
}
