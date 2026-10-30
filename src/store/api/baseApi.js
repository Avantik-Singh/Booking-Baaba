import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const getBaseUrl = () => {
    return import.meta.env?.VITE_API_URL || "http://localhost:8080/api";
};
export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: getBaseUrl(),
        prepareHeaders: (headers) => {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("auth_token");
                if (token) {
                    headers.set("Authorization", `Bearer ${token}`);
                }
            }
            return headers;
        },
    }),
    tagTypes: ["User", "Buses", "Trains", "Flights", "Bookings", "Notifications"],
    endpoints: () => ({}),
});
