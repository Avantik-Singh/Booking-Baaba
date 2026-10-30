"use client";
import React from "react";
import { Bus as BusIcon, Clock, ArrowRight, Snowflake, MapPin, Luggage, ShieldAlert, Info, } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { getCityById, getOperatorById } from "@/lib/services/route-service";
import { formatCurrency, formatDuration } from "@/lib/utils/format-currency";
import { useBookingStore } from "@/store/booking-store";
import { useSearchStore } from "@/store/search-store";
export function BusResultCard({ bus, journeyDate }) {
    const { busCriteria } = useSearchStore();
    const { startBooking } = useBookingStore();
    const originCity = getCityById(bus.originCityId);
    const destCity = getCityById(bus.destinationCityId);
    const operator = getOperatorById(bus.operatorId);
    const handleBook = () => {
        startBooking({
            transportMode: "bus",
            service: bus,
            selectedClassOrFamily: bus.busType.replace("_", " "),
            baseFare: bus.farePerSeat,
            seatLayoutId: bus.seatLayoutId,
            passengerCount: busCriteria.passengerCount,
            journeyDate: journeyDate || busCriteria.journeyDate,
        });
    };
    return (<Card className="border border-border/80 bg-card text-card-foreground rounded-xl shadow-xs hover:shadow-md transition-all duration-200">
      <CardContent className="p-5 sm:p-6 space-y-5">
        {/* Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border border-border/70 bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
              <BusIcon className="w-5 h-5"/>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-base text-foreground leading-tight">
                  {operator?.name || bus.serviceName}
                </h3>
                <Badge variant="outline" className="text-xs px-2 py-0.5 text-muted-foreground border-border/80">
                  {bus.busType.replace("_", " ")}
                </Badge>
                {bus.isAC && (<Badge variant="secondary" className="text-xs font-medium text-sky-700 dark:text-sky-300 bg-sky-500/10 border border-sky-500/20 flex items-center gap-1">
                    <Snowflake className="w-3 h-3 text-sky-500"/> AC Coach
                  </Badge>)}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {bus.serviceName} • Live GPS Tracking • Verified Operator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs px-2.5 py-1 text-muted-foreground border-border/80 bg-muted/20">
              ⭐ 4.8 / 5 Rating
            </Badge>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Departure */}
          <div className="sm:col-span-4">
            <div className="text-2xl font-black font-mono tracking-tight text-foreground">
              {bus.departureTime}
            </div>
            <div className="font-semibold text-sm text-foreground mt-0.5">
              {originCity?.name || "Departure"}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-muted-foreground"/>
              <span>{bus.boardingPoints.length} Boarding Points</span>
            </div>
          </div>

          {/* Duration Line */}
          <div className="sm:col-span-4 flex flex-col items-center justify-center px-2">
            <span className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-muted-foreground"/>{" "}
              {formatDuration(bus.durationMinutes)}
            </span>
            <div className="w-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full border border-primary bg-background shrink-0"/>
              <div className="flex-1 border-t border-dashed border-border relative">
                <div className="absolute left-1/2 -top-2.5 -translate-x-1/2 px-1.5 bg-card text-[11px] text-muted-foreground font-medium">
                  Expressway
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-primary shrink-0"/>
            </div>
            <span className="text-[11px] text-muted-foreground font-medium mt-1">
              Intercity Transit
            </span>
          </div>

          {/* Arrival */}
          <div className="sm:col-span-4 sm:text-right">
            <div className="text-2xl font-black font-mono tracking-tight text-foreground">
              {bus.arrivalTime}
            </div>

            <div className="font-semibold text-sm text-foreground mt-0.5">
              {destCity?.name || "Arrival"}
            </div>
            <div className="text-xs text-muted-foreground flex items-center sm:justify-end gap-1 mt-0.5">
              <span>{bus.droppingPoints.length} Dropping Points</span>
              <MapPin className="w-3 h-3 text-muted-foreground"/>
            </div>
          </div>
        </div>

        {/* Boarding and Amenities List */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-muted-foreground">Amenities:</span>
          {bus.amenities.map((amenity, idx) => (<Badge key={idx} variant="outline" className="text-xs font-normal text-muted-foreground border-border/70 bg-muted/20">
              {amenity}
            </Badge>))}
        </div>

        {/* Footer CTA */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
          <Dialog>
            <DialogTrigger className="text-xs text-muted-foreground hover:text-foreground text-left cursor-pointer transition-colors group flex items-center gap-1 bg-transparent border-0 p-0">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold underline underline-offset-2 group-hover:text-emerald-500">
                Free Cancellation
              </span>
              <span>• Luggage Policy</span>
              <Info className="w-3 h-3 text-muted-foreground"/>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base font-bold">
                  <Info className="w-4 h-4 text-primary"/>
                  <span>Cancellation &amp; Baggage Policy</span>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-xs pt-2">
                <div>
                  <h5 className="font-bold text-foreground mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-emerald-600"/>
                    <span>Cancellation Refund Schedule</span>
                  </h5>
                  <div className="rounded-lg border border-border divide-y divide-border/60 overflow-hidden">
                    <div className="flex justify-between p-2.5 bg-muted/40 font-semibold text-[11px]">
                      <span>Time Before Departure</span>
                      <span>Refund Amount</span>
                    </div>
                    <div className="flex justify-between p-2.5">
                      <span className="text-muted-foreground">&gt; 24 hours</span>
                      <span className="font-bold text-emerald-600">100% Refund</span>
                    </div>
                    <div className="flex justify-between p-2.5">
                      <span className="text-muted-foreground">12 to 24 hours</span>
                      <span className="font-bold text-amber-600">70% Refund</span>
                    </div>
                    <div className="flex justify-between p-2.5">
                      <span className="text-muted-foreground">0 to 12 hours</span>
                      <span className="font-bold text-rose-600">50% Refund</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-muted/20">
                      <span className="text-muted-foreground">Post Departure</span>
                      <span className="font-bold text-rose-700">Non-refundable</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border/80 bg-muted/30 space-y-1.5">
                  <h5 className="font-bold text-foreground flex items-center gap-1.5">
                    <Luggage className="w-3.5 h-3.5 text-primary"/>
                    <span>Luggage Guidelines</span>
                  </h5>
                  <p className="text-muted-foreground leading-relaxed">
                    • Up to 2 standard personal baggage items (combined limit: 20 kg) permitted per passenger.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    • Excess luggage can be accommodated at boarding point subject to operator luggage compartment space.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right">
              <span className="text-[11px] text-muted-foreground block">
                Total for {busCriteria.passengerCount} traveler
                {busCriteria.passengerCount > 1 ? "s" : ""}
              </span>
              <span className="font-black text-lg text-foreground">
                {formatCurrency(bus.farePerSeat * busCriteria.passengerCount)}
              </span>
            </div>
            <Button onClick={handleBook} className="h-10 px-5 rounded-lg font-semibold text-xs tracking-wide shadow-xs active:scale-95 transition-all cursor-pointer">
              Select Seats <ArrowRight className="w-3.5 h-3.5 ml-1.5"/>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>);
}
