import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { UnifiedSearchPanel } from "@/components/search/unified-search-panel";
import { ResultsSection } from "@/components/results/results-section";
import { BookingDrawer } from "@/components/booking/booking-drawer";
export function ResultsPage() {
    return (<div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      <Navbar />

      <section className="border-b border-border/70 bg-muted/30 px-4 sm:px-6 lg:px-8 xl:px-12 py-4">
        <UnifiedSearchPanel compact/>
      </section>

      <div className="flex-1">
        <ResultsSection />
      </div>

      <BookingDrawer />
      <Footer />
    </div>);
}
export default ResultsPage;
