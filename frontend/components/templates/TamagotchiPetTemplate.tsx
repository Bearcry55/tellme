"use client";

import { useState } from "react";

interface TemplateProps {
  data: {
    sender_name: string;
    receiver_name: string;
    custom_question?: string;
  };
}

export default function TamagotchiTemplate({ data }: TemplateProps) {
  const [yesPressed, setYesPressed] = useState(false);
  const [rejectScale, setRejectScale] = useState(1);
  const [petMood, setPetMood] = useState("🥺");
  const [petStatus, setPetStatus] = useState("NEEDING LOVE");

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

  const shrinkRejectButton = () => {
    setPetMood("😭");
    setPetStatus("HEARTBROKEN");
    // Reduce the scale size by 25% each time they hover or click
    setRejectScale((prev) => Math.max(prev - 0.25, 0));
  };

  if (yesPressed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 p-4 font-mono text-center text-neutral-200">
        <div className="border-4 border-emerald-400 bg-neutral-950 p-8 max-w-sm rounded-3xl shadow-[0_0_15px_#10b981]">
          <div className="text-6xl mb-4 animate-bounce">💖🐱💖</div>
          <h1 className="text-2xl font-black uppercase text-emerald-400 tracking-widest mb-4">PET IS HAPPY!</h1>
          <p className="text-sm">ALL SYSTEMS NOMINAL! You made {data.sender_name}&apos;s heart completely full.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-emerald-950 p-4 font-mono text-center text-neutral-800 select-none">
      {/* Outer Egg Shell */}
      <div className="border-8 border-neutral-900 bg-pink-400 rounded-[50px] p-8 pb-12 max-w-sm w-full shadow-2xl border-b-[16px]">
        
        {/* Virtual Screen LCD */}
        <div className="bg-neutral-200 border-4 border-neutral-700 p-4 rounded-xl relative shadow-inner">
          <div className="flex justify-between text-[10px] font-black text-neutral-600 border-b border-neutral-400 pb-1 uppercase tracking-tighter">
            <span>HP: 100/100</span>
            <span className="animate-pulse">STATUS: {petStatus}</span>
          </div>

          <div className="text-6xl my-6 animate-pulse">{petMood}</div>

          <p className="text-[11px] text-neutral-500 font-bold uppercase mb-2">
            Incoming Prompt from [{data.sender_name}]
          </p>

          <h2 className="text-sm font-black text-neutral-900 uppercase mb-6 min-h-[40px] flex items-center justify-center px-1">
            {data.custom_question && data.custom_question.trim() !== "" 
              ? data.custom_question 
              : `Will you be ${data.sender_name}'s co-op companion?`}
          </h2>

          {/* Action Interface Area */}
          <div className="flex justify-center items-center gap-4 min-h-[50px]">
            <button 
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-black py-2 px-4 border-b-4 border-emerald-700 active:border-b-0 text-xs uppercase"
              onClick={handleAcceptClick}
            >
              FEED LOVE
            </button>
            
            {rejectScale > 0 && (
              <button 
                style={{ transform: `scale(${rejectScale})` }}
                onMouseEnter={shrinkRejectButton}
                onClick={shrinkRejectButton}
                className="bg-neutral-400 hover:bg-neutral-500 text-neutral-700 font-bold py-2 px-4 text-xs uppercase transition-all duration-150 origin-center"
              >
                IGNORE
              </button>
            )}
          </div>
        </div>

        {/* Decorative Shell Buttons */}
        <div className="flex justify-center gap-6 mt-6">
          <div className="w-4 h-4 rounded-full bg-yellow-300 border-2 border-neutral-800 shadow-md"></div>
          <div className="w-4 h-4 rounded-full bg-blue-400 border-2 border-neutral-800 shadow-md"></div>
          <div className="w-4 h-4 rounded-full bg-purple-400 border-2 border-neutral-800 shadow-md"></div>
        </div>
      </div>
    </div>
  );
}