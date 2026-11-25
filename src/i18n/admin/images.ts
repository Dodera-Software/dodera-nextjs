import { ImageSize } from "@/lib/image-sizes";

export const imagesCopy = {
    eyebrow: "Content",
    title: "Generate image",
    description: "Write a prompt, pick a model and a shape, and OpenAI draws it. Images stay here until you leave the page.",
    sizes: {
        [ImageSize.Landscape]: { label: "Landscape", dimensions: "1792 × 1024" },
        [ImageSize.Square]: { label: "Square", dimensions: "1024 × 1024" },
        [ImageSize.Portrait]: { label: "Portrait", dimensions: "1024 × 1792" },
    } satisfies Record<ImageSize, { label: string; dimensions: string }>,
    form: {
        prompt: "Prompt",
        placeholder: "Describe the image you want to generate…",
        model: "Model",
        size: "Shape",
        shortcut: "⌘ Enter to generate",
        submit: "Generate",
        submitting: "Generating…",
        required: "Write a prompt first.",
    },
    empty: {
        title: "Describe your image",
        description: "Pick a model and a shape, write a prompt, and generate.",
        suggestions: "Need inspiration?",
    },
    suggestions: [
        "Laptop in a modern office with an automation workflow displayed on the screen",
        "Futuristic AI dashboard with holographic charts and glowing interface elements",
        "Robot and human hands reaching toward each other over a glowing circuit board",
        "Cloud infrastructure floating above a server room with streaming data connections",
    ],
    history: {
        title: "This session",
        pending: "Generating…",
        pendingHint: "Usually 10–20 seconds",
        failed: "Generation failed",
        download: "Download",
        downloadName: "generated-image.png",
    },
} as const;
