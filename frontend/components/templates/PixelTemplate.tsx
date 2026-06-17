"use client";
import { useState } from "react";

interface TemplateProps {
  data: {
    sender_name: string;
    receiver_name: string;
    custom_question?: string; // New variable mapping parameter
  };
}

export default function PixelTemplate({ data }: TemplateProps) {
  const [yesPressed, setYesPressed] = useState(false);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [isMoved, setIsMoved] = useState(false);

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

  const teleportNoButton = () => {
    const randomX = (Math.random() - 0.5) * 300;
    const randomY = (Math.random() - 0.5) * 300;
    setNoPosition({ x: randomX, y: randomY });
    setIsMoved(true);
  };

  if (yesPressed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-green-400 p-4 font-mono text-center">
        <div className="border-4 border-green-400 p-8 rounded-none max-w-sm">
          <div className="text-6xl mb-4 animate-bounce">👾</div>
          <h1 className="text-3xl font-black uppercase tracking-widest mb-4">LEVEL CLEAR!</h1>
          <p className="text-sm">PLAYER 2 JOINS THE GAME! Tell {data.sender_name} they successfully won your heart.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-950 p-4 font-mono text-center text-white select-none">
      <div className="border-4 border-dashed border-pink-500 p-6 sm:p-10 bg-purple-900 max-w-md w-full relative">
        <span className="absolute top-2 left-3 text-xs text-pink-400 font-bold animate-pulse">INSERT COIN</span>
        
        <h1 className="text-xl font-bold text-yellow-400 uppercase tracking-wider mb-2 mt-4">QUEST INCOMING!</h1>
        <p className="text-xs text-purple-200 mb-6">From User: [{data.sender_name}] → To User: [{data.receiver_name}]</p>

        <div className="text-5xl my-6">❤️</div>

        {/* Dynamic Display Condition */}
        <h2 className="text-lg font-black text-pink-400 uppercase mb-8 leading-relaxed px-2">
          {data.custom_question && data.custom_question.trim() !== "" 
            ? data.custom_question 
            : "Will you accept this romantic alliance?"}
        </h2>

        <div className="flex justify-center items-center gap-6 min-h-[60px] relative">
          <button className="bg-yellow-400 hover:bg-yellow-50 text-purple-950 font-black py-3 px-6 uppercase border-b-4 border-yellow-600 active:border-b-0 transition-all rounded-none" onClick={handleAcceptClick}>[ ACCEPT ]</button>
          <button style={isMoved ? { transform: `translate(${noPosition.x}px, ${noPosition.y}px)`, position: "absolute" } : {}} onMouseEnter={teleportNoButton} onClick={teleportNoButton} className="bg-zinc-600 hover:bg-zinc-500 text-zinc-300 font-bold py-3 px-6 uppercase rounded-none transition-transform duration-100 ease-out z-50">REJECT</button>
        </div>
      </div>
    </div>
  );
}