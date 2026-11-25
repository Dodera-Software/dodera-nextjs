"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AdminQueryKey, AdminRoute } from "@/config/admin";
import { loginCopy as copy } from "@/i18n/admin/login";
import { adminFetch, errorMessage } from "@/lib/admin-api";

const schema = z.object({
    email: z.string().trim().email(copy.emailInvalid),
    password: z.string().min(1, copy.passwordRequired),
});

type LoginValues = z.infer<typeof schema>;

export default function AdminLoginPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<LoginValues>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

    const login = useMutation({
        mutationFn: (values: LoginValues) => adminFetch("/api/admin/login", { method: "POST", json: values }),
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: [AdminQueryKey.Session] });
            router.push(AdminRoute.Dashboard);
        },
    });

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-[var(--gutter)] py-16">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_0%,hsl(var(--brand)/0.22),transparent_70%)]"
            />
            <div aria-hidden className="grain" />
            <div className="relative w-full max-w-sm space-y-10">
                <Logo href="/" label={copy.back} />
                <div className="space-y-3">
                    <p className="eyebrow">{copy.eyebrow}</p>
                    <h1 className="display text-5xl">{copy.title}</h1>
                    <p className="text-muted-foreground">{copy.description}</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit((values) => login.mutate(values))} className="glass space-y-5 rounded-3xl p-6" noValidate>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{copy.email}</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email" autoComplete="email" placeholder={copy.emailPlaceholder} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{copy.password}</FormLabel>
                                    <div className="relative">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type={showPassword ? "text" : "password"}
                                                autoComplete="current-password"
                                                placeholder={copy.passwordPlaceholder}
                                                className="pr-10"
                                            />
                                        </FormControl>
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            aria-label={showPassword ? copy.hidePassword : copy.showPassword}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {login.error && (
                            <p role="alert" className="rounded-2xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm text-red-400">
                                {errorMessage(login.error)}
                            </p>
                        )}
                        <Button type="submit" size="pill" className="w-full" disabled={login.isPending}>
                            {login.isPending ? <Loader2 className="animate-spin" /> : null}
                            {login.isPending ? copy.submitting : copy.submit}
                            {!login.isPending && <ArrowRight />}
                        </Button>
                    </form>
                </Form>
                <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    <ArrowLeft className="size-4" />
                    {copy.back}
                </Link>
            </div>
        </div>
    );
}
