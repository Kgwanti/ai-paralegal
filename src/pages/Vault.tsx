
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileUp, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ChatWidget from "@/components/ChatWidget";

type FileRecord = {
  id: string;
  filename: string;
  document_type: string;
  industry: string;
  created_at: string;
};

export default function Vault() {
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Upload file to Supabase Storage
      const filePath = `${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save file metadata to database
      const { error: dbError } = await supabase.from("files").insert({
        filename: file.name,
        file_path: filePath,
        document_type: "Document", // Default value, could be made selectable
        industry: "General", // Default value, could be made selectable
      });

      if (dbError) throw dbError;

      // Refresh file list
      fetchFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const fetchFiles = async () => {
    const { data, error } = await supabase
      .from("files")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching files:", error);
      return;
    }

    setFiles(data || []);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      
      <main className="pl-64 min-h-screen">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <header className="mb-12 animate-fade-down">
            <p className="text-sm font-medium text-white/60 mb-2">Storage</p>
            <h1 className="text-5xl font-serif mb-4">Document Management</h1>
            <p className="text-lg text-white/60">
              Store and manage your legal documents securely
            </p>
          </header>

          <div className="glass rounded-2xl p-8 animate-fade-up">
            <div className="flex justify-between items-center mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-4">
                <Button disabled={isUploading} className="relative">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx"
                  />
                  <FileUp className="mr-2" />
                  Upload Document
                </Button>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Date Added</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell>{file.filename}</TableCell>
                      <TableCell>{file.document_type}</TableCell>
                      <TableCell>{file.industry}</TableCell>
                      <TableCell>
                        {new Date(file.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="mt-8 glass rounded-2xl p-8 animate-fade-up">
            <div className="flex gap-6 h-[400px]">
              <div className="flex-1">
                <ChatInterface
                  initialMessage="Hi! I'm your document management assistant. I can help you organize, search, and analyze your documents. What can I help you with?"
                />
              </div>
              <div className="w-64">
                <h3 className="font-medium mb-4">Recent Documents</h3>
                <div className="space-y-2">
                  {files.slice(0, 5).map((file) => (
                    <div key={file.id} className="flex items-center gap-3 p-3 glass rounded-lg glass-hover cursor-pointer">
                      <FileText className="h-5 w-5 text-white/40" />
                      <span className="text-sm truncate">{file.filename}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ChatWidget />
    </div>
  );
}
