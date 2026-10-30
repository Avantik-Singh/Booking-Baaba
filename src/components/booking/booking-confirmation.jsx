"use client";
import React from "react";
import { CheckCircle2, QrCode, Printer, Ticket, Copy, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBookingStore } from "@/store/booking-store";
import { formatCurrency } from "@/lib/utils/format-currency";
import { toast } from "sonner";
export function BookingConfirmation() {
    const { confirmedBooking, resetBooking } = useBookingStore();
    if (!confirmedBooking)
        return null;
    const handleCopyPNR = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(confirmedBooking.bookingReference);
            toast.success(`Copied PNR [${confirmedBooking.bookingReference}] to clipboard!`);
        }
    };
    const handlePrint = () => {
        window.print();
    };
    return (<div className="space-y-6 text-center">
      {/* Animated Success Badge */}
      <div className="flex flex-col items-center justify-center pt-2">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]"/>
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Booking Confirmed!
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Your booking has been recorded and safely saved in{" "}
          <strong className="text-slate-700 dark:text-slate-200">
            My Trips
          </strong>
          .
        </p>
      </div>

      {/* Official Ticket Card */}
      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-6 text-left shadow-md relative overflow-hidden">
        {/* Ticket Header Banner */}
        <div className="bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest text-center py-1.5 -mx-6 -mt-6 mb-5">
          CONFIRMED RESERVATION — OFFICIAL E-TICKET
        </div>

        {/* Reference & Service Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider block">
              Booking Reference / PNR
            </span>
            <div className="flex items-center gap-2">
              <div className="text-xl font-black text-indigo-700 dark:text-indigo-400 tracking-wider">
                {confirmedBooking.bookingReference}
              </div>
              <button type="button" onClick={handleCopyPNR} className="p-1 rounded-md text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer" title="Copy PNR">
                <Copy className="w-4 h-4"/>
              </button>
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              {confirmedBooking.serviceName}
            </div>
          </div>

          <Badge className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 uppercase font-black text-xs">
            {confirmedBooking.transportMode}
          </Badge>
        </div>

        {/* Route Details */}
        <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block">
              From
            </span>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white">
              {confirmedBooking.departureTime}
            </div>
            <div className="text-slate-700 dark:text-slate-300 font-medium">
              {confirmedBooking.originName}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block">
              To
            </span>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white">
              {confirmedBooking.arrivalTime}
            </div>
            <div className="text-slate-700 dark:text-slate-300 font-medium">
              {confirmedBooking.destinationName}
            </div>
          </div>
        </div>

        {/* Travelers & Seats */}
        <div className="py-4 border-b border-slate-100 dark:border-slate-800 text-xs space-y-2">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block">
            Travelers ({confirmedBooking.passengerCount}) &amp; Seats
          </span>
          <div className="space-y-1">
            {confirmedBooking.passengers.map((p, idx) => (<div key={idx} className="flex justify-between items-center text-slate-800 dark:text-slate-200 font-medium">
                <span>
                  {p.firstName || "Passenger"} {p.lastName || ""}
                </span>
                <span className="font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded text-[11px]">
                  {p.seatLabel ? `Seat: ${p.seatLabel}` : "Reserved"}
                </span>
              </div>))}
          </div>
        </div>

        {/* Fare and Status */}
        <div className="flex items-center justify-between pt-4">
          <div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block">
              Total Amount Paid
            </span>
            <div className="font-black text-lg text-slate-900 dark:text-white">
              {formatCurrency(confirmedBooking.fare.totalAmount)}
            </div>
          </div>

          {/* QR Placeholder */}
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
            <QrCode className="w-8 h-8 text-slate-700 dark:text-slate-300"/>
            <span className="text-[7px] font-black uppercase tracking-tight text-slate-400 dark:text-slate-500">
              BOARDING QR
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button onClick={handlePrint} variant="outline" className="w-full sm:w-auto rounded-xl gap-2 text-xs font-bold border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer">
          <Printer className="w-4 h-4"/> Print / Save E-Ticket
        </Button>

        <Button onClick={resetBooking} className="w-full sm:w-auto rounded-xl gap-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer">
          <Ticket className="w-4 h-4"/> Book Another Journey
        </Button>
      </div>
    </div>);
}
