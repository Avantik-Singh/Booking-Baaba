"use client";
import React from "react";
import { Train, Plane, Bus, ShieldCheck, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSearchStore } from "@/store/search-store";
import { toast } from "sonner";
import { useGoToResults } from "@/lib/hooks/use-go-to-results";
export function Footer() {
  const { prefillSearch, setActiveMode } = useSearchStore();
  const goToResults = useGoToResults();

  const handleTrainClick = (label, fromId, toId) => {
    if (fromId && toId) {
      prefillSearch("train", fromId, toId);
      toast.info(`Loaded: ${label}`);
    } else {
      setActiveMode("train");
      toast.info("Select any train above to view its interactive berth map!");
    }
    goToResults();
  };

  const handleFlightClick = (label, fromId, toId) => {
    if (fromId && toId) {
      prefillSearch("flight", fromId, toId);
      toast.info(`Loaded: ${label}`);
    } else {
      setActiveMode("flight");
      toast.info(
        "Select any flight above to explore the interactive cabin seat map!",
      );
    }
    goToResults();
  };

  const handleBusClick = (label, fromId, toId) => {
    if (fromId && toId) {
      prefillSearch("bus", fromId, toId);
      toast.info(`Loaded: ${label}`);
    } else {
      setActiveMode("bus");
      toast.info(
        "Select any sleeper bus above to toggle Lower & Upper deck seat maps!",
      );
    }
    goToResults();
  };

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-lg">
                B
              </div>
              <span className="font-black text-xl text-white tracking-tight">
                Booking Baaba
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India&apos;s all-in-one unified travel booking experience.
              Discover and book seamless reservations across Indian Railways,
              domestic &amp; international flights, and intercity bus operators.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <Badge
                variant="outline"
                className="text-[10px] text-amber-400 border-amber-500/40 bg-amber-500/10"
              >
                🇮🇳 Made for Bharat
              </Badge>
              <Badge
                variant="outline"
                className="text-[10px] text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
              >
                🔒 100% Secure Checkout
              </Badge>
            </div>
          </div>

          {/* Trains Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Train className="w-3.5 h-3.5 text-indigo-400" /> Indian Trains
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() =>
                    handleTrainClick(
                      "Vande Bharat Express",
                      "station-ndls",
                      "station-bsb",
                    )
                  }
                  className="hover:text-indigo-400 transition-colors text-left"
                >
                  Vande Bharat Express (NDLS → BSB)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    handleTrainClick(
                      "Tejas Rajdhani Express",
                      "station-ndls",
                      "station-mmct",
                    )
                  }
                  className="hover:text-indigo-400 transition-colors text-left"
                >
                  Tejas &amp; Rajdhani (Delhi → Mumbai)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    handleTrainClick(
                      "Shatabdi Express",
                      "station-sbc",
                      "station-mas",
                    )
                  }
                  className="hover:text-indigo-400 transition-colors text-left"
                >
                  Shatabdi Intercity (BLR → MAS)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    handleTrainClick(
                      "Duronto Express",
                      "station-mmct",
                      "station-adi",
                    )
                  }
                  className="hover:text-indigo-400 transition-colors text-left"
                >
                  Duronto Point-to-Point (BOM → ADI)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    handleTrainClick("Interactive Coach & Berth Maps")
                  }
                  className="hover:text-indigo-400 transition-colors text-left flex items-center gap-1 text-slate-300 font-semibold"
                >
                  <span>Interactive Coach &amp; Berth Maps</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Flights Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5 text-sky-400" /> Flights &amp;
              Airlines
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() =>
                    handleFlightClick(
                      "Air Corridor: Delhi to Bengaluru",
                      "airport-del",
                      "airport-blr",
                    )
                  }
                  className="hover:text-sky-400 transition-colors text-left"
                >
                  Delhi to Bengaluru (DEL → BLR)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    handleFlightClick(
                      "Holiday Route: Mumbai to Goa",
                      "airport-bom",
                      "airport-goi",
                    )
                  }
                  className="hover:text-sky-400 transition-colors text-left"
                >
                  Mumbai to Goa Holiday Routes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    handleFlightClick(
                      "Trunk Corridor: Delhi to Mumbai",
                      "airport-del",
                      "airport-bom",
                    )
                  }
                  className="hover:text-sky-400 transition-colors text-left"
                >
                  IndiGo &amp; Air India Trunk Route
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    handleFlightClick(
                      "International Gateway: Delhi to Dubai",
                      "airport-del",
                      "airport-dxb",
                    )
                  }
                  className="hover:text-sky-400 transition-colors text-left"
                >
                  Gulf &amp; International Routes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    handleFlightClick("Aircraft Cabin Seat Selection")
                  }
                  className="hover:text-sky-400 transition-colors text-left flex items-center gap-1 text-slate-300 font-semibold"
                >
                  <span>Aircraft Cabin Seat Selection</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Buses Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Bus className="w-3.5 h-3.5 text-amber-400" /> Intercity Buses
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() =>
                    handleBusClick(
                      "KSRTC Airavat: Bengaluru to Chennai",
                      "city-blr",
                      "city-che",
                    )
                  }
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  KSRTC Airavat Volvo (BLR → CHE)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    handleBusClick(
                      "VRL Sleeper: Bengaluru to Goa",
                      "city-blr",
                      "city-goa",
                    )
                  }
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  VRL Multi-Axle Sleeper (BLR → GOA)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    handleBusClick(
                      "Expressway Liner: Mumbai to Pune",
                      "city-bom",
                      "city-pune",
                    )
                  }
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  IntrCity SmartBus (BOM → PUNE)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    handleBusClick(
                      "Hill Corridor: Delhi to Manali",
                      "city-del",
                      "city-mnl",
                    )
                  }
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Zingbus Snow Line (DEL → MNL)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleBusClick("Upper & Lower Deck Sleepers")}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1 text-slate-300 font-semibold"
                >
                  <span>Upper &amp; Lower Deck Sleepers</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Booking Notice and Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>
              <strong>Notice:</strong> Booking Baaba provides unified ticketing,
              real-time seat availability, and transparent fare comparison
              across Indian Railways, domestic &amp; international airlines, and
              intercity buses.
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span>© 2026 Booking Baaba. Har Safar, Ek Jagah.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
