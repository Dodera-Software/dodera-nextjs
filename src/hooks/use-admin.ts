"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient, type MutationFunction } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminQueryKey, ADMIN_QUERY } from "@/config/admin";
import { errorMessage } from "@/lib/admin-api";

export interface AdminMutationOptions<TData, TVariables> {
    mutationFn: MutationFunction<TData, TVariables>;
    invalidates?: AdminQueryKey[];
    success?: string | ((data: TData, variables: TVariables) => string);
    onSuccess?: (data: TData, variables: TVariables) => void;
    silentError?: boolean;
}

export function useAdminMutation<TData = unknown, TVariables = void>({
    mutationFn,
    invalidates = [],
    success,
    onSuccess,
    silentError,
}: AdminMutationOptions<TData, TVariables>) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn,
        onSuccess: async (data, variables) => {
            await Promise.all(invalidates.map((key) => queryClient.invalidateQueries({ queryKey: [key] })));
            if (success) toast.success(typeof success === "function" ? success(data, variables) : success);
            onSuccess?.(data, variables);
        },
        onError: (error) => {
            if (!silentError) toast.error(errorMessage(error));
        },
    });
}

export function useDebouncedValue<T>(value: T, delayMs: number = ADMIN_QUERY.searchDebounceMs): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(id);
    }, [value, delayMs]);
    return debounced;
}
