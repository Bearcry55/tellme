"use client";
import { useState } from "react";

export default function Home() {
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [templateId, setTemplateId] = useState("cute-cats-01");
  const [generatedLink, setGeneratedLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Sending the data directly to your Go server
      const response = await fetch("http://localhost:8080/api/proposals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_name: senderName,
          receiver_name: receiverName,
          template_id: templateId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Create the final shareable link using the ID Go returned
        setGeneratedLink(`http://localhost:3000/p/${data.proposal_id}`);
      } else {
        alert("Failed to create proposal: " + data.error);
      }
    } catch (error) {
      console.error("Error connecting to Go backend:", error);
      alert("Could not reach backend server.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-pink-600 mb-6 text-center">💘 Proposal Builder</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Your Name</label>
            <input 
              type="text" 
              required
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black"
              value={senderName} 
              onChange={(e) => setSenderName(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Crush's Name</label>
            <input 
              type="text" 
              required
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black"
              value={receiverName} 
              onChange={(e) => setReceiverName(e.target.value)} 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-pink-500 text-white p-2 rounded-md font-semibold hover:bg-pink-600 transition"
          >
            Generate Proposal Link
          </button>
        </form>

        {generatedLink && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg break-all">
            <p className="text-sm text-green-800 font-medium">Share this link with your crush! 👇</p>
            <a href={generatedLink} target="_blank" className="text-blue-600 underline block mt-1 font-mono">
              {generatedLink}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}