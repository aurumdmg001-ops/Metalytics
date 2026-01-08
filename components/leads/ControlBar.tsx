"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Search, Calendar, MessageSquare, LayoutGrid, List, X, 
  Download, Filter, ChevronDown, Check, ChevronLeft, ChevronRight 
} from "lucide-react";
import * as XLSX from "xlsx";
import { 
  format, subDays, startOfMonth, endOfMonth, startOfWeek, 
  endOfWeek, isSameDay, isWithinInterval, addMonths, subMonths, 
  addDays, isToday, isAfter, isBefore 
} from "date-fns";

// --- Sub-component: Visual Calendar Grid ---
const DualCalendar = ({ startDate, setStartDate, endDate, setEndDate }: any) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const nextMonth = addMonths(currentMonth, 1);

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  const handleDateClick = (day: Date) => {
    if (!start || (start && end)) {
      setStartDate(format(day, "yyyy-MM-dd"));
      setEndDate("");
    } else {
      if (isBefore(day, start)) {
        setStartDate(format(day, "yyyy-MM-dd"));
        setEndDate(format(start, "yyyy-MM-dd"));
      } else {
        setEndDate(format(day, "yyyy-MM-dd"));
      }
    }
  };

  const renderMonth = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const rows = [];
    let days = [];
    let day = calendarStart;

    while (day <= calendarEnd) {
      for (let i = 0; i < 7; i++) {
        const d = day;
        const isSelected = (start && isSameDay(d, start)) || (end && isSameDay(d, end));
        const inRange = start && end && isWithinInterval(d, { start, end });
        const isDifferentMonth = !isSameDay(startOfMonth(d), monthStart);

        days.push(
          <div
            key={d.toString()}
            onClick={() => !isDifferentMonth && handleDateClick(d)}
            className={`relative h-9 w-full flex items-center justify-center text-[10px] cursor-pointer transition-all
              ${isDifferentMonth ? "text-transparent pointer-events-none" : "text-foreground font-medium"}
              ${inRange && !isSelected ? "bg-primary-btn/10" : ""}
              ${isSelected ? "bg-primary-btn text-white rounded-md z-10 shadow-lg shadow-primary-btn/20" : "hover:bg-gray-100 dark:hover:bg-white/5 rounded-md"}
              ${isToday(d) && !isSelected ? "border border-primary-btn/40 rounded-md" : ""}
            `}
          >
            {format(d, "d")}
            {/* Range highlight connector */}
            {inRange && !isSelected && <div className="absolute inset-0 bg-primary-btn/5 -z-0" />}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div key={day.toString()} className="grid grid-cols-7 gap-0">{days}</div>);
      days = [];
    }
    return rows;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      {[currentMonth, nextMonth].map((m, idx) => (
        <div key={idx} className="flex-1 min-w-[240px]">
          <div className="flex items-center justify-between mb-4 px-2">
            {idx === 0 && (
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full">
                <ChevronLeft size={14} />
              </button>
            )}
            <span className="text-[10px] font-bold uppercase tracking-widest">{format(m, "MMMM yyyy")}</span>
            {idx === 1 && (
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full">
                <ChevronRight size={14} />
              </button>
            )}
          </div>
          <div className="grid grid-cols-7 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} className="text-[8px] text-center text-black font-bold uppercase">{d}</div>
            ))}
          </div>
          {renderMonth(m)}
        </div>
      ))}
    </div>
  );
};

