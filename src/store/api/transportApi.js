import { baseApi } from "./baseApi";
export const transportApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Bus Queries & Mutations
        getBuses: builder.query({
            query: () => "/buses",
            providesTags: ["Buses"],
        }),
        getBusById: builder.query({
            query: (id) => `/buses/${id}`,
            providesTags: (_result, _error, id) => [{ type: "Buses", id }],
        }),
        createBus: builder.mutation({
            query: (body) => ({
                url: "/buses",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Buses"],
        }),
        updateBus: builder.mutation({
            query: ({ id, body }) => ({
                url: `/buses/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Buses"],
        }),
        deleteBus: builder.mutation({
            query: (id) => ({
                url: `/buses/${id}`,
                method: "DELETE",
                responseHandler: (response) => response.text(),
            }),
            invalidatesTags: ["Buses"],
        }),
        // Train Queries & Mutations
        getTrains: builder.query({
            query: () => "/trains",
            providesTags: ["Trains"],
        }),
        getTrainById: builder.query({
            query: (id) => `/trains/${id}`,
            providesTags: (_result, _error, id) => [{ type: "Trains", id }],
        }),
        createTrain: builder.mutation({
            query: (body) => ({
                url: "/trains",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Trains"],
        }),
        deleteTrain: builder.mutation({
            query: (id) => ({
                url: `/trains/${id}`,
                method: "DELETE",
                responseHandler: (response) => response.text(),
            }),
            invalidatesTags: ["Trains"],
        }),
        // Flight Queries & Mutations
        getFlights: builder.query({
            query: () => "/flights",
            providesTags: ["Flights"],
        }),
        getFlightById: builder.query({
            query: (id) => `/flights/${id}`,
            providesTags: (_result, _error, id) => [{ type: "Flights", id }],
        }),
        createFlight: builder.mutation({
            query: (body) => ({
                url: "/flights",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Flights"],
        }),
        updateFlight: builder.mutation({
            query: ({ id, body }) => ({
                url: `/flights/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Flights"],
        }),
        deleteFlight: builder.mutation({
            query: (id) => ({
                url: `/flights/${id}`,
                method: "DELETE",
                responseHandler: (response) => response.text(),
            }),
            invalidatesTags: ["Flights"],
        }),
    }),
    overrideExisting: false,
});
export const { useGetBusesQuery, useGetBusByIdQuery, useCreateBusMutation, useUpdateBusMutation, useDeleteBusMutation, useGetTrainsQuery, useGetTrainByIdQuery, useCreateTrainMutation, useDeleteTrainMutation, useGetFlightsQuery, useGetFlightByIdQuery, useCreateFlightMutation, useUpdateFlightMutation, useDeleteFlightMutation, } = transportApi;
