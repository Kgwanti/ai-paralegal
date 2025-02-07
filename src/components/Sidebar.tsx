
import { FileText, Brain, Database, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Brain, label: "Assistant", href: "#assistant" },
  { icon: Database, label: "Knowledge", href: "#knowledge" },
  { icon: FileText, label: "Vault", href: "#vault" },
  { icon: Workflow, label: "Workflows", href: "#workflows" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass border-r border-white/[0.1] p-6 animate-slide-in">
      <div className="flex flex-col h-full">
        <h1 className="text-2xl font-serif mb-8">Harvey</h1>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg glass-hover",
                "text-sm font-medium text-white/70 hover:text-white transition-colors"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
