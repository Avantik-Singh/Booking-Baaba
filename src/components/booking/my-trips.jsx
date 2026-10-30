"use client";
import React, { useEffect, useState } from "react";
import { Ticket, XCircle, Printer } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getStoredBookings, cancelStoredBooking } from "@/lib/services/booking-service";
import { formatCurrency } from "@/lib/utils/format-currency";
import { useCancelBookingMutation } from "@/store/api/bookingApi";
import { toast } from "sonner";
export function MyTripsDialog({ open, onOpenChange }) {
    const [trips, setTrips] = useState([]);
    const [cancelBookingApi] = useCancelBookingMutation();
    useEffect(() => {
        if (open) {
            setTrips(getStoredBookings());
        }
    }, [open]);
    const handleCancel = async (bookingId) => {
        cancelStoredBooking(bookingId);
        try {
            const numericId = parseInt(bookingId.replace(/\D/g, ""), 10);
            if (numericId) {
                await cancelBookingApi(numericId).unwrap();
                toast.info("Booking cancelled.");
            }
        }
        catch (err) {
            console.warn("Backend cancel notice:", err);
        }
        setTrips(getStoredBookings());
    };
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <DialogHeader className="pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-indigo-600 dark:text-indigo-400"/>
            <DialogTitle className="text-lg font-black text-slate-900 dark:text-white">
              My Trips &amp; Reservations
            </DialogTitle>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            View, cancel, or reprint your confirmed travel bookings
          </p>
        </DialogHeader>

        <div className="py-2 space-y-3">
          {trips.length === 0 ? (<div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Ticket className="w-6 h-6"/>
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">No Bookings Yet</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-0.5">
                  Search for trains, flights, or buses on the homepage and complete your booking to see your tickets here!
                </p>
              </div>
            </div>) : (trips.map((booking) => {
            const isCancelled = booking.status === "cancelled";
            return (<div key={booking.id} className="p-4 sm:p-5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-indigo-700 dark:text-indigo-400 tracking-wider">
                          {booking.bookingReference}
                        </span>
                        <Badge variant={isCancelled ? "destructive" : "default"} className={`text-[10px] font-black uppercase ${isCancelled
                    ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                    : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"}`}>
                          {booking.status}
                        </Badge>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                        {booking.serviceName}
                      </h4>
                    </div>

                    <Badge className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 uppercase font-bold text-[10px]">
                      {booking.transportMode}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 dark:border-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">From</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{booking.originName}</span>
                      <span className="text-slate-500 dark:text-slate-400 ml-1.5 font-semibold">({booking.departureTime})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">To</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{booking.destinationName}</span>
                      <span className="text-slate-500 dark:text-slate-400 ml-1.5 font-semibold">({booking.arrivalTime})</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">{booking.passengerCount} Traveler(s) • </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(booking.fare.totalAmount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => window.print()} className="h-8 text-xs font-semibold gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                        <Printer className="w-3.5 h-3.5"/> Print
                      </Button>

                      {!isCancelled && (<Button variant="ghost" size="sm" onClick={() => handleCancel(booking.id)} className="h-8 text-xs font-semibold gap-1 text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40">
                          <XCircle className="w-3.5 h-3.5"/> Cancel Booking
                        </Button>)}
                    </div>
                  </div>
                </div>);
        }))}
        </div>
      </DialogContent>
    </Dialog>);
}
