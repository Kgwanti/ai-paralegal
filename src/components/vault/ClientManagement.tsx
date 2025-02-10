
import { useState } from "react";
import { Plus, Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Client {
  id: string;
  name: string;
  industry: string;
}

interface ClientManagementProps {
  clients: Client[];
  onClientUpdate: () => void;
}

export function ClientManagement({ clients, onClientUpdate }: ClientManagementProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [newClientName, setNewClientName] = useState("");
  const { toast } = useToast();

  const handleEdit = (client: Client) => {
    setEditingId(client.id);
    setEditedName(client.name);
  };

  const handleSave = async (clientId: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({ name: editedName })
        .eq('id', clientId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Client name updated successfully",
      });
      
      onClientUpdate();
      setEditingId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update client name",
        variant: "destructive",
      });
    }
  };

  const handleAddClient = async () => {
    if (!newClientName.trim()) return;

    try {
      const { error } = await supabase
        .from('clients')
        .insert({ name: newClientName });

      if (error) throw error;

      toast({
        title: "Success",
        description: "New client added successfully",
      });
      
      setNewClientName("");
      onClientUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add new client",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="New client name..."
          value={newClientName}
          onChange={(e) => setNewClientName(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={handleAddClient} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      <div className="grid gap-2">
        {clients.map((client) => (
          <div key={client.id} className="flex items-center gap-2 p-2 rounded-lg glass">
            {editingId === client.id ? (
              <>
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="max-w-xs"
                />
                <Button size="sm" onClick={() => handleSave(client.id)}>
                  <Save className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1">{client.name}</span>
                <Button size="sm" variant="ghost" onClick={() => handleEdit(client)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
