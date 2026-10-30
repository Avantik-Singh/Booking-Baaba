import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useDispatch, useSelector } from "react-redux";
import { baseApi } from "./api/baseApi";
import authReducer from "./slices/authSlice";
export const makeStore = () => {
    const store = configureStore({
        reducer: {
            [baseApi.reducerPath]: baseApi.reducer,
            auth: authReducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
    });
    setupListeners(store.dispatch);
    return store;
};
export const store = makeStore();
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
