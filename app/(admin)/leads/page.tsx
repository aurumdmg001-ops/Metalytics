import LeadsList from "@/components/leads/LeadsList";
import { createClient } from "@/utils/supabase/server";
import { ShieldCheck } from "lucide-react";

export default async function LeadsPage() {
  const supabase = await createClient();

  // Fetching all data to support "All Data" filtering mode
  const { data: initialLeads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching leads:", error);
  }

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden">
      
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none -z-10"></div>
      
      <div className=" mx-auto p-6 md:p-12 space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-blue-500/10 rounded-lg">
                <ShieldCheck size={18} className="text-blue-500" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                Security Verified
              </span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter leading-none">
              Inbound <span className="text-blue-500">Intelligence</span>
            </h1>
            <p className="text-zinc-500 font-medium max-w-lg">
              Analyze incoming Meta leads with automated region filtering and real-time validation metrics.
            </p>
          </div>

          {/* Quick Counter (Visual Only) */}
          <div className="hidden lg:flex gap-10 border-l border-white/5 pl-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Status</p>
              <p className="text-emerald-500 font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Syncing Live
              </p>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <LeadsList initialLeads={initialLeads || []} />
        </div>

      </div>
    </div>
  );
}