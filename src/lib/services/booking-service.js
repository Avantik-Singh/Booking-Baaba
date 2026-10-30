const LOCAL_STORAGE_KEY = "booking_baaba_my_trips";
export function generateBookingReference(transportMode) {
    const prefix = transportMode.substring(0, 2).toUpperCase();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `BB-${prefix}-${randomNum}`;
}
export function saveBookingLocally(booking) {
    if (typeof window === "undefined")
        return;
    try {
        const existing = getStoredBookings();
        const updated = [booking, ...existing.filter((b) => b.id !== booking.id)];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }
    catch (error) {
        console.error("Failed to save booking to localStorage", error);
    }
}
export function getStoredBookings() {
    if (typeof window === "undefined")
        return [];
    try {
        const data = localStorage.getItem(LOCAL_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }
    catch {
        return [];
    }
}
export function cancelStoredBooking(bookingId) {
    if (typeof window === "undefined")
        return;
    try {
        const existing = getStoredBookings();
        const updated = existing.map((b) => b.id === bookingId ? { ...b, status: "cancelled" } : b);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }
    catch (error) {
        console.error("Failed to cancel booking", error);
    }
}
