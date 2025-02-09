
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X, Loader2 } from "lucide-react";
import { callOpenRouter } from "@/utils/openrouter";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatInterfaceProps {
  initialMessage?: string;
  onSendMessage?: (message: string) => void;
}

export function ChatInterface({ 
  initialMessage = "Hello, I'm your AI legal assistant. Type 'Help' to see how I could be of use to you.", 
  onSendMessage 
}: ChatInterfaceProps) {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { text: initialMessage, isUser: false },
  ]);
  const [showHelpHint, setShowHelpHint] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { text: message, isUser: true }]);
    const userMessage = message;
    setMessage("");

    try {
      setIsLoading(true);

      if (userMessage.toLowerCase() === "help") {
        setMessages((prev) => [
          ...prev,
          {
            text: `I can assist you with the following services:

1. Document Analysis
   • Risk assessment in legal contracts
   • Key terms extraction
   • Compliance verification

2. Contract Drafting
   • Template-based contract creation
   • Custom clause suggestions
   • Legal terminology validation

3. External Information
   • Legal research integration
   • Case law references
   • Regulatory updates

4. Client Communications
   • Automated reminder setup
   • Follow-up scheduling
   • Document request management

5. Task Management
   • Due date tracking
   • Priority task scheduling
   • Deadline reminders

6. Team Collaboration
   • Inter-firm communication
   • Document sharing
   • Task delegation

How can I help you with any of these areas today?`,
            isUser: false,
          },
        ]);
      } else {
        const response = await callOpenRouter(userMessage);
        setMessages((prev) => [
          ...prev,
          { text: response, isUser: false },
        ]);
      }

      if (onSendMessage) {
        onSendMessage(userMessage);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full glass rounded-xl overflow-hidden">
      {showHelpHint && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
          <span className="text-sm text-muted-foreground">
            Type "help" to see how I can be of assistance
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1"
            onClick={() => setShowHelpHint(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
