import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const MODEL_NAME = "gemini-2.0-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

export const chatWithAIService = async (
  message: string,
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> => {
  try {
    if (!GEMINI_API_KEY) {
      // Fallback response if no API key is configured
      return "I'm an AI assistant ready to help! However, the API key is not configured. Please add GEMINI_API_KEY to your environment variables to enable AI responses.";
    }

    console.log("Sending request to Gemini API...");
    console.log("API URL:", GEMINI_API_URL.replace(GEMINI_API_KEY, "***"));

    // Build conversation history for context
    const contents = [];
    
    // Add system instruction as first message
    contents.push({
      role: "user",
      parts: [
        {
          text: "You are a helpful AI assistant. Answer questions clearly and concisely. You can help with any topic including programming, general knowledge, advice, and more.",
        },
      ],
    });
    
    contents.push({
      role: "model",
      parts: [{ text: "I understand. I'm ready to help you with any questions!" }],
    });

    // Add conversation history if provided
    if (conversationHistory && conversationHistory.length > 0) {
      // Get last 10 messages for context (to avoid token limits)
      const recentHistory = conversationHistory.slice(-10);
      
      for (const msg of recentHistory) {
        contents.push({
          role: msg.role === "assistant" ? "model" : msg.role,
          parts: [{ text: msg.content }],
        });
      }
    }

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Full API Response:", JSON.stringify(response.data, null, 2));

    // Check if response has candidates
    if (!response.data.candidates || response.data.candidates.length === 0) {
      console.error("No candidates in response:", response.data);
      return "I couldn't generate a response. Please try again.";
    }

    // Safely extract the response with proper error handling
    const candidate = response.data.candidates[0];
    if (!candidate || !candidate.content) {
      console.error("Invalid response structure:", response.data);
      return "I received an invalid response. Please try again.";
    }

    // Check if parts exist (normal response)
    if (candidate.content.parts && candidate.content.parts.length > 0) {
      const aiResponse = candidate.content.parts[0].text;
      return aiResponse;
    }

    // Handle case where response was cut off or has no parts
    if (candidate.finishReason === "MAX_TOKENS") {
      return "The response was too long. Please ask a more specific question.";
    }

    console.error("No text in response:", response.data);
    return "I couldn't generate a proper response. Please try rephrasing your question.";
  } catch (error: any) {
    console.error("AI Service Error Details:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    
    // Return a friendly error message
    if (error.response?.status === 400) {
      const errorMsg = error.response?.data?.error?.message || "Invalid request";
      console.error("API Error 400:", errorMsg);
      return `API Error: ${errorMsg}. Please check your Gemini API key.`;
    } else if (error.response?.status === 429) {
      return "Rate limit exceeded. Please try again in a moment.";
    } else if (error.response?.status === 403) {
      return "API key is invalid or doesn't have permission. Please check your Gemini API key.";
    } else {
      const errorMsg = error.response?.data?.error?.message || error.message;
      return `Error: ${errorMsg}. Please try again later.`;
    }
  }
};
