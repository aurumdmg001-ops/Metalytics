import { Mail, Phone, MapPin, Calendar, ArrowUpRight, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function ViewCards({ data }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-y-auto p-4 custom-scrollbar">
      {data.map((lead: any) => (
        <div 
          key={lead.id} 
          className={`group relative p-8 rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-2
            ${lead.is_filtered 
              ? 'bg-[#0f0f0f] border-white/5 hover:border-blue-500/40 hover:shadow-[0_20px_50px_rgba(59,130,246,0.1)]' 
              : 'bg-[#1a0a0a] border-red-900/20 hover:border-red-500/40 hover:shadow-[0_20px_50px_rgba(239,68,68,0.1)]'
            }`}
        >
          {/* Subtle Background Icon Glow */}
          <div className={`absolute top-0 right-0 p-10 opacity-[0.03] transition-opacity group-hover:opacity-[0.08] 
            ${lead.is_filtered ? 'text-blue-500' : 'text-red-500'}`}>
            {lead.is_filtered ? <CheckCircle2 size={120} /> : <ShieldAlert size={120} />}
          </div>

          <div className="relative z-10">
            {/* Header: Name & Status */}
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <h3 className="font-black text-white text-2xl tracking-tight group-hover:text-blue-400 transition-colors lowercase first-letter:uppercase">
                  {lead.full_name}
                </h3>
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full animate-pulse ${lead.is_filtered ? 'bg-blue-500' : 'bg-red-500'}`} />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                     {lead.is_filtered ? 'Verified Lead' : 'Invalid Region'}
                   </span>
                </div>
              </div>
              <button className="cursor-pointer p-2 rounded-xl bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10 transition-all">
                <ArrowUpRight size={20} />
              </button>
            </div>

            {/* Content: Contact Details */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 text-zinc-400 group-hover:text-zinc-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Mail size={18} className="text-blue-500/70" />
                </div>
                <span className="text-sm font-medium truncate">{lead.email}</span>
              </div>
              
              <div className="flex items-center gap-4 text-zinc-400 group-hover:text-zinc-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Phone size={18} className="text-emerald-500/70" />
                </div>
                <span className="text-sm font-medium tracking-wide">{lead.phone}</span>
              </div>
            </div>

            {/* Footer: Location & Date */}
            <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                <MapPin size={14} className={lead.is_filtered ? "text-blue-500" : "text-red-500"} />
                <span className="text-xs font-bold text-zinc-300">{lead.city}, {lead.postal_code}</span>
              </div>
              
              <div className="flex items-center gap-2 text-zinc-600">
                <Calendar size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {new Date(lead.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}