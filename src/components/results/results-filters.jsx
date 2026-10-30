"use client";
import React from "react";
import { Filter, RotateCcw, Sun, Sunset, Moon, Sunrise } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useSearchStore } from "@/store/search-store";
export function ResultsFilters() {
    const { activeMode, filters, setFilters, resetFilters } = useSearchStore();
    const toggleTime = (timeBucket) => {
        const current = filters.timeOfDay || [];
        if (current.includes(timeBucket)) {
            setFilters({ timeOfDay: current.filter((t) => t !== timeBucket) });
        }
        else {
            setFilters({ timeOfDay: [...current, timeBucket] });
        }
    };
    const toggleCategory = (cat) => {
        const current = filters.categories || [];
        if (current.includes(cat)) {
            setFilters({ categories: current.filter((c) => c !== cat) });
        }
        else {
            setFilters({ categories: [...current, cat] });
        }
    };
    const toggleClass = (cls) => {
        const current = filters.classes || [];
        if (current.includes(cls)) {
            setFilters({ classes: current.filter((c) => c !== cls) });
        }
        else {
            setFilters({ classes: [...current, cls] });
        }
    };
    return (<Card className="border border-border/80 bg-card text-card-foreground rounded-xl p-5 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2 font-bold text-foreground text-sm">
          <Filter className="w-4 h-4 text-primary"/>
          <span>Filter Results</span>
        </div>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1 px-2">
          <RotateCcw className="w-3 h-3"/> Reset
        </Button>
      </div>

      {/* Departure Time */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
          Departure Time
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { id: "morning", label: "05:00 - 12:00", name: "Morning", icon: Sunrise },
            { id: "afternoon", label: "12:00 - 17:00", name: "Afternoon", icon: Sun },
            { id: "evening", label: "17:00 - 22:00", name: "Evening", icon: Sunset },
            { id: "night", label: "22:00 - 05:00", name: "Night", icon: Moon }
        ].map((item) => {
            const isSelected = (filters.timeOfDay || []).includes(item.id);
            const Icon = item.icon;
            return (<button key={item.id} type="button" onClick={() => toggleTime(item.id)} className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all cursor-pointer ${isSelected
                    ? "border-2 border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-border/80 bg-muted/30 hover:bg-muted/70 text-muted-foreground hover:text-foreground"}`}>
                <Icon className="w-4 h-4 mb-1 text-muted-foreground"/>
                <span className="font-semibold text-xs text-foreground">{item.name}</span>
                <span className="text-[10px] text-muted-foreground font-normal">{item.label}</span>
              </button>);
        })}
        </div>
      </div>

      <Separator />

      {/* Mode Specific Filters */}
      {activeMode === "train" && (<>
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Train Type
            </label>
            <div className="flex flex-wrap gap-1.5">
              {["Vande Bharat", "Rajdhani", "Shatabdi", "Duronto", "Intercity Express", "Mail and Express"].map((cat) => {
                const isSelected = (filters.categories || []).includes(cat);
                return (<Badge key={cat} variant={isSelected ? "default" : "outline"} onClick={() => toggleCategory(cat)} className={`cursor-pointer px-2.5 py-1 text-xs rounded-md transition-all ${isSelected
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground border-border/80 hover:bg-muted"}`}>
                      {cat}
                    </Badge>);
            })}
            </div>
          </div>

          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Travel Class
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {["CC", "EC", "3A", "2A", "1A", "SL"].map((cls) => {
                const isSelected = (filters.classes || []).includes(cls);
                return (<button key={cls} type="button" onClick={() => toggleClass(cls)} className={`py-1.5 px-2 rounded-md text-xs font-semibold border transition-all cursor-pointer ${isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-muted/30 text-muted-foreground hover:text-foreground border-border/80 hover:bg-muted"}`}>
                    {cls}
                  </button>);
            })}
            </div>
          </div>
        </>)}

      {activeMode === "flight" && (<div className="space-y-2.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            Stops
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button type="button" onClick={() => {
                const current = filters.stops || [];
                const updated = current.includes(0) ? current.filter((s) => s !== 0) : [...current, 0];
                setFilters({ stops: updated });
            }} className={`p-2.5 rounded-lg border font-semibold text-center cursor-pointer transition-all ${(filters.stops || []).includes(0)
                ? "border-2 border-primary bg-primary/10 text-primary shadow-xs"
                : "border-border/80 bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
              Non-Stop Only
            </button>
            <button type="button" onClick={() => {
                const current = filters.stops || [];
                const updated = current.includes(1) ? current.filter((s) => s !== 1) : [...current, 1];
                setFilters({ stops: updated });
            }} className={`p-2.5 rounded-lg border font-semibold text-center cursor-pointer transition-all ${(filters.stops || []).includes(1)
                ? "border-2 border-primary bg-primary/10 text-primary shadow-xs"
                : "border-border/80 bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
              1 Stop
            </button>
          </div>
        </div>)}

      {activeMode === "bus" && (<div className="space-y-2.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            Bus Features
          </label>
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-foreground select-none">
              <Checkbox checked={filters.acOnly || false} onCheckedChange={(checked) => setFilters({ acOnly: Boolean(checked) })}/>
              <span>Air Conditioned (AC) Only</span>
            </label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {["SLEEPER", "SEMI_SLEEPER", "SEATER"].map((type) => {
                const isSelected = (filters.categories || []).includes(type);
                return (<Badge key={type} variant={isSelected ? "default" : "outline"} onClick={() => toggleCategory(type)} className={`cursor-pointer text-xs rounded-md ${isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "text-muted-foreground hover:text-foreground border-border/80 hover:bg-muted"}`}>
                    {type.replace("_", " ")}
                  </Badge>);
            })}
            </div>
          </div>
        </div>)}
    </Card>);
}
