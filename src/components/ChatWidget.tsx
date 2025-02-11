
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { callOpenRouter } from "@/utils/openrouter";

export default function ChatWidget() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hello, I'm your AI legal assistant. Type 'Help' to see how I could be of use to you.", isUser: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setMessages([
      { text: "Hello, I'm your AI legal assistant. Type 'Help' to see how I could be of use to you.", isUser: false },
    ]);
    setMessage("");
  };

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
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-12 h-12 p-0 bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <div className="bg-background border rounded-lg shadow-lg w-80 h-96 flex flex-col animate-in slide-in-from-bottom-10 relative">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent animate-glow" />
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-medium">Document Assistant</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleRefresh}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  msg.isUser
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted"
                )}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" className="shrink-0" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
