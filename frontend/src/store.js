import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice.js";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddlware) =>
    getDefaultMiddlware().concat(apiSlice.middleware),
  devtools: true,
});

export default store;