// --- Main ControlBar Component ---
export default function ControlBar({ 
  viewMode, setViewMode, filterMode, setFilterMode, 
  searchQuery, setSearchQuery, startDate, setStartDate, 
  endDate, setEndDate, data 
}: any) {
  
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const exportToExcel = () => {
    const excelRows = data.map((item: any) => ({
      "Full Name": item.full_name, "Phone Number": item.phone, "City": item.city || "N/A",
      "Postal Code": item.postal_code, "Status": item.is_filtered ? "Verified" : "Outside Area",
      "Date": new Date(item.created_at).toLocaleString("en-AU")
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, `Leads_Report_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  const quickOptions = [
    { label: "Today", get: () => ({ s: new Date(), e: new Date() }) },
    { label: "Yesterday", get: () => ({ s: subDays(new Date(), 1), e: subDays(new Date(), 1) }) },
    { label: "Last 7 Days", get: () => ({ s: subDays(new Date(), 7), e: new Date() }) },
    { label: "This Month", get: () => ({ s: startOfMonth(new Date()), e: new Date() }) },
  ];

  return (
    <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 bg-card dark:bg-card/80 backdrop-blur-xl p-4 md:p-5 rounded-sm border border-gray-200 dark:border-border-custom shadow-sm">
      
      {/* View Switcher */}
      <div className="flex items-center bg-gray-100 dark:bg-black/40 p-1 rounded-sm border border-gray-200 dark:border-white/5">
        {[{ id: 'whatsapp', icon: <MessageSquare size={16}/> }, { id: 'card', icon: <LayoutGrid size={16}/> }, { id: 'table', icon: <List size={16}/> }].map((mode) => (
          <button key={mode.id} onClick={() => setViewMode(mode.id)} className={`p-2.5 px-4 rounded-sm transition-all ${viewMode === mode.id ? 'bg-primary-btn text-white dark:text-black' : 'text-black dark:text-white'}`}>
            {mode.icon}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={18} />
        <input 
          type="text" placeholder="Search leads..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5 rounded-sm py-3 pl-12 text-sm outline-none focus:border-primary-btn/40"
        />
      </div>

      <div className="flex items-center gap-3">
        {/* RANGE PICKER DROPDOWN */}
        <div className="relative" ref={calendarRef}>
          <button 
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="flex items-center gap-3 bg-gray-50 dark:bg-black/40 px-4 py-3 rounded-sm border border-gray-200 dark:border-white/5 min-w-[200px] hover:border-primary-btn transition-all"
          >
            <Calendar size={16} className="text-primary-btn" />
            <span className="text-[10px] font-bold uppercase tracking-widest truncate">
              {startDate ? `${format(new Date(startDate), "dd MMM")} - ${endDate ? format(new Date(endDate), "dd MMM") : '...'}` : 'Select Dates'}
            </span>
            <ChevronDown size={14} className={`ml-auto transition-transform ${isCalendarOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCalendarOpen && (
            <div className="absolute top-full right-0 mt-2 z-[200] bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 shadow-2xl rounded-sm overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-200">
              {/* Presets */}
              <div className="w-full md:w-40 bg-gray-50/50 dark:bg-white/[0.02] border-r border-gray-100 dark:border-white/5 p-2">
                <p className="text-[8px] uppercase tracking-widest text-black p-2">Quick Select</p>
                {quickOptions.map((opt) => (
                  <button key={opt.label} onClick={() => { setStartDate(format(opt.get().s, "yyyy-MM-dd")); setEndDate(format(opt.get().e, "yyyy-MM-dd")); setIsCalendarOpen(false); }}
                    className="w-full text-left px-3 py-2 text-[10px] font-bold uppercase text-black dark:text-zinc-400 hover:bg-primary-btn hover:text-white rounded-sm transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
                <button onClick={() => { setStartDate(""); setEndDate(""); setIsCalendarOpen(false); }} className="w-full text-left px-3 py-2 mt-4 text-[10px] font-bold uppercase text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-sm transition-colors">
                  Clear Filter
                </button>
              </div>
              {/* Visual Calendars */}
              <div className="flex flex-col">
                <DualCalendar startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
                <div className="p-4 border-t border-gray-100 dark:border-white/5 flex justify-end">
                  <button onClick={() => setIsCalendarOpen(false)} className="bg-primary-btn text-white px-8 py-2.5 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:brightness-110">
                    Apply Range
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <button onClick={() => setFilterMode(filterMode === 'all' ? 'filtered' : 'all')}
          className={`px-4 py-3 rounded-sm border text-[10px] uppercase tracking-widest font-bold transition-all hover:border-primary-btn dark:text-white ${filterMode === 'filtered' ? 'bg-primary-btn/10 border-primary-btn text-black' : 'bg-gray-50 dark:bg-black/40 border-gray-200 dark:border-white/5 text-black'}`}
        >
          {filterMode === 'filtered' ? 'Verified' : 'All Leads'}
        </button>
        <button onClick={exportToExcel} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-sm text-[10px] uppercase tracking-widest flex items-center gap-2 cursor-pointer">
          <Download size={14} /> Export
        </button>
      </div>
    </div>
  );
} 