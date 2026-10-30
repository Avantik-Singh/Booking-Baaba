import { createSlice } from "@reduxjs/toolkit";
const getInitialToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("auth_token");
    }
    return null;
};
const getInitialUser = () => {
    if (typeof window !== "undefined") {
        try {
            const stored = localStorage.getItem("bb_user");
            if (stored)
                return JSON.parse(stored);
        }
        catch {
            return null;
        }
    }
    return null;
};
const initialState = {
    token: getInitialToken(),
    user: getInitialUser(),
    isAuthenticated: !!getInitialToken(),
};
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.token = token;
            state.isAuthenticated = true;
            if (user) {
                state.user = user;
                if (typeof window !== "undefined") {
                    localStorage.setItem("bb_user", JSON.stringify(user));
                }
            }
            if (typeof window !== "undefined") {
                localStorage.setItem("auth_token", token);
            }
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            if (typeof window !== "undefined") {
                localStorage.removeItem("auth_token");
                localStorage.removeItem("bb_user");
            }
        },
        updateUserProfile: (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                if (typeof window !== "undefined") {
                    localStorage.setItem("bb_user", JSON.stringify(state.user));
                }
            }
        },
    },
});
export const { setCredentials, logout, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
