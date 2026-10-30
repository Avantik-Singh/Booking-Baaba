import { baseApi } from "./baseApi";
export const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        processPayment: builder.mutation({
            query: (request) => ({
                url: "/payments",
                method: "POST",
                body: request,
            }),
            invalidatesTags: ["Bookings"],
        }),
        getPaymentById: builder.query({
            query: (id) => `/payments/${id}`,
        }),
    }),
    overrideExisting: false,
});
export const { useProcessPaymentMutation, useGetPaymentByIdQuery, } = paymentApi;
