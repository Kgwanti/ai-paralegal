
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatInterface } from "@/components/ChatInterface";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ClientManagement } from "@/components/vault/ClientManagement";
import { FileUploadSection } from "@/components/vault/FileUploadSection";
import { FileList } from "@/components/vault/FileList";
import { useToast } from "@/components/ui/use-toast";

type FileRecord = {
  id: string;
  filename: string;
  document_type: string;
  client_id: string;
  created_at: string;
  file_path: string;
  industry: string;
  updated_at: string;
};

type Client = {
  id: string;
  name: string;
  industry: string;
};

export default function Vault() {
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching clients:", error);
      return;
    }

    setClients(data || []);
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

  useEffect(() => {
    fetchFiles();
    fetchClients();
  }, []);

  const analyzeSelectedDocuments = async () => {
    toast({
      title: "Analysis Started",
      description: "Selected documents are being analyzed...",
    });
    console.log("Analyzing documents:", selectedFiles);
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
              AI-powered document analysis and organization
            </p>
          </header>

          <Tabs defaultValue="files" className="animate-fade-up">
            <TabsList>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="files">
              <div className="glass rounded-2xl p-8">
                <FileUploadSection
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onFileUpload={fetchFiles}
                  selectedFiles={selectedFiles}
                  onAnalyze={analyzeSelectedDocuments}
                />
                <FileList
                  files={files}
                  clients={clients}
                  onFileUpdate={fetchFiles}
                />
              </div>
            </TabsContent>

            <TabsContent value="clients">
              <div className="glass rounded-2xl p-8">
                <ClientManagement clients={clients} onClientUpdate={fetchClients} />
              </div>
            </TabsContent>

            <TabsContent value="insights">
              <div className="glass rounded-2xl p-8">
                <ChatInterface
                  initialMessage="I'm your document analysis assistant. Upload documents and I'll help extract key insights, terms, and generate summaries based on relevant laws and regulations."
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
