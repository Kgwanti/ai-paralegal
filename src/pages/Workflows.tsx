
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { 
  FileEdit, Globe, ScrollText, Clock, UserRound,
  Upload, Bot, LayoutGrid, CheckSquare, Plus, MoreHorizontal,
  Calendar, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Task {
  id: number;
  title: string;
  assignee: string;
  dueDate?: string;
  completed: boolean;
}

export default function Workflows() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "meetings", assignee: "Kgwanti Bilankulu", completed: false },
    { id: 2, title: "Install bolt.diy", assignee: "Kgwanti Bilankulu", completed: false },
    { id: 3, title: "follow-up with clients", assignee: "Kgwanti Bilankulu", completed: true },
    { id: 4, title: "contact laura & warrick wiegand", assignee: "", dueDate: "February 8, 2025", completed: false },
    { id: 5, title: "linkedin connections, messaging", assignee: "Kgwanti Bilankulu", dueDate: "February 7, 2025", completed: false },
  ]);

  const [newTask, setNewTask] = useState("");

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
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

          <div className="glass rounded-lg overflow-hidden">
            <div className="grid grid-cols-4 p-4 border-b border-white/10 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <span>Title</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Assignee</span>
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
              {tasks.map(task => (
                <div key={task.id} className="grid grid-cols-4 p-4 hover:bg-white/5">
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
                  <div className="text-white/60">{task.dueDate}</div>
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
      </main>
    </div>
  );
}
