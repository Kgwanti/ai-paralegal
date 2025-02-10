
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";

interface ChatInputProps {
  message: string;
  isLoading: boolean;
  onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ChatInput({ message, isLoading, onMessageChange, onSubmit }: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent form submission from bubbling up
    onSubmit(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent input change from bubbling up
    onMessageChange(e);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t" onClick={(e) => e.stopPropagation()}>
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={handleChange}
          placeholder="Type your message..."
          className="flex-1"
          disabled={isLoading}
          onClick={(e) => e.stopPropagation()}
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
  );
}
