"use client";
import { useState } from "react";

interface TemplateProps {
  data: {
    sender_name: string;
    receiver_name: string;
    custom_question?: string; // New variable mapping parameter
  };
}

export default function CatTemplate({ data }: TemplateProps) {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);

  const yesButtonSize = noCount * 20 + 16; 

  const cryingCatGif = "https://gifdb.com/images/high/sobbing-sad-cat-crying-face-uksj1lfb4y04w615.gif";
  const happyCatGif = "https://gifdb.com/images/high/happy-cat-gif-0xi6309m0qi3eyqc.webp";

  const handleYesClick = async () => {
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

  const getNoButtonText = () => {
    const phrases = [
      "No", "Are you absolutely sure? 🥺", "Pookie please... think again",
      "Don't do this to me 😭", "I will literally cry", 
      "Look at the cats, how can you say no?", "Error: Wrong button clicked 😉"
    ];
    return phrases[Math.min(noCount, phrases.length - 1)];
  };

  if (yesPressed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-rose-100 p-4 text-black text-center">
        <img src={happyCatGif} alt="Happy celebrating cats" className="w-56 h-56 mb-4 object-contain" />
        <h1 className="text-4xl font-extrabold text-rose-600 animate-pulse">YAAAAAY!!! 🎉</h1>
        <p className="text-xl mt-2 text-gray-700">Take a screenshot and send it to <span className="font-bold text-rose-500">{data.sender_name}</span> right away!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-rose-50 p-4 text-black text-center">
      <img src={cryingCatGif} alt="Sad crying cat" className="w-48 h-48 mb-6 object-contain" />
      <h1 className="text-3xl font-bold mb-2">Hey {data.receiver_name}! ✨</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-sm">{data.sender_name} has a question for you...</p>

      {/* Dynamic Display Condition */}
      <h2 className="text-2xl font-extrabold text-rose-600 mb-8 px-4 max-w-xl leading-relaxed">
        {data.custom_question && data.custom_question.trim() !== "" 
          ? data.custom_question 
          : "Will you be my partner? 👉👈"}
      </h2>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xs mx-auto px-4">
        <button style={{ fontSize: `${yesButtonSize}px` }} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-2xl shadow-lg transition-all transform active:scale-95" onClick={handleYesClick}>Yes! 💖</button>
        <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition whitespace-nowrap" onClick={() => setNoCount(noCount + 1)}>{getNoButtonText()}</button>
      </div>
    </div>
  );
}
