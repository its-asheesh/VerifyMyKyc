import { configureStore } from "@reduxjs/toolkit"
import productReducer from "./slices/productSlice"
import solutionReducer from "./slices/solutionSlice"
import authReducer from "./slices/authSlice"
import orderReducer from "./slices/orderSlice"

export const store = configureStore({
  reducer: {
    products: productReducer,
    solutions: solutionReducer,
    auth: authReducer,
    orders: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
