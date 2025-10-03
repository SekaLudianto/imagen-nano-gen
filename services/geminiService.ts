import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

// --- IMPORTANT: PASTE YOUR API KEY HERE ---
// Vercel Environment Variables (process.env) are not accessible in a pure client-side application.
// You must paste your Google AI API Key here for the deployed app to work.
// WARNING: This will expose your API key to anyone who visits your website.
// For personal projects this is acceptable, but it is not secure for production applications.
const API_KEY = "AIzaSyDdb33z_nz6Ww5q9Fy4YYG-OlLqKz898Us"; 

if (!API_KEY || API_KEY === "AIzaSyDdb33z_nz6Ww5q9Fy4YYG-OlLqKz898Us") {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;padding:1rem;background-color:#ef4444;color:white;text-align:center;font-family:sans-serif;z-index:9999;';
    errorDiv.textContent = 'API Key is not configured. Please add your key to services/geminiService.ts';
    document.body.prepend(errorDiv);
    throw new Error("API_KEY is not set. Please add your API key to services/geminiService.ts");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

export const generateWithImagen = async (
    prompt: string,
    aspectRatio: string,
    numberOfImages: number,
): Promise<string[]> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: numberOfImages,
                outputMimeType: 'image/jpeg',
                aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages.map(img => {
                 if (img.image.imageBytes) {
                    return `data:image/jpeg;base64,${img.image.imageBytes}`;
                }
                throw new Error("An image object was returned without image data.");
            });
        }
        
        throw new Error("The model did not return an image. This could be due to safety filters or an issue with the prompt. Please try again with a different prompt.");

    } catch (error) {
        console.error("Error generating with Imagen:", error);
        if (error instanceof Error) {
            throw error; // Re-throw the specific error
        }
        throw new Error("Failed to generate image with Imagen. Check the console for details.");
    }
};


export const editWithNanoBanana = async (imageFile: File, prompt: string): Promise<string> => {
    try {
        const base64ImageData = await fileToBase64(imageFile);
        const mimeType = imageFile.type;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64ImageData,
                            mimeType: mimeType,
                        },
                    },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        if (!response.candidates || response.candidates.length === 0 || !response.candidates[0].content || !response.candidates[0].content.parts) {
            if (response.text) {
                throw new Error(`Image generation failed. The model responded: "${response.text}"`);
            }
            throw new Error("The model returned an empty or invalid response. This might be due to a content policy violation or internal error.");
        }

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes = part.inlineData.data;
                const imageMimeType = part.inlineData.mimeType;
                return `data:${imageMimeType};base64,${base64ImageBytes}`;
            }
        }
        
        const refusalText = response.text;
        if (refusalText) {
             throw new Error(`The model did not return an image. It responded with: "${refusalText.trim()}"`);
        }

        throw new Error("The model did not return an image. Please try adjusting your edit instruction.");

    } catch (error) {
        console.error("Error editing with Nanobanana:", error);
         if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to edit image with Nanobanana. Check the console for details.");
    }
};