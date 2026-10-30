import React, { useState } from "react";
import { Compass, ArrowRight, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { destinations } from "@/lib/services/route-service";
import { useSearchStore } from "@/store/search-store";
import { toast } from "sonner";
import { useGoToResults } from "@/lib/hooks/use-go-to-results";
export function DestinationCards() {
    const { prefillSearch } = useSearchStore();
    const goToResults = useGoToResults();
    const [selectedRegion, setSelectedRegion] = useState("All");
    const regions = ["All", "North", "South", "West", "East", "International"];
    const filteredDestinations = selectedRegion === "All"
        ? destinations
        : destinations.filter((d) => d.region === selectedRegion);
    const handleDestinationClick = (dest) => {
        if (dest.searchPrefill) {
            prefillSearch(dest.searchPrefill.transportMode, dest.searchPrefill.originId, dest.searchPrefill.destinationId);
            toast.info(`Exploring journeys to ${dest.city} (${dest.state})`);
            goToResults();
        }
    };
    return (<section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4"/>
            <span>Discover Bharat &amp; Beyond</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Trending Travel Destinations
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Immerse in ancient temple towns, snow summits, golden shores, and
            bustling metros.
          </p>
        </div>

        {/* Region filter pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          {regions.map((reg) => (<button key={reg} onClick={() => setSelectedRegion(reg)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${selectedRegion === reg
                ? "bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}`}>
              {reg}
            </button>))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
        {filteredDestinations.slice(0, 8).map((dest) => (<Card key={dest.id} onClick={() => handleDestinationClick(dest)} className="group overflow-hidden rounded-2xl border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all cursor-pointer bg-white dark:bg-slate-900">
            <div className="relative h-48 w-full overflow-hidden">
              <img src={dest.imageUrl} alt={dest.city} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"/>

              <Badge className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white font-bold text-[10px] shadow-sm border-none backdrop-blur">
                {dest.tag}
              </Badge>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-extrabold text-lg leading-tight">
                  {dest.city}
                </h3>
                <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-amber-400"/>
                  <span>{dest.state}</span>
                </p>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {dest.description}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                <span>View Journeys</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
              </div>
            </div>
          </Card>))}
      </div>
    </section>);
}
