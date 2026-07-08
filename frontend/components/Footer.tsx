"use client";

export default function Footer() {
  return (
    <footer className="max-w-6xl w-full mx-auto mt-16 bg-white/60 backdrop-blur-sm rounded-2xl px-8 py-6 border border-pink-50/50 shadow-[0_4px_20px_rgb(0,0,0,0.01)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-zinc-400 relative z-20">
      <div>
        <span>© 2026 TellMe. Made beautifully with care.</span>
      </div>
      
      {/* Soft Iconized or Text Links */}
      <div className="flex items-center gap-6 text-zinc-500">
        <a href="mailto:support@tellme.com" className="hover:text-[#FFAFCC] transition-colors flex items-center gap-1">
          <span>Email</span>
        </a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFAFCC] transition-colors">
          Facebook
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFAFCC] transition-colors">
          Instagram
        </a>
      </div>
    </footer>
  );
}