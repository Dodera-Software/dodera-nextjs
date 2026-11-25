"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import {
    Controller,
    FormProvider,
    useFormContext,
    useFormState,
    type ControllerProps,
    type FieldPath,
    type FieldValues,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field-error";
import { cn } from "@/lib/utils";

const Form = FormProvider;

interface FormFieldContextValue {
    name: string;
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);
const FormItemContext = React.createContext<string | null>(null);

function FormField<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(
    props: ControllerProps<TFieldValues, TName>,
) {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    );
}

function useFormField() {
    const field = React.useContext(FormFieldContext);
    const itemId = React.useContext(FormItemContext);
    const { getFieldState } = useFormContext();
    const formState = useFormState({ name: field?.name });
    if (!field || !itemId) throw new Error("useFormField must be used inside <FormField> and <FormItem>");
    const state = getFieldState(field.name, formState);
    return {
        id: itemId,
        name: field.name,
        controlId: `${itemId}-control`,
        descriptionId: `${itemId}-description`,
        messageId: `${itemId}-message`,
        ...state,
    };
}

function FormItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const id = React.useId();
    return (
        <FormItemContext.Provider value={id}>
            <div className={cn("space-y-2", className)} {...props} />
        </FormItemContext.Provider>
    );
}

function FormLabel({ className, ...props }: React.ComponentPropsWithoutRef<typeof Label>) {
    const { controlId, error } = useFormField();
    return <Label htmlFor={controlId} className={cn(error && "text-red-400", className)} {...props} />;
}

function FormControl(props: React.ComponentPropsWithoutRef<typeof Slot>) {
    const { controlId, descriptionId, messageId, error } = useFormField();
    return (
        <Slot
            id={controlId}
            aria-describedby={error ? `${descriptionId} ${messageId}` : descriptionId}
            aria-invalid={!!error}
            {...props}
        />
    );
}

function FormDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    const { descriptionId } = useFormField();
    return <p id={descriptionId} className={cn("text-xs text-muted-foreground", className)} {...props} />;
}

function FormMessage() {
    const { messageId, error } = useFormField();
    return (
        <div id={messageId}>
            <FieldError message={error?.message} />
        </div>
    );
}

export { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, useFormField };
