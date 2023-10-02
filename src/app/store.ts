import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/slices/userSlice";
import userTokenMiddleware from "../redux/middlewares/userTokenMiddleware";

const store = configureStore({
  reducer: {
    user: userReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userTokenMiddleware)
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
