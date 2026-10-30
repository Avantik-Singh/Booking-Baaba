"use client";
import React, { useState } from "react";
import { Train as TrainIcon, Clock, ArrowRight, Sparkles, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getStationById } from "@/lib/services/route-service";
import { formatCurrency, formatDuration } from "@/lib/utils/format-currency";
import { useBookingStore } from "@/store/booking-store";
import { useSearchStore } from "@/store/search-store";
export function TrainResultCard({ train }) {
    const { trainCriteria } = useSearchStore();
    const { startBooking } = useBookingStore();
    // Select first available class by default
    const [selectedClass, setSelectedClass] = useState(train.classes[0] || null);
    const originStation = getStationById(train.originStationId);
    const destStation = getStationById(train.destinationStationId);
    const handleBook = () => {
        if (!selectedClass)
            return;
        startBooking({
            transportMode: "train",
            service: train,
            selectedClassOrFamily: selectedClass.classCode,
            baseFare: selectedClass.fare,
            seatLayoutId: selectedClass.seatLayoutId,
            passengerCount: trainCriteria.passengerCount
        });
    };
    const getCategoryBadgeClass = (category) => {
        switch (category) {
            case "Vande Bharat":
                return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300/50 font-bold";
            case "Rajdhani":
                return "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-300/50 font-bold";
            case "Shatabdi":
                return "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-300/50 font-bold";
            default:
                return "bg-muted text-muted-foreground border-border";
        }
    };
    return (<Card className="border border-border/80 bg-card text-card-foreground rounded-xl shadow-xs hover:shadow-md transition-all duration-200">
      <CardContent className="p-5 sm:p-6 space-y-5">
        
        {/* Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border border-border/70 bg-muted/40 flex items-center justify-center text-primary font-bold shrink-0">
              <TrainIcon className="w-5 h-5 text-primary"/>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-base text-foreground leading-tight">
                  {train.trainName}
                </h3>
                <Badge variant="outline" className="font-mono text-xs px-2 py-0.5 text-muted-foreground border-border/80">
                  #{train.trainNumber}
                </Badge>
                <Badge variant="secondary" className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium">
                  Runs Daily
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Superfast Express • Pantry Onboard • Bio-Toilets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {trainCriteria.quota && trainCriteria.quota !== "GN" && (<Badge variant="secondary" className="text-xs px-2.5 py-1 font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-300/50">
                {trainCriteria.quota === "TQ" ? "⚡ Tatkal" : trainCriteria.quota === "LD" ? "👩 Ladies" : trainCriteria.quota === "SS" ? "🧓 Senior Citizen" : "🎓 Student"}
              </Badge>)}
            <Badge variant="outline" className={`text-xs px-2.5 py-1 ${getCategoryBadgeClass(train.category)}`}>
              {train.category === "Vande Bharat" && <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500"/>}
              {train.category}
            </Badge>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          
          {/* Departure */}
          <div className="sm:col-span-4">
            <div className="text-2xl font-black font-mono tracking-tight text-foreground">{train.departureTime}</div>
            <div className="font-semibold text-sm text-foreground mt-0.5">{originStation?.city || "Departure"}</div>
            <div className="text-xs text-muted-foreground leading-snug">{originStation?.name} [{originStation?.code}]</div>
          </div>

          {/* Duration Line */}
          <div className="sm:col-span-4 flex flex-col items-center justify-center px-2">
            <span className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-muted-foreground"/> {formatDuration(train.durationMinutes)}
            </span>
            <div className="w-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full border border-primary bg-background shrink-0"/>
              <div className="flex-1 border-t border-dashed border-border relative">
                <div className="absolute left-1/2 -top-2.5 -translate-x-1/2 px-1.5 bg-card text-[11px] text-muted-foreground font-medium">
                  Non-Stop
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-primary shrink-0"/>
            </div>
            <span className="text-[11px] text-muted-foreground font-medium mt-1">Superfast Route</span>
          </div>

          {/* Arrival */}
          <div className="sm:col-span-4 sm:text-right">
            <div className="text-2xl font-black font-mono tracking-tight text-foreground">{train.arrivalTime}</div>
            <div className="font-semibold text-sm text-foreground mt-0.5">{destStation?.city || "Arrival"}</div>
            <div className="text-xs text-muted-foreground leading-snug">{destStation?.name} [{destStation?.code}]</div>
          </div>

        </div>

        {/* Classes & Fares Grid (shadcn segmented cards) */}
        <div className="pt-1">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Select Travel Class &amp; Berth</span>
            <span className="text-[11px] text-primary hover:underline cursor-pointer lowercase">Free Cancellation Available</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {train.classes.map((cls) => {
            const isSelected = selectedClass?.classCode === cls.classCode;
            const isAvailable = cls.status === "AVAILABLE";
            return (<div key={cls.classCode} onClick={() => setSelectedClass(cls)} className={`relative p-3 rounded-lg border text-left cursor-pointer transition-all ${isSelected
                    ? "border-2 border-primary bg-primary/5 shadow-xs"
                    : "border-border/80 bg-card hover:bg-muted/40 hover:border-primary/40"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-foreground">{cls.classCode}</span>
                    <span className="font-extrabold text-sm text-primary">{formatCurrency(cls.fare)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate mb-1.5">{cls.className}</div>
                  
                  <div className="flex items-center gap-1 text-[11px] font-semibold">
                    {isAvailable ? (<span className="text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                        AVL {cls.availableCount || 12}
                      </span>) : cls.status === "RAC" ? (<span className="text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                        RAC {cls.availableCount || 4}
                      </span>) : (<span className="text-rose-700 dark:text-rose-300 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded">
                        WL {cls.availableCount || 2}
                      </span>)}
                  </div>

                  {isSelected && (<div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="w-2.5 h-2.5"/>
                    </div>)}
                </div>);
        })}
          </div>
        </div>

        {/* Footer Amenities and CTA */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Included:</span>
            {train.amenities.slice(0, 3).map((amenity, idx) => (<Badge key={idx} variant="outline" className="text-xs font-normal text-muted-foreground border-border/70 bg-muted/20">
                {amenity}
              </Badge>))}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right">
              <span className="text-[11px] text-muted-foreground block">
                Total for {trainCriteria.passengerCount} traveler{trainCriteria.passengerCount > 1 ? "s" : ""}
              </span>
              <span className="font-black text-lg text-foreground">
                {formatCurrency((selectedClass?.fare || 0) * trainCriteria.passengerCount)}
              </span>
            </div>
            <Button onClick={handleBook} className="h-10 px-5 rounded-lg font-semibold text-xs tracking-wide shadow-xs active:scale-95 transition-all cursor-pointer">
              Select Berth <ArrowRight className="w-3.5 h-3.5 ml-1.5"/>
            </Button>
          </div>
        </div>

      </CardContent>
    </Card>);
}
