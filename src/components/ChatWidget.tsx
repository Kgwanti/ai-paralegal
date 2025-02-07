
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hello, I'm your AI legal assistant. Type 'Help' to see how I could be of use to you.", isUser: false },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { text: message, isUser: true }]);

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "I'm here to help you manage your documents. What would you like to know?",
          isUser: false,
        },
      ]);
    }, 1000);

    setMessage("");
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
        <div className="bg-background border rounded-lg shadow-lg w-80 h-96 flex flex-col animate-in slide-in-from-bottom-10">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-medium">Document Assistant</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
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
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button type="submit" size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
import React from 'react';

export default function ChatWidget() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="glass rounded-full p-4 cursor-pointer hover:bg-white/10">
        <div className="w-6 h-6" />
      </div>
    </div>
  );
}
