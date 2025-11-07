export type WorkspaceChatMessage = {
  _id: string;
  content: string;
  createdAt: string;
  senderId: { _id: string; name?: string; email: string; profilePicture?: string | null };
};
