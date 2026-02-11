import mongoose, { Document, Schema } from "mongoose";

export interface WorkspaceChatMessageDocument extends Document {
  workspaceId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const workspaceChatMessageSchema = new Schema<WorkspaceChatMessageDocument>(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

workspaceChatMessageSchema.index({ workspaceId: 1, createdAt: -1 });

const WorkspaceChatMessageModel = mongoose.model<WorkspaceChatMessageDocument>(
  "WorkspaceChatMessage",
  workspaceChatMessageSchema
);

export default WorkspaceChatMessageModel;
