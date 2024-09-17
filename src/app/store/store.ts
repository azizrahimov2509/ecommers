import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./searchSlice"; // Adjust the path to your slice

// Create the store with your reducers
export const store = configureStore({
  reducer: {
    search: searchReducer,
  },
});

// Define the RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
