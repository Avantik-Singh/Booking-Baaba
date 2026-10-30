"use client";
import React from "react";
import { Train, Plane, Bus, ArrowRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSearchStore } from "@/store/search-store";
import { toast } from "sonner";
import { useGoToResults } from "@/lib/hooks/use-go-to-results";
export function PopularRoutes() {
    const { prefillSearch } = useSearchStore();
    const goToResults = useGoToResults();
    const routes = [
        {
            id: "pr-1",
            mode: "train",
            fromName: "New Delhi",
            toName: "Varanasi",
            fromId: "station-ndls",
            toId: "station-bsb",
            tag: "Vande Bharat Express",
            priceFrom: "₹1,750",
            duration: "8h",
        },
        {
            id: "pr-2",
            mode: "flight",
            fromName: "Delhi (DEL)",
            toName: "Bengaluru (BLR)",
            fromId: "airport-del",
            toId: "airport-blr",
            tag: "Direct Air Corridor",
            priceFrom: "₹5,499",
            duration: "2h 45m",
        },
        {
            id: "pr-3",
            mode: "bus",
            fromName: "Bengaluru",
            toName: "Chennai",
            fromId: "city-blr",
            toId: "city-che",
            tag: "Airavat Volvo Multi-Axle",
            priceFrom: "₹750",
            duration: "6h",
        },
        {
            id: "pr-4",
            mode: "train",
            fromName: "New Delhi",
            toName: "Mumbai Central",
            fromId: "station-ndls",
            toId: "station-mmct",
            tag: "Tejas Rajdhani Express",
            priceFrom: "₹2,420",
            duration: "15h 40m",
        },
        {
            id: "pr-5",
            mode: "bus",
            fromName: "Mumbai",
            toName: "Pune",
            fromId: "city-bom",
            toId: "city-pune",
            tag: "Expressway Luxury Liner",
            priceFrom: "₹420",
            duration: "3h 15m",
        },
        {
            id: "pr-6",
            mode: "flight",
            fromName: "Mumbai (BOM)",
            toName: "Goa (GOI)",
            fromId: "airport-bom",
            toId: "airport-goi",
            tag: "Coastal Jet Hop",
            priceFrom: "₹3,100",
            duration: "1h 15m",
        },
    ];
    const handleRouteClick = (item) => {
        prefillSearch(item.mode, item.fromId, item.toId);
        toast.info(`Switched to ${item.mode.toUpperCase()}: ${item.fromName} → ${item.toName}`);
        goToResults();
    };
    return (<section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4"/>
            <span>High Demand Corridors</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Popular Routes Across Bharat
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            One-click search for India&apos;s most booked railway routes,
            express highways, and air corridors.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5">
        {routes.map((item) => (<Card key={item.id} onClick={() => handleRouteClick(item)} className="border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/5 transition-all cursor-pointer bg-white dark:bg-slate-900 group">
            <div className="flex items-start justify-between pb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${item.mode === "train"
                ? "bg-indigo-600"
                : item.mode === "flight"
                    ? "bg-sky-600"
                    : "bg-amber-500"}`}>
                  {item.mode === "train" && <Train className="w-4 h-4"/>}
                  {item.mode === "flight" && <Plane className="w-4 h-4"/>}
                  {item.mode === "bus" && <Bus className="w-4 h-4"/>}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {item.mode}
                </span>
              </div>

              <Badge variant="outline" className="text-[10px] font-bold border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {item.duration}
              </Badge>
            </div>

            <div className="my-2">
              <div className="flex items-center gap-2 text-base font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                <span>{item.fromName}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform"/>
                <span>{item.toName}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {item.tag}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">From</span>
              <span className="font-extrabold text-indigo-700 dark:text-indigo-400 text-sm">
                {item.priceFrom}
              </span>
            </div>
          </Card>))}
      </div>
    </section>);
}
