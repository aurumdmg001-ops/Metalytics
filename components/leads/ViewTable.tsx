import { MapPin, Phone, Mail, Calendar, ExternalLink, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function ViewTable({ data }: any) {
  return (
    <div className="bg-[#0a0a0a]/90 backdrop-blur-xl rounded-[2.5rem] border border-white/10 overflow-hidden h-full flex flex-col shadow-2xl">
      <div className="overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          {/* Header */}
          <thead className="sticky top-0 z-20 bg-[#111] border-b border-white/10 shadow-sm">
            <tr>
              <th className="p-6 text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">Lead Information</th>
              <th className="p-6 text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">Location Details</th>
              <th className="p-6 text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">Contact Method</th>
              <th className="p-6 text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">Status & Date</th>
              <th className="p-6 text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] text-right">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-white/5">
            {data.map((lead: any) => (
              <tr 
                key={lead.id} 
                className="group hover:bg-white/3 transition-all cursor-pointer relative"
              >
                {/* 1. Name Column */}
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-inner 
                      ${lead.is_filtered ? 'bg-blue-600 text-white' : 'bg-red-950/50 text-red-500 border border-red-500/20'}`}>
                      {lead.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-black text-base group-hover:text-blue-400 transition-colors lowercase first-letter:uppercase">
                        {lead.full_name}
                      </p>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5 font-mono">
                        ID: {lead.id.slice(0, 8)}
                      </p>
                    </div>
                  </div>
                </td>

                {/* 2. Location Column */}
                <td className="p-6">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <MapPin size={16} className="text-zinc-600 group-hover:text-blue-500 transition-colors" />
                    <div>
                      <p className="text-sm font-bold text-zinc-200">{lead.city}</p>
                      <p className="text-xs text-zinc-500 font-medium tracking-wide">{lead.postal_code}</p>
                    </div>
                  </div>
                </td>

                {/* 3. Contact Column */}
                <td className="p-6">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Mail size={14} className="opacity-40" />
                      <span className="text-sm font-medium hover:text-white transition-colors">{lead.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Phone size={14} className="opacity-40" />
                      <span className="text-sm font-medium">{lead.phone}</span>
                    </div>
                  </div>
                </td>

                {/* 4. Status Column */}
                <td className="p-6">
                  <div className="flex flex-col gap-2">
                    <div className={`flex items-center gap-2 w-fit px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest
                      ${lead.is_filtered ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                      {lead.is_filtered ? <CheckCircle2 size={12}/> : <ShieldAlert size={12}/>}
                      {lead.is_filtered ? 'Verified' : 'Flagged'}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-600 text-xs">
                      <Calendar size={12} />
                      <span className="font-bold">{new Date(lead.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </td>

                {/* 5. Actions Column */}
                <td className="p-6 text-right">
                  <button className="p-3 rounded-2xl bg-white/5 text-zinc-500 hover:text-white hover:bg-blue-600 transition-all cursor-pointer opacity-0 group-hover:opacity-100 shadow-xl">
                    <ExternalLink size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}