
import { FileText, Brain, Database, Workflow, MessageSquare, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const menuItems = [
  { icon: Brain, label: "AI Paralegal", href: "/ai-paralegal" },
  { icon: Database, label: "Research", href: "/research" },
  { icon: FileText, label: "Storage", href: "/storage" },
  { icon: Workflow, label: "Tasks", href: "/tasks" },
  { icon: MessageSquare, label: "Communications", href: "/communications" },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass border-r border-white/[0.1] p-6 animate-slide-in">
      <div className="flex flex-col h-full">
        <Link to="/" className="text-2xl font-serif mb-8">NexData</Link>

        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg glass-hover",
                "text-sm font-medium text-white/70 hover:text-white transition-colors",
                location.pathname === item.href && "bg-white/[0.06] text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <Button
          variant="ghost"
          className="justify-start px-4 py-3 h-auto glass-hover"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
