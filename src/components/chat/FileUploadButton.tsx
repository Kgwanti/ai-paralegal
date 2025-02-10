
import { Button } from "@/components/ui/button";
import { FileUp, Loader2 } from "lucide-react";

interface FileUploadButtonProps {
  isUploading: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileUploadButton({ isUploading, onFileUpload }: FileUploadButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onFileUpload(e);
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-2 relative"
      disabled={isUploading}
      onClick={handleClick}
    >
      <input
        type="file"
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()}
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
