import { z } from "zod";
export const singlePassengerSchema = z.object({
    id: z.string(),
    firstName: z.string().min(2, "First name must have at least 2 letters"),
    lastName: z.string().min(1, "Last name is required"),
    age: z.coerce.number().min(1, "Enter a valid age").max(120),
    gender: z.enum(["M", "F", "Other"]),
    berthPreference: z.string().optional(),
    mealPreference: z.string().optional()
});
export const contactInfoSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number")
});
export const passengerListSchema = z.object({
    contact: contactInfoSchema,
    passengers: z.array(singlePassengerSchema).min(1, "At least 1 passenger is required")
});
