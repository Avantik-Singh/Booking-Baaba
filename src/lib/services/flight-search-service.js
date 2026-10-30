import flightsData from "@/lib/mock-data/flights.json";
import { getTimeOfDayBucket } from "@/lib/utils/filter-results";
export const allFlights = flightsData;
export function searchFlights({ originAirportId, destinationAirportId, journeyDate, cabinClass, filters, sortBy = "recommended" }) {
    let results = allFlights.filter((flight) => {
        const matchesRoute = flight.originAirportId === originAirportId &&
            flight.destinationAirportId === destinationAirportId;
        if (!matchesRoute)
            return false;
        // Filter by cabin class if fares exist
        if (cabinClass && cabinClass !== "ALL") {
            const hasFare = flight.fares.some((f) => f.cabinClass === cabinClass);
            if (!hasFare)
                return false;
        }
        return true;
    });
    // Apply filters
    if (filters) {
        if (filters.operators && filters.operators.length > 0) {
            results = results.filter((f) => filters.operators.includes(f.airlineCode));
        }
        if (filters.timeOfDay && filters.timeOfDay.length > 0) {
            results = results.filter((f) => filters.timeOfDay.includes(getTimeOfDayBucket(f.departureTime)));
        }
        if (filters.stops !== undefined && filters.stops.length > 0) {
            results = results.filter((f) => filters.stops.includes(f.stops));
        }
        if (filters.priceMax !== undefined) {
            results = results.filter((f) => {
                const minFare = Math.min(...f.fares.map((fare) => fare.baseFare));
                return minFare <= filters.priceMax;
            });
        }
    }
    // Sort results
    results.sort((a, b) => {
        const minFareA = Math.min(...a.fares.map((f) => f.baseFare));
        const minFareB = Math.min(...b.fares.map((f) => f.baseFare));
        switch (sortBy) {
            case "cheapest":
                return minFareA - minFareB;
            case "earliest":
                return a.departureTime.localeCompare(b.departureTime);
            case "fastest":
                return a.durationMinutes - b.durationMinutes;
            case "recommended":
            default: {
                // Non-stop flights first, then lower price
                if (a.stops !== b.stops)
                    return a.stops - b.stops;
                return minFareA - minFareB;
            }
        }
    });
    return results;
}
export function getFlightById(id) {
    return allFlights.find((f) => f.id === id);
}
