"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfirmDialogProvider } from "@/hooks/use-confirm";
import { ADMIN_QUERY } from "@/config/admin";

export function AdminProviders({ children }: { children: ReactNode }) {
    const [client] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: { staleTime: ADMIN_QUERY.staleMs, retry: 1, refetchOnWindowFocus: false },
                },
            }),
    );
    return (
        <QueryClientProvider client={client}>
            <ConfirmDialogProvider>{children}</ConfirmDialogProvider>
        </QueryClientProvider>
    );
}
