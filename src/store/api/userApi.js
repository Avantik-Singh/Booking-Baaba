import { baseApi } from "./baseApi";
export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserById: builder.query({
            query: (id) => `/users/${id}`,
            providesTags: (_result, _error, id) => [{ type: "User", id }],
        }),
        getAllUsers: builder.query({
            query: () => "/users",
            providesTags: ["User"],
        }),
        updateUser: builder.mutation({
            query: ({ id, data }) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "User", id },
                "User",
            ],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE",
                responseHandler: (response) => response.text(),
            }),
            invalidatesTags: ["User"],
        }),
    }),
    overrideExisting: false,
});
export const { useGetUserByIdQuery, useGetAllUsersQuery, useUpdateUserMutation, useDeleteUserMutation, } = userApi;
