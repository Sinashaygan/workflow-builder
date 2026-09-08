"use client";

import React from "react";
import { Provider } from "react-redux";
import { ReactFlowProvider } from "@xyflow/react";
import { store } from "@/shared/lib/store";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <ReactFlowProvider>{children}</ReactFlowProvider>
    </Provider>
  );
}
