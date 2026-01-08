import LeadsList from "@/components/leads/LeadsList";
import { createClient } from "@/utils/supabase/server";
import { ShieldCheck } from "lucide-react";

export default async function LeadsPage() {
  const supabase = await createClient();

  // Fetching all data
  const { data: initialLeads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching leads:", error);
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Decorative Glow (Subtle) */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary-btn/5 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/5 blur-[100px] rounded-full -z-10" />

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        
        {/* Header Section (Optional but recommended for better UI) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div>
            <h1 className="text-2xl md:text-3xl  tracking-tight text-gray-900 dark:text-white">
              Leads <span className="text-primary-btn">Management</span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-500 font-medium">
              View and manage your real-time Meta incoming leads.
            </p>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-card dark:bg-white/5 border border-gray-200 dark:border-border-custom rounded-xl self-start md:self-center shadow-sm">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-black dark:text-zinc-400">
              Verified Stream
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative animate-in fade-in slide-in-from-bottom-6 duration-1000">
          {/* Note: Ensure LeadsList component also uses bg-card and adaptive text colors */}
          <LeadsList initialLeads={initialLeads || []} />
        </div>

      </div>
    </div>
  );
}