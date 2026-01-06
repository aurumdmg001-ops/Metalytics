import { createClient } from "@/utils/supabase/server";
import AddLocationForm from "@/components/locations/AddLocationForm";
import LocationRow from "@/components/locations/LocationRow";
import { MapPinned, Settings2, Globe } from "lucide-react";

export default async function LocationsPage() {
  const supabase = await createClient();
  const { data: locations } = await supabase
    .from("allowed_locations")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-500">
                <Globe size={18} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                Geofencing Active
              </span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter leading-none">
              Region <span className="text-emerald-500">Settings</span>
            </h1>
            <p className="text-zinc-500 font-medium max-w-lg">
              Define allowed service zones. Incoming leads will be auto-verified based on these locations.
            </p>
          </div>

          <div className="flex bg-zinc-900/40 backdrop-blur-md border border-white/5 p-4 rounded-3xl items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Active Zones</p>
              <p className="text-2xl font-black text-white">{locations?.length || 0}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl">
              <MapPinned size={24} className="text-emerald-500" />
            </div>
          </div>
        </div>

        {/* 1. Add Form Section - Wrapped in a subtle card */}
        <div className="relative z-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <AddLocationForm />
        </div>

        {/* 2. Locations Table */}
        <div className="space-y-4">
           <div className="flex items-center gap-3 px-4">
              <Settings2 size={16} className="text-zinc-600" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-600">
                Live Zone Directory
              </h2>
           </div>

           <div className="bg-zinc-900/20 backdrop-blur-xl rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="p-8 text-[11px] font-black text-zinc-400 uppercase tracking-widest">City Name</th>
                    <th className="p-8 text-[11px] font-black text-zinc-400 uppercase tracking-widest">Zip Code</th>
                    <th className="p-8 text-[11px] font-black text-zinc-400 uppercase tracking-widest text-center">Serving Status</th>
                    <th className="p-8 text-[11px] font-black text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {locations && locations.length > 0 ? (
                    locations.map((loc) => (
                      <LocationRow key={loc.id} loc={loc} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <MapPinned size={48} className="text-zinc-800" />
                          <p className="text-zinc-500 font-bold tracking-tight">No active zones found. Add your first location above.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}