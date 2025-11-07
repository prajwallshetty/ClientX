import { Router } from "express";
import { listWorkspaceMessagesController, sendWorkspaceMessageController } from "../controllers/workspace-chat.controller";

const workspaceChatRoutes = Router();

workspaceChatRoutes.get("/:id/messages", listWorkspaceMessagesController);
workspaceChatRoutes.post("/:id/messages", sendWorkspaceMessageController);

export default workspaceChatRoutes;
