import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { chatWithAIService } from "../services";
import { z } from "zod";
import ChatModel from "../models/chat.model";

const chatSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export const chatController = asyncHandler(
  async (req: Request, res: Response) => {
    const { message } = chatSchema.parse(req.body);
    const userId = req.user?._id;

    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    // Get recent conversation history for context (last 10 messages)
    const recentHistory = await ChatModel.find({ userId })
      .sort({ timestamp: -1 })
      .limit(10)
      .select("role content");

    // Reverse to get chronological order
    const conversationHistory = recentHistory.reverse().map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Save user message to database
    await ChatModel.create({
      userId,
      role: "user",
      content: message,
    });

    // Get AI response with conversation context
    const response = await chatWithAIService(message, conversationHistory);

    // Save AI response to database
    await ChatModel.create({
      userId,
      role: "assistant",
      content: response,
    });

    return res.status(HTTPSTATUS.OK).json({
      response,
    });
  }
);

export const getChatHistoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    // Get last 50 messages for the user
    const chatHistory = await ChatModel.find({ userId })
      .sort({ timestamp: 1 })
      .limit(50)
      .select("role content timestamp");

    return res.status(HTTPSTATUS.OK).json({
      chatHistory,
    });
  }
);

export const clearChatHistoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    await ChatModel.deleteMany({ userId });

    return res.status(HTTPSTATUS.OK).json({
      message: "Chat history cleared successfully",
    });
  }
);
