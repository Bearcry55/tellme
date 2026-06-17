"use client";
import { useState } from "react";

export default function Home() {
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [templateId, setTemplateId] = useState("pleading-cats-02");
  const [generatedLink, setGeneratedLink] = useState("");
  const [trackerLink, setTrackerLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50 p-4 text-black">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-pink-100">
        <h1 className="text-3xl font-bold text-pink-600 mb-6 text-center">💘 Proposal Builder</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Your Name</label>
            <input type="text" required className="mt-1 block w-full rounded-md border border-gray-300 p-2" value={senderName} onChange={(e) => setSenderName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Crush's Name</label>
            <input type="text" required className="mt-1 block w-full rounded-md border border-gray-300 p-2" value={receiverName} onChange={(e) => setReceiverName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Select Interactive Style</label>
            <select className="mt-1 block w-full rounded-xl border border-gray-300 p-3 bg-white" value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
              <option value="pleading-cats-02">🐱 Cute Pleading Cats</option>
              <option value="retro-pixel-03">👾 Retro Arcade Pixel</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-pink-500 text-white p-3 rounded-md font-semibold hover:bg-pink-600 transition">
            Generate Proposal Pack
          </button>
        </form>

        {generatedLink && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg break-all">
              <p className="text-xs text-green-800 font-bold uppercase tracking-wider">1. Send this to your Crush 👇</p>
              <a href={generatedLink} target="_blank" className="text-blue-600 underline block mt-1 font-mono text-sm">{generatedLink}</a>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg break-all">
              <p className="text-xs text-purple-800 font-bold uppercase tracking-wider">2. Keep this secret to track responses 👇</p>
              <a href={trackerLink} target="_blank" className="text-purple-600 underline block mt-1 font-mono text-sm">{trackerLink}</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}