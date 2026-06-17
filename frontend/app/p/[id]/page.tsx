"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Tell TypeScript what kind of data we expect back from Go
interface ProposalData {
  sender_name: string;
  receiver_name: string;
  template_id: string;
}

export default function ProposalView() {
  const params = useParams();
  const proposalId = params.id; // Grabs the "love-999" from the URL

  const [data, setData] = useState<ProposalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // This runs automatically when the page loads
    const fetchProposal = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/proposals/${proposalId}`);
        const result = await response.json();

        if (response.ok) {
          setData(result);
        } else {
          setError(result.error || "Proposal not found");
        }
      } catch (err) {
        console.error("Error fetching data from Go:", err);
        setError("Could not connect to backend server");
      } finally {
        setLoading(false);
      }
    };

    if (proposalId) {
      fetchProposal();
    }
  }, [proposalId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-black">Loading love letter... 💌</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">{error} ❌</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-red-100 to-pink-200 p-4 text-black">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center border-4 border-pink-400">
        
        {/* This is a super basic placeholder for your templates */}
        <h1 className="text-3xl font-extrabold text-pink-600 mb-4">
          Hey {data?.receiver_name}! 💖
        </h1>
        
        <p className="text-lg text-gray-700 mb-6">
          <span className="font-bold text-gray-900">{data?.sender_name}</span> has a really important question for you...
        </p>

        <div className="text-6xl my-6 animate-bounce">🥺👉👈</div>

        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Will you be my partner?
        </h2>

        {/* Interactive Buttons */}
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => alert("🎉 SUCCESS! Send a screenshot to them!")}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition"
          >
            YES!
          </button>
          
          <button 
            onClick={(e) => {
              // A funny little trick: make the button pop up an alert
              alert("Type 'Yes' is the only option! 😉");
            }}
            className="px-6 py-3 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-xl shadow-lg transition"
          >
            No
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-8 font-mono">Template: {data?.template_id}</p>
      </div>
    </div>
  );
}