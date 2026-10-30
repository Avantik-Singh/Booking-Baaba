import { baseApi } from "./baseApi";
export const bookingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createBooking: builder.mutation({
            query: (request) => ({
                url: "/bookings",
                method: "POST",
                body: request,
            }),
            invalidatesTags: ["Bookings"],
        }),
        getAllBookings: builder.query({
            query: () => "/bookings",
            providesTags: ["Bookings"],
        }),
        getBookingById: builder.query({
            query: (id) => `/bookings/${id}`,
            providesTags: (_result, _error, id) => [{ type: "Bookings", id }],
        }),
        cancelBooking: builder.mutation({
            query: (id) => ({
                url: `/bookings/${id}/cancel`,
                method: "PUT",
                responseHandler: (response) => response.text(),
            }),
            invalidatesTags: ["Bookings"],
        }),
        deleteBooking: builder.mutation({
            query: (id) => ({
                url: `/bookings/${id}`,
                method: "DELETE",
                responseHandler: (response) => response.text(),
            }),
            invalidatesTags: ["Bookings"],
        }),
    }),
    overrideExisting: false,
});
export const { useCreateBookingMutation, useGetAllBookingsQuery, useGetBookingByIdQuery, useCancelBookingMutation, useDeleteBookingMutation, } = bookingApi;
