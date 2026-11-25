"use client";

import { useRef, useState, type ReactNode } from "react";
import { Editor, useEditorState } from "@tiptap/react";
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    Code,
    Heading1,
    Heading2,
    Heading3,
    ImageIcon,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Pilcrow,
    Redo,
    Strikethrough,
    Trash2,
    Underline,
    Undo,
    type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    EMAIL_IMAGE_ALIGNS,
    EMAIL_IMAGE_WIDTHS,
    EmailImageAlign,
    EmailImageWidth,
    HEADING_LEVELS,
    TEXT_ALIGNMENTS,
    TextAlignment,
    type HeadingLevel,
} from "@/config/admin-email";
import { emailCopy } from "@/i18n/admin/email";
import { cn } from "@/lib/utils";

const copy = emailCopy.toolbar;

const ALIGN_ICON: Record<TextAlignment, LucideIcon> = {
    [TextAlignment.Left]: AlignLeft,
    [TextAlignment.Center]: AlignCenter,
    [TextAlignment.Right]: AlignRight,
    [TextAlignment.Justify]: AlignJustify,
};

const IMAGE_ALIGN_ICON: Record<EmailImageAlign, LucideIcon> = {
    [EmailImageAlign.None]: AlignLeft,
    [EmailImageAlign.Left]: AlignLeft,
    [EmailImageAlign.Center]: AlignCenter,
    [EmailImageAlign.Right]: AlignRight,
};

const HEADING_ICON: Record<HeadingLevel, LucideIcon> = { 1: Heading1, 2: Heading2, 3: Heading3 };

interface ToolbarButtonProps {
    label: string;
    active?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    children: ReactNode;
    className?: string;
}

function ToolbarButton({ label, active, disabled, onClick, children, className }: ToolbarButtonProps) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            title={label}
            aria-label={label}
            aria-pressed={active}
            disabled={disabled}
            onClick={onClick}
            className={cn(
                "h-8 w-8 rounded-full text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground",
                active && "bg-foreground/[0.1] text-foreground",
                className,
            )}
        >
            {children}
        </Button>
    );
}

function Divider() {
    return <span className="mx-1 h-5 w-px bg-foreground/10" aria-hidden />;
}

function LinkButton({ editor, active }: { editor: Editor; active: boolean }) {
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState("");

    function onOpenChange(next: boolean) {
        if (next) setUrl((editor.getAttributes("link").href as string | undefined) ?? copy.link.placeholder);
        setOpen(next);
    }

    function apply(event: React.FormEvent) {
        event.preventDefault();
        event.stopPropagation();
        const chain = editor.chain().focus().extendMarkRange("link");
        if (url.trim()) chain.setLink({ href: url.trim() }).run();
        else chain.unsetLink().run();
        setOpen(false);
    }

    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title={copy.link.button}
                    aria-label={copy.link.button}
                    aria-pressed={active}
                    className={cn(
                        "h-8 w-8 rounded-full text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground",
                        active && "bg-foreground/[0.1] text-foreground",
                    )}
                >
                    <LinkIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <form noValidate onSubmit={apply} className="space-y-3">
                    <label className="block font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted-foreground" htmlFor="email-link-url">
                        {copy.link.label}
                    </label>
                    <Input id="email-link-url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} autoFocus />
                    <div className="flex justify-end gap-2">
                        {active && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="rounded-full"
                                onClick={() => {
                                    editor.chain().focus().extendMarkRange("link").unsetLink().run();
                                    setOpen(false);
                                }}
                            >
                                {copy.link.remove}
                            </Button>
                        )}
                        <Button type="submit" size="sm" className="rounded-full">
                            {copy.link.apply}
                        </Button>
                    </div>
                </form>
            </PopoverContent>
        </Popover>
    );
}

