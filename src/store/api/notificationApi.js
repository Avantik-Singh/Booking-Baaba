import { baseApi } from "./baseApi";
export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: () => "/notifications",
            providesTags: ["Notifications"],
        }),
        getNotificationById: builder.query({
            query: (id) => `/notifications/${id}`,
            providesTags: (_result, _error, id) => [{ type: "Notifications", id }],
        }),
        createNotification: builder.mutation({
            query: (body) => ({
                url: "/notifications",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Notifications"],
        }),
        deleteNotification: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}`,
                method: "DELETE",
                responseHandler: (response) => response.text(),
            }),
            invalidatesTags: ["Notifications"],
        }),
    }),
    overrideExisting: false,
});
export const { useGetNotificationsQuery, useGetNotificationByIdQuery, useCreateNotificationMutation, useDeleteNotificationMutation, } = notificationApi;
