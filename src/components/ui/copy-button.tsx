"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { adminCommon } from "@/i18n/admin/common";
import { cn } from "@/lib/utils";

const COPIED_MS = 2000;

export interface CopyButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
    value: string;
    label?: string;
    iconOnly?: boolean;
}

export function CopyButton({ value, label = adminCommon.actions.copy, iconOnly, className, variant = "glass", size = "sm", ...props }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    async function copy(event: React.MouseEvent) {
        event.stopPropagation();
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), COPIED_MS);
        } catch {
            setCopied(false);
        }
    }

    const text = copied ? adminCommon.actions.copied : label;
    return (
        <Button
            type="button"
            variant={iconOnly ? "ghost" : variant}
            size={iconOnly ? "icon" : size}
            className={cn(iconOnly ? "size-8 rounded-full text-muted-foreground" : "rounded-full", className)}
            onClick={copy}
            aria-label={iconOnly ? text : undefined}
            title={iconOnly ? text : undefined}
            {...props}
        >
            {copied ? <Check className="text-emerald-400" /> : <Copy />}
            {!iconOnly && text}
        </Button>
    );
}
