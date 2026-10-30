import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { UnifiedSearchPanel } from "@/components/search/unified-search-panel";
import { ResultsSection } from "@/components/results/results-section";
import { PopularRoutes } from "@/components/explore/popular-routes";
import { DestinationCards } from "@/components/explore/destination-cards";
import { TransportDiscovery } from "@/components/explore/transport-discovery";
import { BookingDrawer } from "@/components/booking/booking-drawer";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
export function HomePage() {
    return (<div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* 1. TOP NAVIGATION */}
      <Navbar />

      {/* 2. HERO & UNIFIED SEARCH PANEL */}
      <section className="relative pt-10 sm:pt-14 pb-14 px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 left-0 right-0 w-full h-96 bg-gradient-to-b from-indigo-100/60 via-amber-50/30 to-transparent dark:from-indigo-950/40 dark:via-slate-900/40 -z-10 rounded-b-[4rem]"/>

        {/* Hero Title & Tagline */}
        <div className="max-w-4xl mx-auto text-center space-y-3 mb-10">
          <Badge variant="outline" className="px-3.5 py-1 rounded-full bg-white/90 dark:bg-slate-800/90 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-xs shadow-sm inline-flex items-center gap-1.5 backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-amber-500"/>
            <span>
              Har Safar, Ek Jagah • India&apos;s Unified Travel Platform
            </span>
          </Badge>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Where will your journey take you?
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto">
            Trains, flights, and buses across India — all in one place. Discover
            routes, inspect seat layouts, and book journeys seamlessly.
          </p>
        </div>

        {/* Unified Search Box with 3 Transport Tabs */}
        <div className="relative z-20">
          <UnifiedSearchPanel />
        </div>
      </section>

      {/* 3. SAME-PAGE SEARCH RESULTS (TRAIN / FLIGHT / BUS) */}
      <div className="flex-1">
        <ResultsSection />
      </div>

      {/* 4. EXPLORE & DISCOVERY SECTIONS */}
      <PopularRoutes />
      <DestinationCards />
      <TransportDiscovery />

      {/* 5. MULTI-STEP BOOKING DRAWER / MODAL */}
      <BookingDrawer />

      {/* 6. COMPREHENSIVE FOOTER */}
      <Footer />
    </div>);
}
export default HomePage;
