
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { 
  FileEdit, Globe, ScrollText, Clock, UserRound,
  Upload, Bot, LayoutGrid, CheckSquare, Plus, MoreHorizontal,
  Calendar, User, Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ChatInterface } from "@/components/ChatInterface";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Task {
  id: number;
  title: string;
  assignee: string;
  dueDate?: Date;
  completed: boolean;
  client: string;
}

export default function Workflows() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "meetings", assignee: "Kgwanti Bilankulu", completed: false, client: "Smith & Co" },
    { id: 2, title: "Install bolt.diy", assignee: "Kgwanti Bilankulu", completed: false, client: "Johnson LLC" },
    { id: 3, title: "follow-up with clients", assignee: "Kgwanti Bilankulu", completed: true, client: "Smith & Co" },
    { id: 4, title: "contact laura & warrick wiegand", assignee: "", dueDate: new Date("2025-02-08"), completed: false, client: "Johnson LLC" },
    { id: 5, title: "linkedin connections, messaging", assignee: "Kgwanti Bilankulu", dueDate: new Date("2025-02-07"), completed: false, client: "Smith & Co" },
  ]);

  const [newTask, setNewTask] = useState("");
  const [selectedClient, setSelectedClient] = useState<string>("all");

  const clients = Array.from(new Set(tasks.map(task => task.client)));
  
  const filteredTasks = selectedClient === "all" 
    ? tasks 
    : tasks.filter(task => task.client === selectedClient);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const updateDueDate = (id: number, date: Date) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, dueDate: date } : task
    ));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      
      <main className="pl-64 min-h-screen">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-6 w-6" />
              <h1 className="text-2xl font-medium">Tasks</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {clients.map(client => (
                    <SelectItem key={client} value={client}>
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-2" />
                        {client}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <LayoutGrid className="h-4 w-4 mr-2" />
                All tasks
              </Button>
              <Button variant="outline" size="sm">Board</Button>
              <Button className="bg-primary" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="glass rounded-lg overflow-hidden">
                <div className="grid grid-cols-5 p-4 border-b border-white/10 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <span>Title</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Assignee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>Client</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Due</span>
                  </div>
                  <div className="flex items-center justify-end">
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="divide-y divide-white/10">
                  {filteredTasks.map(task => (
                    <div key={task.id} className="grid grid-cols-5 p-4 hover:bg-white/5">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(task.id)}
                          className="rounded border-white/20"
                        />
                        <span className={cn(task.completed && "line-through text-white/40")}>
                          {task.title}
                        </span>
                      </div>
                      <div className="text-white/60">{task.assignee}</div>
                      <div className="text-white/60 flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        {task.client}
                      </div>
                      <div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-white/60">
                              {task.dueDate ? format(task.dueDate, "PP") : "Set due date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={task.dueDate}
                              onSelect={(date) => date && updateDueDate(task.id, date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-white/10">
                  <Input
                    placeholder="New task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="bg-transparent border-white/20"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 h-[600px]">
              <ChatInterface 
                initialMessage="I'm your task management assistant. I can help you manage your tasks, set due dates, and track progress."
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
