"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TransportTabs } from "./transport-tabs";
import { TrainSearchForm } from "./train-search-form";
import { FlightSearchForm } from "./flight-search-form";
import { BusSearchForm } from "./bus-search-form";
import { useSearchStore } from "@/store/search-store";
import { cn } from "cn";
export function UnifiedSearchPanel({ compact = false }) {
    const { activeMode } = useSearchStore();
    return (<Card className={cn("w-full border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors relative z-20 overflow-visible", compact
            ? "shadow-md rounded-2xl"
            : "shadow-2xl shadow-indigo-950/10 dark:shadow-black/50 rounded-3xl")}>
      <TransportTabs compact={compact}/>
      <CardContent className={cn("overflow-visible", compact ? "p-3 sm:p-4" : "p-4 sm:p-6 lg:p-8")}>
        {activeMode === "train" && <TrainSearchForm compact={compact}/>}
        {activeMode === "flight" && <FlightSearchForm compact={compact}/>}
        {activeMode === "bus" && <BusSearchForm compact={compact}/>}
      </CardContent>
    </Card>);
}
