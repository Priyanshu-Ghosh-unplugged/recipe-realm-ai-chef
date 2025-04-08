
import { toast } from "@/hooks/use-toast";

// Define the response structure from Gemini
export interface GeminiResponse {
  text: string;
  recipes?: {
    title: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    prepTime?: string;
    cookTime?: string;
    servings?: number;
  }[];
}

// Main function to get recipe suggestions from Gemini
export async function getRecipeSuggestions(prompt: string): Promise<GeminiResponse> {
  try {
    const apiKey = "AIzaSyBMjw1-moQSEc0ZLMAZSF8I_Poo_fWAmbA"; // Using the provided API key
    
    if (!apiKey || apiKey === "API KEY") {
      throw new Error("Missing Gemini API key");
    }
    
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Generate recipe suggestions based on this request: "${prompt}". 
            Please format your response as conversational text, but also include structured recipe information if applicable.`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Extract the text from Gemini's response
    const text = data.candidates[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate any recipe suggestions.";
    
    // For now, we're just returning the text response
    // In a more advanced implementation, you could parse the response to extract structured recipe data
    return { text };
  } catch (error) {
    console.error("Error fetching recipe suggestions:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to get recipe suggestions",
      variant: "destructive"
    });
    return { text: "Sorry, there was an error getting recipe suggestions. Please try again later." };
  }
}
