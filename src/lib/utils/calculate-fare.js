import faresData from "@/lib/mock-data/fares.json";
export function calculateFare({ transportMode, baseFarePerPassenger, passengerCount, seatPremiumsTotal = 0, selectedExtras = [], discountAmount = 0 }) {
    const count = Math.max(1, passengerCount);
    const totalBaseFare = Math.round(baseFarePerPassenger * count);
    // Extras total
    const extrasFromAddons = selectedExtras.reduce((sum, item) => sum + item.price, 0);
    const totalExtras = Math.round(seatPremiumsTotal + extrasFromAddons);
    // Service Fee based on transport mode
    let serviceFee = faresData.rates.trainServiceFee;
    let gstPercentage = faresData.rates.trainGstPercentage;
    if (transportMode === "flight") {
        serviceFee = faresData.rates.flightServiceFee;
        gstPercentage = faresData.rates.flightGstPercentage;
    }
    else if (transportMode === "bus") {
        serviceFee = faresData.rates.busServiceFee;
        gstPercentage = faresData.rates.busGstPercentage;
    }
    // Taxes (GST calculated on base fare and service fee)
    const taxableAmount = totalBaseFare + serviceFee;
    const taxes = Math.round((taxableAmount * gstPercentage) / 100);
    // Discount
    const appliedDiscount = Math.min(discountAmount, totalBaseFare);
    // Total
    const totalAmount = Math.max(0, totalBaseFare + taxes + serviceFee + totalExtras - appliedDiscount);
    return {
        baseFare: totalBaseFare,
        passengerCount: count,
        taxes,
        serviceFee,
        extrasTotal: totalExtras,
        discount: appliedDiscount,
        totalAmount,
        currency: "INR"
    };
}
