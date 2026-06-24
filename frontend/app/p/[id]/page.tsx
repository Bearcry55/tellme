"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CatTemplate from "@/components/templates/CatTemplate";
import PixelTemplate from "@/components/templates/PixelTemplate";
import TamagotchiTemplate from "@/components/templates/TamagotchiPetTemplate";
import CyberpunkTemplate from "@/components/templates/CyberpunkHackTemplate";

interface ProposalData {
  sender_name: string;
  receiver_name: string;
  template_id: string;
  custom_question?: string;
}

export default function ProposalView() {
  const params = useParams();
  const proposalId = params.id;

  const [data, setData] = useState<ProposalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/proposals/${proposalId}`);
        const result = await response.json();

        if (response.ok) {
          setData(result);
        } else {
          setError(result.error || "Proposal file missing!");
        }
      } catch (err) {
        console.error(err);
        setError("Network sync connection error.");
      } finally {
        setLoading(false);
      }
    };

    if (proposalId) fetchProposal();
  }, [proposalId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white font-mono">Decoding transmission... 💌</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-red-400 font-mono font-bold">{error} ❌</div>;

  // Render the selected visual style template
  switch (data?.template_id) {
    case "pleading-cats-02":
      return <CatTemplate data={data} />;
    case "retro-pixel-03":
      return <PixelTemplate data={data} />;
    case "tamagotchi-pet-04":
      return <TamagotchiTemplate data={data} />;
    case "cyberpunk-hack-05":
      return <CyberpunkTemplate data={data} />;
    default:
      // Fallback structural layout if the ID matches something unexpected
      return <CatTemplate data={data || { sender_name: "Someone", receiver_name: "You" }} />;
  }
}