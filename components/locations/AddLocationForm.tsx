"use client";

import { useState, useRef } from "react";
import { Plus, MapPin, Globe, Loader2, Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function AddLocationForm() {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const city = formData.get("city") as string;
    const zip = formData.get("zip") as string;

    const { error } = await supabase
      .from("allowed_locations")
      .insert([{ 
        city_name: city, 
        postal_code: zip, 
        is_serving: true 
      }]);
    
    if (error) {
      alert("Error adding location: " + error.message);
    } else {
      formRef.current?.reset();
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="relative group/form">
      {/* Background Decorative Gradient for the Form */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-[3.2rem] blur-xl opacity-0 group-hover/form:opacity-100 transition duration-1000"></div>
      
      <form 
        ref={formRef}
        onSubmit={handleSubmit} 
        className="relative grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-[#0a0a0a]/90 backdrop-blur-2xl rounded-[3rem] border border-white/5 shadow-2xl"
      >
        {/* City Input */}
        <div className="relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 p-1.5 bg-zinc-900 rounded-lg group-focus-within:bg-emerald-500/10 transition-colors">
            <MapPin className="text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={16} />
          </div>
          <input 
            name="city" 
            placeholder="City Name (e.g. New York)" 
            className="w-full bg-zinc-950/50 border border-white/5 rounded-[1.5rem] py-5 pl-16 pr-6 text-sm text-white outline-none focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/5 transition-all font-medium placeholder:text-zinc-700" 
            required 
          />
        </div>

        {/* Zip Code Input */}
        <div className="relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 p-1.5 bg-zinc-900 rounded-lg group-focus-within:bg-emerald-500/10 transition-colors">
            <Globe className="text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={16} />
          </div>
          <input 
            name="zip" 
            placeholder="Postal Code (e.g. 10001)" 
            className="w-full bg-zinc-950/50 border border-white/5 rounded-[1.5rem] py-5 pl-16 pr-6 text-sm text-white outline-none focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/5 transition-all font-mono placeholder:text-zinc-700 tracking-wider" 
            required 
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="relative overflow-hidden cursor-pointer bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 flex items-center justify-center gap-3 shadow-2xl shadow-emerald-900/20 group"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18}/>
          ) : (
            <>
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>Add Service Region</span>
            </>
          )}
          
          {/* Subtle Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
        </button>
      </form>
    </div>
  );
}