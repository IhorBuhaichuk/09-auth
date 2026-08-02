"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import css from "./TanStackProvider.module.css";

interface TanStackProviderProps {
  children: ReactNode;
}

function TanStackProvider({ children }: TanStackProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div className={css.provider}>{children}</div>
    </QueryClientProvider>
  );
}

export default TanStackProvider;
