"use client";

import Link from "next/link";
import { BarChart3, MapPin, ArrowRight, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white selection:bg-blue-500/30 overflow-hidden relative">
      
      {/* Background Glows - Modern Aesthetic */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[100px] rounded-full -z-10" />

      <div className="max-w-4xl w-full text-center px-6">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
          <Zap size={14} className="text-blue-500 fill-blue-500" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            v2.0 Real-time Engine
          </span>
        </div>

        {/* Header Section */}
        <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tighter leading-[0.9]">
          Manage Meta Leads <br />
          <span className="bg-gradient-to-r from-blue-500 to-emerald-400 bg-clip-text text-transparent">
            with Precision
          </span>
        </h1>
        
        <p className="text-lg text-zinc-400 mb-12 max-w-xl mx-auto font-medium">
          Filter, verify, and export leads from Meta Ads in real-time. 
          Built for high-performance marketing teams.
        </p>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 text-left">
          
          {/* Leads Dashboard Card */}
          <Link href="/leads" className="group">
            <div className="relative h-full p-8 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(37,99,235,0.15)]">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-500">
                <BarChart3 className="w-7 h-7 text-blue-500 group-hover:text-white" />
              </div>
              <h2 className="text-2xl font-black text-white mb-3 tracking-tight flex items-center gap-2">
                Leads Dashboard 
                <ArrowRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Live stream of incoming leads. Automatically filters by your allowed service areas.
              </p>
            </div>
          </Link>

          {/* Manage Locations Card */}
          <Link href="/locations" className="group">
            <div className="relative h-full p-8 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] hover:border-emerald-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 transition-all duration-500">
                <MapPin className="w-7 h-7 text-emerald-500 group-hover:text-white" />
              </div>
              <h2 className="text-2xl font-black text-white mb-3 tracking-tight flex items-center gap-2">
                Service Areas
                <ArrowRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Add city names or postal codes. System will automatically flag leads outside these zones.
              </p>
            </div>
          </Link>
        </div>

        {/* Footer Info */}
        <div className="mt-16 pt-10 border-t border-white/5 flex items-center justify-center gap-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full absolute top-0 left-0 animate-ping"></div>
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500">
              System Online
            </span>
          </div>
          <div className="h-4 w-[1px] bg-white/10"></div>
          <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500">
            End-to-End Encrypted
          </span>
        </div>
      </div>
    </div>
  );
}