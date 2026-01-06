"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MapPinned, Activity } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  // Helper function to check if link is active
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] group-hover:scale-105 transition-transform">
              <Activity size={20} className="text-white" />
            </div>
            <span className="font-black text-xl tracking-tighter text-white">
              META<span className="text-blue-500">LYTICS</span>
            </span>
          </Link>

          {/* Vertical Divider */}
          <div className="h-6 w-[1px] bg-white/10 hidden md:block"></div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            <Link 
              href="/leads" 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-widest transition-all ${
                isActive('/leads') 
                ? 'bg-white/5 text-blue-400 border border-white/10' 
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>

            <Link 
              href="/locations" 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-widest transition-all ${
                isActive('/locations') 
                ? 'bg-white/5 text-emerald-400 border border-white/10' 
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <MapPinned size={16} />
              Locations
            </Link>
          </div>
        </div>

        {/* Right Side Stats/Profile */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end mr-4">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Server Status</span>
            <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Operational
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-[1px]">
             <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center text-[10px] font-black">
                AD
             </div>
          </div>
        </div>

      </div>
    </nav>
  );
}