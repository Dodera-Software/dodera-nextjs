export enum ImageSize {
    Landscape = "1792x1024",
    Square = "1024x1024",
    Portrait = "1024x1792",
}

export const IMAGE_SIZES: ImageSize[] = [ImageSize.Landscape, ImageSize.Square, ImageSize.Portrait];

export const DEFAULT_IMAGE_SIZE = ImageSize.Landscape;

export function isImageSize(value: unknown): value is ImageSize {
    return typeof value === "string" && (IMAGE_SIZES as string[]).includes(value);
}
