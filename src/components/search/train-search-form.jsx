"use client";
import React, { useState, useEffect, useRef } from "react";
import { ArrowLeftRight, Calendar, Users, Train, Search, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchStore } from "@/store/search-store";
import { stations } from "@/lib/services/route-service";
import { cn } from "cn";
import { toast } from "sonner";
import { useGoToResults } from "@/lib/hooks/use-go-to-results";
const quotas = [
    { code: "GN", label: "Regular", icon: "⚡" },
    { code: "LD", label: "Ladies", icon: "👩" },
    { code: "SS", label: "Senior Citizen", icon: "🧓" },
    { code: "TQ", label: "Tatkal Instant", icon: "⚡" },
    { code: "ST", label: "Student", icon: "🎓" },
];
const trainClasses = [
    { code: "ALL", name: "All Classes", badge: "ANY", desc: "Any Available Coach" },
    { code: "3A", name: "AC 3 Tier", badge: "3A", desc: "Economy AC Sleeper" },
    { code: "2A", name: "AC 2 Tier", badge: "2A", desc: "Spacious 2-Tier AC Sleeper" },
    { code: "1A", name: "AC First Class", badge: "1A", desc: "Luxury AC Coupe & Cabin" },
    { code: "CC", name: "AC Chair Car", badge: "CC", desc: "Comfortable Daytime Coach" },
    { code: "EC", name: "Exec. Chair Car", badge: "EC", desc: "Executive Luxury Seating" },
    { code: "SL", name: "Sleeper Class", badge: "SL", desc: "Standard Non-AC Sleeper Coach" },
];
export function TrainSearchForm({ compact = false }) {
    const { trainCriteria, setTrainCriteria, setHasSearched } = useSearchStore();
    const goToResults = useGoToResults();
    const [minDate, setMinDate] = useState("2026-01-01");
    const initialOrigin = stations.find((s) => s.id === trainCriteria.originStationId);
    const initialDest = stations.find((s) => s.id === trainCriteria.destinationStationId);
    // Autocomplete & input states
    const [originQuery, setOriginQuery] = useState(initialOrigin ? initialOrigin.city : "");
    const [destQuery, setDestQuery] = useState(initialDest ? initialDest.city : "");
    const [hasTypedOrigin, setHasTypedOrigin] = useState(false);
    const [hasTypedDest, setHasTypedDest] = useState(false);
    const [isOriginOpen, setIsOriginOpen] = useState(false);
    const [isDestOpen, setIsDestOpen] = useState(false);
    const [isClassOpen, setIsClassOpen] = useState(false);
    const [isTravellerOpen, setIsTravellerOpen] = useState(false);
    const originContainerRef = useRef(null);
    const destContainerRef = useRef(null);
    const originInputRef = useRef(null);
    const destInputRef = useRef(null);
    const dateInputRef = useRef(null);
    const returnDateInputRef = useRef(null);
    const classContainerRef = useRef(null);
    const travellerContainerRef = useRef(null);
    useEffect(() => {
        setMinDate(new Date().toISOString().split("T")[0]);
    }, []);
    const originStation = stations.find((s) => s.id === trainCriteria.originStationId);
    const destStation = stations.find((s) => s.id === trainCriteria.destinationStationId);
    // Keep input text synced with selected stations when not typing
    useEffect(() => {
        if (originStation && !hasTypedOrigin) {
            setOriginQuery(originStation.city);
        }
    }, [originStation, hasTypedOrigin]);
    useEffect(() => {
        if (destStation && !hasTypedDest) {
            setDestQuery(destStation.city);
        }
    }, [destStation, hasTypedDest]);
    // Click outside listener to dismiss popups
    useEffect(() => {
        const handleClickOutside = (e) => {
            const target = e.target;
            if (originContainerRef.current && !originContainerRef.current.contains(target)) {
                setIsOriginOpen(false);
                setHasTypedOrigin(false);
                if (originStation)
                    setOriginQuery(originStation.city);
            }
            if (destContainerRef.current && !destContainerRef.current.contains(target)) {
                setIsDestOpen(false);
                setHasTypedDest(false);
                if (destStation)
                    setDestQuery(destStation.city);
            }
            if (classContainerRef.current && !classContainerRef.current.contains(target)) {
                setIsClassOpen(false);
            }
            if (travellerContainerRef.current && !travellerContainerRef.current.contains(target)) {
                setIsTravellerOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [originStation, destStation]);
    // Station filtering: Show all available stations when clicking, filter when user types
    const filteredOriginStations = stations.filter((s) => {
        if (!hasTypedOrigin || !originQuery.trim())
            return true;
        const q = originQuery.toLowerCase();
        return (s.city.toLowerCase().includes(q) ||
            s.code.toLowerCase().includes(q) ||
            s.name.toLowerCase().includes(q));
    });
    const filteredDestStations = stations.filter((s) => {
        if (!hasTypedDest || !destQuery.trim())
            return true;
        const q = destQuery.toLowerCase();
        return (s.city.toLowerCase().includes(q) ||
            s.code.toLowerCase().includes(q) ||
            s.name.toLowerCase().includes(q));
    });
    // Date picker opener
    const handleDateClick = () => {
        if (!dateInputRef.current)
            return;
        try {
            if ("showPicker" in HTMLInputElement.prototype) {
                dateInputRef.current.showPicker();
            }
            else {
                dateInputRef.current.focus();
            }
        }
        catch {
            dateInputRef.current?.focus();
        }
    };
    const handleReturnDateClick = () => {
        if (!returnDateInputRef.current)
            return;
        try {
            if ("showPicker" in HTMLInputElement.prototype) {
                returnDateInputRef.current.showPicker();
            }
            else {
                returnDateInputRef.current.focus();
            }
        }
        catch {
            returnDateInputRef.current?.focus();
        }
    };
    // Station selection: Auto-advance to destination station
    const selectOriginStation = (st) => {
        setTrainCriteria({ originStationId: st.id });
        setOriginQuery(st.city);
        setHasTypedOrigin(false);
        setIsOriginOpen(false);
        // Auto-advance to To Station
        setTimeout(() => {
            setIsDestOpen(true);
            destInputRef.current?.focus();
            destInputRef.current?.select();
        }, 100);
        toast.success(`From: ${st.city} (${st.code})`);
    };
    // Destination selection: Auto-advance to departure date
    const selectDestStation = (st) => {
        setTrainCriteria({ destinationStationId: st.id });
        setDestQuery(st.city);
        setHasTypedDest(false);
        setIsDestOpen(false);
        // Auto-advance to Date picker
        setTimeout(() => {
            handleDateClick();
        }, 150);
        toast.success(`To: ${st.city} (${st.code})`);
    };
    const handleSwap = () => {
        const newOriginId = trainCriteria.destinationStationId;
        const newDestId = trainCriteria.originStationId;
        const newOriginStation = stations.find((s) => s.id === newOriginId);
        const newDestStation = stations.find((s) => s.id === newDestId);
        setTrainCriteria({
            originStationId: newOriginId,
            destinationStationId: newDestId,
        });
        setHasTypedOrigin(false);
        setHasTypedDest(false);
        if (newOriginStation)
            setOriginQuery(newOriginStation.city);
        if (newDestStation)
            setDestQuery(newDestStation.city);
        toast.info("Swapped departure and destination stations");
    };
    const handleSearch = (e) => {
        e.preventDefault();
        setHasSearched(true);
        toast.success("Searched live Indian Railways schedules!");
        goToResults();
    };
    const formatDisplayDate = (dateStr) => {
        if (!dateStr)
            return { date: "Select Date", day: "Any Day" };
        try {
            const d = new Date(dateStr + "T00:00:00");
            if (isNaN(d.getTime()))
                return { date: dateStr, day: "" };
            const day = d.getDate();
            const month = d.toLocaleDateString("en-IN", { month: "short" });
            const year = d.getFullYear();
            const dayName = d.toLocaleDateString("en-IN", { weekday: "long" });
            return { date: `${day} ${month} ${year}`, day: dayName };
        }
        catch {
            return { date: dateStr, day: "" };
        }
    };
    const displayDate = formatDisplayDate(trainCriteria.journeyDate);
    const displayReturnDate = formatDisplayDate(trainCriteria.returnDate || "");
    const selectedClass = trainClasses.find((c) => c.code === trainCriteria.travelClass) || trainClasses[0];
    const isRoundTrip = trainCriteria.tripType === "round-trip";
    return (<form onSubmit={handleSearch} className="space-y-4">
      {/* 1. Trip Mode & Special Fare Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-5">
          <label onClick={() => setTrainCriteria({ tripType: "one-way" })} className={cn("flex items-center gap-2 cursor-pointer transition-colors", !isRoundTrip ? "font-bold text-slate-800 dark:text-slate-200" : "font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}>
            <span className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all", !isRoundTrip ? "border-indigo-600" : "border-slate-300 dark:border-slate-600")}>
              {!isRoundTrip && <span className="w-2 h-2 rounded-full bg-indigo-600"/>}
            </span>
            <span>One Way</span>
          </label>
          <label onClick={() => {
            const nextDay = new Date(trainCriteria.journeyDate || Date.now());
            nextDay.setDate(nextDay.getDate() + 3);
            const nextDayStr = nextDay.toISOString().split("T")[0];
            setTrainCriteria({
                tripType: "round-trip",
                returnDate: trainCriteria.returnDate || nextDayStr
            });
            toast.info("Round Trip enabled — select your return date");
        }} className={cn("flex items-center gap-2 cursor-pointer transition-colors", isRoundTrip ? "font-bold text-slate-800 dark:text-slate-200" : "font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}>
            <span className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all", isRoundTrip ? "border-indigo-600" : "border-slate-300 dark:border-slate-600")}>
              {isRoundTrip && <span className="w-2 h-2 rounded-full bg-indigo-600"/>}
            </span>
            <span>Round Trip</span>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="font-bold text-slate-400 dark:text-slate-500 mr-1 uppercase tracking-wider text-[10px]">
            Quota &amp; Special Fares:
          </span>
          {quotas.map((q) => {
            const isSelected = (trainCriteria.quota || "GN") === q.code;
            return (<button key={q.code} type="button" onClick={() => {
                    setTrainCriteria({ quota: q.code });
                    toast.success(`Active Quota: ${q.label}`);
                }} className={cn("px-2.5 py-0.5 rounded-full font-bold transition-all cursor-pointer border", isSelected
                    ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800/80 font-extrabold ring-1 ring-indigo-500/20"
                    : "bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-transparent hover:border-slate-300")}>
                {q.icon} {q.label}
              </button>);
        })}
        </div>
      </div>

      {/* 2. Industry-Level 6-Tile Console */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 items-stretch relative">
        
        {/* Tile 1: Typable From Station */}
        <div ref={originContainerRef} className={cn("relative group", isOriginOpen ? "z-50" : "z-20")}>
          <div onClick={() => {
            setIsOriginOpen(true);
            originInputRef.current?.focus();
            originInputRef.current?.select();
        }} className={cn("w-full min-h-[88px] sm:min-h-[92px] rounded-2xl text-left px-4 py-3 transition-all cursor-text flex flex-col justify-between border-2 shadow-xs", isOriginOpen
            ? "bg-white dark:bg-slate-800 border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-md"
            : "bg-slate-50/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md")}>
            <div className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pointer-events-none">
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-extrabold">
                <Train className="w-3.5 h-3.5"/> From Station
              </span>
              {originStation && (<span className="text-xs font-black text-indigo-700 dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-950 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                  {originStation.code}
                </span>)}
            </div>

            <div className="w-full my-0.5">
              <input ref={originInputRef} type="text" value={originQuery} onChange={(e) => {
            setOriginQuery(e.target.value);
            setHasTypedOrigin(true);
            setIsOriginOpen(true);
        }} onFocus={(e) => {
            setIsOriginOpen(true);
            e.target.select();
        }} onKeyDown={(e) => {
            if (e.key === "Enter" && filteredOriginStations.length > 0) {
                e.preventDefault();
                selectOriginStation(filteredOriginStations[0]);
            }
            else if (e.key === "Escape") {
                setIsOriginOpen(false);
            }
        }} placeholder="Type station or city..." className="w-full bg-transparent font-black text-base sm:text-lg text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"/>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold line-clamp-1 leading-snug pointer-events-none" title={originStation ? `${originStation.name} • ${originStation.state}` : "Search station name or code"}>
              {originStation
            ? `${originStation.name.replace(" Railway Station", "")} (${originStation.state})`
            : "Click to choose departure station"}
            </div>
          </div>

          {/* Autocomplete Dropdown: Shows all available stations on click, filters when typing */}
          {isOriginOpen && (<div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[320px] sm:min-w-[380px] max-w-[calc(100vw-2rem)] max-h-80 bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 animate-in fade-in-0 zoom-in-95 duration-100">
              <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/90 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between sticky top-0 backdrop-blur-md z-10 border-b border-slate-200/70 dark:border-slate-700/70">
                <span>{hasTypedOrigin ? `Matching stations (${filteredOriginStations.length})` : `Popular Stations (${stations.length})`}</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold normal-case">1-Click Select</span>
              </div>
              {filteredOriginStations.length > 0 ? (filteredOriginStations.map((st) => {
                const isCurrent = st.id === trainCriteria.originStationId;
                return (<button key={st.id} type="button" onClick={() => selectOriginStation(st)} className={cn("w-full p-3.5 text-left hover:bg-indigo-50/90 dark:hover:bg-slate-800 transition-colors flex items-center justify-between gap-3 group/item cursor-pointer", isCurrent && "bg-indigo-50/60 dark:bg-indigo-950/40")}>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400">
                            {st.city}
                          </span>
                          <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-950 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                            {st.code}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            • {st.state}
                          </span>
                          {isCurrent && (<span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-100 px-1.5 py-0.2 rounded">
                              Current
                            </span>)}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 leading-snug">
                          {st.name}
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 group-hover/item:bg-indigo-100 dark:group-hover/item:bg-indigo-900/60 flex items-center justify-center shrink-0 transition-colors">
                        <Train className="w-4 h-4 text-slate-400 group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400"/>
                      </div>
                    </button>);
            })) : (<div className="p-5 text-center text-xs text-slate-500 font-semibold">
                  No stations found matching &ldquo;{originQuery}&rdquo;
                </div>)}
            </div>)}

          {/* Floating Swap Button centered between Col 1 and Col 2 */}
          <button type="button" onClick={handleSwap} title="Swap Departure and Destination" className="hidden xl:flex absolute left-[calc(100%+6px)] -translate-x-1/2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white shadow-md items-center justify-center transition-all hover:scale-110 active:rotate-180 duration-300 cursor-pointer">
            <ArrowLeftRight className="w-3.5 h-3.5"/>
          </button>
        </div>

        {/* Tile 2: Typable To Station */}
        <div ref={destContainerRef} className={cn("relative group", isDestOpen ? "z-50" : "z-20")}>
          <div onClick={() => {
            setIsDestOpen(true);
            destInputRef.current?.focus();
            destInputRef.current?.select();
        }} className={cn("w-full min-h-[88px] sm:min-h-[92px] rounded-2xl text-left px-4 py-3 transition-all cursor-text flex flex-col justify-between border-2 shadow-xs", isDestOpen
            ? "bg-white dark:bg-slate-800 border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-md"
            : "bg-slate-50/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md")}>
            <div className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pointer-events-none">
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-extrabold">
                <Train className="w-3.5 h-3.5"/> To Station
              </span>
              {destStation && (<span className="text-xs font-black text-indigo-700 dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-950 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                  {destStation.code}
                </span>)}
            </div>

            <div className="w-full my-0.5">
              <input ref={destInputRef} type="text" value={destQuery} onChange={(e) => {
            setDestQuery(e.target.value);
            setHasTypedDest(true);
            setIsDestOpen(true);
        }} onFocus={(e) => {
            setIsDestOpen(true);
            e.target.select();
        }} onKeyDown={(e) => {
            if (e.key === "Enter" && filteredDestStations.length > 0) {
                e.preventDefault();
                selectDestStation(filteredDestStations[0]);
            }
            else if (e.key === "Escape") {
                setIsDestOpen(false);
            }
        }} placeholder="Type destination..." className="w-full bg-transparent font-black text-base sm:text-lg text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"/>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold line-clamp-1 leading-snug pointer-events-none" title={destStation ? `${destStation.name} • ${destStation.state}` : "Search destination station"}>
              {destStation
            ? `${destStation.name.replace(" Railway Station", "")} (${destStation.state})`
            : "Click to choose destination station"}
            </div>
          </div>

          {/* Autocomplete Dropdown: Shows all available stations on click, filters when typing */}
          {isDestOpen && (<div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[320px] sm:min-w-[380px] max-w-[calc(100vw-2rem)] max-h-80 bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 animate-in fade-in-0 zoom-in-95 duration-100">
              <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/90 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between sticky top-0 backdrop-blur-md z-10 border-b border-slate-200/70 dark:border-slate-700/70">
                <span>{hasTypedDest ? `Matching stations (${filteredDestStations.length})` : `Popular Destinations (${stations.length})`}</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold normal-case">1-Click Select</span>
              </div>
              {filteredDestStations.length > 0 ? (filteredDestStations.map((st) => {
                const isCurrent = st.id === trainCriteria.destinationStationId;
                const isDeparture = st.id === trainCriteria.originStationId;
                return (<button key={st.id} type="button" onClick={() => selectDestStation(st)} className={cn("w-full p-3.5 text-left hover:bg-indigo-50/90 dark:hover:bg-slate-800 transition-colors flex items-center justify-between gap-3 group/item cursor-pointer", isCurrent && "bg-indigo-50/60 dark:bg-indigo-950/40")}>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400">
                            {st.city}
                          </span>
                          <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-950 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                            {st.code}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            • {st.state}
                          </span>
                          {isCurrent && (<span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-100 px-1.5 py-0.2 rounded">
                              Current
                            </span>)}
                          {isDeparture && (<span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                              Origin
                            </span>)}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 leading-snug">
                          {st.name}
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 group-hover/item:bg-indigo-100 dark:group-hover/item:bg-indigo-900/60 flex items-center justify-center shrink-0 transition-colors">
                        <Train className="w-4 h-4 text-slate-400 group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400"/>
                      </div>
                    </button>);
            })) : (<div className="p-5 text-center text-xs text-slate-500 font-semibold">
                  No stations found matching &ldquo;{destQuery}&rdquo;
                </div>)}
            </div>)}
        </div>

        {/* Tile 3: Departure Date / Return Date (Responsive Dual-Date if Round Trip) */}
        <div className="relative group z-20">
          {!isRoundTrip ? (<div onClick={handleDateClick} className="relative w-full min-h-[88px] sm:min-h-[92px] rounded-2xl bg-slate-50/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border-2 border-slate-200/90 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 px-4 py-3 transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between">
              <div className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pointer-events-none">
                <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-extrabold">
                  <Calendar className="w-3.5 h-3.5"/> Departure Date
                </span>
                <Calendar className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"/>
              </div>
              <div className="leading-tight my-0.5 pointer-events-none">
                <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {displayDate.date}
                </div>
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">
                  {displayDate.day}
                </div>
              </div>
              <input ref={dateInputRef} type="date" value={trainCriteria.journeyDate} min={minDate} onChange={(e) => {
                if (e.target.value) {
                    setTrainCriteria({ journeyDate: e.target.value });
                    toast.success(`Journey Date: ${e.target.value}`);
                }
            }} onClick={(e) => {
                try {
                    e.currentTarget.showPicker();
                }
                catch { }
            }} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" title="Click to change departure date"/>
            </div>) : (<div className="relative w-full min-h-[88px] sm:min-h-[92px] rounded-2xl bg-slate-50/70 dark:bg-slate-800/70 border-2 border-slate-200/90 dark:border-slate-700 px-3 py-2.5 shadow-xs flex flex-col justify-between">
              <div className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold flex items-center gap-1">
                  <Calendar className="w-3 h-3"/> Round Trip Dates
                </span>
                <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-950 px-1.5 py-0.2 rounded">
                  2-Way
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 items-center">
                <div onClick={handleDateClick} className="p-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors relative">
                  <span className="text-[9px] font-black uppercase text-indigo-600 dark:text-indigo-400 block">Outbound</span>
                  <div className="text-xs font-black text-slate-900 dark:text-white truncate">{displayDate.date}</div>
                  <input ref={dateInputRef} type="date" value={trainCriteria.journeyDate} min={minDate} onChange={(e) => {
                if (e.target.value) {
                    setTrainCriteria({ journeyDate: e.target.value });
                    toast.success(`Outbound: ${e.target.value}`);
                }
            }} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"/>
                </div>
                <div onClick={handleReturnDateClick} className="p-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-indigo-200 dark:border-indigo-800/60 cursor-pointer transition-colors relative">
                  <span className="text-[9px] font-black uppercase text-amber-600 dark:text-amber-400 block">Return</span>
                  <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                    {trainCriteria.returnDate ? displayReturnDate.date : "+ Return"}
                  </div>
                  <input ref={returnDateInputRef} type="date" value={trainCriteria.returnDate || ""} min={trainCriteria.journeyDate || minDate} onChange={(e) => {
                if (e.target.value) {
                    setTrainCriteria({ returnDate: e.target.value });
                    toast.success(`Return: ${e.target.value}`);
                }
            }} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"/>
                </div>
              </div>
            </div>)}
        </div>

        {/* Tile 4: Travel Class Selector */}
        <div ref={classContainerRef} className={cn("relative group", isClassOpen ? "z-50" : "z-20")}>
          <button type="button" onClick={() => setIsClassOpen(!isClassOpen)} className={cn("w-full min-h-[88px] sm:min-h-[92px] rounded-2xl text-left px-4 py-3 transition-all cursor-pointer flex flex-col justify-between items-start border-2 shadow-xs", isClassOpen
            ? "bg-white dark:bg-slate-800 border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-md"
            : "bg-slate-50/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md")}>
            <div className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-extrabold">
                <Users className="w-3.5 h-3.5"/> Class
              </span>
              <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-950 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                {selectedClass.badge}
              </span>
            </div>
            <div className="w-full my-0.5">
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                {selectedClass.name}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-0.5 line-clamp-1">
                {selectedClass.desc}
              </div>
            </div>
          </button>

          {isClassOpen && (<div className="absolute top-[calc(100%+8px)] left-0 sm:left-auto sm:right-0 xl:left-0 w-full min-w-[300px] sm:min-w-[340px] max-w-[calc(100vw-2rem)] max-h-80 bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 animate-in fade-in-0 zoom-in-95 duration-100">
              <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/90 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between sticky top-0 backdrop-blur-md z-10 border-b border-slate-200/70 dark:border-slate-700/70">
                <span>Choose Travel Class ({trainClasses.length})</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold normal-case">All berths</span>
              </div>
              {trainClasses.map((cls) => {
                const isSelected = cls.code === trainCriteria.travelClass;
                return (<button key={cls.code} type="button" onClick={() => {
                        setTrainCriteria({ travelClass: cls.code });
                        setIsClassOpen(false);
                        toast.success(`Class: ${cls.name}`);
                    }} className={cn("w-full p-3.5 text-left hover:bg-indigo-50/90 dark:hover:bg-slate-800 transition-colors flex items-center justify-between gap-3 cursor-pointer", isSelected && "bg-indigo-50/80 dark:bg-indigo-950/50")}>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                          {cls.name}
                        </span>
                        <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-950 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                          {cls.badge}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 leading-snug">
                        {cls.desc}
                      </div>
                    </div>
                    {isSelected ? (<div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]"/>
                      </div>) : (<div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0"/>)}
                  </button>);
            })}
            </div>)}
        </div>

        {/* Tile 5: Travelers Input & Stepper */}
        <div ref={travellerContainerRef} className={cn("relative group", isTravellerOpen ? "z-50" : "z-20")}>
          <button type="button" onClick={() => setIsTravellerOpen(!isTravellerOpen)} className={cn("w-full min-h-[88px] sm:min-h-[92px] rounded-2xl text-left px-4 py-3 transition-all cursor-pointer flex flex-col justify-between items-start border-2 shadow-xs", isTravellerOpen
            ? "bg-white dark:bg-slate-800 border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-md"
            : "bg-slate-50/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md")}>
            <div className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-extrabold">
                <Users className="w-3.5 h-3.5"/> Travelers
              </span>
              <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-950 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                {trainCriteria.passengerCount} Pax
              </span>
            </div>
            <div className="w-full my-0.5">
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                {trainCriteria.passengerCount} {trainCriteria.passengerCount === 1 ? "Traveler" : "Travelers"}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-0.5 line-clamp-1">
                Adults &amp; Children (All Ages)
              </div>
            </div>
          </button>

          {isTravellerOpen && (<div className="absolute top-[calc(100%+8px)] right-0 w-full min-w-[300px] sm:min-w-[340px] max-w-[calc(100vw-2rem)] p-4 bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-slate-700 rounded-2xl shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-100">
              <div className="text-sm font-black text-slate-900 dark:text-white mb-1">
                Number of Travelers
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">
                Type count directly or use + / - buttons (Max 6 per ticket)
              </p>

              {/* Stepper with typable Input */}
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 mb-3">
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  Total Passengers
                </span>
                <div className="flex items-center gap-2">
                  <button type="button" disabled={trainCriteria.passengerCount <= 1} onClick={() => {
                if (trainCriteria.passengerCount > 1) {
                    setTrainCriteria({ passengerCount: trainCriteria.passengerCount - 1 });
                }
            }} className="w-9 h-9 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 disabled:opacity-40 font-black text-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer">
                    -
                  </button>
                  <input type="number" min={1} max={6} value={trainCriteria.passengerCount} onChange={(e) => {
                const val = Math.max(1, Math.min(6, parseInt(e.target.value) || 1));
                setTrainCriteria({ passengerCount: val });
            }} className="w-12 h-9 text-center font-black text-base bg-white dark:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-600 outline-none"/>
                  <button type="button" disabled={trainCriteria.passengerCount >= 6} onClick={() => {
                if (trainCriteria.passengerCount < 6) {
                    setTrainCriteria({ passengerCount: trainCriteria.passengerCount + 1 });
                }
            }} className="w-9 h-9 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 disabled:opacity-40 font-black text-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer">
                    +
                  </button>
                </div>
              </div>

              {/* Quick Select Number Pills */}
              <div className="grid grid-cols-6 gap-1.5 mb-3.5">
                {[1, 2, 3, 4, 5, 6].map((num) => (<button key={num} type="button" onClick={() => setTrainCriteria({ passengerCount: num })} className={cn("h-9 rounded-lg text-xs font-black transition-all border cursor-pointer flex items-center justify-center", trainCriteria.passengerCount === num
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-700")}>
                    {num}
                  </button>))}
              </div>

              <button type="button" onClick={() => setIsTravellerOpen(false)} className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-md shadow-indigo-600/20">
                Apply Travelers
              </button>
            </div>)}
        </div>

        {/* Tile 6: Submit Button */}
        <div className="z-20">
          <Button type="submit" className="w-full min-h-[88px] sm:min-h-[92px] rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-sm shadow-xl shadow-indigo-600/30 active:scale-95 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer tracking-wider" title="Search Trains">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 stroke-[2.5]"/>
              <span className="text-base font-black uppercase tracking-wider">Search Trains</span>
            </div>
            <span className="text-xs text-indigo-200 font-normal">Check Live Seats</span>
          </Button>
        </div>

      </div>

      {/* Popular Quick Suggestions */}
      {!compact && <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-slate-600 dark:text-slate-300">Popular Routes:</span>
        {[
                { label: "New Delhi → Varanasi (Vande Bharat)", from: "station-ndls", to: "station-bsb" },
                { label: "Delhi → Mumbai Central (Rajdhani)", from: "station-ndls", to: "station-mmct" },
                { label: "Bengaluru → Chennai (Shatabdi)", from: "station-sbc", to: "station-mas" },
                { label: "Mumbai → Ahmedabad", from: "station-mmct", to: "station-adi" }
            ].map((item, idx) => (<button key={idx} type="button" onClick={() => {
                    setTrainCriteria({ originStationId: item.from, destinationStationId: item.to });
                    const fromSt = stations.find((s) => s.id === item.from);
                    const toSt = stations.find((s) => s.id === item.to);
                    if (fromSt)
                        setOriginQuery(fromSt.city);
                    if (toSt)
                        setDestQuery(toSt.city);
                    setHasSearched(true);
                    toast.info(`Selected ${item.label}`);
                }} className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer font-medium">
            {item.label}
          </button>))}
      </div>}
    </form>);
}
