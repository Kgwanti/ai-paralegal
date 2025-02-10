
import { FileUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FileUploadSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFileUpload: () => void;
  selectedFiles: string[];
  onAnalyze: () => void;
}

export function FileUploadSection({
  searchQuery,
  onSearchChange,
  onFileUpload,
  selectedFiles,
  onAnalyze,
}: FileUploadSectionProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    try {
      setIsUploading(true);
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = `${crypto.randomUUID()}-${file.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from("documents")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase.from("files").insert({
          filename: file.name,
          file_path: filePath,
          document_type: "Contract",
          client_id: null,
          industry: "Legal",
        });

        if (dbError) throw dbError;
      }

      onFileUpload();
      toast({
        title: "Success",
        description: "Files uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      toast({
        title: "Error",
        description: "Failed to upload files",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <Input
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          disabled={selectedFiles.length === 0}
          onClick={onAnalyze}
        >
          <AlertCircle className="mr-2 h-4 w-4" />
          Analyze Selected
        </Button>
        <Button disabled={isUploading} className="relative">
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx"
            multiple
          />
          <FileUp className="mr-2" />
          Upload Documents
        </Button>
      </div>
    </div>
  );
}
