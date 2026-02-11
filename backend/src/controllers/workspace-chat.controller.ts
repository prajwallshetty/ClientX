import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import WorkspaceChatMessageModel from "../models/workspace-chat.model";
import { z } from "zod";
import { getMemberRoleInWorkspace } from "../services/member.service";

const paramsSchema = z.object({ id: z.string() });
const sendSchema = z.object({ content: z.string().min(1) });

export const listWorkspaceMessagesController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: workspaceId } = paramsSchema.parse(req.params);
    const userId = req.user?._id;

    await getMemberRoleInWorkspace(userId, workspaceId);

    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const cursor = req.query.cursor as string | undefined; // message _id for pagination

    const query: any = { workspaceId };
    if (cursor) {
      query._id = { $lt: cursor };
    }

    const messages = await WorkspaceChatMessageModel.find(query)
      .sort({ _id: -1 })
      .limit(limit)
      .populate("senderId", "name email profilePicture")
      .lean();

    const nextCursor = messages.length === limit ? messages[messages.length - 1]._id : null;

    return res.status(HTTPSTATUS.OK).json({ messages: messages.reverse(), nextCursor });
  }
);

export const sendWorkspaceMessageController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: workspaceId } = paramsSchema.parse(req.params);
    const { content } = sendSchema.parse(req.body);
    const userId = req.user?._id;

    await getMemberRoleInWorkspace(userId, workspaceId);

    const message = await WorkspaceChatMessageModel.create({
      workspaceId,
      senderId: userId,
      content,
    });

    const populated = await message.populate("senderId", "name email profilePicture");

    return res.status(HTTPSTATUS.CREATED).json({ message: populated });
  }
);
