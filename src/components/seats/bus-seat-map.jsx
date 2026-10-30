"use client";
import React, { useState } from "react";
import { Check, Disc, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/store/booking-store";
import { formatCurrency } from "@/lib/utils/format-currency";
export function BusSeatMap({ layout, maxSeats }) {
    const { selectedSeatIds, toggleSeatSelection, autoSelectSeats } = useBookingStore();
    const [activeDeck, setActiveDeck] = useState("lower");
    const hasDecks = (layout.decks || 1) > 1;
    // Filter seats based on activeDeck if multi-deck
    const displayedSeats = hasDecks
        ? layout.seats.filter((s) => (s.deck || "lower") === activeDeck)
        : layout.seats;
    // Group by rows
    const rowNumbers = Array.from(new Set(displayedSeats.map((s) => s.row))).sort((a, b) => a - b);
    return (<div className="space-y-6">
      {/* Legend & Deck Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"/>
            <span className="text-slate-600 dark:text-slate-400">
              Available
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded border border-amber-500 bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold">
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
            <div className="w-5 h-5 rounded border-2 border-pink-400 bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-300 flex items-center justify-center text-[10px] font-bold">
              ♀
            </div>
            <span className="text-pink-700 dark:text-pink-300 font-semibold">
              Ladies Only
            </span>
          </div>
        </div>

        {hasDecks && (<div className="flex items-center p-1 bg-slate-200 dark:bg-slate-800 rounded-lg">
            <button type="button" onClick={() => setActiveDeck("lower")} className={`px-3 py-1 rounded-md font-bold text-xs transition-colors cursor-pointer ${activeDeck === "lower"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400"}`}>
              Lower Deck
            </button>
            <button type="button" onClick={() => setActiveDeck("upper")} className={`px-3 py-1 rounded-md font-bold text-xs transition-colors cursor-pointer ${activeDeck === "upper"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400"}`}>
              Upper Deck
            </button>
          </div>)}
      </div>

      {/* Auto-Select Toolbar */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Selected:{" "}
          <strong className="text-amber-600 dark:text-amber-400">
            {selectedSeatIds.length}
          </strong>{" "}
          of {maxSeats} seat{maxSeats > 1 ? "s" : ""}
        </span>
        <Button type="button" variant="outline" size="sm" onClick={autoSelectSeats} className="h-8 text-xs font-bold gap-1 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer">
          <Sparkles className="w-3.5 h-3.5 text-amber-500"/> Auto-Pick{" "}
          {maxSeats} Seat{maxSeats > 1 ? "s" : ""}
        </Button>
      </div>

      {/* Bus Cabin Frame */}
      <div className="max-w-sm sm:max-w-md mx-auto bg-slate-100/90 dark:bg-slate-900/80 border-2 border-slate-300 dark:border-slate-700 rounded-3xl p-5 shadow-inner">
        {/* Front Cabin & Driver Wheel */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
            Entry Door
          </span>
          <div className="flex items-center gap-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg text-xs font-bold">
            <Disc className="w-4 h-4 animate-spin-slow"/>
            <span>Driver</span>
          </div>
        </div>

        {/* Seats Container */}
        <div className="space-y-3">
          {rowNumbers.map((rowNum) => {
            const seatsInRow = displayedSeats.filter((s) => s.row === rowNum);
            const isSleeper = seatsInRow.some((s) => s.type === "sleeper_berth");
            return (<div key={rowNum} className="flex items-center justify-between gap-2">
                {seatsInRow.map((seat) => {
                    const isSelected = selectedSeatIds.includes(seat.id);
                    const isOccupied = seat.status === "occupied";
                    const isLadiesSeat = Boolean(seat.isFemaleOnly ||
                        seat.features?.includes("ladies_only") ||
                        ["3", "4", "7", "8", "L3", "L4"].includes(seat.label));
                    return (<button key={seat.id} type="button" disabled={isOccupied} onClick={() => toggleSeatSelection(seat, maxSeats)} title={`${seat.label} (${seat.type})${isLadiesSeat ? " - Reserved for Ladies" : ""} - ${seat.price ? formatCurrency(seat.price) : "Standard"}`} className={`relative flex flex-col items-center justify-center font-bold text-xs transition-all cursor-pointer ${isSleeper
                            ? "h-14 flex-1 rounded-xl"
                            : "w-10 h-10 rounded-xl"} ${isOccupied
                            ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-800"
                            : isSelected
                                ? "bg-amber-500 text-white border-2 border-amber-600 shadow-md scale-105"
                                : isLadiesSeat
                                    ? "bg-pink-50/80 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border-2 border-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/60 shadow-sm"
                                    : "bg-white dark:bg-slate-800 hover:bg-amber-50/50 dark:hover:bg-amber-950/40 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 shadow-sm"}`}>
                      <span>{seat.label}</span>
                      {isLadiesSeat && !isSelected && !isOccupied && (<span className="text-[9px] font-black text-pink-600 dark:text-pink-400 leading-none">
                          ♀
                        </span>)}
                      {isSelected && <Check className="w-3 h-3 stroke-[3]"/>}
                    </button>);
                })}
              </div>);
        })}
        </div>

        {/* Rear of Bus */}
        <div className="mt-6 pt-3 border-t border-slate-200 dark:border-slate-800 text-center text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">
          Rear Windshield
        </div>
      </div>
    </div>);
}
