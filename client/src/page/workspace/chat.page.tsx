import { useEffect, useRef, useState } from "react";
import { Send, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { getWorkspaceChatHistory, sendWorkspaceChatMessage } from "@/lib/api";
import { useParams } from "react-router-dom";

type Message = {
  _id: string;
  content: string;
  createdAt: string;
  senderId: { _id: string; name?: string; email: string; profilePicture?: string | null };
};

const WorkspaceChatPage = () => {
  const { workspaceId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadMessages = async () => {
    if (!workspaceId) return;
    try {
      const { messages } = await getWorkspaceChatHistory({ workspaceId });
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    // simple polling every 5s
    const id = window.setInterval(loadMessages, 5000);
    return () => {
      if (id) window.clearInterval(id);
    };
  }, [workspaceId]);

  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement | null;
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, sending]);

  const handleSend = async () => {
    if (!workspaceId || !input.trim() || sending) return;
    const content = input.trim();
    setInput("");
    setSending(true);
    try {
      const optimistic: Message = {
        _id: `temp-${Date.now()}`,
        content,
        createdAt: new Date().toISOString(),
        senderId: { _id: "me", email: "me" },
      };
      setMessages((prev) => [...prev, optimistic]);
      const { message } = await sendWorkspaceChatMessage({ workspaceId, content });
      setMessages((prev) => prev.filter((m) => m._id !== optimistic._id).concat(message));
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Workspace Chat</h1>
        <p className="text-muted-foreground">Chat with members of this workspace</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message._id} className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                  {/* Placeholder avatar */}
                  <User className="w-5 h-5" />
                </div>
                <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                  <div className="text-xs mb-1 opacity-70">
                    {message.senderId?.name || message.senderId?.email}
                  </div>
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              className="min-h-[60px] max-h-[120px] resize-none"
              disabled={sending}
            />
            <Button onClick={handleSend} disabled={!input.trim() || sending} size="icon" className="h-[60px] w-[60px]">
              {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WorkspaceChatPage;
