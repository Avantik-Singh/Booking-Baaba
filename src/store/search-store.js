import { create } from "zustand";
export const useSearchStore = create((set) => ({
    activeMode: "train",
    setActiveMode: (mode) => set({
        activeMode: mode,
        hasSearched: true, // keep smooth results transition
        filters: {},
        sortBy: "recommended",
    }),
    trainCriteria: {
        originStationId: "station-ndls",
        destinationStationId: "station-bsb",
        journeyDate: "2026-10-15",
        returnDate: "",
        tripType: "one-way",
        passengerCount: 1,
        passengerBreakdown: { adults: 1, children: 0, infants: 0 },
        travelClass: "ALL",
        quota: "GN",
    },
    setTrainCriteria: (criteria) => set((state) => ({
        trainCriteria: { ...state.trainCriteria, ...criteria },
        hasSearched: true,
    })),
    flightCriteria: {
        originAirportId: "airport-del",
        destinationAirportId: "airport-blr",
        journeyDate: "2026-10-16",
        returnDate: "",
        multiCityLegs: [],
        passengerCount: 1,
        passengerBreakdown: { adults: 1, children: 0, infants: 0 },
        cabinClass: "ECONOMY",
        tripType: "one-way",
    },
    setFlightCriteria: (criteria) => set((state) => ({
        flightCriteria: { ...state.flightCriteria, ...criteria },
        hasSearched: true,
    })),
    busCriteria: {
        originCityId: "city-blr",
        destinationCityId: "city-che",
        journeyDate: "2026-10-14",
        returnDate: "",
        multiCityLegs: [],
        tripType: "one-way",
        passengerCount: 1,
        passengerBreakdown: { adults: 1, children: 0, infants: 0 },
    },
    setBusCriteria: (criteria) => set((state) => ({
        busCriteria: { ...state.busCriteria, ...criteria },
        hasSearched: true,
    })),
    hasSearched: true, // Default to true so users immediately see live results
    setHasSearched: (searched) => set({ hasSearched: searched }),
    filters: {},
    setFilters: (newFilters) => set((state) => ({ filters: { ...state.filters, ...newFilters } })),
    resetFilters: () => set({ filters: {}, sortBy: "recommended" }),
    sortBy: "recommended",
    setSortBy: (sort) => set({ sortBy: sort }),
    prefillSearch: (mode, originId, destinationId) => {
        set((state) => {
            if (mode === "train") {
                return {
                    activeMode: "train",
                    hasSearched: true,
                    trainCriteria: {
                        ...state.trainCriteria,
                        originStationId: originId,
                        destinationStationId: destinationId,
                    },
                };
            }
            if (mode === "flight") {
                return {
                    activeMode: "flight",
                    hasSearched: true,
                    flightCriteria: {
                        ...state.flightCriteria,
                        originAirportId: originId,
                        destinationAirportId: destinationId,
                    },
                };
            }
            return {
                activeMode: "bus",
                hasSearched: true,
                busCriteria: {
                    ...state.busCriteria,
                    originCityId: originId,
                    destinationCityId: destinationId,
                },
            };
        });
    },
}));
