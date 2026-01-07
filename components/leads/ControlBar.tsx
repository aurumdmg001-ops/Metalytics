"use client";

import React from "react";
import { Search, Calendar, MessageSquare, LayoutGrid, List, X, Download, Filter } from "lucide-react";
import * as XLSX from "xlsx";

export default function ControlBar({ 
  viewMode, setViewMode, filterMode, setFilterMode, 
  searchQuery, setSearchQuery, startDate, setStartDate, 
  endDate, setEndDate, data 
}: any) {
  
  // High-Performance Excel Export
  const exportToExcel = () => {
    try {
      // Mapping data to clean headers for Excel
      const excelRows = data.map((item: any) => ({
        "Full Name": item.full_name,
        "Phone Number": item.phone,
        "City": item.city || "N/A",
        "Postal Code": item.postal_code,
        "Status": item.is_filtered ? "Verified" : "Outside Area",
        "Notes": item.notes || "",
        "Date Captured": new Date(item.created_at).toLocaleString()
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leads Data");
      
      // Filename with current date
      const fileName = `Leads_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const clearDates = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-6 bg-[#0a0a0a]/80 backdrop-blur-3xl p-5 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
      
      {/* 1. View Type Switcher - High Contrast */}
      <div className="flex items-center bg-zinc-950 p-1.5 rounded-2xl border border-white/5">
        {[
          { id: 'whatsapp', icon: <MessageSquare size={18}/>, label: 'Chat' },
          { id: 'card', icon: <LayoutGrid size={18}/>, label: 'Grid' },
          { id: 'table', icon: <List size={18}/>, label: 'List' }
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => setViewMode(mode.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-tighter transition-all duration-300 cursor-pointer ${
              viewMode === mode.id 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
              : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            {mode.icon}
            <span className={viewMode === mode.id ? 'block' : 'hidden lg:block'}>{mode.label}</span>
          </button>
        ))}
      </div>

      {/* 2. Global Search - Focal Point */}
      <div className="relative flex-1 max-w-md group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <Search className="text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
          <div className="h-4 w-px bg-white/10" />
        </div>
        <input 
          type="text" 
          placeholder="Search leads by name, city or zip..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-4 pl-16 pr-6 text-sm text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/40 transition-all placeholder:text-zinc-600 font-medium"
        />
      </div>

      {/* 3. Filter Controls Cluster */}
      <div className="flex items-center gap-3">
        
        {/* Date Range Picker */}
        <div className="flex items-center gap-3 bg-zinc-950 px-5 py-2.5 rounded-2xl border border-white/5">
          <Calendar size={16} className="text-blue-500" />
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            className="bg-transparent text-[12px] text-zinc-300 outline-none hover:text-white transition-colors scheme-dark font-bold uppercase tracking-tighter cursor-pointer" 
          />
          <div className="w-2 h-px bg-zinc-700" />
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            className="bg-transparent text-[12px] text-zinc-300 outline-none hover:text-white transition-colors scheme-dark font-bold uppercase tracking-tighter cursor-pointer" 
          />
          {(startDate || endDate) && (
            <button onClick={clearDates} className="ml-2 text-zinc-500 hover:text-red-500 transition-colors">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Verification Toggle */}
        <button 
          onClick={() => setFilterMode(filterMode === 'all' ? 'filtered' : 'all')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl border transition-all text-[11px] font-black uppercase tracking-widest cursor-pointer ${
            filterMode === 'filtered' 
            ? 'bg-blue-600/10 border-blue-500 text-blue-500' 
            : 'bg-zinc-950 border-white/5 text-zinc-500 hover:text-zinc-200'
          }`}
        >
          <Filter size={14} />
          {filterMode === 'filtered' ? 'Verified Only' : 'Show All'}
        </button>

        {/* Export Button - Emerald Highlight */}
        <button 
          onClick={exportToExcel} 
          className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 shadow-xl shadow-emerald-900/20 active:scale-95 group cursor-pointer"
        >
          <Download size={16} className="group-hover:translate-y-0.5 transition-transform " />
          Export
        </button>
      </div>
    </div>
  );
}