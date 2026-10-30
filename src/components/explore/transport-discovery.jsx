"use client";
import React from "react";
import { Train, Plane, Bus, HelpCircle, CheckCircle2, ArrowRight, } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useSearchStore } from "@/store/search-store";
import { toast } from "sonner";
import { useGoToResults } from "@/lib/hooks/use-go-to-results";
export function TransportDiscovery() {
    const { setActiveMode } = useSearchStore();
    const goToResults = useGoToResults();
    const handleExplore = (mode, label) => {
        setActiveMode(mode);
        toast.info(`Switched to ${label}`);
        goToResults();
    };
    return (<section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 space-y-16">
      {/* 3 Transport Pillars */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="outline" className="text-xs font-bold text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-slate-800 mb-2">
            Multi-Modal Travel Tech
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            How Booking Baba Powers Your Journey
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            We bring India&apos;s complex multi-transit network into one unified
            booking engine with interactive seat maps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Trains */}
          <Card className="rounded-2xl border-slate-200/90 dark:border-slate-800 shadow-sm p-6 space-y-4 bg-white dark:bg-slate-900 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Train className="w-6 h-6"/>
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Next-Gen Indian Railways
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Experience cutting-edge Vande Bharat chair cars, Tejas
                  Rajdhani sleepers, and classic Shatabdi expresses. Review
                  coach layouts with realistic lower, middle, upper, and side
                  berth mapping.
                </p>
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500"/>
                  <span>Live RAC &amp; Waitlist tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500"/>
                  <span>Executive (EC) &amp; Chair Car (CC) layouts</span>
                </li>
              </ul>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => handleExplore("train", "Indian Railways")} className="w-full text-xs font-bold text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl justify-between cursor-pointer">
                <span>Search Trains</span>
                <ArrowRight className="w-3.5 h-3.5"/>
              </Button>
            </div>
          </Card>

          {/* Pillar 2: Flights */}
          <Card className="rounded-2xl border-slate-200/90 dark:border-slate-800 shadow-sm p-6 space-y-4 bg-white dark:bg-slate-900 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Plane className="w-6 h-6"/>
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Seamless Aerial Corridors
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Connect major Indian metropolitan hubs and select
                  international gateways. Compare flexible fare families with
                  transparent baggage allowances and choose window, aisle, or
                  extra legroom seats.
                </p>
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500"/>
                  <span>Transparent Saver vs. Flexi fares</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500"/>
                  <span>Interactive A320 &amp; B787 cabin seat maps</span>
                </li>
              </ul>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => handleExplore("flight", "Domestic & Intl Flights")} className="w-full text-xs font-bold text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800 hover:bg-sky-50 dark:hover:bg-slate-800 rounded-xl justify-between cursor-pointer">
                <span>Search Flights</span>
                <ArrowRight className="w-3.5 h-3.5"/>
              </Button>
            </div>
          </Card>

          {/* Pillar 3: Buses */}
          <Card className="rounded-2xl border-slate-200/90 dark:border-slate-800 shadow-sm p-6 space-y-4 bg-white dark:bg-slate-900 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-slate-800 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Bus className="w-6 h-6"/>
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Expressway Bus Fleets
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Travel comfortably across Indian highways aboard Volvo
                  multi-axle coaches, BharatBenz semi-sleepers, and double deck
                  AC sleepers. Pick exact boarding and dropping locations near
                  you.
                </p>
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500"/>
                  <span>Upper &amp; lower deck sleeper berth selection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500"/>
                  <span>Detailed pickup point address and timings</span>
                </li>
              </ul>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => handleExplore("bus", "Intercity Buses")} className="w-full text-xs font-bold text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-xl justify-between cursor-pointer">
                <span>Search Buses</span>
                <ArrowRight className="w-3.5 h-3.5"/>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4"/>
            <span>Got Questions?</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h3>
        </div>

        <Accordion className="w-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xs sm:text-sm font-bold text-left hover:no-underline text-slate-900 dark:text-slate-100">
              Why book trains, flights, and buses with Booking Baba?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Booking Baba is India&apos;s all-in-one unified travel portal providing
              instant reservations, real-time seat selection, and transparent fares. Compare
              Indian Railways routes, domestic and international flights, and luxury sleeper
              buses side-by-side with zero hidden charges and instant PNR issuance.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-xs sm:text-sm font-bold text-left hover:no-underline text-slate-900 dark:text-slate-100">
              How does the interactive seat selection work?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              When you select a service with a supported layout, our system
              loads the physical seat grid. Available seats can be clicked to
              assign them to your travelers. Occupied seats are locked and
              unselectable. Any seat premiums are itemized in your live fare
              summary.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-xs sm:text-sm font-bold text-left hover:no-underline text-slate-900 dark:text-slate-100">
              Can I view or cancel my bookings later?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Yes! Click on &quot;My Trips&quot; in the top navigation bar at
              any time to inspect your saved reservations, print your official
              e-tickets, or manage booking cancellations.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-xs sm:text-sm font-bold text-left hover:no-underline text-slate-900 dark:text-slate-100">
              What promo codes can I try during checkout?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              You can test our centralized fare calculator using coupon codes:{" "}
              <strong className="text-indigo-600 dark:text-indigo-400">WELCOMEBAABA</strong> (₹150
              off on ₹500+ spend) or{" "}
              <strong className="text-indigo-600 dark:text-indigo-400">SAFAR200</strong> (₹200 off on
              ₹1,000+ spend).
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>);
}
