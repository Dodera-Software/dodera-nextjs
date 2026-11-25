"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { ConfirmVariant } from "@/config/ui";
import { adminCommon } from "@/i18n/admin/common";

export interface ConfirmOptions {
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: ConfirmVariant;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

interface DialogState extends ConfirmOptions {
    resolve: (value: boolean) => void;
}

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
    const [dialog, setDialog] = useState<DialogState | null>(null);

    const confirm: ConfirmFn = useCallback((options) => new Promise<boolean>((resolve) => setDialog({ ...options, resolve })), []);

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
                confirmLabel={dialog?.confirmLabel ?? adminCommon.actions.confirm}
                cancelLabel={dialog?.cancelLabel ?? adminCommon.actions.cancel}
                variant={dialog?.variant}
                onConfirm={() => settle(true)}
            />
        </ConfirmContext.Provider>
    );
}

export function useConfirm(): ConfirmFn {
    const ctx = useContext(ConfirmContext);
    if (!ctx) throw new Error("useConfirm must be used inside <ConfirmDialogProvider>");
    return ctx;
}
