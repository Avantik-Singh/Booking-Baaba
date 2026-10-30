import trainsData from "@/lib/mock-data/trains.json";
import { getTimeOfDayBucket } from "@/lib/utils/filter-results";
export const allTrains = trainsData;
export function searchTrains({ originStationId, destinationStationId, journeyDate, travelClass, filters, sortBy = "recommended" }) {
    let results = allTrains.filter((train) => {
        const matchesRoute = train.originStationId === originStationId &&
            train.destinationStationId === destinationStationId;
        if (!matchesRoute)
            return false;
        // Check running day if date is valid
        if (journeyDate) {
            try {
                const dayOfWeek = new Date(journeyDate).getDay();
                if (train.runningDays && train.runningDays.length > 0 && !train.runningDays.includes(dayOfWeek)) {
                    // In demo data, keep running if it's broad, but respect schedule
                    return false;
                }
            }
            catch {
                // Fallback to match
            }
        }
        // Filter by class if specified
        if (travelClass && travelClass !== "ALL") {
            const hasClass = train.classes.some((c) => c.classCode === travelClass);
            if (!hasClass)
                return false;
        }
        return true;
    });
    // Apply filters
    if (filters) {
        if (filters.categories && filters.categories.length > 0) {
            results = results.filter((t) => filters.categories.includes(t.category));
        }
        if (filters.timeOfDay && filters.timeOfDay.length > 0) {
            results = results.filter((t) => filters.timeOfDay.includes(getTimeOfDayBucket(t.departureTime)));
        }
        if (filters.priceMax !== undefined) {
            results = results.filter((t) => {
                const minFare = Math.min(...t.classes.map((c) => c.fare));
                return minFare <= filters.priceMax;
            });
        }
        if (filters.classes && filters.classes.length > 0) {
            results = results.filter((t) => t.classes.some((c) => filters.classes.includes(c.classCode)));
        }
    }
    // Sort results
    results.sort((a, b) => {
        const minFareA = Math.min(...a.classes.map((c) => c.fare));
        const minFareB = Math.min(...b.classes.map((c) => c.fare));
        switch (sortBy) {
            case "cheapest":
                return minFareA - minFareB;
            case "earliest":
                return a.departureTime.localeCompare(b.departureTime);
            case "fastest":
                return a.durationMinutes - b.durationMinutes;
            case "recommended":
            default: {
                // Vande Bharat & Rajdhani prioritized
                const priorityScore = (t) => t.category === "Vande Bharat" ? 3 : t.category === "Rajdhani" ? 2 : 1;
                return priorityScore(b) - priorityScore(a);
            }
        }
    });
    return results;
}
export function getTrainById(id) {
    return allTrains.find((t) => t.id === id);
}
