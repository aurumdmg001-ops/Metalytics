"use client";

import React, { useMemo, useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, Legend, LineChart, Line, CartesianGrid 
} from "recharts";
import { 
  Download, Users, ShieldCheck, ShieldAlert, 
  Map, TrendingUp, Clock, Zap, Activity 
} from "lucide-react";
import * as XLSX from "xlsx";

// Sub-component for Metric Cards
function MetricCard({ label, val, sub, icon, color, glow }: any) {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] relative overflow-hidden group hover:border-white/10 transition-all duration-500">
      <div className={`absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity ${glow}`} />
      <div className="relative z-10">
        <div className={`mb-3 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">{label}</p>
        <h3 className="text-3xl font-black text-white mt-1 tracking-tighter">{val}</h3>
        <p className="text-zinc-600 text-[9px] font-bold mt-1 uppercase tracking-widest">{sub}</p>
      </div>
    </div>
  );
}

export default function LeadAnalytics({ data }: { data: any[] }) {
  const [limitZips, setLimitZips] = useState(true);

  // Advanced Data Processing Engine
  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;

    const zipMap: any = {};
    const dailyMap: any = {};
    const hourlyDist = Array.from({ length: 24 }, (_, i) => ({ 
      hour: `${i}:00`, verified: 0, outside: 0, total: 0 
    }));
    
    let todayCount = 0;
    const todayStr = new Date().toISOString().split("T")[0];

    data.forEach((lead) => {
      const date = new Date(lead.created_at);
      const dateStr = date.toISOString().split("T")[0];
      const hour = date.getHours();
      const zip = lead.postal_code || "N/A";

      // 1. Time Series (Daily)
      const dayLabel = date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
      if (!dailyMap[dayLabel]) dailyMap[dayLabel] = { name: dayLabel, verified: 0, outside: 0 };
      lead.is_filtered ? dailyMap[dayLabel].verified++ : dailyMap[dayLabel].outside++;

      // 2. Hourly Distribution
      hourlyDist[hour].total++;
      lead.is_filtered ? hourlyDist[hour].verified++ : hourlyDist[hour].outside++;

      // 3. Regional Analysis
      if (!zipMap[zip]) zipMap[zip] = { zip, verified: 0, outside: 0, total: 0 };
      zipMap[zip].total++;
      lead.is_filtered ? zipMap[zip].verified++ : zipMap[zip].outside++;

      // 4. Velocity
      if (dateStr === todayStr) todayCount++;
    });

    const sortedZips = Object.values(zipMap).sort((a: any, b: any) => b.total - a.total);

    return {
      total: data.length,
      verified: data.filter(l => l.is_filtered).length,
      outside: data.length - data.filter(l => l.is_filtered).length,
      today: todayCount,
      timeSeries: Object.values(dailyMap).slice(-12),
      hourly: hourlyDist,
      zips: sortedZips,
      topZips: sortedZips.slice(0, 8)
    };
  }, [data]);

  const generateReport = () => {
    const wsData = stats?.zips.map(z => ({
      "Postal Code": z.zip,
      "Total Leads": z.total,
      "Verified (Inside)": z.verified,
      "Flagged (Outside)": z.outside,
      "Capture Quality": ((z.verified / z.total) * 100).toFixed(1) + "%"
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(wsData || []);
    XLSX.utils.book_append_sheet(wb, ws, "Regional Quality Report");
    XLSX.writeFile(wb, `Market_Intelligence_${new Date().getTime()}.xlsx`);
  };

  if (!stats) return null;

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-700">
      
      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Inflow" val={stats.total} sub="Gross Leads" icon={<Users size={20}/>} color="text-white" glow="bg-white" />
        <MetricCard label="Verified" val={stats.verified} sub="Market Fit" icon={<ShieldCheck size={20}/>} color="text-blue-500" glow="bg-blue-500" />
        <MetricCard label="Outside" val={stats.outside} sub="Filtered Out" icon={<ShieldAlert size={20}/>} color="text-red-500" glow="bg-red-500" />
        <MetricCard label="Velocity" val={`+${stats.today}`} sub="Captured Today" icon={<Zap size={20}/>} color="text-emerald-500" glow="bg-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Time-Series: Daily Quality Trend */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-white font-black text-[11px] uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-500"/> Conversion Quality Over Time
            </h4>
          </div>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={stats.timeSeries}>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#333" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #222', borderRadius: '15px'}} />
              <Area type="monotone" dataKey="verified" name="Verified" stroke="#3b82f6" fill="url(#blueGrad)" strokeWidth={3} />
              <Area type="monotone" dataKey="outside" name="Rejected" stroke="#ef4444" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Hourly Peak Activity */}
        <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] h-[400px]">
          <h4 className="text-white font-black text-[11px] uppercase tracking-widest mb-6 flex items-center gap-2">
            <Clock size={16} className="text-emerald-500"/> Hourly Heatmap
          </h4>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={stats.hourly}>
              <XAxis dataKey="hour" stroke="#333" fontSize={9} axisLine={false} tickLine={false} interval={3} />
              <Tooltip contentStyle={{backgroundColor: '#000', border: 'none'}} />
              <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} dot={false} animationDuration={2000} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 3. Regional Composition (Full Width) */}
        <div className="lg:col-span-3 bg-[#0a0a0a] border border-white/5 p-8 rounded-[3rem] min-h-[500px]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h4 className="text-white font-black text-[12px] uppercase tracking-[0.2em] flex items-center gap-2">
                <Map size={18} className="text-blue-500"/> Regional Market Share
              </h4>
              <p className="text-zinc-500 text-[10px] mt-1 font-bold uppercase italic">Verified vs Flagged distribution per Zip Code</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setLimitZips(!limitZips)}
                className="bg-white/5 text-zinc-400 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"
              >
                {limitZips ? "Show All Regions" : "Show Top 8"}
              </button>
              <button 
                onClick={generateReport}
                className="bg-emerald-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-emerald-900/20 hover:bg-emerald-500 transition-all"
              >
                <Download size={14}/> Download Intelligence
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={limitZips ? stats.topZips : stats.zips} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
              <XAxis 
                dataKey="zip" 
                stroke="#666" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                angle={-45} 
                textAnchor="end"
                interval={0}
              />
              <YAxis stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.02)'}}
                contentStyle={{backgroundColor: '#000', border: '1px solid #222', borderRadius: '12px'}} 
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '30px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }} />
              <Bar name="Verified (Target)" dataKey="verified" stackId="a" fill="#3b82f6" barSize={35} />
              <Bar name="Outside (Flagged)" dataKey="outside" stackId="a" fill="#18181b" barSize={35} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}