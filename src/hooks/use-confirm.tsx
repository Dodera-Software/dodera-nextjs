"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ConfirmOptions {
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "default" | "destructive";
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

// ─── Context ─────────────────────────────────────────────────────────────────

const ConfirmContext = createContext<ConfirmFn | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

interface DialogState extends ConfirmOptions {
    resolve: (value: boolean) => void;
}

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
    const [dialog, setDialog] = useState<DialogState | null>(null);

    const confirm: ConfirmFn = useCallback(
        (options) =>
            new Promise<boolean>((resolve) => {
                setDialog({ ...options, resolve });
            }),
        [],
    );

    function settle(confirmed: boolean) {
        dialog?.resolve(confirmed);
        setDialog(null);
    }

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            <ConfirmDialog
                open={!!dialog}
                onOpenChange={(open) => {
                    if (!open) settle(false);
                }}
                title={dialog?.title ?? ""}
                description={dialog?.description ?? ""}
                confirmLabel={dialog?.confirmLabel}
                cancelLabel={dialog?.cancelLabel}
                variant={dialog?.variant}
                onConfirm={() => settle(true)}
            />
        </ConfirmContext.Provider>
    );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Returns an imperative `confirm(options)` function that shows a modal dialog
 * and resolves to `true` if confirmed, `false` if cancelled or dismissed.
 *
 * Must be used inside `<ConfirmDialogProvider>`.
 *
 * @example
 * const confirm = useConfirm();
 * async function handleDelete(id: number) {
 *   const ok = await confirm({ title: "Delete?", description: "This cannot be undone." });
 *   if (ok) doDelete(id);
 * }
 */
export function useConfirm(): ConfirmFn {
    const ctx = useContext(ConfirmContext);
    if (!ctx) {
        throw new Error("useConfirm must be used inside <ConfirmDialogProvider>");
    }
    return ctx;
}
