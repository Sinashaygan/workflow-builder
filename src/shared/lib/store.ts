
import { workflowReducer } from "@/entities/workflow/model";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    workflow: workflowReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true,
    }),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch