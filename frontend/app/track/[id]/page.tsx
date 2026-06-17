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
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");

  // Reusable function to pull fresh database status from Go manually
  const fetchCurrentStatus = async (isInitialLoad: boolean) => {
    if (!isInitialLoad) setSyncing(true);
    try {
      const response = await fetch(`http://localhost:8080/api/track/${trackerId}`);
      const result = await response.json();
      
      if (response.ok) {
        setData(result);
        setError(""); // Clear any previous network errors
      } else {
        setError(result.error || "Invalid tracker link.");
      }
    } catch (err) {
      console.error(err);
      setError("Could not reach your Go server. Is it running?");
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  // Run only once when the page first opens so the user sees the initial "pending" state
  useEffect(() => {
    if (trackerId) {
      fetchCurrentStatus(true);
    }
  }, [trackerId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-mono text-sm">Connecting to radar pipeline... 🛰️</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-red-400 font-mono text-sm font-bold">{error} ❌</div>;

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
          <p className="text-sm"><span className="text-slate-500 font-semibold">Agent (You):</span> {data?.sender_name}</p>
          <p className="text-sm"><span className="text-slate-500 font-semibold">Target (partner):</span> {data?.receiver_name}</p>
        </div>

        <div className="my-8 py-6 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Current Status</p>
          
          {data?.status === "pending" ? (
            <div>
              <div className="text-4xl my-3">⏳</div>
              <h2 className="text-2xl font-black text-yellow-500 uppercase tracking-wide">Pending Response</h2>
              <p className="text-xs text-slate-400 px-4 mt-2">
                No background requests are running. Click the button below to check for updates.
              </p>
            </div>
          ) : (
            <div>
              <div className="text-5xl animate-bounce my-3">🎉</div>
              <h2 className="text-2xl font-black text-green-400 uppercase tracking-wide">MISSION SUCCESSFUL!</h2>
              <p className="text-sm text-green-200 font-bold px-4 mt-2">{data?.receiver_name} accepted your request! 💖</p>
            </div>
          )}
        </div>

        {/* Big clean interactive button wrapper */}
        {data?.status === "pending" ? (
          <button 
            onClick={() => fetchCurrentStatus(false)}
            disabled={syncing}
            className="w-full py-3 bg-pink-600 hover:bg-pink-500 active:bg-pink-700 disabled:opacity-50 text-white font-bold rounded-xl transition border border-pink-500 shadow-[0_0_15px_rgba(219,39,119,0.3)] tracking-wider uppercase text-sm"
          >
            {syncing ? "Pinging Server... ⚡" : "🔍 Check Response"}
          </button>
        ) : (
          <div className="text-xs text-emerald-400 bg-emerald-950/40 py-2 rounded-lg border border-emerald-900/40 font-bold">
            Data Locked & Sync Complete
          </div>
        )}
      </div>
    </div>
  );
}