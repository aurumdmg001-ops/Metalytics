"use client";

import { useState } from "react";
import { 
  User, Mail, Phone, MapPin, StickyNote, Loader2, 
  ChevronRight, CheckCircle, ShieldAlert, Database, 
  Clock, Hash, Globe, MessageSquare 
} from "lucide-react";

export default function ViewWhatsApp({ data, onSave, savingId, filterMode }: any) {
  const [selectedId, setSelectedId] = useState<string | null>(data[0]?.id || null);
  const selectedLead = data.find((l: any) => l.id === selectedId);

  return (
    <div className="flex h-[calc(100vh-180px)] gap-0 bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
      
      {/* 1. Sidebar: Leads List */}
      <div className="w-80 border-r border-white/5 flex flex-col bg-zinc-950/50">
        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
          <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
            <MessageSquare size={14} className="text-blue-500" /> Inbox
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {data.map((lead: any) => (
            <div 
              key={lead.id} 
              onClick={() => setSelectedId(lead.id)}
              className={`p-5 flex items-center justify-between cursor-pointer border-b border-white/[0.03] transition-all relative
                ${selectedId === lead.id ? 'bg-blue-600/10' : 'hover:bg-white/[0.02]'} `}
            >
              {selectedId === lead.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />}
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shadow-inner
                  ${lead.is_filtered ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white' : 'bg-zinc-900 text-zinc-500 border border-white/5'}`}>
                  {lead.full_name.charAt(0)}
                </div>
                <div className="truncate">
                  <p className="text-sm font-bold text-white truncate">{lead.full_name}</p>
                  <p className="text-[10px] text-zinc-500 font-medium flex items-center gap-1">
                    <MapPin size={10} /> {lead.city || 'Unknown'}
                  </p>
                </div>
              </div>
              {lead.is_filtered && <CheckCircle size={12} className="text-blue-500 shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Main Content: Conversation & Notes */}
      <div className="flex-1 flex flex-col bg-black/40">
        {selectedLead ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-xl font-black text-blue-500">
                  {selectedLead.full_name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tighter">{selectedLead.full_name}</h2>
                  <p className="text-xs text-zinc-500 font-medium">{selectedLead.email}</p>
                </div>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2
                ${selectedLead.is_filtered ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                {selectedLead.is_filtered ? <CheckCircle size={12}/> : <ShieldAlert size={12}/>}
                {selectedLead.is_filtered ? 'Verified Region' : 'Outside Service Zone'}
              </div>
            </div>

            {/* Notes Section (The "Chat" area) */}
            <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
               <div className="max-w-2xl mx-auto w-full">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-zinc-500">
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                         <StickyNote size={14} /> Internal Log
                       </span>
                       {savingId === selectedLead.id && <Loader2 size={14} className="animate-spin text-blue-500" />}
                    </div>
                    <textarea 
                      className="w-full bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 text-white outline-none focus:border-blue-500/50 min-h-[300px] shadow-2xl placeholder:text-zinc-700"
                      placeholder="Type internal notes here... (Auto-saves on blur)"
                      defaultValue={selectedLead.notes || ""}
                      onBlur={(e) => onSave(selectedLead.id, e.target.value)}
                    />
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-zinc-700 gap-4">
            <MessageSquare size={48} className="opacity-20" />
            <p className="font-bold uppercase tracking-widest text-xs">Select a lead to start management</p>
          </div>
        )}
      </div>

      {/* 3. Right Hand Panel: Lead Data Inspector */}
      {selectedLead && (
        <div className="w-[400px] border-l border-white/5 bg-zinc-950/80 backdrop-blur-xl overflow-y-auto custom-scrollbar">
          <div className="p-8 space-y-8">
            <h3 className="text-white font-black text-[11px] uppercase tracking-[0.3em] flex items-center gap-2 border-b border-white/5 pb-4">
              <Database size={14} className="text-blue-500" /> Data Inspector
            </h3>

            {/* Essential Info Grid */}
            <div className="grid grid-cols-1 gap-4">
               <InfoBlock icon={<Mail size={14}/>} label="Primary Email" value={selectedLead.email} />
               <InfoBlock icon={<Phone size={14}/>} label="Phone Line" value={selectedLead.phone} />
               <InfoBlock icon={<MapPin size={14}/>} label="City / Region" value={`${selectedLead.city}, ${selectedLead.postal_code}`} />
               <InfoBlock icon={<Clock size={14}/>} label="Acquisition Date" value={new Date(selectedLead.created_at).toLocaleString()} />
            </div>

            {/* System Info */}
            <div className="space-y-4 pt-4">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">System Metadata</p>
              <div className="p-5 bg-white/[0.02] rounded-3xl border border-white/5 space-y-3">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">Meta ID</span>
                    <span className="text-[10px] text-white font-mono bg-white/5 px-2 py-1 rounded">{selectedLead.meta_lead_id || 'N/A'}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">Lead Status</span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${selectedLead.is_filtered ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-800 text-zinc-400'}`}>
                      {selectedLead.is_filtered ? 'VERIFIED' : 'UNVERIFIED'}
                    </span>
                 </div>
              </div>
            </div>

            {/* Raw JSON Data Viewer */}
            {selectedLead.raw_data && (
              <div className="space-y-4 pt-4">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Raw Source Data</p>
                <div className="p-5 bg-black rounded-3xl border border-white/5">
                  <pre className="text-[10px] text-emerald-500/80 font-mono leading-relaxed overflow-x-auto">
                    {JSON.stringify(selectedLead.raw_data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Component for RHS Panel
function InfoBlock({ icon, label, value }: any) {
  return (
    <div className="p-4 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl border border-white/5 transition-colors">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-blue-500 opacity-70">{icon}</span>
        <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">{label}</p>
      </div>
      <p className="text-sm text-white font-medium truncate">{value || 'N/A'}</p>
    </div>
  );
}