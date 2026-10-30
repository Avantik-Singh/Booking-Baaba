"use client";
import React from "react";
import { ShieldCheck, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBookingStore } from "@/store/booking-store";
import { useSearchStore } from "@/store/search-store";
import { getStationById, getAirportById, getCityById } from "@/lib/services/route-service";
export function BookingReview() {
    const { transportMode, selectedService, selectedClassOrFamily, passengers, contactEmail, contactPhone, selectedSeatIds, seatLayout, completeBooking } = useBookingStore();
    const { trainCriteria } = useSearchStore();
    if (!selectedService)
        return null;
    let serviceTitle = "";
    let serviceSubtitle = "";
    let originTitle = "";
    let destTitle = "";
    let depTime = "";
    let arrTime = "";
    if (transportMode === "train") {
        const t = selectedService;
        const quotaLabel = trainCriteria.quota && trainCriteria.quota !== "GN"
            ? ` • Quota: ${trainCriteria.quota === "TQ" ? "Tatkal" : trainCriteria.quota === "LD" ? "Ladies" : trainCriteria.quota === "SS" ? "Senior Citizen" : "Student"}`
            : "";
        serviceTitle = `${t.trainName} (#${t.trainNumber})`;
        serviceSubtitle = `Category: ${t.category} • Class: ${selectedClassOrFamily}${quotaLabel}`;
        const st1 = getStationById(t.originStationId);
        const st2 = getStationById(t.destinationStationId);
        originTitle = st1 ? `${st1.city} [${st1.code}]` : t.originStationId;
        destTitle = st2 ? `${st2.city} [${st2.code}]` : t.destinationStationId;
        depTime = t.departureTime;
        arrTime = t.arrivalTime;
    }
    else if (transportMode === "flight") {
        const f = selectedService;
        serviceTitle = `${f.airlineName} - ${f.flightNumber}`;
        serviceSubtitle = `Cabin: ${selectedClassOrFamily} • Non-Stop`;
        const ap1 = getAirportById(f.originAirportId);
        const ap2 = getAirportById(f.destinationAirportId);
        originTitle = ap1 ? `${ap1.city} (${ap1.iataCode})` : f.originAirportId;
        destTitle = ap2 ? `${ap2.city} (${ap2.iataCode})` : f.destinationAirportId;
        depTime = f.departureTime;
        arrTime = f.arrivalTime;
    }
    else {
        const b = selectedService;
        serviceTitle = b.serviceName;
        serviceSubtitle = `Type: ${b.busType.replace("_", " ")} ${b.isAC ? "• AC" : ""}`;
        const c1 = getCityById(b.originCityId);
        const c2 = getCityById(b.destinationCityId);
        originTitle = c1 ? c1.name : b.originCityId;
        destTitle = c2 ? c2.name : b.destinationCityId;
        depTime = b.departureTime;
        arrTime = b.arrivalTime;
    }
    return (<div className="space-y-6">
      
      {/* Notice Banner */}
      <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0"/>
        <span>
          <strong>Safe &amp; Secure Checkout:</strong> 100% encrypted transaction with instant ticket issuance and SMS/email confirmation.
        </span>
      </div>

      {/* Journey Card */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{serviceTitle}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">{serviceSubtitle}</p>
          </div>
          <Badge className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 uppercase font-bold text-xs">
            {transportMode}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Departure</span>
            <div className="text-xl font-black text-slate-900 dark:text-white">{depTime}</div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{originTitle}</div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Arrival</span>
            <div className="text-xl font-black text-slate-900 dark:text-white">{arrTime}</div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{destTitle}</div>
          </div>
        </div>
      </div>

      {/* Passengers & Seats Summary */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Travelers &amp; Seat Allocation
        </h4>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {passengers.map((p, idx) => {
            const assignedSeatId = selectedSeatIds[idx];
            const seatObj = seatLayout?.seats.find((s) => s.id === assignedSeatId);
            return (<div key={idx} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500"/>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {p.firstName ? `${p.firstName} ${p.lastName || ""}`.trim() : `Traveler ${idx + 1}`}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    ({p.gender}{p.age ? `, ${p.age} yrs` : ""})
                  </span>
                </div>
                <div>
                  {seatObj ? (<span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-md">
                      Seat: {seatObj.label} ({seatObj.type})
                    </span>) : (<span className="text-slate-400 dark:text-slate-500 italic">Auto-Assigned Berth</span>)}
                </div>
              </div>);
        })}
        </div>
      </div>

      {/* Communication Contacts */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs space-y-1">
        <div className="font-bold text-slate-700 dark:text-slate-300">Digital Tickets Sent To:</div>
        <div className="text-slate-600 dark:text-slate-400">Email: <strong className="text-slate-800 dark:text-slate-200">{contactEmail || "Not provided"}</strong></div>
        <div className="text-slate-600 dark:text-slate-400">WhatsApp / SMS: <strong className="text-slate-800 dark:text-slate-200">{contactPhone ? `+91 ${contactPhone}` : "Not provided"}</strong></div>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <Button onClick={() => completeBooking()} className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-xl shadow-emerald-600/25 active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer">
          <CheckCircle2 className="w-5 h-5"/>
          <span>Confirm &amp; Generate E-Ticket</span>
        </Button>
      </div>

    </div>);
}
