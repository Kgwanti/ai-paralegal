
import { Button } from "@/components/ui/button";
import { RefreshCw, X } from "lucide-react";

interface ChatHeaderProps {
  showHelpHint: boolean;
  onRefresh: () => void;
  onHideHint: () => void;
}

export function ChatHeader({ showHelpHint, onRefresh, onHideHint }: ChatHeaderProps) {
  if (!showHelpHint) return null;
  
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
      <span className="text-sm text-muted-foreground">
        Type "help" to see how I can be of assistance
      </span>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-1"
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-1"
          onClick={onHideHint}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
