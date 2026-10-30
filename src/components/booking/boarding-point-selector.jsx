"use client";
import React from "react";
import { MapPin, Navigation } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useBookingStore } from "@/store/booking-store";
export function BoardingPointSelector({ boardingPoints, droppingPoints, }) {
    const { boardingPointId, setBoardingPoint, droppingPointId, setDroppingPoint, } = useBookingStore();
    return (<div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800 rounded-2xl">
      {/* Boarding Points */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400"/>
          <span>Select Boarding Point</span>
        </div>
        <RadioGroup value={boardingPointId} onValueChange={setBoardingPoint} className="space-y-2">
          {boardingPoints.map((bp) => (<div key={bp.id} onClick={() => setBoardingPoint(bp.id)} className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${boardingPointId === bp.id
                ? "border-emerald-600 bg-white dark:bg-slate-800 ring-1 ring-emerald-600 shadow-sm"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
              <RadioGroupItem value={bp.id} id={bp.id} className="mt-0.5 text-emerald-600 dark:text-emerald-400"/>
              <div className="flex-1">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span>{bp.name}</span>
                  <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded font-black">
                    {bp.departureTime}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {bp.address}
                </p>
              </div>
            </div>))}
        </RadioGroup>
      </div>

      {/* Dropping Points */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
          <Navigation className="w-4 h-4 text-amber-600 dark:text-amber-400"/>
          <span>Select Dropping Point</span>
        </div>
        <RadioGroup value={droppingPointId} onValueChange={setDroppingPoint} className="space-y-2">
          {droppingPoints.map((dp) => (<div key={dp.id} onClick={() => setDroppingPoint(dp.id)} className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${droppingPointId === dp.id
                ? "border-amber-600 bg-white dark:bg-slate-800 ring-1 ring-amber-600 shadow-sm"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
              <RadioGroupItem value={dp.id} id={dp.id} className="mt-0.5 text-amber-600 dark:text-amber-400"/>
              <div className="flex-1">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span>{dp.name}</span>
                  <span className="text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded font-black">
                    {dp.arrivalTime}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {dp.address}
                </p>
              </div>
            </div>))}
        </RadioGroup>
      </div>
    </div>);
}
