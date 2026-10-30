import busesData from "@/lib/mock-data/buses.json";
import { getTimeOfDayBucket, } from "@/lib/utils/filter-results";
export const allBuses = busesData;
export function searchBuses({ originCityId, destinationCityId, journeyDate, filters, sortBy = "recommended", }) {
    let results = allBuses.filter((bus) => {
        return (bus.originCityId === originCityId &&
            bus.destinationCityId === destinationCityId);
    });
    // Apply filters
    if (filters) {
        if (filters.operators && filters.operators.length > 0) {
            results = results.filter((b) => filters.operators.includes(b.operatorId));
        }
        if (filters.timeOfDay && filters.timeOfDay.length > 0) {
            results = results.filter((b) => filters.timeOfDay.includes(getTimeOfDayBucket(b.departureTime)));
        }
        if (filters.acOnly) {
            results = results.filter((b) => b.isAC);
        }
        if (filters.categories && filters.categories.length > 0) {
            results = results.filter((b) => filters.categories.includes(b.busType));
        }
        if (filters.priceMax !== undefined) {
            results = results.filter((b) => b.farePerSeat <= filters.priceMax);
        }
    }
    // Sort results
    results.sort((a, b) => {
        switch (sortBy) {
            case "cheapest":
                return a.farePerSeat - b.farePerSeat;
            case "earliest":
                return a.departureTime.localeCompare(b.departureTime);
            case "fastest":
                return a.durationMinutes - b.durationMinutes;
            case "recommended":
            default: {
                // Sleeper and AC preference
                const score = (bus) => (bus.isAC ? 2 : 0) + (bus.busType === "SLEEPER" ? 2 : 1);
                return score(b) - score(a) || a.farePerSeat - b.farePerSeat;
            }
        }
    });
    return results;
}
export function getBusById(id) {
    return allBuses.find((b) => b.id === id);
}
