"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function containsFilter(value: string, search: string, keywords?: string[]): number {
    const terms = search.toLowerCase().split(/\s+/).filter(Boolean);
    const haystack = [value, ...(keywords ?? [])].join(" ").toLowerCase();
    return terms.every((term) => haystack.includes(term)) ? 1 : 0;
}

const Command = React.forwardRef<
    React.ComponentRef<typeof CommandPrimitive>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
    <CommandPrimitive
        ref={ref}
        filter={containsFilter}
        className={cn("flex size-full flex-col overflow-hidden rounded-2xl bg-popover text-popover-foreground", className)}
        {...props}
    />
));
Command.displayName = CommandPrimitive.displayName;

function CommandDialog({
    open,
    onOpenChange,
    title,
    children,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="top-[20%] max-w-xl translate-y-0 overflow-hidden p-0 data-[state=closed]:slide-out-to-top-[18%] data-[state=open]:slide-in-from-top-[18%] [&>button]:hidden">
                <DialogTitle className="sr-only">{title}</DialogTitle>
                <Command>{children}</Command>
            </DialogContent>
        </Dialog>
    );
}

const CommandInput = React.forwardRef<
    React.ComponentRef<typeof CommandPrimitive.Input>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
    <div className="flex items-center gap-3 border-b border-foreground/10 px-4">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <CommandPrimitive.Input
            ref={ref}
            className={cn(
                "flex h-14 w-full bg-transparent text-[0.95rem] outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
                className,
            )}
            {...props}
        />
    </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
    React.ComponentRef<typeof CommandPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.List ref={ref} className={cn("max-h-[360px] overflow-y-auto overflow-x-hidden p-2", className)} {...props} />
));
CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
    React.ComponentRef<typeof CommandPrimitive.Empty>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => <CommandPrimitive.Empty ref={ref} className="py-8 text-center text-sm text-muted-foreground" {...props} />);
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
    React.ComponentRef<typeof CommandPrimitive.Group>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Group
        ref={ref}
        className={cn(
            "overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[0.68rem] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.08em] [&_[cmdk-group-heading]]:text-muted-foreground",
            className,
        )}
        {...props}
    />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandItem = React.forwardRef<
    React.ComponentRef<typeof CommandPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Item
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-foreground/[0.06] data-[disabled=true]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground data-[selected=true]:[&_svg]:text-brand-bright",
            className,
        )}
        {...props}
    />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

function CommandShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
    return <span className={cn("ml-auto font-mono text-[0.7rem] tracking-wider text-muted-foreground", className)} {...props} />;
}

export { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut };
