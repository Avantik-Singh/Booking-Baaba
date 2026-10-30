"use client";
import React from "react";
import { Train, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/store/booking-store";
export function TrainBerthMap({ layout, maxSeats }) {
    const { selectedSeatIds, toggleSeatSelection, autoSelectSeats } = useBookingStore();
    const isChairCar = layout.coachType === "CC" || layout.coachType === "EC";
    return (<div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"/>
          <span className="text-slate-600 dark:text-slate-400">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded border border-indigo-600 bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
            ✓
          </div>
          <span className="text-slate-900 dark:text-white font-semibold">
            Selected
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded border border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center text-[10px]">
            ✕
          </div>
          <span className="text-slate-400 dark:text-slate-500">Occupied</span>
        </div>
        {!isChairCar && (<div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>LB = Lower</span> • <span>MB = Middle</span> •{" "}
            <span>UB = Upper</span> • <span>SL/SU = Side</span>
          </div>)}
      </div>

      {/* Auto-Select Toolbar */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Selected:{" "}
          <strong className="text-indigo-600 dark:text-indigo-400">
            {selectedSeatIds.length}
          </strong>{" "}
          of {maxSeats} berth{maxSeats > 1 ? "s" : ""}
        </span>
        <Button type="button" variant="outline" size="sm" onClick={autoSelectSeats} className="h-8 text-xs font-bold gap-1 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500"/> Auto-Pick{" "}
          {maxSeats} Berth{maxSeats > 1 ? "s" : ""}
        </Button>
      </div>

      {/* Railway Coach Container */}
      <div className="max-w-xl mx-auto bg-slate-100/90 dark:bg-slate-900/80 border-2 border-slate-300 dark:border-slate-700 rounded-2xl p-5 shadow-inner">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Train className="w-4 h-4"/>
            <span>
              Coach {layout.coachType || "B1"} • {layout.name}
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Indian Railways Coach
          </span>
        </div>

        {/* Seat / Berth Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {layout.seats.map((seat) => {
            const isSelected = selectedSeatIds.includes(seat.id);
            const isOccupied = seat.status === "occupied";
            return (<button key={seat.id} type="button" disabled={isOccupied} onClick={() => toggleSeatSelection(seat, maxSeats)} className={`p-3 rounded-xl border flex flex-col items-center justify-between min-h-[64px] transition-all cursor-pointer ${isOccupied
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border-slate-200 dark:border-slate-800"
                    : isSelected
                        ? "bg-indigo-600 text-white border-2 border-indigo-700 shadow-md scale-105"
                        : "bg-white dark:bg-slate-800 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 text-slate-800 dark:text-white border-slate-300 dark:border-slate-600 shadow-sm"}`}>
                <div className="flex items-center justify-between w-full">
                  <span className="font-black text-sm">{seat.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0"/>}
                </div>

                <div className="text-[10px] uppercase font-bold tracking-tight opacity-80 mt-1 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                  {seat.type.replace("_", " ")}
                </div>
              </button>);
        })}
        </div>
        <div className="mt-4 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
          Exit Vestibule &amp; Washrooms
        </div>
      </div>
    </div>);
}
