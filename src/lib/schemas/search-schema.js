import { z } from "zod";
export const trainSearchSchema = z
    .object({
    transportMode: z.literal("train"),
    originId: z.string().min(1, "Please select departure station"),
    destinationId: z.string().min(1, "Please select destination station"),
    journeyDate: z.string().min(1, "Please select travel date"),
    passengerCount: z.number().min(1).max(6),
    travelClass: z.string().optional(),
})
    .refine((data) => data.originId !== data.destinationId, {
    message: "Origin and destination stations cannot be the same",
    path: ["destinationId"],
});
export const flightSearchSchema = z
    .object({
    transportMode: z.literal("flight"),
    tripType: z.enum(["one-way", "round-trip", "multi-city"]).default("one-way"),
    originId: z.string().min(1, "Please select origin airport"),
    destinationId: z.string().min(1, "Please select destination airport"),
    journeyDate: z.string().min(1, "Please select departure date"),
    returnDate: z.string().optional(),
    multiCityLegs: z
        .array(z
        .object({
        originId: z.string().min(1, "Please select origin airport"),
        destinationId: z.string().min(1, "Please select destination airport"),
        journeyDate: z.string().min(1, "Please select travel date"),
    })
        .refine((leg) => leg.originId !== leg.destinationId, {
        message: "Origin and destination airports cannot be the same",
        path: ["destinationId"],
    }))
        .optional(),
    passengerCount: z.number().min(1).max(9),
    cabinClass: z
        .enum(["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"])
        .default("ECONOMY"),
})
    .refine((data) => data.originId !== data.destinationId, {
    message: "Origin and destination airports cannot be the same",
    path: ["destinationId"],
})
    .refine((data) => data.tripType !== "multi-city" || (data.multiCityLegs?.length ?? 0) > 0, {
    message: "Please add at least one additional flight leg",
    path: ["multiCityLegs"],
});
export const busSearchSchema = z
    .object({
    transportMode: z.literal("bus"),
    tripType: z.enum(["one-way", "round-trip", "multi-city"]).default("one-way"),
    originId: z.string().min(1, "Please select departure city"),
    destinationId: z.string().min(1, "Please select arrival city"),
    journeyDate: z.string().min(1, "Please select travel date"),
    returnDate: z.string().optional(),
    multiCityLegs: z
        .array(z
        .object({
        originId: z.string().min(1, "Please select departure city"),
        destinationId: z.string().min(1, "Please select arrival city"),
        journeyDate: z.string().min(1, "Please select travel date"),
    })
        .refine((leg) => leg.originId !== leg.destinationId, {
        message: "Origin and destination cities cannot be the same",
        path: ["destinationId"],
    }))
        .optional(),
    passengerCount: z.number().min(1).max(6),
})
    .refine((data) => data.originId !== data.destinationId, {
    message: "Origin and destination cities cannot be the same",
    path: ["destinationId"],
})
    .refine((data) => data.tripType !== "multi-city" || (data.multiCityLegs?.length ?? 0) > 0, {
    message: "Please add at least one additional bus leg",
    path: ["multiCityLegs"],
});
