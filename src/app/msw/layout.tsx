"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";

const MSWLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const [queryCient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryCient}>{children}</QueryClientProvider>
  );
};

export default MSWLayout;
