"use client";
import React from "react";
import { Plane, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/store/booking-store";
import { formatCurrency } from "@/lib/utils/format-currency";
export function FlightSeatMap({ layout, maxSeats }) {
    const { selectedSeatIds, toggleSeatSelection, autoSelectSeats } = useBookingStore();
    // Group seats by row.
    const rowNumbers = Array.from(new Set(layout.seats.map((s) => s.row))).sort((a, b) => a - b);
    return (<div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"/>
          <span className="text-slate-600 dark:text-slate-400">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded border border-sky-600 bg-sky-600 text-white flex items-center justify-center text-[10px] font-bold">
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
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40"/>
          <span className="text-amber-700 dark:text-amber-300">
            Extra Legroom
          </span>
        </div>
      </div>

      {/* Auto-Select Toolbar */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Selected:{" "}
          <strong className="text-sky-600 dark:text-sky-400">
            {selectedSeatIds.length}
          </strong>{" "}
          of {maxSeats} seat{maxSeats > 1 ? "s" : ""}
        </span>
        <Button type="button" variant="outline" size="sm" onClick={autoSelectSeats} className="h-8 text-xs font-bold gap-1 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800 hover:bg-sky-50 dark:hover:bg-sky-950/40 cursor-pointer">
          <Sparkles className="w-3.5 h-3.5 text-sky-500"/> Auto-Pick {maxSeats}{" "}
          Seat{maxSeats > 1 ? "s" : ""}
        </Button>
      </div>

      {/* Aircraft Fuselage Frame */}
      <div className="relative max-w-md mx-auto bg-slate-100/90 dark:bg-slate-900/80 border-2 border-slate-300/80 dark:border-slate-700 rounded-t-full rounded-b-3xl p-6 pt-12 shadow-inner">
        {/* Cockpit Indicator */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-16 h-8 bg-slate-300 dark:bg-slate-700 rounded-t-full flex items-center justify-center text-slate-500 dark:text-slate-400">
            <Plane className="w-4 h-4"/>
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mt-1">
            Cockpit / Front
          </span>
        </div>

        {/* Column Labels */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 dark:text-slate-500 mb-3 px-2">
          <span>A</span>
          <span>B</span>
          <span>C</span>
          <span className="text-[10px] uppercase font-normal">Aisle</span>
          <span>D</span>
          <span>E</span>
          <span>F</span>
        </div>

        {/* Seat Rows Grid */}
        <div className="space-y-2.5">
          {rowNumbers.map((rowNum) => {
            const seatsInRow = layout.seats.filter((s) => s.row === rowNum);
            const leftSeats = seatsInRow.filter((s) => s.column <= 3);
            const rightSeats = seatsInRow.filter((s) => s.column > 3);
            return (<div key={rowNum} className="flex items-center justify-between gap-1">
                {/* Left side (A, B, C) */}
                <div className="flex items-center gap-1.5">
                  {leftSeats.map((seat) => {
                    const isSelected = selectedSeatIds.includes(seat.id);
                    const isOccupied = seat.status === "occupied";
                    const isPremium = (seat.price || 0) > 0;
                    return (<button key={seat.id} type="button" disabled={isOccupied} onClick={() => toggleSeatSelection(seat, maxSeats)} title={`${seat.label} - ${seat.type} (${seat.price ? formatCurrency(seat.price) : "Free"})`} className={`relative w-8 h-9 rounded-lg flex flex-col items-center justify-center font-bold text-[11px] transition-all cursor-pointer ${isOccupied
                            ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-800"
                            : isSelected
                                ? "bg-sky-600 text-white border-2 border-sky-700 shadow-md scale-105"
                                : isPremium
                                    ? "bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-slate-800 dark:text-slate-200 border border-amber-300 dark:border-amber-700"
                                    : "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 shadow-sm"}`}>
                        <span>{seat.label.replace(String(rowNum), "")}</span>
                        {isSelected && (<Check className="w-2.5 h-2.5 stroke-[3]"/>)}
                      </button>);
                })}
                </div>

                {/* Aisle Number */}
                <div className="w-7 text-center font-bold text-xs text-slate-400 dark:text-slate-500">
                  {rowNum}
                </div>

                {/* Right side (D, E, F) */}
                <div className="flex items-center gap-1.5">
                  {rightSeats.map((seat) => {
                    const isSelected = selectedSeatIds.includes(seat.id);
                    const isOccupied = seat.status === "occupied";
                    const isPremium = (seat.price || 0) > 0;
                    return (<button key={seat.id} type="button" disabled={isOccupied} onClick={() => toggleSeatSelection(seat, maxSeats)} title={`${seat.label} - ${seat.type} (${seat.price ? formatCurrency(seat.price) : "Free"})`} className={`relative w-8 h-9 rounded-lg flex flex-col items-center justify-center font-bold text-[11px] transition-all cursor-pointer ${isOccupied
                            ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-800"
                            : isSelected
                                ? "bg-sky-600 text-white border-2 border-sky-700 shadow-md scale-105"
                                : isPremium
                                    ? "bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-slate-800 dark:text-slate-200 border border-amber-300 dark:border-amber-700"
                                    : "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 shadow-sm"}`}>
                        <span>{seat.label.replace(String(rowNum), "")}</span>
                        {isSelected && (<Check className="w-2.5 h-2.5 stroke-[3]"/>)}
                      </button>);
                })}
                </div>
              </div>);
        })}
        </div>

        {/* Galley / Rear */}
        <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Rear Galley &amp; Lavatories
          </span>
        </div>
      </div>
    </div>);
}
