"use client";
import React, { useState, useEffect, useRef } from "react";
import { ArrowLeftRight, Calendar, Users, Plane, Search, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchStore } from "@/store/search-store";
import { airports } from "@/lib/services/route-service";
import { cn } from "cn";
import { toast } from "sonner";
import { useGoToResults } from "@/lib/hooks/use-go-to-results";
const cabinClasses = [
    { code: "ECONOMY", name: "Economy", badge: "ECO", desc: "Best Value & Standard Baggage" },
    { code: "PREMIUM_ECONOMY", name: "Premium Economy", badge: "PREM", desc: "Extra Legroom & Priority Boarding" },
    { code: "BUSINESS", name: "Business Class", badge: "BIZ", desc: "Lie-Flat Beds & Lounge Access" },
    { code: "FIRST", name: "First Class", badge: "FIRST", desc: "Ultra Luxury Private Suites" },
];
export function FlightSearchForm({ compact = false }) {
    const { flightCriteria, setFlightCriteria, setHasSearched } = useSearchStore();
    const goToResults = useGoToResults();
    const [minDate, setMinDate] = useState("2026-01-01");
    const initialOrigin = airports.find((a) => a.id === flightCriteria.originAirportId);
    const initialDest = airports.find((a) => a.id === flightCriteria.destinationAirportId);
    // Autocomplete & input states
    const [originQuery, setOriginQuery] = useState(initialOrigin ? initialOrigin.city : "");
    const [destQuery, setDestQuery] = useState(initialDest ? initialDest.city : "");
    const [hasTypedOrigin, setHasTypedOrigin] = useState(false);
    const [hasTypedDest, setHasTypedDest] = useState(false);
    const [isOriginOpen, setIsOriginOpen] = useState(false);
    const [isDestOpen, setIsDestOpen] = useState(false);
    const [isCabinOpen, setIsCabinOpen] = useState(false);
    const [isTravellerOpen, setIsTravellerOpen] = useState(false);
    const originContainerRef = useRef(null);
    const destContainerRef = useRef(null);
    const originInputRef = useRef(null);
    const destInputRef = useRef(null);
    const dateInputRef = useRef(null);
    const returnDateInputRef = useRef(null);
    const cabinContainerRef = useRef(null);
    const travellerContainerRef = useRef(null);
    useEffect(() => {
        setMinDate(new Date().toISOString().split("T")[0]);
    }, []);
    const originAirport = airports.find((a) => a.id === flightCriteria.originAirportId);
    const destAirport = airports.find((a) => a.id === flightCriteria.destinationAirportId);
    useEffect(() => {
        if (originAirport && !hasTypedOrigin) {
            setOriginQuery(originAirport.city);
        }
    }, [originAirport, hasTypedOrigin]);
    useEffect(() => {
        if (destAirport && !hasTypedDest) {
            setDestQuery(destAirport.city);
        }
    }, [destAirport, hasTypedDest]);
    useEffect(() => {
        const handleClickOutside = (e) => {
            const target = e.target;
            if (originContainerRef.current && !originContainerRef.current.contains(target)) {
                setIsOriginOpen(false);
                setHasTypedOrigin(false);
                if (originAirport)
                    setOriginQuery(originAirport.city);
            }
            if (destContainerRef.current && !destContainerRef.current.contains(target)) {
                setIsDestOpen(false);
                setHasTypedDest(false);
                if (destAirport)
                    setDestQuery(destAirport.city);
            }
            if (cabinContainerRef.current && !cabinContainerRef.current.contains(target)) {
                setIsCabinOpen(false);
            }
            if (travellerContainerRef.current && !travellerContainerRef.current.contains(target)) {
                setIsTravellerOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [originAirport, destAirport]);
    // Airport filtering: Show all available airports on click, filter when user types
    const filteredOriginAirports = airports.filter((a) => {
        if (!hasTypedOrigin || !originQuery.trim())
            return true;
        const q = originQuery.toLowerCase();
        return (a.city.toLowerCase().includes(q) ||
            a.iataCode.toLowerCase().includes(q) ||
            a.name.toLowerCase().includes(q));
    });
    const filteredDestAirports = airports.filter((a) => {
        if (!hasTypedDest || !destQuery.trim())
            return true;
        const q = destQuery.toLowerCase();
        return (a.city.toLowerCase().includes(q) ||
            a.iataCode.toLowerCase().includes(q) ||
            a.name.toLowerCase().includes(q));
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
    // Select origin: Auto-advance to destination airport
    const selectOriginAirport = (ap) => {
        setFlightCriteria({ originAirportId: ap.id });
        setOriginQuery(ap.city);
        setHasTypedOrigin(false);
        setIsOriginOpen(false);
        // Auto-advance to To Airport
        setTimeout(() => {
            setIsDestOpen(true);
            destInputRef.current?.focus();
            destInputRef.current?.select();
        }, 100);
        toast.success(`Origin: ${ap.city} [${ap.iataCode}]`);
    };
    // Select destination: Auto-advance to departure date
    const selectDestAirport = (ap) => {
        setFlightCriteria({ destinationAirportId: ap.id });
        setDestQuery(ap.city);
        setHasTypedDest(false);
        setIsDestOpen(false);
        // Auto-advance to Date picker
        setTimeout(() => {
            handleDateClick();
        }, 150);
        toast.success(`Destination: ${ap.city} [${ap.iataCode}]`);
    };
    const handleSwap = () => {
        const newOriginId = flightCriteria.destinationAirportId;
        const newDestId = flightCriteria.originAirportId;
        const newOrigin = airports.find((a) => a.id === newOriginId);
        const newDest = airports.find((a) => a.id === newDestId);
        setFlightCriteria({
            originAirportId: newOriginId,
            destinationAirportId: newDestId,
        });
        setHasTypedOrigin(false);
        setHasTypedDest(false);
        if (newOrigin)
            setOriginQuery(newOrigin.city);
        if (newDest)
            setDestQuery(newDest.city);
        toast.info("Swapped departure and arrival airports");
    };
    const handleSearch = (e) => {
        e.preventDefault();
        setHasSearched(true);
        toast.success("Searched live flights across airlines!");
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
    const displayDate = formatDisplayDate(flightCriteria.journeyDate);
    const displayReturnDate = formatDisplayDate(flightCriteria.returnDate || "");
    const selectedCabin = cabinClasses.find((c) => c.code === flightCriteria.cabinClass) || cabinClasses[0];
    const isRoundTrip = flightCriteria.tripType === "round-trip";
    const isMultiCity = flightCriteria.tripType === "multi-city";
    return (<form onSubmit={handleSearch} className="space-y-4">
      {/* 1. Trip Mode & Special Fare Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-5">
          <label onClick={() => setFlightCriteria({ tripType: "one-way" })} className={cn("flex items-center gap-2 cursor-pointer transition-colors", flightCriteria.tripType === "one-way" ? "font-bold text-slate-800 dark:text-slate-200" : "font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}>
            <span className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all", flightCriteria.tripType === "one-way" ? "border-sky-600" : "border-slate-300 dark:border-slate-600")}>
              {flightCriteria.tripType === "one-way" && <span className="w-2 h-2 rounded-full bg-sky-600"/>}
            </span>
            <span>One Way</span>
          </label>
          <label onClick={() => {
            const nextDay = new Date(flightCriteria.journeyDate || Date.now());
            nextDay.setDate(nextDay.getDate() + 4);
            const nextDayStr = nextDay.toISOString().split("T")[0];
            setFlightCriteria({
                tripType: "round-trip",
                returnDate: flightCriteria.returnDate || nextDayStr
            });
            toast.info("Round Trip enabled — pick return flight date");
        }} className={cn("flex items-center gap-2 cursor-pointer transition-colors", isRoundTrip ? "font-bold text-slate-800 dark:text-slate-200" : "font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}>
            <span className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all", isRoundTrip ? "border-sky-600" : "border-slate-300 dark:border-slate-600")}>
              {isRoundTrip && <span className="w-2 h-2 rounded-full bg-sky-600"/>}
            </span>
            <span>Round Trip</span>
          </label>
          <label onClick={() => {
            setFlightCriteria({ tripType: "multi-city" });
            toast.info("Multi-City search selected");
        }} className={cn("hidden sm:flex items-center gap-2 cursor-pointer transition-colors", isMultiCity ? "font-bold text-slate-800 dark:text-slate-200" : "font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}>
            <span className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all", isMultiCity ? "border-sky-600" : "border-slate-300 dark:border-slate-600")}>
              {isMultiCity && <span className="w-2 h-2 rounded-full bg-sky-600"/>}
            </span>
            <span>Multi-City</span>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="font-bold text-slate-400 dark:text-slate-500 mr-1 uppercase tracking-wider text-[10px]">
            Special Fares:
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-extrabold border border-sky-200/60 dark:border-sky-800/60">
            ✈ Regular
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold transition-colors cursor-pointer border border-transparent hover:border-slate-300">
            🎓 Student
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold transition-colors cursor-pointer border border-transparent hover:border-slate-300">
            🎖 Armed Forces
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold transition-colors cursor-pointer border border-transparent hover:border-slate-300">
            🧓 Senior Citizen
          </span>
        </div>
      </div>

      {/* 2. Industry-Level 6-Tile Console */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 items-stretch relative">
        
        {/* Tile 1: Typable Origin Airport */}
        <div ref={originContainerRef} className={cn("relative group", isOriginOpen ? "z-50" : "z-20")}>
          <div onClick={() => {
            setIsOriginOpen(true);
            originInputRef.current?.focus();
            originInputRef.current?.select();
        }} className={cn("w-full min-h-[88px] sm:min-h-[92px] rounded-2xl text-left px-4 py-3 transition-all cursor-text flex flex-col justify-between border-2 shadow-xs", isOriginOpen
            ? "bg-white dark:bg-slate-800 border-sky-600 dark:border-sky-500 ring-2 ring-sky-500/20 shadow-md"
            : "bg-slate-50/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-500 hover:shadow-md")}>
            <div className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pointer-events-none">
              <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-extrabold">
                <Plane className="w-3.5 h-3.5"/> Origin Airport
              </span>
              {originAirport && (<span className="text-xs font-black text-sky-700 dark:text-sky-300 bg-sky-100/80 dark:bg-sky-950 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                  {originAirport.iataCode}
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
            if (e.key === "Enter" && filteredOriginAirports.length > 0) {
                e.preventDefault();
                selectOriginAirport(filteredOriginAirports[0]);
            }
            else if (e.key === "Escape") {
                setIsOriginOpen(false);
            }
        }} placeholder="Type airport or city..." className="w-full bg-transparent font-black text-base sm:text-lg text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"/>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold line-clamp-1 leading-snug pointer-events-none" title={originAirport ? `${originAirport.name} • ${originAirport.country}` : "Search airport code or name"}>
              {originAirport
            ? `${originAirport.name.replace(" International Airport", "")} (${originAirport.country})`
            : "Click to choose departure airport"}
            </div>
          </div>

          {/* Autocomplete Dropdown: Shows all available airports on click, filters when typing */}
          {isOriginOpen && (<div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[320px] sm:min-w-[380px] max-w-[calc(100vw-2rem)] max-h-80 bg-white dark:bg-slate-900 border-2 border-sky-100 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 animate-in fade-in-0 zoom-in-95 duration-100">
              <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/90 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between sticky top-0 backdrop-blur-md z-10 border-b border-slate-200/70 dark:border-slate-700/70">
                <span>{hasTypedOrigin ? `Matching airports (${filteredOriginAirports.length})` : `Major Airports (${airports.length})`}</span>
                <span className="text-sky-600 dark:text-sky-400 font-bold normal-case">1-Click Select</span>
              </div>
              {filteredOriginAirports.length > 0 ? (filteredOriginAirports.map((ap) => {
                const isCurrent = ap.id === flightCriteria.originAirportId;
                return (<button key={ap.id} type="button" onClick={() => selectOriginAirport(ap)} className={cn("w-full p-3.5 text-left hover:bg-sky-50/90 dark:hover:bg-slate-800 transition-colors flex items-center justify-between gap-3 group/item cursor-pointer", isCurrent && "bg-sky-50/60 dark:bg-sky-950/40")}>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white group-hover/item:text-sky-600 dark:group-hover/item:text-sky-400">
                            {ap.city}
                          </span>
                          <span className="text-xs font-black text-sky-700 dark:text-sky-300 bg-sky-100/80 dark:bg-sky-950 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                            {ap.iataCode}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            • {ap.country}
                          </span>
                          {isCurrent && (<span className="text-[10px] font-black uppercase text-sky-600 bg-sky-100 px-1.5 py-0.2 rounded">
                              Current
                            </span>)}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 leading-snug">
                          {ap.name}
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 group-hover/item:bg-sky-100 dark:group-hover/item:bg-sky-900/60 flex items-center justify-center shrink-0 transition-colors">
                        <Plane className="w-4 h-4 text-slate-400 group-hover/item:text-sky-600 dark:group-hover/item:text-sky-400"/>
                      </div>
                    </button>);
            })) : (<div className="p-5 text-center text-xs text-slate-500 font-semibold">
                  No airports found matching &ldquo;{originQuery}&rdquo;
                </div>)}
            </div>)}

          {/* Floating Swap Button */}
          <button type="button" onClick={handleSwap} title="Swap Airports" className="hidden xl:flex absolute left-[calc(100%+6px)] -translate-x-1/2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-2 border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 hover:bg-sky-600 hover:text-white dark:hover:bg-sky-600 dark:hover:text-white shadow-md items-center justify-center transition-all hover:scale-110 active:rotate-180 duration-300 cursor-pointer">
            <ArrowLeftRight className="w-3.5 h-3.5"/>
          </button>
        </div>

        {/* Tile 2: Typable Destination Airport */}
        <div ref={destContainerRef} className={cn("relative group", isDestOpen ? "z-50" : "z-20")}>
          <div onClick={() => {
            setIsDestOpen(true);
            destInputRef.current?.focus();
            destInputRef.current?.select();
        }} className={cn("w-full min-h-[88px] sm:min-h-[92px] rounded-2xl text-left px-4 py-3 transition-all cursor-text flex flex-col justify-between border-2 shadow-xs", isDestOpen
            ? "bg-white dark:bg-slate-800 border-sky-600 dark:border-sky-500 ring-2 ring-sky-500/20 shadow-md"
            : "bg-slate-50/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-500 hover:shadow-md")}>
            <div className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pointer-events-none">
              <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-extrabold">
                <Plane className="w-3.5 h-3.5"/> Destination Airport
              </span>
              {destAirport && (<span className="text-xs font-black text-sky-700 dark:text-sky-300 bg-sky-100/80 dark:bg-sky-950 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                  {destAirport.iataCode}
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
            if (e.key === "Enter" && filteredDestAirports.length > 0) {
                e.preventDefault();
                selectDestAirport(filteredDestAirports[0]);
            }
            else if (e.key === "Escape") {
                setIsDestOpen(false);
            }
        }} placeholder="Type destination airport..." className="w-full bg-transparent font-black text-base sm:text-lg text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"/>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold line-clamp-1 leading-snug pointer-events-none" title={destAirport ? `${destAirport.name} • ${destAirport.country}` : "Search destination airport"}>
              {destAirport
            ? `${destAirport.name.replace(" International Airport", "")} (${destAirport.country})`
            : "Click to choose destination airport"}
            </div>
          </div>

          {/* Autocomplete Dropdown: Shows all available airports on click, filters when typing */}
          {isDestOpen && (<div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[320px] sm:min-w-[380px] max-w-[calc(100vw-2rem)] max-h-80 bg-white dark:bg-slate-900 border-2 border-sky-100 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 animate-in fade-in-0 zoom-in-95 duration-100">
              <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/90 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between sticky top-0 backdrop-blur-md z-10 border-b border-slate-200/70 dark:border-slate-700/70">
                <span>{hasTypedDest ? `Matching airports (${filteredDestAirports.length})` : `Major Destinations (${airports.length})`}</span>
                <span className="text-sky-600 dark:text-sky-400 font-bold normal-case">1-Click Select</span>
              </div>
              {filteredDestAirports.length > 0 ? (filteredDestAirports.map((ap) => {
                const isCurrent = ap.id === flightCriteria.destinationAirportId;
                const isDeparture = ap.id === flightCriteria.originAirportId;
                return (<button key={ap.id} type="button" onClick={() => selectDestAirport(ap)} className={cn("w-full p-3.5 text-left hover:bg-sky-50/90 dark:hover:bg-slate-800 transition-colors flex items-center justify-between gap-3 group/item cursor-pointer", isCurrent && "bg-sky-50/60 dark:bg-sky-950/40")}>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white group-hover/item:text-sky-600 dark:group-hover/item:text-sky-400">
                            {ap.city}
                          </span>
                          <span className="text-xs font-black text-sky-700 dark:text-sky-300 bg-sky-100/80 dark:bg-sky-950 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                            {ap.iataCode}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            • {ap.country}
                          </span>
                          {isCurrent && (<span className="text-[10px] font-black uppercase text-sky-600 bg-sky-100 px-1.5 py-0.2 rounded">
                              Current
                            </span>)}
                          {isDeparture && (<span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                              Origin
                            </span>)}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 leading-snug">
                          {ap.name}
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 group-hover/item:bg-sky-100 dark:group-hover/item:bg-sky-900/60 flex items-center justify-center shrink-0 transition-colors">
                        <Plane className="w-4 h-4 text-slate-400 group-hover/item:text-sky-600 dark:group-hover/item:text-sky-400"/>
                      </div>
                    </button>);
            })) : (<div className="p-5 text-center text-xs text-slate-500 font-semibold">
                  No airports found matching &ldquo;{destQuery}&rdquo;
                </div>)}
            </div>)}
        </div>

        {/* Tile 3: Departure Date / Return Date (Responsive Dual-Date if Round Trip) */}
        <div className="relative group z-20">
          {!isRoundTrip ? (<div onClick={handleDateClick} className="relative w-full min-h-[88px] sm:min-h-[92px] rounded-2xl bg-slate-50/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border-2 border-slate-200/90 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-500 px-4 py-3 transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between">
              <div className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pointer-events-none">
                <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-extrabold">
                  <Calendar className="w-3.5 h-3.5"/> Departure Date
                </span>
                <Calendar className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 transition-colors"/>
              </div>
              <div className="leading-tight my-0.5 pointer-events-none">
                <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {displayDate.date}
                </div>
                <div className="text-xs text-sky-600 dark:text-sky-400 font-bold mt-0.5">
                  {displayDate.day}
                </div>
              </div>
              <input ref={dateInputRef} type="date" value={flightCriteria.journeyDate} min={minDate} onChange={(e) => {
                if (e.target.value) {
                    setFlightCriteria({ journeyDate: e.target.value });
                    toast.success(`Flight Date: ${e.target.value}`);
                }
            }} onClick={(e) => {
                try {
                    e.currentTarget.showPicker();
                }
                catch { }
            }} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" title="Click to change departure date"/>
            </div>) : (<div className="relative w-full min-h-[88px] sm:min-h-[92px] rounded-2xl bg-slate-50/70 dark:bg-slate-800/70 border-2 border-slate-200/90 dark:border-slate-700 px-3 py-2.5 shadow-xs flex flex-col justify-between">
              <div className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <span className="text-sky-600 dark:text-sky-400 font-extrabold flex items-center gap-1">
                  <Calendar className="w-3 h-3"/> Round Trip Dates
                </span>
                <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 bg-sky-100/80 dark:bg-sky-950 px-1.5 py-0.2 rounded">
                  2-Way
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 items-center">
                <div onClick={handleDateClick} className="p-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors relative">
                  <span className="text-[9px] font-black uppercase text-sky-600 dark:text-sky-400 block">Outbound</span>
                  <div className="text-xs font-black text-slate-900 dark:text-white truncate">{displayDate.date}</div>
                  <input ref={dateInputRef} type="date" value={flightCriteria.journeyDate} min={minDate} onChange={(e) => {
                if (e.target.value) {
                    setFlightCriteria({ journeyDate: e.target.value });
                    toast.success(`Outbound: ${e.target.value}`);
                }
            }} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"/>
                </div>
                <div onClick={handleReturnDateClick} className="p-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-sky-200 dark:border-sky-800/60 cursor-pointer transition-colors relative">
                  <span className="text-[9px] font-black uppercase text-amber-600 dark:text-amber-400 block">Return</span>
                  <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                    {flightCriteria.returnDate ? displayReturnDate.date : "+ Return"}
                  </div>
                  <input ref={returnDateInputRef} type="date" value={flightCriteria.returnDate || ""} min={flightCriteria.journeyDate || minDate} onChange={(e) => {
                if (e.target.value) {
                    setFlightCriteria({ returnDate: e.target.value });
                    toast.success(`Return: ${e.target.value}`);
                }
            }} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"/>
                </div>
              </div>
            </div>)}
        </div>

        {/* Tile 4: Cabin Class Selector */}
        <div ref={cabinContainerRef} className={cn("relative group", isCabinOpen ? "z-50" : "z-20")}>
          <button type="button" onClick={() => setIsCabinOpen(!isCabinOpen)} className={cn("w-full min-h-[88px] sm:min-h-[92px] rounded-2xl text-left px-4 py-3 transition-all cursor-pointer flex flex-col justify-between items-start border-2 shadow-xs", isCabinOpen
            ? "bg-white dark:bg-slate-800 border-sky-600 dark:border-sky-500 ring-2 ring-sky-500/20 shadow-md"
            : "bg-slate-50/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-500 hover:shadow-md")}>
            <div className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-extrabold">
                <Users className="w-3.5 h-3.5"/> Cabin Class
              </span>
              <span className="text-xs font-black text-sky-700 dark:text-sky-300 bg-sky-100/80 dark:bg-sky-950 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                {selectedCabin.badge}
              </span>
            </div>
            <div className="w-full my-0.5">
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                {selectedCabin.name}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-0.5 line-clamp-1">
                {selectedCabin.desc}
              </div>
            </div>
          </button>

          {isCabinOpen && (<div className="absolute top-[calc(100%+8px)] left-0 sm:left-auto sm:right-0 xl:left-0 w-full min-w-[300px] sm:min-w-[340px] max-w-[calc(100vw-2rem)] max-h-80 bg-white dark:bg-slate-900 border-2 border-sky-100 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 animate-in fade-in-0 zoom-in-95 duration-100">
              <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/90 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between sticky top-0 backdrop-blur-md z-10 border-b border-slate-200/70 dark:border-slate-700/70">
                <span>Choose Flight Cabin ({cabinClasses.length})</span>
                <span className="text-sky-600 dark:text-sky-400 font-bold normal-case">Confirmed fares</span>
              </div>
              {cabinClasses.map((cls) => {
                const isSelected = cls.code === flightCriteria.cabinClass;
                return (<button key={cls.code} type="button" onClick={() => {
                        setFlightCriteria({ cabinClass: cls.code });
                        setIsCabinOpen(false);
                        toast.success(`Cabin: ${cls.name}`);
                    }} className={cn("w-full p-3.5 text-left hover:bg-sky-50/90 dark:hover:bg-slate-800 transition-colors flex items-center justify-between gap-3 cursor-pointer", isSelected && "bg-sky-50/80 dark:bg-sky-950/50")}>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                          {cls.name}
                        </span>
                        <span className="text-xs font-black text-sky-700 dark:text-sky-300 bg-sky-100/80 dark:bg-sky-950 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                          {cls.badge}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 leading-snug">
                        {cls.desc}
                      </div>
                    </div>
                    {isSelected ? (<div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]"/>
                      </div>) : (<div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0"/>)}
                  </button>);
            })}
            </div>)}
        </div>

        {/* Tile 5: Travelers Input & Stepper (Adults, Children, Infants) */}
        <div ref={travellerContainerRef} className={cn("relative group", isTravellerOpen ? "z-50" : "z-20")}>
          {(() => {
            const breakdown = flightCriteria.passengerBreakdown || { adults: flightCriteria.passengerCount || 1, children: 0, infants: 0 };
            const adults = breakdown.adults ?? 1;
            const children = breakdown.children ?? 0;
            const infants = breakdown.infants ?? 0;
            const updateCounts = (newAdults, newChildren, newInfants) => {
                const safeAdults = Math.max(1, Math.min(9, newAdults));
                const safeChildren = Math.max(0, Math.min(9 - safeAdults, newChildren));
                const safeInfants = Math.max(0, Math.min(safeAdults, newInfants));
                const total = safeAdults + safeChildren + safeInfants;
                setFlightCriteria({
                    passengerCount: total,
                    passengerBreakdown: {
                        adults: safeAdults,
                        children: safeChildren,
                        infants: safeInfants
                    }
                });
            };
            return (<>
                <button type="button" onClick={() => setIsTravellerOpen(!isTravellerOpen)} className={cn("w-full min-h-[88px] sm:min-h-[92px] rounded-2xl text-left px-4 py-3 transition-all cursor-pointer flex flex-col justify-between items-start border-2 shadow-xs", isTravellerOpen
                    ? "bg-white dark:bg-slate-800 border-sky-600 dark:border-sky-500 ring-2 ring-sky-500/20 shadow-md"
                    : "bg-slate-50/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-500 hover:shadow-md")}>
                  <div className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-extrabold">
                      <Users className="w-3.5 h-3.5"/> Travelers
                    </span>
                    <span className="text-xs font-black text-sky-700 dark:text-sky-300 bg-sky-100/80 dark:bg-sky-950 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                      {flightCriteria.passengerCount} Pax
                    </span>
                  </div>
                  <div className="w-full my-0.5">
                    <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                      {flightCriteria.passengerCount} {flightCriteria.passengerCount === 1 ? "Traveler" : "Travelers"}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-0.5 line-clamp-1">
                      {adults} Adt{children > 0 ? `, ${children} Chd` : ""}{infants > 0 ? `, ${infants} Inf` : ""}
                    </div>
                  </div>
                </button>

                {isTravellerOpen && (<div className="absolute top-[calc(100%+8px)] right-0 w-full min-w-[320px] sm:min-w-[360px] max-w-[calc(100vw-2rem)] p-4 bg-white dark:bg-slate-900 border-2 border-sky-100 dark:border-slate-700 rounded-2xl shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-100">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-3">
                      <div>
                        <div className="text-sm font-black text-slate-900 dark:text-white">
                          Select Travelers
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          Separate seats for adults &amp; kids
                        </p>
                      </div>
                      <span className="text-xs font-black text-sky-600 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded">
                        Total {flightCriteria.passengerCount} Pax
                      </span>
                    </div>

                    <div className="space-y-2.5 mb-4">
                      {/* Adults Counter */}
                      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div>
                          <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                            Adults
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            12+ yrs (on seat)
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" disabled={adults <= 1} onClick={() => updateCounts(adults - 1, children, infants)} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 disabled:opacity-40 font-black text-base flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer">
                            -
                          </button>
                          <span className="w-8 text-center font-black text-sm text-slate-900 dark:text-white">
                            {adults}
                          </span>
                          <button type="button" disabled={adults + children >= 9} onClick={() => updateCounts(adults + 1, children, infants)} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 disabled:opacity-40 font-black text-base flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer">
                            +
                          </button>
                        </div>
                      </div>

                      {/* Children Counter */}
                      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div>
                          <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                            Children
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            2 - 11 yrs (on seat)
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" disabled={children <= 0} onClick={() => updateCounts(adults, children - 1, infants)} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 disabled:opacity-40 font-black text-base flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer">
                            -
                          </button>
                          <span className="w-8 text-center font-black text-sm text-slate-900 dark:text-white">
                            {children}
                          </span>
                          <button type="button" disabled={adults + children >= 9} onClick={() => updateCounts(adults, children + 1, infants)} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 disabled:opacity-40 font-black text-base flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer">
                            +
                          </button>
                        </div>
                      </div>

                      {/* Infants Counter */}
                      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div>
                          <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                            Infants
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            Under 2 yrs (on lap, max {adults})
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" disabled={infants <= 0} onClick={() => updateCounts(adults, children, infants - 1)} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 disabled:opacity-40 font-black text-base flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer">
                            -
                          </button>
                          <span className="w-8 text-center font-black text-sm text-slate-900 dark:text-white">
                            {infants}
                          </span>
                          <button type="button" disabled={infants >= adults} onClick={() => updateCounts(adults, children, infants + 1)} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 disabled:opacity-40 font-black text-base flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer">
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <button type="button" onClick={() => setIsTravellerOpen(false)} className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-md shadow-sky-600/20">
                      Done Selecting
                    </button>
                  </div>)}
              </>);
        })()}
        </div>

        {/* Tile 6: Submit Button */}
        <div className="z-20">
          <Button type="submit" className="w-full min-h-[88px] sm:min-h-[92px] rounded-2xl bg-gradient-to-r from-sky-600 via-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-black text-sm shadow-xl shadow-sky-600/30 active:scale-95 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer tracking-wider" title="Search Flights">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 stroke-[2.5]"/>
              <span className="text-base font-black uppercase tracking-wider">Search Flights</span>
            </div>
            <span className="text-xs text-sky-200 font-normal">Best Fare Guarantee</span>
          </Button>
        </div>

      </div>

      {/* Popular Flight Suggestions */}
      {!compact && <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-slate-600 dark:text-slate-300">Top Flights:</span>
        {[
                { label: "Delhi [DEL] → Bengaluru [BLR]", from: "airport-del", to: "airport-blr" },
                { label: "Mumbai [BOM] → Goa [GOI]", from: "airport-bom", to: "airport-goi" },
                { label: "Delhi [DEL] → Dubai [DXB]", from: "airport-del", to: "airport-dxb" },
                { label: "Bengaluru [BLR] → Singapore [SIN]", from: "airport-blr", to: "airport-sin" }
            ].map((item, idx) => (<button key={idx} type="button" onClick={() => {
                    setFlightCriteria({ originAirportId: item.from, destinationAirportId: item.to });
                    const fromAp = airports.find((a) => a.id === item.from);
                    const toAp = airports.find((a) => a.id === item.to);
                    if (fromAp)
                        setOriginQuery(fromAp.city);
                    if (toAp)
                        setDestQuery(toAp.city);
                    setHasSearched(true);
                    toast.info(`Selected ${item.label}`);
                }} className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 hover:text-sky-600 dark:hover:text-sky-400 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer font-medium">
            {item.label}
          </button>))}
      </div>}
    </form>);
}
