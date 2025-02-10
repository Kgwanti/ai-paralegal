
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/ChatInterface";
import { Input } from "@/components/ui/input";
import { FileUp, Search, FileText, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { ClientManagement } from "@/components/vault/ClientManagement";
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
  const [isUploading, setIsUploading] = useState(false);
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

      fetchFiles();
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

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    
    const { draggableId, destination } = result;
    const clientId = destination.droppableId;

    try {
      const { error } = await supabase
        .from('files')
        .update({ client_id: clientId })
        .eq('id', draggableId);

      if (error) throw error;
      
      fetchFiles();
      toast({
        title: "Success",
        description: "File moved successfully",
      });
    } catch (error) {
      console.error('Error updating file client:', error);
      toast({
        title: "Error",
        description: "Failed to move file",
        variant: "destructive",
      });
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
                    <Button 
                      variant="outline" 
                      disabled={selectedFiles.length === 0}
                      onClick={analyzeSelectedDocuments}
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

                <DragDropContext onDragEnd={handleDragEnd}>
                  <div className="grid grid-cols-4 gap-4">
                    <Droppable key="unassigned" droppableId="null">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="glass p-4 rounded-lg"
                        >
                          <h3 className="font-medium mb-4">Unassigned</h3>
                          <div className="space-y-2">
                            {files
                              .filter((file) => !file.client_id)
                              .map((file, index) => (
                                <Draggable
                                  key={file.id}
                                  draggableId={file.id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="flex items-center gap-3 p-3 glass rounded-lg glass-hover cursor-pointer"
                                    >
                                      <FileText className="h-5 w-5 text-white/40" />
                                      <span className="text-sm truncate">
                                        {file.filename}
                                      </span>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>
                    
                    {clients.map((client) => (
                      <Droppable key={client.id} droppableId={client.id}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="glass p-4 rounded-lg"
                          >
                            <h3 className="font-medium mb-4">{client.name}</h3>
                            <div className="space-y-2">
                              {files
                                .filter((file) => file.client_id === client.id)
                                .map((file, index) => (
                                  <Draggable
                                    key={file.id}
                                    draggableId={file.id}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="flex items-center gap-3 p-3 glass rounded-lg glass-hover cursor-pointer"
                                      >
                                        <FileText className="h-5 w-5 text-white/40" />
                                        <span className="text-sm truncate">
                                          {file.filename}
                                        </span>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                              {provided.placeholder}
                            </div>
                          </div>
                        )}
                      </Droppable>
                    ))}
                  </div>
                </DragDropContext>
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
