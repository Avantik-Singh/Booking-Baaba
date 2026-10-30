import seatLayoutsData from "@/lib/mock-data/seat-layouts.json";
export const allSeatLayouts = seatLayoutsData;
export function getSeatLayoutById(layoutId) {
    const layout = allSeatLayouts.find((l) => l.id === layoutId);
    if (!layout)
        return undefined;
    // Return a cloned layout copy so that runtime changes do not mutate global data
    return JSON.parse(JSON.stringify(layout));
}
export function getSelectedSeatsSummary(layout, selectedSeatIds) {
    return layout.seats.filter((s) => selectedSeatIds.includes(s.id));
}
