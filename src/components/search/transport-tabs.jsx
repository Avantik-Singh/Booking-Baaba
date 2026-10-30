"use client";
import React from "react";
import { Train, Plane, Bus } from "lucide-react";
import { useSearchStore } from "@/store/search-store";
import { toast } from "sonner";
export function TransportTabs({ compact = false }) {
    const { activeMode, setActiveMode } = useSearchStore();
    const tabs = [
        {
            id: "train",
            label: "Trains",
            icon: Train,
            badge: "Vande Bharat & Express",
            activeText: "text-indigo-700",
            activeBorder: "border-indigo-600",
            activeBg: "bg-indigo-600"
        },
        {
            id: "flight",
            label: "Flights",
            icon: Plane,
            badge: "Domestic & Int'l",
            activeText: "text-sky-700",
            activeBorder: "border-sky-600",
            activeBg: "bg-sky-600"
        },
        {
            id: "bus",
            label: "Buses",
            icon: Bus,
            badge: "Volvo & Sleepers",
            activeText: "text-amber-700",
            activeBorder: "border-amber-500",
            activeBg: "bg-amber-500"
        }
    ];
    return (<div className={`flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 overflow-x-auto scrollbar-none transition-colors ${compact ? "px-3 sm:px-4 pt-2 rounded-t-2xl" : "px-4 sm:px-6 pt-4 rounded-t-3xl"}`}>
      {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeMode === tab.id;
            return (<button key={tab.id} type="button" onClick={() => {
                    setActiveMode(tab.id);
                    toast.info(`Switched to ${tab.label}`);
                }} className={`relative flex items-center rounded-t-2xl font-bold transition-all whitespace-nowrap cursor-pointer select-none ${compact ? "gap-2 px-3 py-2 text-xs" : "gap-3 px-5 py-3.5 text-sm"} ${isActive
                    ? `bg-white dark:bg-slate-900 ${tab.activeText} dark:text-white shadow-sm border-t-2 ${tab.activeBorder}`
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60"}`}>
            <div className={`rounded-lg flex items-center justify-center transition-colors ${compact ? "w-6 h-6" : "w-7 h-7"} ${isActive ? `${tab.activeBg} text-white` : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
              <Icon className={compact ? "w-3.5 h-3.5" : "w-4 h-4"}/>
            </div>
            
            <div className="text-left">
              <div className="leading-tight">{tab.label}</div>
              {!compact && (<div className="text-[10px] font-normal text-slate-500 dark:text-slate-400 leading-none mt-0.5">{tab.badge}</div>)}
            </div>

            {isActive && (<div className="absolute -bottom-px left-0 right-0 h-1 bg-white dark:bg-slate-900"/>)}
          </button>);
        })}
    </div>);
}
