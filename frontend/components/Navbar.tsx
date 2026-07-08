"use client";

import { Heart } from "lucide-react";

interface NavbarProps {
  onExploreClick: () => void;
  onAboutClick?: () => void;
}

export default function Navbar({ onExploreClick, onAboutClick }: NavbarProps) {
  return (
    <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between bg-white/70 backdrop-blur-md rounded-2xl my-6 border border-pink-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative z-50 transition-all">
      {/* Brand Logo */}
      <div className="flex items-center gap-2 cursor-pointer group">
        <Heart className="w-5 h-5 text-[#785589] fill-[#785589] group-hover:scale-110 transition-transform" />
        <span className="text-base font-bold tracking-tight text-zinc-800">
          Tell<span className="text-[#785589]">Me</span>
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-8 text-sm font-medium text-zinc-500">
        <button 
          onClick={onExploreClick} 
        
          className="hover:text-[#785589] bg-transparent border-none cursor-pointer transition-colors"
        >
          How to Use
        </button>
        <button 
          onClick={onAboutClick || onExploreClick} 
          className="hover:text-[#785589] bg-transparent border-none cursor-pointer transition-colors"
        >
          About Us
        </button>
        
        {/* Action Button using a soft lavender tint background with dark lavender text */}
        <button 
          onClick={onExploreClick} 
          className="bg-[#785589]/10 text-[#785589] hover:bg-[#785589]/20 px-4 py-2 rounded-xl text-xs font-bold transition-all"
        >
          Explore
        </button>
      </div>
    </nav>
  );
}