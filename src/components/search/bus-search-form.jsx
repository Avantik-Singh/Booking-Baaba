"use client";
import React, { useState, useEffect, useRef } from "react";
import { ArrowLeftRight, Calendar, Users, Bus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchStore } from "@/store/search-store";
import { cities } from "@/lib/services/route-service";
import { cn } from "cn";
import { toast } from "sonner";
import { useGoToResults } from "@/lib/hooks/use-go-to-results";
export function BusSearchForm({ compact = false }) {
    const { busCriteria, setBusCriteria, setHasSearched } = useSearchStore();
    const goToResults = useGoToResults();
    const [minDate, setMinDate] = useState("2026-01-01");
    const initialOrigin = cities.find((c) => c.id === busCriteria.originCityId);
    const initialDest = cities.find((c) => c.id === busCriteria.destinationCityId);
    // Autocomplete & input states
    const [originQuery, setOriginQuery] = useState(initialOrigin ? initialOrigin.name : "");
    const [destQuery, setDestQuery] = useState(initialDest ? initialDest.name : "");
    const [hasTypedOrigin, setHasTypedOrigin] = useState(false);
    const [hasTypedDest, setHasTypedDest] = useState(false);
    const [isOriginOpen, setIsOriginOpen] = useState(false);
    const [isDestOpen, setIsDestOpen] = useState(false);
    const [isTravellerOpen, setIsTravellerOpen] = useState(false);
    const originContainerRef = useRef(null);
    const destContainerRef = useRef(null);
    const originInputRef = useRef(null);
    const destInputRef = useRef(null);
    const dateInputRef = useRef(null);
    const returnDateInputRef = useRef(null);
    const travellerContainerRef = useRef(null);
    useEffect(() => {
        setMinDate(new Date().toISOString().split("T")[0]);
    }, []);
    const originCity = cities.find((c) => c.id === busCriteria.originCityId);
    const destCity = cities.find((c) => c.id === busCriteria.destinationCityId);
    useEffect(() => {
        if (originCity && !hasTypedOrigin) {
            setOriginQuery(originCity.name);
        }
    }, [originCity, hasTypedOrigin]);
    useEffect(() => {
        if (destCity && !hasTypedDest) {
            setDestQuery(destCity.name);
        }
    }, [destCity, hasTypedDest]);
    useEffect(() => {
        const handleClickOutside = (e) => {
            const target = e.target;
            if (originContainerRef.current && !originContainerRef.current.contains(target)) {
                setIsOriginOpen(false);
                setHasTypedOrigin(false);
                if (originCity)
                    setOriginQuery(originCity.name);
            }
            if (destContainerRef.current && !destContainerRef.current.contains(target)) {
                setIsDestOpen(false);
                setHasTypedDest(false);
                if (destCity)
                    setDestQuery(destCity.name);
            }
            if (travellerContainerRef.current && !travellerContainerRef.current.contains(target)) {
                setIsTravellerOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [originCity, destCity]);
    // City filtering: Show all available cities on click, filter when user types
    const filteredOriginCities = cities.filter((c) => {
        if (!hasTypedOrigin || !originQuery.trim())
            return true;
        const q = originQuery.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q);
    });
    const filteredDestCities = cities.filter((c) => {
        if (!hasTypedDest || !destQuery.trim())
            return true;
        const q = destQuery.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q);
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
    // Select origin city: Auto-advance to destination city
    const selectOriginCity = (city) => {
        setBusCriteria({ originCityId: city.id });
        setOriginQuery(city.name);
        setHasTypedOrigin(false);
        setIsOriginOpen(false);
        // Auto-advance to To City
        setTimeout(() => {
            setIsDestOpen(true);
            destInputRef.current?.focus();
            destInputRef.current?.select();
        }, 100);
        toast.success(`Origin: ${city.name} (${city.state})`);
    };
    // Select destination city: Auto-advance to departure date
    const selectDestCity = (city) => {
        setBusCriteria({ destinationCityId: city.id });
        setDestQuery(city.name);
        setHasTypedDest(false);
        setIsDestOpen(false);
        // Auto-advance to Date picker
        setTimeout(() => {
            handleDateClick();
        }, 150);
        toast.success(`Destination: ${city.name} (${city.state})`);
    };
    const handleSwap = () => {
        const newOriginId = busCriteria.destinationCityId;
        const newDestId = busCriteria.originCityId;
        const newOrigin = cities.find((c) => c.id === newOriginId);
        const newDest = cities.find((c) => c.id === newDestId);
        setBusCriteria({
            originCityId: newOriginId,
            destinationCityId: newDestId,
        });
        setHasTypedOrigin(false);
        setHasTypedDest(false);
        if (newOrigin)
            setOriginQuery(newOrigin.name);
        if (newDest)
            setDestQuery(newDest.name);
        toast.info("Swapped departure and destination cities");
    };
    const handleSearch = (e) => {
        e.preventDefault();
        setHasSearched(true);
        toast.success("Searched live intercity bus routes!");
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
    const displayDate = formatDisplayDate(busCriteria.journeyDate);
    const displayReturnDate = formatDisplayDate(busCriteria.returnDate || "");
    const isRoundTrip = busCriteria.tripType === "round-trip";
    return (<form onSubmit={handleSearch} className="space-y-4">
      {/* 1. Bus Categories & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-5">
          <label onClick={() => setBusCriteria({ tripType: "one-way" })} className={cn("flex items-center gap-2 cursor-pointer transition-colors", !isRoundTrip ? "font-bold text-slate-800 dark:text-slate-200" : "font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}>
            <span className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all", !isRoundTrip ? "border-amber-500" : "border-slate-300 dark:border-slate-600")}>
              {!isRoundTrip && <span className="w-2 h-2 rounded-full bg-amber-500"/>}
            </span>
            <span>One Way</span>
          </label>
          <label onClick={() => {
            const nextDay = new Date(busCriteria.journeyDate || Date.now());
            nextDay.setDate(nextDay.getDate() + 2);
            const nextDayStr = nextDay.toISOString().split("T")[0];
            setBusCriteria({
                tripType: "round-trip",
                returnDate: busCriteria.returnDate || nextDayStr
            });
            toast.info("Round Trip enabled — select your return bus date");
        }} className={cn("flex items-center gap-2 cursor-pointer transition-colors", isRoundTrip ? "font-bold text-slate-800 dark:text-slate-200" : "font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}>
            <span className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all", isRoundTrip ? "border-amber-500" : "border-slate-300 dark:border-slate-600")}>
              {isRoundTrip && <span className="w-2 h-2 rounded-full bg-amber-500"/>}
            </span>
            <span>Round Trip</span>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="font-bold text-slate-400 dark:text-slate-500 mr-1 uppercase tracking-wider text-[10px]">
            Bus Types:
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-extrabold border border-amber-200/60 dark:border-amber-800/60">
            ⚡ All Luxury Buses
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold transition-colors cursor-pointer border border-transparent hover:border-slate-300">
            🚌 AC Sleeper (2+1)
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold transition-colors cursor-pointer border border-transparent hover:border-slate-300">
            🚍 Volvo Multi-Axle
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold transition-colors cursor-pointer border border-transparent hover:border-slate-300">
            ⚡ Electric Express
          </span>
        </div>
      </div>

      {/* 2. Industry-Level 5-Tile Console */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 items-stretch relative">
        
        {/* Tile 1: Typable Origin City */}
        <div ref={originContainerRef} className={cn("relative group", isOriginOpen ? "z-50" : "z-20")}>
          <div onClick={() => {
            setIsOriginOpen(true);
            originInputRef.current?.focus();
            originInputRef.current?.select();
        }} className={cn("w-full min-h-[88px] sm:min-h-[92px] rounded-2xl text-left px-4 py-3 transition-all cursor-text flex flex-col justify-between border-2 shadow-xs", isOriginOpen
            ? "bg-white dark:bg-slate-800 border-amber-500 ring-2 ring-amber-500/20 shadow-md"
            : "bg-slate-50/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md")}>
            <div className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pointer-events-none">
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-extrabold">
                <Bus className="w-3.5 h-3.5"/> Origin City
              </span>
              {originCity && (<span className="text-xs font-black text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                  {originCity.region}
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
            if (e.key === "Enter" && filteredOriginCities.length > 0) {
                e.preventDefault();
                selectOriginCity(filteredOriginCities[0]);
            }
            else if (e.key === "Escape") {
                setIsOriginOpen(false);
            }
        }} placeholder="Type departure city..." className="w-full bg-transparent font-black text-base sm:text-lg text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"/>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold line-clamp-1 leading-snug pointer-events-none" title={originCity ? `${originCity.name}, ${originCity.state}` : "Search city or boarding stop"}>
              {originCity ? `${originCity.name}, ${originCity.state}` : "Click to choose departure city"}
            </div>
          </div>

          {/* Autocomplete Dropdown: Shows all available cities on click, filters when typing */}
          {isOriginOpen && (<div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[320px] sm:min-w-[380px] max-w-[calc(100vw-2rem)] max-h-80 bg-white dark:bg-slate-900 border-2 border-amber-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 animate-in fade-in-0 zoom-in-95 duration-100">
              <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/90 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between sticky top-0 backdrop-blur-md z-10 border-b border-slate-200/70 dark:border-slate-700/70">
                <span>{hasTypedOrigin ? `Matching cities (${filteredOriginCities.length})` : `Major Cities (${cities.length})`}</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold normal-case">1-Click Select</span>
              </div>
              {filteredOriginCities.length > 0 ? (filteredOriginCities.map((city) => {
                const isCurrent = city.id === busCriteria.originCityId;
                return (<button key={city.id} type="button" onClick={() => selectOriginCity(city)} className={cn("w-full p-3.5 text-left hover:bg-amber-50/90 dark:hover:bg-slate-800 transition-colors flex items-center justify-between gap-3 group/item cursor-pointer", isCurrent && "bg-amber-50/60 dark:bg-amber-950/40")}>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white group-hover/item:text-amber-600 dark:group-hover/item:text-amber-400">
                            {city.name}
                          </span>
                          <span className="text-xs font-black text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                            {city.region}
                          </span>
                          {isCurrent && (<span className="text-[10px] font-black uppercase text-amber-600 bg-amber-100 px-1.5 py-0.2 rounded">
                              Current
                            </span>)}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 leading-snug">
                          {city.state} • All Major Boarding Points
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 group-hover/item:bg-amber-100 dark:group-hover/item:bg-amber-900/60 flex items-center justify-center shrink-0 transition-colors">
                        <Bus className="w-4 h-4 text-slate-400 group-hover/item:text-amber-600 dark:group-hover/item:text-amber-400"/>
                      </div>
                    </button>);
            })) : (<div className="p-5 text-center text-xs text-slate-500 font-semibold">
                  No cities found matching &ldquo;{originQuery}&rdquo;
                </div>)}
            </div>)}

          {/* Floating Swap Button */}
          <button type="button" onClick={handleSwap} title="Swap Cities" className="hidden xl:flex absolute left-[calc(100%+6px)] -translate-x-1/2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-2 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white shadow-md items-center justify-center transition-all hover:scale-110 active:rotate-180 duration-300 cursor-pointer">
            <ArrowLeftRight className="w-3.5 h-3.5"/>
          </button>
        </div>

        {/* Tile 2: Typable Destination City */}
        <div ref={destContainerRef} className={cn("relative group", isDestOpen ? "z-50" : "z-20")}>
          <div onClick={() => {
            setIsDestOpen(true);
            destInputRef.current?.focus();
            destInputRef.current?.select();
        }} className={cn("w-full min-h-[88px] sm:min-h-[92px] rounded-2xl text-left px-4 py-3 transition-all cursor-text flex flex-col justify-between border-2 shadow-xs", isDestOpen
            ? "bg-white dark:bg-slate-800 border-amber-500 ring-2 ring-amber-500/20 shadow-md"
            : "bg-slate-50/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md")}>
            <div className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pointer-events-none">
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-extrabold">
                <Bus className="w-3.5 h-3.5"/> Destination City
              </span>
              {destCity && (<span className="text-xs font-black text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                  {destCity.region}
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
            if (e.key === "Enter" && filteredDestCities.length > 0) {
                e.preventDefault();
                selectDestCity(filteredDestCities[0]);
            }
            else if (e.key === "Escape") {
                setIsDestOpen(false);
            }
        }} placeholder="Type destination city..." className="w-full bg-transparent font-black text-base sm:text-lg text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"/>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold line-clamp-1 leading-snug pointer-events-none" title={destCity ? `${destCity.name}, ${destCity.state}` : "Search destination city"}>
              {destCity ? `${destCity.name}, ${destCity.state}` : "Click to choose destination city"}
            </div>
          </div>

          {/* Autocomplete Dropdown: Shows all available cities on click, filters when typing */}
          {isDestOpen && (<div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[320px] sm:min-w-[380px] max-w-[calc(100vw-2rem)] max-h-80 bg-white dark:bg-slate-900 border-2 border-amber-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 animate-in fade-in-0 zoom-in-95 duration-100">
              <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/90 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between sticky top-0 backdrop-blur-md z-10 border-b border-slate-200/70 dark:border-slate-700/70">
                <span>{hasTypedDest ? `Matching cities (${filteredDestCities.length})` : `Major Destinations (${cities.length})`}</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold normal-case">1-Click Select</span>
              </div>
              {filteredDestCities.length > 0 ? (filteredDestCities.map((city) => {
                const isCurrent = city.id === busCriteria.destinationCityId;
                const isDeparture = city.id === busCriteria.originCityId;
                return (<button key={city.id} type="button" onClick={() => selectDestCity(city)} className={cn("w-full p-3.5 text-left hover:bg-amber-50/90 dark:hover:bg-slate-800 transition-colors flex items-center justify-between gap-3 group/item cursor-pointer", isCurrent && "bg-amber-50/60 dark:bg-amber-950/40")}>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white group-hover/item:text-amber-600 dark:group-hover/item:text-amber-400">
                            {city.name}
                          </span>
                          <span className="text-xs font-black text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                            {city.region}
                          </span>
                          {isCurrent && (<span className="text-[10px] font-black uppercase text-amber-600 bg-amber-100 px-1.5 py-0.2 rounded">
                              Current
                            </span>)}
                          {isDeparture && (<span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                              Origin
                            </span>)}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 leading-snug">
                          {city.state} • Drop Points Available
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 group-hover/item:bg-amber-100 dark:group-hover/item:bg-amber-900/60 flex items-center justify-center shrink-0 transition-colors">
                        <Bus className="w-4 h-4 text-slate-400 group-hover/item:text-amber-600 dark:group-hover/item:text-amber-400"/>
                      </div>
                    </button>);
            })) : (<div className="p-5 text-center text-xs text-slate-500 font-semibold">
                  No cities found matching &ldquo;{destQuery}&rdquo;
                </div>)}
            </div>)}
        </div>

        {/* Tile 3: Departure Date / Return Date (Responsive Dual-Date if Round Trip) */}
        <div className="relative group z-20">
          {!isRoundTrip ? (<div onClick={handleDateClick} className="relative w-full min-h-[88px] sm:min-h-[92px] rounded-2xl bg-slate-50/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border-2 border-slate-200/90 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 px-4 py-3 transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between">
              <div className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pointer-events-none">
                <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-extrabold">
                  <Calendar className="w-3.5 h-3.5"/> Departure Date
                </span>
                <Calendar className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 transition-colors"/>
              </div>
              <div className="leading-tight my-0.5 pointer-events-none">
                <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {displayDate.date}
                </div>
                <div className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-0.5">
                  {displayDate.day}
                </div>
              </div>
              <input ref={dateInputRef} type="date" value={busCriteria.journeyDate} min={minDate} onChange={(e) => {
                if (e.target.value) {
                    setBusCriteria({ journeyDate: e.target.value });
                    toast.success(`Bus Date: ${e.target.value}`);
                }
            }} onClick={(e) => {
                try {
                    e.currentTarget.showPicker();
                }
                catch { }
            }} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" title="Click to change departure date"/>
            </div>) : (<div className="relative w-full min-h-[88px] sm:min-h-[92px] rounded-2xl bg-slate-50/70 dark:bg-slate-800/70 border-2 border-slate-200/90 dark:border-slate-700 px-3 py-2.5 shadow-xs flex flex-col justify-between">
              <div className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <span className="text-amber-600 dark:text-amber-400 font-extrabold flex items-center gap-1">
                  <Calendar className="w-3 h-3"/> Round Trip Bus Dates
                </span>
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950 px-1.5 py-0.2 rounded">
                  2-Way
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 items-center">
                <div onClick={handleDateClick} className="p-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors relative">
                  <span className="text-[9px] font-black uppercase text-amber-600 dark:text-amber-400 block">Outbound</span>
                  <div className="text-xs font-black text-slate-900 dark:text-white truncate">{displayDate.date}</div>
                  <input ref={dateInputRef} type="date" value={busCriteria.journeyDate} min={minDate} onChange={(e) => {
                if (e.target.value) {
                    setBusCriteria({ journeyDate: e.target.value });
                    toast.success(`Outbound: ${e.target.value}`);
                }
            }} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"/>
                </div>
                <div onClick={handleReturnDateClick} className="p-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-amber-200 dark:border-amber-800/60 cursor-pointer transition-colors relative">
                  <span className="text-[9px] font-black uppercase text-amber-600 dark:text-amber-400 block">Return</span>
                  <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                    {busCriteria.returnDate ? displayReturnDate.date : "+ Return"}
                  </div>
                  <input ref={returnDateInputRef} type="date" value={busCriteria.returnDate || ""} min={busCriteria.journeyDate || minDate} onChange={(e) => {
                if (e.target.value) {
                    setBusCriteria({ returnDate: e.target.value });
                    toast.success(`Return: ${e.target.value}`);
                }
            }} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"/>
                </div>
              </div>
            </div>)}
        </div>

        {/* Tile 4: Travelers / Seats Input & Stepper */}
        <div ref={travellerContainerRef} className={cn("relative group", isTravellerOpen ? "z-50" : "z-20")}>
          <button type="button" onClick={() => setIsTravellerOpen(!isTravellerOpen)} className={cn("w-full min-h-[88px] sm:min-h-[92px] rounded-2xl text-left px-4 py-3 transition-all cursor-pointer flex flex-col justify-between items-start border-2 shadow-xs", isTravellerOpen
            ? "bg-white dark:bg-slate-800 border-amber-500 ring-2 ring-amber-500/20 shadow-md"
            : "bg-slate-50/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md")}>
            <div className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-extrabold">
                <Users className="w-3.5 h-3.5"/> Seats &amp; Travelers
              </span>
              <span className="text-xs font-black text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                {busCriteria.passengerCount} {busCriteria.passengerCount === 1 ? "Seat" : "Seats"}
              </span>
            </div>
            <div className="w-full my-0.5">
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                {busCriteria.passengerCount} {busCriteria.passengerCount === 1 ? "Traveler" : "Travelers"}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-0.5 line-clamp-1">
                {busCriteria.passengerCount === 1 ? "1 Seat Reserved" : `${busCriteria.passengerCount} Seats Reserved`}
              </div>
            </div>
          </button>

          {isTravellerOpen && (<div className="absolute top-[calc(100%+8px)] right-0 w-full min-w-[300px] sm:min-w-[340px] max-w-[calc(100vw-2rem)] p-4 bg-white dark:bg-slate-900 border-2 border-amber-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-100">
              <div className="text-sm font-black text-slate-900 dark:text-white mb-1">
                Seats &amp; Passengers
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">
                Type seat count or select below (max 6 seats per booking)
              </p>

              {/* Stepper with typable Input */}
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 mb-3">
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  Total Seats
                </span>
                <div className="flex items-center gap-2">
                  <button type="button" disabled={busCriteria.passengerCount <= 1} onClick={() => {
                if (busCriteria.passengerCount > 1) {
                    setBusCriteria({ passengerCount: busCriteria.passengerCount - 1 });
                }
            }} className="w-9 h-9 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 disabled:opacity-40 font-black text-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer">
                    -
                  </button>
                  <input type="number" min={1} max={6} value={busCriteria.passengerCount} onChange={(e) => {
                const val = Math.max(1, Math.min(6, parseInt(e.target.value) || 1));
                setBusCriteria({ passengerCount: val });
            }} className="w-12 h-9 text-center font-black text-base bg-white dark:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-600 outline-none"/>
                  <button type="button" disabled={busCriteria.passengerCount >= 6} onClick={() => {
                if (busCriteria.passengerCount < 6) {
                    setBusCriteria({ passengerCount: busCriteria.passengerCount + 1 });
                }
            }} className="w-9 h-9 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 disabled:opacity-40 font-black text-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer">
                    +
                  </button>
                </div>
              </div>

              {/* Quick Select Number Pills */}
              <div className="grid grid-cols-6 gap-1.5 mb-3.5">
                {[1, 2, 3, 4, 5, 6].map((num) => (<button key={num} type="button" onClick={() => setBusCriteria({ passengerCount: num })} className={cn("h-9 rounded-lg text-xs font-black transition-all border cursor-pointer flex items-center justify-center", busCriteria.passengerCount === num
                    ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-slate-700")}>
                    {num}
                  </button>))}
              </div>

              <button type="button" onClick={() => setIsTravellerOpen(false)} className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-md shadow-amber-500/20">
                Apply Seats
              </button>
            </div>)}
        </div>

        {/* Tile 5: Submit Button */}
        <div className="z-20">
          <Button type="submit" className="w-full min-h-[88px] sm:min-h-[92px] rounded-2xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-sm shadow-xl shadow-amber-500/30 active:scale-95 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer tracking-wider" title="Search Buses">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 stroke-[2.5]"/>
              <span className="text-base font-black uppercase tracking-wider">Search Buses</span>
            </div>
            <span className="text-xs text-amber-100 font-normal">Select Live Seats</span>
          </Button>
        </div>

      </div>

      {/* Popular Bus Routes */}
      {!compact && <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-slate-600 dark:text-slate-300">Popular Bus Routes:</span>
        {[
                { label: "Bengaluru → Chennai (Volvo)", from: "city-blr", to: "city-che" },
                { label: "Mumbai → Pune (Expressway)", from: "city-bom", to: "city-pune" },
                { label: "Delhi → Manali (Snow Line)", from: "city-del", to: "city-mnl" },
                { label: "Bengaluru → Goa (Sleeper)", from: "city-blr", to: "city-goa" }
            ].map((item, idx) => (<button key={idx} type="button" onClick={() => {
                    setBusCriteria({ originCityId: item.from, destinationCityId: item.to });
                    const fromCity = cities.find((c) => c.id === item.from);
                    const toCity = cities.find((c) => c.id === item.to);
                    if (fromCity)
                        setOriginQuery(fromCity.name);
                    if (toCity)
                        setDestQuery(toCity.name);
                    setHasSearched(true);
                    toast.info(`Selected ${item.label}`);
                }} className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 hover:text-amber-700 dark:hover:text-amber-400 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer font-medium">
            {item.label}
          </button>))}
      </div>}
    </form>);
}
