"use client";
import React from "react";
import { User, Mail, Phone, Plus, Trash2, ShieldCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBookingStore } from "@/store/booking-store";
export function PassengerForm() {
    const { passengers, setPassengers, contactEmail, contactPhone, setContactInfo, selectedSeatIds, seatLayout, transportMode } = useBookingStore();
    const handlePassengerChange = (index, field, value) => {
        const updated = [...passengers];
        updated[index] = { ...updated[index], [field]: value };
        setPassengers(updated);
    };
    const addPassenger = () => {
        if (passengers.length >= 6)
            return;
        const newPassenger = {
            id: `p-${passengers.length + 1}`,
            firstName: "",
            lastName: "",
            age: undefined,
            gender: "M"
        };
        setPassengers([...passengers, newPassenger]);
    };
    const removePassenger = (index) => {
        if (passengers.length <= 1)
            return;
        const updated = passengers.filter((_, i) => i !== index);
        setPassengers(updated);
    };
    return (<div className="space-y-6">
      
      {/* Contact Info Header Card */}
      <div className="p-4 sm:p-5 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400"/>
          <span>Ticket Delivery &amp; Contact Details</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Your booking confirmation, PNR reference, and WhatsApp updates will be sent here.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</Label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400 dark:text-slate-500"/>
              <Input type="email" value={contactEmail || ""} onChange={(e) => setContactInfo(e.target.value, contactPhone)} placeholder="name@example.com" className="pl-9 h-11 rounded-xl bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white text-xs font-medium"/>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Indian Mobile Number (+91)</Label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400 dark:text-slate-500"/>
              <Input type="tel" value={contactPhone || ""} onChange={(e) => setContactInfo(contactEmail, e.target.value)} placeholder="10-digit mobile number" className="pl-9 h-11 rounded-xl bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white text-xs font-medium"/>
            </div>
          </div>
        </div>
      </div>

      {/* Passenger List */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400"/>
            <span>Traveler Details ({passengers.length})</span>
          </h4>
          <div>
            {passengers.length < 6 && (<Button type="button" variant="outline" size="sm" onClick={addPassenger} className="h-8 text-xs font-bold gap-1 rounded-lg border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 cursor-pointer">
                <Plus className="w-3.5 h-3.5"/> Add Traveler
              </Button>)}
          </div>
        </div>

        {passengers.map((passenger, index) => {
            // Get assigned seat label if seat was picked
            const assignedSeatId = selectedSeatIds[index];
            const seatObj = seatLayout?.seats.find((s) => s.id === assignedSeatId);
            return (<div key={passenger.id} className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-black flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    Traveler {index + 1}
                  </span>
                  {seatObj && (<span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Seat: {seatObj.label} ({seatObj.type})
                    </span>)}
                </div>

                {passengers.length > 1 && (<button type="button" onClick={() => removePassenger(index)} className="text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 transition-colors p-1 cursor-pointer" title="Remove Passenger">
                    <Trash2 className="w-4 h-4"/>
                  </button>)}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-5 space-y-1">
                  <Label className="text-xs font-medium text-slate-600 dark:text-slate-300">First &amp; Middle Name</Label>
                  <Input required value={passenger.firstName || ""} onChange={(e) => handlePassengerChange(index, "firstName", e.target.value)} placeholder="First & Middle Name" className="h-10 rounded-xl text-xs font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white"/>
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <Label className="text-xs font-medium text-slate-600 dark:text-slate-300">Last Name</Label>
                  <Input required value={passenger.lastName || ""} onChange={(e) => handlePassengerChange(index, "lastName", e.target.value)} placeholder="Last Name" className="h-10 rounded-xl text-xs font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white"/>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <Label className="text-xs font-medium text-slate-600 dark:text-slate-300">Age</Label>
                  <Input type="number" min={1} max={120} value={passenger.age ? passenger.age : ""} onChange={(e) => handlePassengerChange(index, "age", e.target.value ? Number(e.target.value) : undefined)} placeholder="Age" className="h-10 rounded-xl text-xs font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white"/>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <Label className="text-xs font-medium text-slate-600 dark:text-slate-300">Gender</Label>
                  <Select value={passenger.gender || "M"} onValueChange={(val) => handlePassengerChange(index, "gender", val)}>
                    <SelectTrigger className="h-10 rounded-xl text-xs font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                      <SelectValue placeholder="Gender"/>
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-900 dark:border-slate-800 dark:text-white">
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Optional Berth Preference for Trains */}
              {transportMode === "train" && (<div className="pt-1">
                  <Label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Berth Preference (Subject to availability)</Label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {["No Preference", "Lower Berth", "Middle Berth", "Upper Berth", "Side Lower"].map((pref) => (<button key={pref} type="button" onClick={() => handlePassengerChange(index, "berthPreference", pref)} className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${passenger.berthPreference === pref
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"}`}>
                        {pref}
                      </button>))}
                  </div>
                </div>)}
            </div>);
        })}
      </div>

    </div>);
}
