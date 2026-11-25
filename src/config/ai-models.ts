export const OPENAI_TEXT_MODELS = [
    { value: "gpt-4", label: "GPT-4" },
    { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "gpt-4o-mini", label: "GPT-4o Mini" },
    { value: "gpt-4o-nano", label: "GPT-4o Nano" },
    { value: "gpt-4.5-preview", label: "GPT-4.5 Preview" },
    { value: "gpt-5", label: "GPT-5" },
    { value: "gpt-5-mini", label: "GPT-5 Mini" },
    { value: "gpt-5.2", label: "GPT-5.2" },
];

export enum ImageModel {
    DallE2 = "dall-e-2",
    DallE3 = "dall-e-3",
    GptImage1 = "gpt-image-1",
}

export const DEFAULT_IMAGE_MODEL = ImageModel.DallE3;

export const IMAGE_MODEL_CONFIG_KEY = "image_generation_model";

export const IMAGE_MODELS = [
    { value: ImageModel.DallE2, label: "DALL-E 2" },
    { value: ImageModel.DallE3, label: "DALL-E 3" },
    { value: ImageModel.GptImage1, label: "GPT Image 1" },
];

export function isImageModel(value: unknown): value is ImageModel {
    return typeof value === "string" && IMAGE_MODELS.some((model) => model.value === value);
}