export function EditorToolbar({ editor }: { editor: Editor | null }) {
    const imageInput = useRef<HTMLInputElement>(null);
    const state = useEditorState({
        editor,
        selector: ({ editor: e }) =>
            e
                ? {
                    canUndo: e.can().undo(),
                    canRedo: e.can().redo(),
                    paragraph: e.isActive("paragraph"),
                    headings: HEADING_LEVELS.map((level) => e.isActive("heading", { level })),
                    bold: e.isActive("bold"),
                    italic: e.isActive("italic"),
                    underline: e.isActive("underline"),
                    strike: e.isActive("strike"),
                    code: e.isActive("code"),
                    aligns: TEXT_ALIGNMENTS.map((align) => e.isActive({ textAlign: align })),
                    bulletList: e.isActive("bulletList"),
                    orderedList: e.isActive("orderedList"),
                    link: e.isActive("link"),
                    image: e.isActive("image"),
                    imageAlign: (e.getAttributes("image").align as EmailImageAlign | undefined) ?? EmailImageAlign.None,
                    imageWidth: (e.getAttributes("image").width as string | null | undefined) ?? null,
                }
                : null,
    });

    if (!editor || !state) return null;

    function onImageFile(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file || !editor) return;
        const reader = new FileReader();
        reader.onload = () => editor.chain().focus().setImage({ src: reader.result as string }).run();
        reader.readAsDataURL(file);
    }

    const chain = () => editor.chain().focus();
    const imageAlign = state.imageAlign === EmailImageAlign.None ? EmailImageAlign.Left : state.imageAlign;

    return (
        <div role="toolbar" aria-label={copy.label} className="flex flex-wrap items-center gap-0.5 border-b border-foreground/10 bg-foreground/[0.03] p-2">
            <ToolbarButton label={copy.undo} disabled={!state.canUndo} onClick={() => chain().undo().run()}>
                <Undo />
            </ToolbarButton>
            <ToolbarButton label={copy.redo} disabled={!state.canRedo} onClick={() => chain().redo().run()}>
                <Redo />
            </ToolbarButton>
            <Divider />
            <ToolbarButton label={copy.paragraph} active={state.paragraph} onClick={() => chain().setParagraph().run()}>
                <Pilcrow />
            </ToolbarButton>
            {HEADING_LEVELS.map((level, index) => {
                const Icon = HEADING_ICON[level];
                return (
                    <ToolbarButton key={level} label={copy.heading(level)} active={state.headings[index]} onClick={() => chain().toggleHeading({ level }).run()}>
                        <Icon />
                    </ToolbarButton>
                );
            })}
            <Divider />
            <ToolbarButton label={copy.bold} active={state.bold} onClick={() => chain().toggleBold().run()}>
                <Bold />
            </ToolbarButton>
            <ToolbarButton label={copy.italic} active={state.italic} onClick={() => chain().toggleItalic().run()}>
                <Italic />
            </ToolbarButton>
            <ToolbarButton label={copy.underline} active={state.underline} onClick={() => chain().toggleUnderline().run()}>
                <Underline />
            </ToolbarButton>
            <ToolbarButton label={copy.strike} active={state.strike} onClick={() => chain().toggleStrike().run()}>
                <Strikethrough />
            </ToolbarButton>
            <ToolbarButton label={copy.code} active={state.code} onClick={() => chain().toggleCode().run()}>
                <Code />
            </ToolbarButton>
            <Divider />
            {TEXT_ALIGNMENTS.map((align, index) => {
                const Icon = ALIGN_ICON[align];
                return (
                    <ToolbarButton key={align} label={copy.align[align]} active={state.aligns[index]} onClick={() => chain().setTextAlign(align).run()}>
                        <Icon />
                    </ToolbarButton>
                );
            })}
            <Divider />
            <ToolbarButton label={copy.bulletList} active={state.bulletList} onClick={() => chain().toggleBulletList().run()}>
                <List />
            </ToolbarButton>
            <ToolbarButton label={copy.orderedList} active={state.orderedList} onClick={() => chain().toggleOrderedList().run()}>
                <ListOrdered />
            </ToolbarButton>
            <Divider />
            <LinkButton editor={editor} active={state.link} />
            <ToolbarButton label={copy.image.insert} onClick={() => imageInput.current?.click()}>
                <ImageIcon />
            </ToolbarButton>
            <input ref={imageInput} type="file" accept="image/*" className="hidden" onChange={onImageFile} />

            {state.image && (
                <>
                    <Divider />
                    <span className="px-1 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted-foreground">{copy.image.align}</span>
                    {EMAIL_IMAGE_ALIGNS.map((align) => {
                        const Icon = IMAGE_ALIGN_ICON[align];
                        return (
                            <ToolbarButton
                                key={align}
                                label={copy.image.alignments[align]}
                                active={imageAlign === align}
                                onClick={() => chain().updateAttributes("image", { align }).run()}
                            >
                                <Icon />
                            </ToolbarButton>
                        );
                    })}
                    <Divider />
                    <span className="px-1 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted-foreground">{copy.image.size}</span>
                    {EMAIL_IMAGE_WIDTHS.map((width) => {
                        const value = width === EmailImageWidth.Full ? null : width;
                        return (
                            <ToolbarButton
                                key={width}
                                label={copy.image.widths[width].label}
                                active={state.imageWidth === value}
                                onClick={() => chain().updateAttributes("image", { width: value, height: null }).run()}
                                className="w-auto min-w-8 px-2 text-xs font-semibold"
                            >
                                {copy.image.widths[width].short}
                            </ToolbarButton>
                        );
                    })}
                    <Divider />
                    <ToolbarButton
                        label={copy.image.remove}
                        onClick={() => chain().deleteSelection().run()}
                        className="hover:bg-red-400/10 hover:text-red-400"
                    >
                        <Trash2 />
                    </ToolbarButton>
                </>
            )}
        </div>
    );
}
