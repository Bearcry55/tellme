"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface TrackData {
  sender_name: string;
  receiver_name: string;
  status: string;
}

export default function StatusCheck() {
  const params = useParams();
  const trackerId = params.id;

  const [data, setData] = useState<TrackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const checkStatus = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/track/${trackerId}`);
      const result = await response.json();
      
      if (response.ok) {
        setData(result);
      } else {
        setError(result.error || "Invalid tracker link.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error: Could not sync with Go backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trackerId) {
      // Run right away when page loads
      checkStatus();
      
      // Poll/refresh the backend data every 5 seconds automatically
      const interval = setInterval(checkStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [trackerId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-mono text-sm">
        Accessing live telemetry... 🛰️
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-red-400 font-mono text-sm font-bold">
        {error} ❌
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-4 text-white font-mono">
      <div className="border-2 border-slate-700 bg-slate-900 p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
        <h1 className="text-xl font-bold text-slate-400 mb-2 uppercase tracking-widest">
          Proposal Radar Dashboard
        </h1>
        <p className="text-xs text-slate-500 mb-6">
          Tracker Token ID: {trackerId}
        </p>
        
        <div className="border border-slate-800 p-4 rounded-lg bg-black/40 text-left mb-6 space-y-2">
          <p className="text-sm">
            <span className="text-slate-500 font-semibold">Agent (You):</span> {data?.sender_name}
          </p>
          <p className="text-sm">
            <span className="text-slate-500 font-semibold">Target (Crush):</span> {data?.receiver_name}
          </p>
        </div>

        <div className="my-8 py-6 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">
            Current Status
          </p>
          
          {data?.status === "pending" ? (
            <div>
              <div className="text-4xl anonymity-pulse my-3 animate-pulse">⏳</div>
              <h2 className="text-2xl font-black text-yellow-500 uppercase tracking-wide">
                Pending Response
              </h2>
              <p className="text-xs text-slate-400 px-4 mt-2">
                They haven't clicked an option yet. Keep waiting, soldier!
              </p>
            </div>
          ) : (
            <div>
              <div className="text-5xl animate-bounce my-3">🎉</div>
              <h2 className="text-2xl font-black text-green-400 uppercase tracking-wide">
                MISSION SUCCESSFUL!
              </h2>
              <p className="text-sm text-green-200 font-bold px-4 mt-2">
                {data?.receiver_name} accepted your request! 💖
              </p>
            </div>
          )}
        </div>

        <button 
          onClick={checkStatus}
          className="text-xs px-4 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-300 rounded transition border border-slate-700"
        >
          Force Manual Re-Check 🔄
        </button>
      </div>
    </div>
  );
}