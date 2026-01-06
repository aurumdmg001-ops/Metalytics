"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";

import ViewWhatsApp from "./ViewWhatsApp";
import ViewCards from "./ViewCards";
import ViewTable from "./ViewTable";
import ControlBar from "./ControlBar";
import LeadAnalytics from "./LeadAnalytics";
import { BarChart3, Layers } from "lucide-react";

export default function LeadsList({ initialLeads }: { initialLeads: any[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [viewMode, setViewMode] = useState<"card" | "table" | "whatsapp">("whatsapp");
  const [filterMode, setFilterMode] = useState<"all" | "filtered">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("realtime_leads")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        (payload) => {
          if (payload.eventType === "INSERT")
            setLeads((prev) => [payload.new, ...prev]);
          if (payload.eventType === "UPDATE")
            setLeads((prev) =>
              prev.map((l) => (l.id === payload.new.id ? payload.new : l))
            );
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const displayData = useMemo(() => {
    return leads.filter((lead) => {
      const matchesMode = filterMode === "all" ? true : lead.is_filtered;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        lead.full_name?.toLowerCase().includes(searchLower) ||
        lead.postal_code?.includes(searchQuery) ||
        lead.city?.toLowerCase().includes(searchLower);
      
      const leadDate = new Date(lead.created_at).toISOString().split("T")[0];
      const matchesDate =
        (startDate ? leadDate >= startDate : true) &&
        (endDate ? leadDate <= endDate : true);
      
      return matchesMode && matchesSearch && matchesDate;
    });
  }, [leads, filterMode, searchQuery, startDate, endDate]);

  const handleSaveNote = async (id: string, text: string) => {
    setSavingId(id);
    await supabase.from("leads").update({ notes: text }).eq("id", id);
    setSavingId(null);
  };

  return (
    <div className="flex flex-col min-h-screen space-y-8 pb-20">
      {/* 1. Control Hub - Glassmorphism style */}
      <section className="sticky top-24 z-40">
        <ControlBar
          viewMode={viewMode}
          setViewMode={setViewMode}
          filterMode={filterMode}
          setFilterMode={setFilterMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          data={displayData}
        />
      </section>

      {/* 2. Main Display Area */}
      <main className="flex-1 rounded-[2.5rem] border border-white/5 bg-zinc-900/20 backdrop-blur-sm overflow-hidden min-h-[500px]">
        <div className="p-1 border-b border-white/5 bg-white/5 flex items-center px-8 py-3 justify-between">
          <div className="flex items-center gap-2 text-zinc-500 font-bold text-[10px] uppercase tracking-widest">
            <Layers size={14} className="text-blue-500" />
            {displayData.length} Records Found
          </div>
          <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
            View: {viewMode}
          </div>
        </div>
        
        <div className="p-6 transition-all duration-500 ease-in-out">
          {viewMode === "whatsapp" && (
            <ViewWhatsApp
              data={displayData}
              onSave={handleSaveNote}
              savingId={savingId}
              filterMode={filterMode}
            />
          )}
          {viewMode === "card" && <ViewCards data={displayData} />}
          {viewMode === "table" && <ViewTable data={displayData} />}
        </div>
      </main>

      {/* 3. Analytics Section - Lower visual priority but high detail */}
      <section className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 mt-12 shadow-2xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-emerald-500/10 rounded-xl">
            <BarChart3 size={20} className="text-emerald-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter leading-tight">
              Market Intelligence
            </h2>
            <p className="text-zinc-500 text-xs font-medium">Data visualization based on current filtered results</p>
          </div>
        </div>
        
        <LeadAnalytics data={displayData} />
      </section>
    </div>
  );
}