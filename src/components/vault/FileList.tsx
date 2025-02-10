
import { FileText } from "lucide-react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FileRecord {
  id: string;
  filename: string;
  document_type: string;
  client_id: string;
  created_at: string;
  file_path: string;
  industry: string;
  updated_at: string;
}

interface Client {
  id: string;
  name: string;
  industry: string;
}

interface FileListProps {
  files: FileRecord[];
  clients: Client[];
  onFileUpdate: () => void;
}

export function FileList({ files, clients, onFileUpdate }: FileListProps) {
  const { toast } = useToast();

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
      
      onFileUpdate();
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

  return (
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
  );
}
