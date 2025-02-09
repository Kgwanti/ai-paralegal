
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X, Loader2, RefreshCw, FileUp } from "lucide-react";
import { callOpenRouter } from "@/utils/openrouter";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [isUploading, setIsUploading] = useState(false);

  const handleRefresh = () => {
    setMessages([{ text: initialMessage, isUser: false }]);
    setMessage("");
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const filePath = `${crypto.randomUUID()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("files").insert({
        filename: file.name,
        file_path: filePath,
        document_type: file.type.includes('pdf') ? 'PDF' : 'Document',
        industry: 'Legal',
      });

      if (dbError) throw dbError;

      setMessages(prev => [
        ...prev,
        { text: `📄 File uploaded: ${file.name}`, isUser: true },
        { text: "I'll analyze this document and use it as context for our conversation.", isUser: false }
      ]);

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
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

You can also upload documents that I can analyze and use as context for our conversation. Simply click the upload button below the chat.

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
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1"
              onClick={() => setShowHelpHint(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
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

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2 mb-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={isUploading}
          >
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx"
            />
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileUp className="h-4 w-4" />
            )}
            Upload Document
          </Button>
        </div>
        <div className="flex gap-2">
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
        </div>
      </form>
    </div>
  );
}

