import { baseApi } from "./baseApi";
export const passengerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addPassenger: builder.mutation({
            query: (request) => ({
                url: "/passengers",
                method: "POST",
                body: request,
            }),
            invalidatesTags: ["Bookings"],
        }),
        getPassengerById: builder.query({
            query: (id) => `/passengers/${id}`,
        }),
        getAllPassengers: builder.query({
            query: () => "/passengers",
        }),
    }),
    overrideExisting: false,
});
export const { useAddPassengerMutation, useGetPassengerByIdQuery, useGetAllPassengersQuery, } = passengerApi;
