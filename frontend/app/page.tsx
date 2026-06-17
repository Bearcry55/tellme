"use client";
import { useState } from "react";

export default function Home() {
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [templateId, setTemplateId] = useState("pleading-cats-02");
  const [generatedLink, setGeneratedLink] = useState("");
  const [trackerLink, setTrackerLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_name: senderName,
          receiver_name: receiverName,
          template_id: templateId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedLink(`http://localhost:3000/p/${data.proposal_id}`);
        setTrackerLink(`http://localhost:3000/track/${data.tracker_id}`);
      } else {
        alert("Failed to build asset: " + data.error);
      }
    } catch (error) {
      alert("Could not reach backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#1E1E1E] selection:bg-pink-200 p-4 sm:p-8 flex flex-col items-center justify-center font-sans relative overflow-hidden">
      
      {/* Decorative background grid/elements to kill the plain AI background look */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <header className="text-center mb-8 max-w-md relative z-10">
        <span className="bg-pink-100 text-pink-700 text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full border-2 border-[#1E1E1E] inline-block mb-3 shadow-[2px_2px_0px_#1E1E1E]">
          Free Link Engine v1.0
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#1E1E1E]">
          TELL<span className="text-pink-500">Me</span>
        </h1>
        <p className="text-sm font-medium text-gray-500 mt-2">
          Create custom interactive links to ask out your favorite human. Watch their live answers in real-time.
        </p>
      </header>

      <main className="w-full max-w-2xl bg-white border-4 border-[#1E1E1E] rounded-3xl p-6 sm:p-10 shadow-[8px_8px_0px_#1E1E1E] relative z-10 transition-all">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black tracking-wider uppercase text-gray-700 mb-1">
                Your Signature Name
              </label>
              <input 
                type="text" 
                required 
                placeholder="e.g., Alex"
                className="w-full border-3 border-[#1E1E1E] rounded-xl p-3 font-semibold text-black placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition shadow-[3px_3px_0px_#1E1E1E]" 
                value={senderName} 
                onChange={(e) => setSenderName(e.target.value)} 
              />
            </div>

            <div>
              <label className="block text-xs font-black tracking-wider uppercase text-gray-700 mb-1">
                Their Target Name
              </label>
              <input 
                type="text" 
                required 
                placeholder="e.g., Sam"
                className="w-full border-3 border-[#1E1E1E] rounded-xl p-3 font-semibold text-black placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition shadow-[3px_3px_0px_#1E1E1E]" 
                value={receiverName} 
                onChange={(e) => setReceiverName(e.target.value)} 
              />
            </div>
          </div>

          {/* Upgraded Template Cards Selection Grid */}
          <div>
            <label className="block text-xs font-black tracking-wider uppercase text-gray-700 mb-2">
              Choose Interactive Strategy
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Option 1 Card */}
              <div 
                onClick={() => setTemplateId("pleading-cats-02")}
                className={`cursor-pointer border-3 rounded-2xl p-4 transition-all flex flex-col justify-between select-none bg-rose-50/40 ${
                  templateId === "pleading-cats-02" 
                    ? "border-pink-500 bg-rose-50 shadow-[4px_4px_0px_#EC4899]" 
                    : "border-[#1E1E1E] hover:border-pink-400 hover:shadow-[4px_4px_0px_#1E1E1E] shadow-[2px_2px_0px_#1E1E1E]"
                }`}
              >
                <div>
                  <div className="text-2xl mb-1">🐱</div>
                  <h3 className="font-bold text-base text-gray-900">Pleading Cats</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    The classic psychological setup. When they hit "No", your "Yes" button expands to fill their screen.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-pink-600 bg-pink-100/60 px-2 py-0.5 rounded mt-3 self-start border border-pink-300">
                  Guaranteed Button Scaling
                </span>
              </div>

              {/* Option 2 Card */}
              <div 
                onClick={() => setTemplateId("retro-pixel-03")}
                className={`cursor-pointer border-3 rounded-2xl p-4 transition-all flex flex-col justify-between select-none bg-purple-50/40 ${
                  templateId === "retro-pixel-03" 
                    ? "border-purple-600 bg-purple-50 shadow-[4px_4px_0px_#7C3AED]" 
                    : "border-[#1E1E1E] hover:border-purple-400 hover:shadow-[4px_4px_0px_#1E1E1E] shadow-[2px_2px_0px_#1E1E1E]"
                }`}
              >
                <div>
                  <div className="text-2xl mb-1">👾</div>
                  <h3 className="font-bold text-base text-gray-900">Retro Arcade Pixel</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Chiptune terminal style. The "Reject" button teleports away erratically whenever their cursor draws close.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-100/60 px-2 py-0.5 rounded mt-3 self-start border border-purple-300">
                  Evasive Flying Button
                </span>
              </div>

            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#1E1E1E] text-white font-black uppercase tracking-wider p-4 rounded-xl shadow-[4px_4px_0px_#EC4899] hover:bg-gray-800 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#EC4899] transition-all disabled:opacity-50 mt-4 text-center"
          >
            {loading ? "Generating Pipeline Tokens..." : "Deploy Active Proposal Link 🔥"}
          </button>
        </form>

        {/* Generated Output Area with clean Action Cards */}
        {generatedLink && (
          <div className="mt-8 pt-6 border-t-4 border-dashed border-gray-200 space-y-4 animate-[fadeIn_0.2s_ease-out]">
            
            <div className="p-4 bg-emerald-50 border-3 border-emerald-600 rounded-xl shadow-[4px_4px_0px_#059669] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="break-all">
                <p className="text-xs font-black uppercase tracking-wider text-emerald-800">1. Share this with your crush</p>
                <a href={generatedLink} target="_blank" rel="noreferrer" className="text-blue-600 underline font-mono text-sm block mt-1 hover:text-blue-800">
                  {generatedLink}
                </a>
              </div>
              <button 
                onClick={() => { navigator.clipboard.writeText(generatedLink); alert("Copied shareable link!"); }}
                className="bg-white border-2 border-[#1E1E1E] text-xs font-bold py-1 px-3 rounded-lg shadow-[2px_2px_0px_#1E1E1E] active:translate-y-0.5 hover:bg-gray-50 whitespace-nowrap self-end sm:self-center text-black"
              >
                Copy Link
              </button>
            </div>

            <div className="p-4 bg-amber-50 border-3 border-amber-500 rounded-xl shadow-[4px_4px_0px_#D97706] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="break-all">
                <p className="text-xs font-black uppercase tracking-wider text-amber-800">2. Keep this secret (Radar Dashboard)</p>
                <a href={trackerLink} target="_blank" rel="noreferrer" className="text-purple-600 underline font-mono text-sm block mt-1 hover:text-purple-800">
                  {trackerLink}
                </a>
              </div>
              <button 
                onClick={() => { navigator.clipboard.writeText(trackerLink); alert("Copied radar key link!"); }}
                className="bg-white border-2 border-[#1E1E1E] text-xs font-bold py-1 px-3 rounded-lg shadow-[2px_2px_0px_#1E1E1E] active:translate-y-0.5 hover:bg-gray-50 whitespace-nowrap self-end sm:self-center text-black"
              >
                Copy Key
              </button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}