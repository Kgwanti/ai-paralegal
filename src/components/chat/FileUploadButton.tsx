
import { Button } from "@/components/ui/button";
import { FileUp, Loader2 } from "lucide-react";

interface FileUploadButtonProps {
  isUploading: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileUploadButton({ isUploading, onFileUpload }: FileUploadButtonProps) {
  return (
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
        onChange={onFileUpload}
        accept=".pdf,.doc,.docx"
      />
      {isUploading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileUp className="h-4 w-4" />
      )}
      Upload Document
    </Button>
  );
}
