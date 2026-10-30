"use client";
import React, { useState } from "react";
import { Clock, ArrowRight, Luggage, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAirportById } from "@/lib/services/route-service";
import { formatCurrency, formatDuration } from "@/lib/utils/format-currency";
import { useBookingStore } from "@/store/booking-store";
import { useSearchStore } from "@/store/search-store";
export function FlightResultCard({ flight, journeyDate, }) {
    const { flightCriteria } = useSearchStore();
    const { startBooking } = useBookingStore();
    const [selectedFare, setSelectedFare] = useState(flight.fares[0] || null);
    const originAirport = getAirportById(flight.originAirportId);
    const destAirport = getAirportById(flight.destinationAirportId);
    const handleBook = () => {
        if (!selectedFare)
            return;
        startBooking({
            transportMode: "flight",
            service: flight,
            selectedClassOrFamily: `${selectedFare.cabinClass} (${selectedFare.fareFamily})`,
            baseFare: selectedFare.baseFare,
            seatLayoutId: flight.seatLayoutId,
            passengerCount: flightCriteria.passengerCount,
            journeyDate: journeyDate || flightCriteria.journeyDate,
        });
    };
    const getAirlineColor = (code) => {
        switch (code) {
            case "6E":
                return "bg-blue-600 text-white";
            case "AI":
                return "bg-rose-600 text-white";
            case "UK":
                return "bg-purple-900 text-white";
            case "QP":
                return "bg-orange-500 text-white";
            case "BB":
                return "bg-indigo-600 text-white";
            default:
                return "bg-slate-800 text-white";
        }
    };
    return (<Card className="border border-border/80 bg-card text-card-foreground rounded-xl shadow-xs hover:shadow-md transition-all duration-200">
      <CardContent className="p-5 sm:p-6 space-y-5">
        {/* Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-xs shrink-0 shadow-xs ${getAirlineColor(flight.airlineCode)}`}>
              {flight.airlineCode}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-base text-foreground leading-tight">
                  {flight.airlineName}
                </h3>
                <Badge variant="outline" className="font-mono text-xs px-2 py-0.5 text-muted-foreground border-border/80">
                  {flight.flightNumber}
                </Badge>
                <Badge variant="secondary" className="text-xs font-medium text-sky-700 dark:text-sky-300 bg-sky-500/10 border border-sky-500/20">
                  {flight.stops === 0 ? "Non-Stop" : `${flight.stops} Stop`}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Commercial Jetliner • Web Check-in Available • On-Time 95%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs px-2.5 py-1 text-muted-foreground border-border/80 bg-muted/20">
              ✈️ Direct Flight
            </Badge>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Departure */}
          <div className="sm:col-span-4">
            <div className="text-2xl font-black font-mono tracking-tight text-foreground">
              {flight.departureTime}
            </div>
            <div className="font-semibold text-sm text-foreground mt-0.5">
              {originAirport?.city || "Departure"}
            </div>
            <div className="text-xs text-muted-foreground leading-snug">
              {originAirport?.iataCode} • {originAirport?.name}
            </div>
          </div>

          {/* Duration Line */}
          <div className="sm:col-span-4 flex flex-col items-center justify-center px-2">
            <span className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-muted-foreground"/>{" "}
              {formatDuration(flight.durationMinutes)}
            </span>
            <div className="w-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full border border-primary bg-background shrink-0"/>
              <div className="flex-1 border-t border-dashed border-border relative">
                <div className="absolute left-1/2 -top-2.5 -translate-x-1/2 px-1.5 bg-card text-[11px] text-muted-foreground font-medium">
                  {flight.stops === 0 ? "Direct" : `${flight.stops} Stop`}
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-primary shrink-0"/>
            </div>
            <span className="text-[11px] text-muted-foreground font-medium mt-1">
              Airway Corridor
            </span>
          </div>

          {/* Arrival */}
          <div className="sm:col-span-4 sm:text-right">
            <div className="text-2xl font-black font-mono tracking-tight text-foreground">
              {flight.arrivalTime}
            </div>
            <div className="font-semibold text-sm text-foreground mt-0.5">
              {destAirport?.city || "Arrival"}
            </div>
            <div className="text-xs text-muted-foreground leading-snug">
              {destAirport?.iataCode} • {destAirport?.name}
            </div>
          </div>
        </div>

        {/* Fare Family Cards */}
        <div className="pt-1">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Select Fare Category &amp; Cabin</span>
            <span className="text-[11px] text-primary hover:underline cursor-pointer lowercase">
              Baggage &amp; Fare Policies
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {flight.fares.map((fare) => {
            const isSelected = selectedFare?.id === fare.id;
            return (<div key={fare.id} onClick={() => setSelectedFare(fare)} className={`relative p-3.5 rounded-lg border text-left cursor-pointer transition-all ${isSelected
                    ? "border-2 border-primary bg-primary/5 shadow-xs"
                    : "border-border/80 bg-card hover:bg-muted/40 hover:border-primary/40"}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-foreground">
                      {fare.fareFamily}
                    </span>
                    <span className="font-extrabold text-base text-primary">
                      {formatCurrency(fare.baseFare)}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Luggage className="w-3.5 h-3.5 text-muted-foreground"/>
                      <span>{fare.baggageAllowanceKg}kg Checked Baggage</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400"/>
                      <span>
                        {fare.refundable
                    ? "Refundable Ticket"
                    : "Standard Fare"}
                      </span>
                    </div>
                  </div>

                  {isSelected && (<div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="w-2.5 h-2.5"/>
                    </div>)}
                </div>);
        })}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-normal text-muted-foreground border-border/70 bg-muted/20">
              7kg Cabin Baggage included
            </Badge>
            <Badge variant="outline" className="text-xs font-normal text-muted-foreground border-border/70 bg-muted/20">
              Instant e-Ticket
            </Badge>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right">
              <span className="text-[11px] text-muted-foreground block">
                Total for {flightCriteria.passengerCount} traveler
                {flightCriteria.passengerCount > 1 ? "s" : ""}
              </span>
              <span className="font-black text-lg text-foreground">
                {formatCurrency((selectedFare?.baseFare || 0) * flightCriteria.passengerCount)}
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
