"use client";
import React, { useState } from "react";
import { Tag, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useBookingStore } from "@/store/booking-store";
import { calculateFare } from "@/lib/utils/calculate-fare";
import { formatCurrency } from "@/lib/utils/format-currency";
import faresData from "@/lib/mock-data/fares.json";
import { toast } from "sonner";
export function FareSummary() {
    const { transportMode, baseFarePerPassenger, passengerCount, selectedSeatIds, seatLayout, selectedExtras, toggleExtra, couponCode, discountAmount, applyCoupon, removeCoupon, } = useBookingStore();
    const [inputCoupon, setInputCoupon] = useState("");
    const [couponError, setCouponError] = useState("");
    // Calculate seat premiums
    let seatPremiumsTotal = 0;
    if (seatLayout) {
        selectedSeatIds.forEach((id) => {
            const s = seatLayout.seats.find((seat) => seat.id === id);
            if (s)
                seatPremiumsTotal += s.price || 0;
        });
    }
    const fare = calculateFare({
        transportMode,
        baseFarePerPassenger,
        passengerCount,
        seatPremiumsTotal,
        selectedExtras,
        discountAmount,
    });
    const handleApplyCoupon = (e) => {
        e.preventDefault();
        setCouponError("");
        if (!inputCoupon.trim())
            return;
        const success = applyCoupon(inputCoupon);
        if (!success) {
            setCouponError("Invalid promo code or minimum spend requirement not met.");
            toast.error("Invalid coupon code or min spend not met");
        }
        else {
            toast.success(`Promo code [${inputCoupon.toUpperCase()}] applied successfully!`);
            setInputCoupon("");
        }
    };
    return (<div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider whitespace-nowrap">
          Fare Summary
        </h4>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
          {passengerCount} Traveler{passengerCount > 1 ? "s" : ""}
        </span>
      </div>

      {/* Itemized lines */}
      <div className="space-y-2.5 text-xs">
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 gap-2">
          <span>
            Base Fare ({passengerCount} × {formatCurrency(baseFarePerPassenger)}
            )
          </span>
          <span className="font-bold text-slate-900 dark:text-white shrink-0">
            {formatCurrency(fare.baseFare)}
          </span>
        </div>

        {seatPremiumsTotal > 0 && (<div className="flex items-center justify-between text-slate-600 dark:text-slate-400 gap-2">
            <span>Seat Premiums &amp; Selection</span>
            <span className="font-bold text-slate-900 dark:text-white shrink-0">
              {formatCurrency(seatPremiumsTotal)}
            </span>
          </div>)}

        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 gap-2">
          <span>Taxes (GST 5%)</span>
          <span className="font-bold text-slate-900 dark:text-white shrink-0">
            {formatCurrency(fare.taxes)}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 gap-2">
          <span>Convenience / Service Fee</span>
          <span className="font-bold text-slate-900 dark:text-white shrink-0">
            {formatCurrency(fare.serviceFee)}
          </span>
        </div>

        {selectedExtras.length > 0 && (<div className="space-y-1.5 pt-1">
            <span className="font-bold text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block whitespace-nowrap">
              Selected Add-ons:
            </span>
            {selectedExtras.map((extra) => (<div key={extra.id} className="flex items-center justify-between text-slate-600 dark:text-slate-400 pl-2 gap-2">
                <span>• {extra.name}</span>
                <span className="font-bold text-slate-900 dark:text-white shrink-0">
                  {formatCurrency(extra.price)}
                </span>
              </div>))}
          </div>)}

        {fare.discount > 0 && (<div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50/80 dark:bg-emerald-950/40 p-2 rounded-lg gap-2">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5"/> Coupon [{couponCode}]
            </span>
            <span className="shrink-0">-{formatCurrency(fare.discount)}</span>
          </div>)}
      </div>

      <Separator className="dark:bg-slate-800"/>

      {/* Total Amount */}
      <div className="flex items-baseline justify-between gap-2">
        <div className="shrink-0">
          <span className="font-black text-base text-slate-900 dark:text-white block whitespace-nowrap">
            Total Payable
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
            All taxes &amp; fees included
          </span>
        </div>
        <div className="text-right shrink-0">
          <span className="text-2xl font-black text-indigo-700 dark:text-indigo-400 tracking-tight whitespace-nowrap">
            {formatCurrency(fare.totalAmount)}
          </span>
        </div>
      </div>

      {/* Promo Code Box */}
      <div className="pt-2">
        {couponCode ? (<div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
              <Tag className="w-3.5 h-3.5"/>
              <span>Coupon applied: {couponCode}</span>
            </div>
            <button onClick={removeCoupon} className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer">
              Remove
            </button>
          </div>) : (<form onSubmit={handleApplyCoupon} className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400 dark:text-slate-500"/>
                <Input value={inputCoupon} onChange={(e) => setInputCoupon(e.target.value)} placeholder="Enter Promo Code" className="pl-8 h-9 rounded-xl text-xs font-bold uppercase dark:bg-slate-800 dark:border-slate-700 dark:text-white"/>
              </div>
              <Button type="submit" variant="outline" size="sm" className="h-9 px-3 rounded-xl text-xs font-bold dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer">
                Apply
              </Button>
            </div>
            {couponError && (<p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                {couponError}
              </p>)}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
              <span>Try:</span>
              <button type="button" onClick={() => {
                const ok = applyCoupon("WELCOMEBAABA");
                if (ok)
                    toast.success("Applied WELCOMEBAABA (₹150 OFF)!");
            }} className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                WELCOMEBAABA
              </button>
              <span>or</span>
              <button type="button" onClick={() => {
                const ok = applyCoupon("SAFAR200");
                if (ok)
                    toast.success("Applied SAFAR200 (₹200 OFF)!");
            }} className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                SAFAR200
              </button>
            </div>
          </form>)}
      </div>

      {/* Recommended Extras & Baggage Add-ons */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
          {transportMode === "flight" ? "Add-on Baggage &amp; Protections:" : "Add-on Protections:"}
        </span>
        {faresData.extras
            .filter((e) => (transportMode === "flight" ? true : e.category !== "baggage"))
            .map((extra) => {
            const isAdded = selectedExtras.some((e) => e.id === extra.id);
            return (<div key={extra.id} onClick={() => toggleExtra(extra)} className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${isAdded
                    ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50/30 dark:bg-slate-800/40"}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${isAdded
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"}`}>
                    {isAdded && "✓"}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{extra.name}</span>
                      {extra.category === "baggage" && (<span className="text-[10px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-1.5 py-0.2 rounded">
                          Pre-book 50% Off
                        </span>)}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">
                      {extra.description}
                    </div>
                  </div>
                </div>
                <div className="font-bold text-xs whitespace-nowrap ml-2 text-slate-900 dark:text-white">
                  +{formatCurrency(extra.price)}
                </div>
              </div>);
        })}
      </div>
    </div>);
}
