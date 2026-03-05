import { AlertCircle } from "lucide-react";

export interface FieldErrorProps {
    /** Error message to display. Renders nothing when undefined or empty. */
    message?: string;
}

/**
 * Inline field-level error message used beneath form inputs.
 */
export function FieldError({ message }: FieldErrorProps) {
    if (!message) return null;
    return (
        <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
            <AlertCircle className="size-3 shrink-0" />
            {message}
        </p>
    );
}
