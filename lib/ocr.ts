import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient({
  apiKey: process.env.GOOGLE_CLOUD_VISION_KEY,
});

export async function extractTextFromImage(imageBuffer: Buffer): Promise<string> {
  const [result] = await client.textDetection({ image: { content: imageBuffer } });
  const fullText = result.textAnnotations?.[0]?.description || "";
  return fullText;
}
