"use client";
import React from "react";
import { Check } from "lucide-react";
export function BookingStepper({ currentStep, hasSeatsStep }) {
    const steps = hasSeatsStep
        ? [
            { id: "seats", label: "Seats & Options" },
            { id: "passengers", label: "Travelers" },
            { id: "review", label: "Review & Pay" },
            { id: "confirmation", label: "Confirmation" }
        ]
        : [
            { id: "passengers", label: "Travelers" },
            { id: "review", label: "Review & Pay" },
            { id: "confirmation", label: "Confirmation" }
        ];
    const currentIdx = steps.findIndex((s) => s.id === currentStep);
    return (<div className="w-full py-2">
      <div className="flex items-center justify-between max-w-lg mx-auto relative">
        {/* Connecting bar */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-slate-200 dark:bg-slate-700 -z-0"/>
        
        {steps.map((step, idx) => {
            const isDone = idx < currentIdx;
            const isActive = idx === currentIdx;
            return (<div key={step.id} className="relative z-10 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${isDone
                    ? "bg-emerald-600 text-white shadow-sm"
                    : isActive
                        ? "bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-900/50 shadow-md scale-110"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
                {isDone ? <Check className="w-4 h-4 stroke-[3]"/> : idx + 1}
              </div>
              <span className={`text-[11px] font-bold mt-1.5 whitespace-nowrap ${isActive ? "text-indigo-700 dark:text-indigo-400" : isDone ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-500"}`}>
                {step.label}
              </span>
            </div>);
        })}
      </div>
    </div>);
}
