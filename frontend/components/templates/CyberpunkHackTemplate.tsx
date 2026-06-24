"use client";

import { useState } from "react";

interface TemplateProps {
  data: {
    sender_name: string;
    receiver_name: string;
    custom_question?: string;
  };
}

export default function CyberpunkTemplate({ data }: TemplateProps) {
  const [yesPressed, setYesPressed] = useState(false);
  const [glitchCount, setGlitchCount] = useState(0);

  const handleAcceptClick = async () => {
    setYesPressed(true);
    try {
      const pathParts = window.location.pathname.split("/");
      const id = pathParts[pathParts.length - 1];
      await fetch(`http://localhost:8080/api/proposals/${id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: "accepted" }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const triggerSystemGlitch = () => {
    setGlitchCount((prev) => prev + 1);
  };

  if (yesPressed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 p-4 font-mono text-center text-cyan-400">
        <div className="border-2 border-cyan-400 bg-neutral-900 p-8 rounded-none max-w-sm shadow-[0_0_20px_rgba(34,211,238,0.3)]">
          <div className="text-5xl mb-4 tracking-widest animate-pulse">🔓 [ACCESS GRANTED]</div>
          <h1 className="text-2xl font-black uppercase tracking-wider mb-4 text-white">FIREWALL BREACHED</h1>
          <p className="text-xs text-neutral-400">Connection established securely. {data.sender_name} now possesses write permissions directly to your core systems.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 p-4 font-mono text-left text-cyan-400 select-none">
      <div className={`border-2 ${glitchCount > 2 ? 'border-red-500 bg-red-950/20' : 'border-cyan-500 bg-neutral-900'} p-6 sm:p-8 max-w-md w-full relative transition-colors duration-300`}>
        
        {/* Terminal Header Decoration */}
        <div className="flex items-center justify-between border-b border-cyan-500 pb-3 mb-6">
          <span className="text-xs font-bold tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> 
            CORE_MAIN_FRAME // PROPOSAL_LINK
          </span>
          <span className="text-xs opacity-60">V.2.0.26</span>
        </div>

        <p className="text-[11px] uppercase tracking-wide mb-1 text-cyan-500/70">INCOMING CORRUPTED PACKET</p>
        <p className="text-xs font-bold text-white mb-6">
          SOURCE_NODE: [{data.sender_name}] <br />
          TARGET_NODE: [{data.receiver_name}]
        </p>

        {/* Central Exploit Prompt Statement */}
        <div className="border border-cyan-500/30 p-4 bg-black/40 mb-8 rounded-none">
          <p className="text-[10px] text-yellow-500 mb-2 font-bold">// ACCESS QUESTION RUNNING:</p>
          <h2 className="text-md font-extrabold text-white uppercase leading-relaxed">
            {data.custom_question && data.custom_question.trim() !== "" 
              ? data.custom_question 
              : "Execute protocol initialized to lock in this romantic partnership?"}
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 font-bold text-xs">
          <button 
            onClick={triggerSystemGlitch}
            className={`border px-4 py-3 uppercase text-center transition-all ${
              glitchCount > 0 
                ? "border-red-500 text-red-400 bg-red-500/10 animate-shake" 
                : "border-neutral-600 text-neutral-400 hover:border-red-400 hover:text-red-400"
            }`}
          >
            {glitchCount === 0 && "DENY OVERRIDE"}
            {glitchCount === 1 && "ERROR: RETRYING"}
            {glitchCount === 2 && "ACCESS DENIED !!"}
            {glitchCount > 2 && "COMPLIANCE MANDATORY"}
          </button>

          <button 
            className="bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-black px-6 py-3 uppercase transition-all shadow-[0_0_10px_rgba(6,182,212,0.4)]"
            onClick={handleAcceptClick}
          >
            {glitchCount > 2 ? "[ FORCE AUTHORIZE ]" : "[ AUTHORIZE OVERRIDE ]"}
          </button>
        </div>

        {glitchCount > 0 && (
          <p className="text-[10px] text-red-500 font-bold mt-4 text-center uppercase tracking-widest animate-pulse">
            ⚠️ SYSTEM INTRUSION DETECTED: TERMINATE REJECTION ATTEMPTS IMMEDIATELY.
          </p>
        )}
      </div>
    </div>
  );
}