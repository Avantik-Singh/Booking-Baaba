"use client";
import React, { useState } from "react";
import { SlidersHorizontal, AlertCircle, Train, Plane, Bus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResultsFilters } from "./results-filters";
import { TrainResultCard } from "./train-result-card";
import { FlightResultCard } from "./flight-result-card";
import { BusResultCard } from "./bus-result-card";
import { useSearchStore } from "@/store/search-store";
import { toast } from "sonner";
import { searchTrains } from "@/lib/services/train-search-service";
import { searchFlights } from "@/lib/services/flight-search-service";
import { searchBuses } from "@/lib/services/bus-search-service";
import { getStationById, getAirportById, getCityById } from "@/lib/services/route-service";
export function ResultsSection() {
    const { activeMode, setActiveMode, trainCriteria, flightCriteria, busCriteria, filters, resetFilters, sortBy, setSortBy } = useSearchStore();
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const formatFlightRoute = (originAirportId, destinationAirportId) => {
        const origin = getAirportById(originAirportId);
        const destination = getAirportById(destinationAirportId);
        return `${origin?.city || "Origin"} (${origin?.iataCode || "—"}) → ${destination?.city || "Destination"} (${destination?.iataCode || "—"})`;
    };
    // Compute live search results based on activeMode
    let resultsCount = 0;
    let originLabel = "";
    let destLabel = "";
    let journeyDateLabel = "";
    let trainResults = [];
    let returnTrainResults = [];
    let flightResults = [];
    let flightLegResults = [];
    let busResults = [];
    let busLegResults = [];
    const formatBusRoute = (originCityId, destinationCityId) => {
        const origin = getCityById(originCityId);
        const destination = getCityById(destinationCityId);
        return `${origin?.name || "Origin"} → ${destination?.name || "Destination"}`;
    };
    if (activeMode === "train") {
        trainResults = searchTrains({
            originStationId: trainCriteria.originStationId,
            destinationStationId: trainCriteria.destinationStationId,
            journeyDate: trainCriteria.journeyDate,
            travelClass: trainCriteria.travelClass,
            filters,
            sortBy
        });
        if (trainCriteria.tripType === "round-trip" && trainCriteria.returnDate) {
            returnTrainResults = searchTrains({
                originStationId: trainCriteria.destinationStationId,
                destinationStationId: trainCriteria.originStationId,
                journeyDate: trainCriteria.returnDate,
                travelClass: trainCriteria.travelClass,
                filters,
                sortBy
            });
        }
        resultsCount = trainResults.length + returnTrainResults.length;
        const origin = getStationById(trainCriteria.originStationId);
        const dest = getStationById(trainCriteria.destinationStationId);
        originLabel = origin ? `${origin.city} [${origin.code}]` : "Origin";
        destLabel = dest ? `${dest.city} [${dest.code}]` : "Destination";
        journeyDateLabel = trainCriteria.tripType === "round-trip"
            ? `Outbound: ${trainCriteria.journeyDate} / Return: ${trainCriteria.returnDate || "Select date"}`
            : trainCriteria.journeyDate;
    }
    else if (activeMode === "flight") {
        flightResults = searchFlights({
            originAirportId: flightCriteria.originAirportId,
            destinationAirportId: flightCriteria.destinationAirportId,
            journeyDate: flightCriteria.journeyDate,
            cabinClass: flightCriteria.cabinClass,
            filters,
            sortBy
        });
        flightLegResults = [
            {
                label: flightCriteria.tripType === "round-trip"
                    ? "Outbound"
                    : flightCriteria.tripType === "multi-city"
                        ? "Leg 1"
                        : "Flights",
                routeLabel: formatFlightRoute(flightCriteria.originAirportId, flightCriteria.destinationAirportId),
                journeyDate: flightCriteria.journeyDate,
                results: flightResults,
            },
        ];
        if (flightCriteria.tripType === "round-trip") {
            flightLegResults.push({
                label: "Return",
                routeLabel: formatFlightRoute(flightCriteria.destinationAirportId, flightCriteria.originAirportId),
                journeyDate: flightCriteria.returnDate || "",
                results: flightCriteria.returnDate
                    ? searchFlights({
                        originAirportId: flightCriteria.destinationAirportId,
                        destinationAirportId: flightCriteria.originAirportId,
                        journeyDate: flightCriteria.returnDate,
                        cabinClass: flightCriteria.cabinClass,
                        filters,
                        sortBy,
                    })
                    : [],
            });
        }
        else if (flightCriteria.tripType === "multi-city") {
            flightCriteria.multiCityLegs.forEach((leg, index) => {
                flightLegResults.push({
                    label: `Leg ${index + 2}`,
                    routeLabel: formatFlightRoute(leg.originAirportId, leg.destinationAirportId),
                    journeyDate: leg.journeyDate,
                    results: searchFlights({
                        originAirportId: leg.originAirportId,
                        destinationAirportId: leg.destinationAirportId,
                        journeyDate: leg.journeyDate,
                        cabinClass: flightCriteria.cabinClass,
                        filters,
                        sortBy,
                    }),
                });
            });
        }
        resultsCount = flightLegResults.reduce((total, leg) => total + leg.results.length, 0);
        const origin = getAirportById(flightCriteria.originAirportId);
        const dest = getAirportById(flightCriteria.destinationAirportId);
        originLabel = origin ? `${origin.city} (${origin.iataCode})` : "Origin";
        destLabel = dest ? `${dest.city} (${dest.iataCode})` : "Destination";
        journeyDateLabel = flightLegResults
            .map((leg) => `${leg.label}: ${leg.journeyDate || "Select date"}`)
            .join(" / ");
    }
    else {
        busResults =
            busCriteria.originCityId &&
                busCriteria.destinationCityId &&
                busCriteria.journeyDate
                ? searchBuses({
                    originCityId: busCriteria.originCityId,
                    destinationCityId: busCriteria.destinationCityId,
                    journeyDate: busCriteria.journeyDate,
                    filters,
                    sortBy,
                })
                : [];
        busLegResults = [{
                label: busCriteria.tripType === "multi-city" ? "Leg 1" : "Outbound",
                routeLabel: formatBusRoute(busCriteria.originCityId, busCriteria.destinationCityId),
                journeyDate: busCriteria.journeyDate,
                results: busResults,
            }];
        if (busCriteria.tripType === "round-trip") {
            busLegResults.push({
                label: "Return",
                routeLabel: formatBusRoute(busCriteria.destinationCityId, busCriteria.originCityId),
                journeyDate: busCriteria.returnDate,
                results: busCriteria.returnDate
                    ? searchBuses({
                        originCityId: busCriteria.destinationCityId,
                        destinationCityId: busCriteria.originCityId,
                        journeyDate: busCriteria.returnDate,
                        filters,
                        sortBy,
                    })
                    : [],
            });
        }
        else if (busCriteria.tripType === "multi-city") {
            busCriteria.multiCityLegs.forEach((leg, index) => {
                busLegResults.push({
                    label: `Leg ${index + 2}`,
                    routeLabel: formatBusRoute(leg.originCityId, leg.destinationCityId),
                    journeyDate: leg.journeyDate,
                    results: leg.originCityId && leg.destinationCityId && leg.journeyDate
                        ? searchBuses({
                            originCityId: leg.originCityId,
                            destinationCityId: leg.destinationCityId,
                            journeyDate: leg.journeyDate,
                            filters,
                            sortBy,
                        })
                        : [],
                });
            });
        }
        resultsCount = busLegResults.reduce((total, leg) => total + leg.results.length, 0);
        const origin = getCityById(busCriteria.originCityId);
        const dest = getCityById(busCriteria.destinationCityId);
        originLabel = origin ? origin.name : "Origin";
        destLabel = dest ? dest.name : "Destination";
        journeyDateLabel = busLegResults
            .map((leg) => `${leg.label}: ${leg.journeyDate || "Select date"}`)
            .join(" / ");
    }
    return (<section id="search-results-section" className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 space-y-6">
      
      {/* Search Result Bar */}
      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 border border-border/80 bg-card text-card-foreground rounded-xl shadow-xs transition-colors">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-lg sm:text-xl text-foreground">
              {originLabel} → {destLabel}
            </span>

            {/* Interactive Transport Mode Switcher in Output Area */}
            <div className="inline-flex items-center p-1 bg-muted/50 rounded-lg gap-1 border border-border/60">
              <button type="button" onClick={() => {
            setActiveMode("train");
            toast.info("Showing Trains results");
        }} className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer select-none ${activeMode === "train"
            ? "bg-primary text-primary-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                <Train className="w-3.5 h-3.5"/> Trains
              </button>
              <button type="button" onClick={() => {
            setActiveMode("flight");
            toast.info("Showing Flights results");
        }} className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer select-none ${activeMode === "flight"
            ? "bg-primary text-primary-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                <Plane className="w-3.5 h-3.5"/> Flights
              </button>
              <button type="button" onClick={() => {
            setActiveMode("bus");
            toast.info("Showing Buses results");
        }} className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer select-none ${activeMode === "bus"
            ? "bg-primary text-primary-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                <Bus className="w-3.5 h-3.5"/> Buses
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Date: <span className="font-semibold text-foreground">{journeyDateLabel}</span> •{" "}
            Found <strong className="text-primary font-bold">{resultsCount}</strong> available {activeMode} service{resultsCount === 1 ? "" : "s"}
          </p>
        </div>

        {/* Sort Controls & Mobile Filter Trigger */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap hidden sm:inline">Sort By:</span>
            <Select value={sortBy} onValueChange={(val) => { if (val)
        setSortBy(val); }}>
              <SelectTrigger className="h-9 w-44 rounded-lg text-xs font-medium bg-background border-border/80 text-foreground">
                <SelectValue placeholder="Sort option"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="cheapest">Price: Lowest First</SelectItem>
                <SelectItem value="earliest">Earliest Departure</SelectItem>
                <SelectItem value="fastest">Shortest Duration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
              <SheetTrigger className="inline-flex items-center gap-2 h-9 px-3 rounded-lg text-xs font-semibold border border-border/80 bg-background text-foreground hover:bg-muted cursor-pointer">
                <SlidersHorizontal className="w-3.5 h-3.5"/> Filters
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 overflow-y-auto bg-card border-border text-foreground">
                <SheetHeader className="p-4 border-b border-border">
                  <SheetTitle className="text-sm font-bold text-foreground">Search Filters</SheetTitle>
                </SheetHeader>
                <div className="p-4">
                  <ResultsFilters />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Card>

      {/* Main Grid: Filters Sidebar + Results List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-3 xl:col-span-3 sticky top-20">
          <ResultsFilters />
        </div>

        {/* Results List */}
        <div className="lg:col-span-9 xl:col-span-9 space-y-4">
          {resultsCount === 0 && activeMode !== "flight" && activeMode !== "bus" ? (<Card className="p-12 text-center border border-border/80 bg-card rounded-xl shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mx-auto">
                <AlertCircle className="w-6 h-6"/>
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">No Services Found for this Selection</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1">
                  We couldn&apos;t find any {activeMode}s matching your filter criteria on this route. Try adjusting your filters or clearing selected options.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={resetFilters} className="rounded-lg text-xs font-semibold">
                Clear Filters
              </Button>
            </Card>) : (<>
              {activeMode === "train" && (<div className="space-y-6">
                  <section className="space-y-3">
                    <h2 className="text-base font-bold text-foreground">
                      Outbound trains <span className="text-sm font-medium text-muted-foreground">({trainCriteria.journeyDate})</span>
                    </h2>
                    {trainResults.length > 0 ? (trainResults.map((train) => <TrainResultCard key={train.id} train={train}/>)) : (<Card className="p-6 text-center border border-border/80 bg-card rounded-xl shadow-xs">
                        <p className="text-sm text-muted-foreground">No outbound trains found for this route and date.</p>
                      </Card>)}
                  </section>

                  {trainCriteria.tripType === "round-trip" && (<section className="space-y-3">
                      <h2 className="text-base font-bold text-foreground">
                        Return trains <span className="text-sm font-medium text-muted-foreground">({trainCriteria.returnDate || "select a return date"})</span>
                      </h2>
                      {returnTrainResults.length > 0 ? (returnTrainResults.map((train) => <TrainResultCard key={train.id} train={train}/>)) : (<Card className="p-6 text-center border border-border/80 bg-card rounded-xl shadow-xs">
                          <p className="text-sm text-muted-foreground">No return trains found for this route and date.</p>
                        </Card>)}
                    </section>)}
                </div>)}

              {activeMode === "flight" && (<div className="space-y-6">
                  {flightLegResults.map((leg, index) => (<section key={`flight-leg-${index}`} className="space-y-3">
                      <h2 className="text-base font-bold text-foreground">
                        {leg.label === "Flights" ? "Available flights" : leg.label}{": "}
                        <span>{leg.routeLabel}</span>{" "}
                        <span className="text-sm font-medium text-muted-foreground">({leg.journeyDate || "select a date"})</span>
                      </h2>
                      {leg.results.length > 0 ? (leg.results.map((flight) => (<FlightResultCard key={flight.id} flight={flight} journeyDate={leg.journeyDate}/>))) : (<Card className="p-6 text-center border border-border/80 bg-card rounded-xl shadow-xs space-y-3">
                          <p className="text-sm text-muted-foreground">No flights found for this route and date.</p>
                          <Button type="button" variant="outline" size="sm" onClick={resetFilters} className="rounded-lg text-xs font-semibold">
                            Clear Filters
                          </Button>
                        </Card>)}
                    </section>))}
                </div>)}

              {activeMode === "bus" && (<div className="space-y-6">
                  {busLegResults.map((leg, index) => (<section key={`bus-leg-${index}`} className="space-y-3">
                      <h2 className="text-base font-bold text-foreground">
                        {leg.label}: <span>{leg.routeLabel}</span>{" "}
                        <span className="text-sm font-medium text-muted-foreground">({leg.journeyDate || "select a date"})</span>
                      </h2>
                      {leg.results.length > 0 ? (leg.results.map((bus) => (<BusResultCard key={bus.id} bus={bus} journeyDate={leg.journeyDate}/>))) : (<Card className="p-6 text-center border border-border/80 bg-card rounded-xl shadow-xs space-y-3">
                          <p className="text-sm text-muted-foreground">No buses found for this route and date.</p>
                          <Button type="button" variant="outline" size="sm" onClick={resetFilters} className="rounded-lg text-xs font-semibold">
                            Clear Filters
                          </Button>
                        </Card>)}
                    </section>))}
                </div>)}
            </>)}
        </div>

      </div>

    </section>);
}
