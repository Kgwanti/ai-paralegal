
import { Sidebar } from "@/components/Sidebar";
import { 
  FileEdit, Globe, ScrollText, Clock, UserRound,
  Upload, Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";

const tools = [
  { icon: FileEdit, name: "Redlines" },
  { icon: Globe, name: "Translation" },
  { icon: ScrollText, name: "Compare Agreements" },
  { icon: Clock, name: "Chronology" },
  { icon: UserRound, name: "Client" },
];

export default function Workflows() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      
      <main className="pl-64 min-h-screen">
        <div className="max-w-5xl mx-auto px-8 py-12">
          <header className="mb-12 animate-fade-down">
            <p className="text-sm font-medium text-white/60 mb-2">Tasks</p>
            <h1 className="text-5xl font-serif mb-4">Streamline Your Work</h1>
            <p className="text-lg text-white/60">
              Multi-model agents designed to collaborate with<br />
              professionals to deliver precise, purpose-built work product.
            </p>
          </header>

          <div className="glass rounded-2xl p-8 animate-fade-up">
            <div className="space-y-8">
              <h2 className="text-xl font-medium">Start a new query</h2>
              
              <div className="grid grid-cols-5 gap-4">
                {tools.map(({ icon: Icon, name }) => (
                  <div key={name} className="flex flex-col items-center gap-2 p-4 glass rounded-lg glass-hover cursor-pointer">
                    <Icon className="h-6 w-6 text-white/40" />
                    <span className="text-sm text-center">{name}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="glass px-2 py-1 rounded">01</span>
                  Upload Files
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="glass glass-hover h-12">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Files
                  </Button>
                  <Button variant="outline" className="glass glass-hover h-12">
                    Import from Vault
                  </Button>
                </div>

                <div className="flex items-center gap-3 p-4 glass rounded-lg">
                  <Bot className="h-5 w-5" />
                  <p className="text-sm">Processing...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
