import { Router } from "express";
import {
  chatController,
  getChatHistoryController,
  clearChatHistoryController,
} from "../controllers/ai.controller";

const aiRoutes = Router();

aiRoutes.post("/chat", chatController);
aiRoutes.get("/chat/history", getChatHistoryController);
aiRoutes.delete("/chat/history", clearChatHistoryController);

export default aiRoutes;
