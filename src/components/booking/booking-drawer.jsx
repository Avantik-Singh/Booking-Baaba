"use client";
import React from "react";
import { ArrowLeft, ArrowRight, X, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookingStepper } from "./booking-stepper";
import { FareSummary } from "./fare-summary";
import { PassengerForm } from "./passenger-form";
import { BookingReview } from "./booking-review";
import { BookingConfirmation } from "./booking-confirmation";
import { BoardingPointSelector } from "./boarding-point-selector";
import { FlightSeatMap } from "@/components/seats/flight-seat-map";
import { TrainBerthMap } from "@/components/seats/train-berth-map";
import { BusSeatMap } from "@/components/seats/bus-seat-map";
import { useBookingStore } from "@/store/booking-store";
export function BookingDrawer() {
    const { isOpen, setIsOpen, currentStep, nextStep, prevStep, transportMode, selectedService, seatLayout, passengerCount, selectedSeatIds, passengers, } = useBookingStore();
    if (!selectedService)
        return null;
    const hasSeats = !!seatLayout;
    // Validation before advancing from passengers
    const canProceedFromPassengers = passengers.every((p) => p.firstName.trim().length > 0 && p.lastName.trim().length > 0);
    return (<Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[96vw] max-w-5xl md:max-w-5xl lg:max-w-6xl max-h-[92vh] overflow-y-auto p-0 rounded-3xl border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-100 dark:border-slate-800 p-5 pb-3">
          <div className="flex items-center justify-between pb-3">
            <div>
              <DialogTitle className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Express Ticket Reservation
              </DialogTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Complete your travel reservation across India
              </p>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              <X className="w-5 h-5"/>
            </button>
          </div>

          <BookingStepper currentStep={currentStep} hasSeatsStep={hasSeats}/>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* STEP 1: SEATS & BOARDING OPTIONS */}
          {currentStep === "seats" && (<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Select Your Seat{passengerCount > 1 ? "s" : ""} (
                    {selectedSeatIds.length} of {passengerCount} picked)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Click on available seats to assign them to your travelers.
                    Occupied seats are locked.
                  </p>
                </div>

                {/* If Bus, also render boarding & dropping points */}
                {transportMode === "bus" &&
                "boardingPoints" in selectedService && (<BoardingPointSelector boardingPoints={selectedService.boardingPoints} droppingPoints={selectedService.droppingPoints}/>)}

                {/* Seat Map according to transport mode */}
                {seatLayout && (<div className="pt-2">
                    {transportMode === "flight" && (<FlightSeatMap layout={seatLayout} maxSeats={passengerCount}/>)}
                    {transportMode === "train" && (<TrainBerthMap layout={seatLayout} maxSeats={passengerCount}/>)}
                    {transportMode === "bus" && (<BusSeatMap layout={seatLayout} maxSeats={passengerCount}/>)}
                  </div>)}
              </div>

              {/* Sidebar with itemized fare */}
              <div className="lg:col-span-4 sticky top-28">
                <FareSummary />
              </div>
            </div>)}

          {/* STEP 2: TRAVELERS FORM */}
          {currentStep === "passengers" && (<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8">
                <PassengerForm />
              </div>
              <div className="lg:col-span-4 sticky top-28">
                <FareSummary />
              </div>
            </div>)}

          {/* STEP 3: REVIEW & SUMMARY */}
          {currentStep === "review" && (<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8">
                <BookingReview />
              </div>
              <div className="lg:col-span-4 sticky top-28">
                <FareSummary />
              </div>
            </div>)}

          {/* STEP 4: CONFIRMATION & TICKET */}
          {currentStep === "confirmation" && (<div className="max-w-2xl mx-auto py-4">
              <BookingConfirmation />
            </div>)}
        </div>

        {/* Sticky Footer Navigation (only for steps before confirmation) */}
        {currentStep !== "confirmation" && (<div className="sticky bottom-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-100 dark:border-slate-800 p-4 px-6 flex items-center justify-between">
            <Button type="button" variant="outline" onClick={prevStep} className="rounded-xl text-xs font-bold gap-1.5 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer">
              <ArrowLeft className="w-4 h-4"/> Back
            </Button>

            <div className="flex items-center gap-3">
              {currentStep === "passengers" && !canProceedFromPassengers && (<span className="text-xs text-rose-600 font-medium hidden sm:inline">
                  Please fill all passenger first &amp; last names
                </span>)}
              <Button type="button" onClick={nextStep} disabled={currentStep === "passengers" && !canProceedFromPassengers} className={`h-11 px-6 rounded-xl font-bold text-xs gap-1.5 shadow-md active:scale-95 transition-transform ${currentStep === "review"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20"}`}>
                {currentStep === "review" ? (<>
                    <CheckCircle2 className="w-4 h-4"/>
                    <span>Confirm &amp; Pay</span>
                  </>) : (<>
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4"/>
                  </>)}
              </Button>
            </div>
          </div>)}
      </DialogContent>
    </Dialog>);
}
