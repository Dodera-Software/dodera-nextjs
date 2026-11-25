"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Facebook, Instagram, MapPin } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { OutreachRuleNote } from "@/components/admin/leads/OutreachRuleNote";
import { LEAD_LIMITS } from "@/config/leads";
import { leadsCopy as copy } from "@/i18n/admin/leads";
import { useLeadSuggestions } from "@/lib/leads-client";
import type { LeadBusinessValues } from "@/lib/lead-forms";
import { cn } from "@/lib/utils";

const FIELD_CLASS = "rounded-xl border-foreground/10 bg-foreground/[0.03]";

interface TextFieldProps extends Omit<ComponentProps<typeof Input>, "name"> {
    name: string;
    label: ReactNode;
    icon?: ReactNode;
    options?: readonly string[];
    className?: string;
}

export function TextField({ name, label, icon, options, className, ...input }: TextFieldProps) {
    const { control } = useFormContext();
    const listId = useId();
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel className={cn(icon && "flex items-center gap-1.5 [&_svg]:size-3.5")}>
                        {icon}
                        {label}
                    </FormLabel>
                    <FormControl>
                        <Input {...input} {...field} list={options ? listId : undefined} className={FIELD_CLASS} />
                    </FormControl>
                    {options && (
                        <datalist id={listId}>
                            {options.map((option) => (
                                <option key={option} value={option} />
                            ))}
                        </datalist>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export function TextAreaField({
    name,
    label,
    className,
    ...textarea
}: Omit<ComponentProps<typeof Textarea>, "name"> & { name: string; label: ReactNode }) {
    const { control } = useFormContext();
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Textarea {...textarea} {...field} className={cn(FIELD_CLASS, className)} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export function LeadBusinessFields({ focusName }: { focusName?: boolean }) {
    const suggestions = useLeadSuggestions();
    const { control } = useFormContext<LeadBusinessValues>();
    const country = useWatch({ control, name: "country" });
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
                <TextField
                    name="country"
                    label={copy.form.country}
                    options={suggestions.countries}
                    maxLength={LEAD_LIMITS.name}
                    autoFocus={focusName === false}
                />
                <TextField name="city" label={copy.form.city} options={suggestions.cities} maxLength={LEAD_LIMITS.name} />
            </div>
            <OutreachRuleNote country={country ?? ""} />
            <TextField
                name="name"
                label={copy.form.name}
                placeholder={copy.form.namePlaceholder}
                maxLength={LEAD_LIMITS.name}
                autoFocus={focusName === true}
            />
            <TextField
                name="category"
                label={copy.form.category}
                placeholder={copy.form.categoryPlaceholder}
                options={suggestions.categories}
                maxLength={LEAD_LIMITS.name}
            />
            <div className="grid gap-3 sm:grid-cols-2">
                <TextField
                    name="facebook_url"
                    label={copy.form.facebook}
                    icon={<Facebook />}
                    placeholder={copy.form.facebookPlaceholder}
                    maxLength={LEAD_LIMITS.url}
                />
                <TextField
                    name="instagram_url"
                    label={copy.form.instagram}
                    icon={<Instagram />}
                    placeholder={copy.form.instagramPlaceholder}
                    maxLength={LEAD_LIMITS.url}
                />
            </div>
            <TextField
                name="google_maps_url"
                label={copy.form.maps}
                icon={<MapPin />}
                placeholder={copy.form.mapsPlaceholder}
                maxLength={LEAD_LIMITS.url}
            />
        </div>
    );
}
