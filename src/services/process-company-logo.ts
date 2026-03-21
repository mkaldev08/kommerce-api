import sharp from "sharp";

const SUPPORTED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

export interface ProcessCompanyLogoResult {
  base64Data: string;
  imageType: string;
}

export function isSupportedCompanyLogoMimeType(mimeType: string): boolean {
  return SUPPORTED_MIME_TYPES.has(mimeType.toLowerCase());
}

export async function processCompanyLogo(
  input: Buffer,
): Promise<ProcessCompanyLogoResult> {
  const processed = await sharp(input)
    .rotate()
    .resize({
      width: 512,
      height: 512,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toBuffer();

  return {
    base64Data: processed.toString("base64"),
    imageType: "image/webp",
  };
}
