import mongoose, { Document, Schema } from "mongoose";

export interface IChat extends Document {
  userId: mongoose.Types.ObjectId;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const chatSchema = new Schema<IChat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by user
chatSchema.index({ userId: 1, timestamp: -1 });

const ChatModel = mongoose.model<IChat>("Chat", chatSchema);

export default ChatModel;
