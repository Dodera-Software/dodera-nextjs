"use client";

import { useCallback, useRef } from "react";
import { Editor } from "@tiptap/react";
import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Link as LinkIcon,
    ImageIcon,
    Trash2,
    Undo,
    Redo,
} from "lucide-react";

// ─── ToolbarButton ────────────────────────────────────────────────────────────

export interface ToolbarButtonProps {
    active?: boolean;
    disabled?: boolean;
    onClick: () => void;
    title: string;
    children: React.ReactNode;
}

export function ToolbarButton({ active, disabled, onClick, title, children }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            title={title}
            disabled={disabled}
            onClick={onClick}
            className={`w-8 h-8 flex items-center justify-center rounded transition-colors disabled:opacity-40 ${active
                ? "bg-accent text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
        >
            {children}
        </button>
    );
}

// ─── ToolbarDivider ───────────────────────────────────────────────────────────

export function ToolbarDivider() {
    return <div className="w-px h-6 bg-border mx-1" />;
}

// ─── EditorToolbar ────────────────────────────────────────────────────────────

export interface EditorToolbarProps {
    editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
    const setLink = useCallback(() => {
        if (!editor) return;
        const prev = editor.getAttributes("link").href as string | undefined;
        const url = window.prompt("URL", prev ?? "https://");
        if (url === null) return;
        if (!url) {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }, [editor]);

    const imageInputRef = useRef<HTMLInputElement>(null);

    const insertImage = useCallback(() => {
        imageInputRef.current?.click();
    }, []);

    const handleImageFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editor) return;
        const reader = new FileReader();
        reader.onload = () => {
            const src = reader.result as string;
            editor.chain().focus().setImage({ src }).run();
        };
        reader.readAsDataURL(file);
        // reset so the same file can be selected again
        e.target.value = "";
    }, [editor]);

    if (!editor) return null;

    return (
        <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border bg-muted/40">
            {/* History */}
            <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                <Undo className="w-[18px] h-[18px]" />
            </ToolbarButton>
            <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                <Redo className="w-[18px] h-[18px]" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Headings + paragraph */}
            <ToolbarButton title="Paragraph" active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()}>
                <span className="text-sm font-semibold leading-none">P</span>
            </ToolbarButton>
            <ToolbarButton title="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                <span className="text-sm font-semibold leading-none">H1</span>
            </ToolbarButton>
            <ToolbarButton title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                <span className="text-sm font-semibold leading-none">H2</span>
            </ToolbarButton>
            <ToolbarButton title="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                <span className="text-sm font-semibold leading-none">H3</span>
            </ToolbarButton>

            <ToolbarDivider />

            {/* Inline marks */}
            <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
                <span className="text-sm font-bold leading-none">B</span>
            </ToolbarButton>
            <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
                <span className="text-sm italic leading-none">I</span>
            </ToolbarButton>
            <ToolbarButton title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
                <span className="text-sm underline leading-none">U</span>
            </ToolbarButton>
            <ToolbarButton title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
                <span className="text-sm line-through leading-none">S</span>
            </ToolbarButton>
            <ToolbarButton title="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
                <span className="text-sm font-mono leading-none">&lt;/&gt;</span>
            </ToolbarButton>

            <ToolbarDivider />

            {/* Alignment */}
            <ToolbarButton title="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
                <AlignLeft className="w-[18px] h-[18px]" />
            </ToolbarButton>
            <ToolbarButton title="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
                <AlignCenter className="w-[18px] h-[18px]" />
            </ToolbarButton>
            <ToolbarButton title="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
                <AlignRight className="w-[18px] h-[18px]" />
            </ToolbarButton>
            <ToolbarButton title="Justify" active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
                <AlignJustify className="w-[18px] h-[18px]" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Lists */}
            <ToolbarButton title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                <List className="w-[18px] h-[18px]" />
            </ToolbarButton>
            <ToolbarButton title="Ordered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                <ListOrdered className="w-[18px] h-[18px]" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Link */}
            <ToolbarButton title="Set link" active={editor.isActive("link")} onClick={setLink}>
                <LinkIcon className="w-[18px] h-[18px]" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Image */}
            <ToolbarButton title="Insert image from file" onClick={insertImage}>
                <ImageIcon className="w-[18px] h-[18px]" />
            </ToolbarButton>
            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageFile}
            />

            {/* Image size controls — only visible when an image node is selected */}
            {editor.isActive("image") && (
                <>
                    <ToolbarDivider />
                    <span className="text-[11px] text-muted-foreground px-1 select-none">Size:</span>
                    {(
                        [
                            { label: "S", title: "Small (200 px)", width: "200" },
                            { label: "M", title: "Medium (400 px)", width: "400" },
                            { label: "L", title: "Large (600 px)", width: "600" },
                            { label: "Full", title: "Full width", width: null },
                        ] as { label: string; title: string; width: string | null }[]
                    ).map(({ label, title, width }) => (
                        <ToolbarButton
                            key={label}
                            title={title}
                            active={
                                (editor.getAttributes("image").width ?? null) ===
                                (width ?? null)
                            }
                            onClick={() =>
                                editor
                                    .chain()
                                    .focus()
                                    .updateAttributes("image", { width, height: null })
                                    .run()
                            }
                        >
                            <span className="text-[11px] font-semibold leading-none">{label}</span>
                        </ToolbarButton>
                    ))}
                    <ToolbarDivider />
                    <ToolbarButton
                        title="Remove image"
                        onClick={() => editor.chain().focus().deleteSelection().run()}
                    >
                        <Trash2 className="w-[16px] h-[16px] text-destructive" />
                    </ToolbarButton>
                </>
            )}
        </div>
    );
}
