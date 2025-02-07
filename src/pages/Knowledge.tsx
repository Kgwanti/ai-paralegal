
import { Sidebar } from "@/components/Sidebar";
import { Building2, Euro, FileText, Scale } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatInterface from "../components/ChatInterface";

const databases = [
  { icon: Building2, name: "EDGAR" },
  { icon: Euro, name: "EUR-Lex" },
  { icon: FileText, name: "Memos" },
  { icon: Scale, name: "French Case Law" },
];

export default function Knowledge() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      
      <main className="pl-64 min-h-screen">
        <div className="max-w-5xl mx-auto px-8 py-12">
          <header className="mb-12 animate-fade-down">
            <p className="text-sm font-medium text-white/60 mb-2">Research</p>
            <h1 className="text-5xl font-serif mb-4">Rapid Research,<br />Grounded Results</h1>
            <p className="text-lg text-white/60">
              Get answers to complex research questions across<br />
              multiple domains in legal, regulatory, and tax.
            </p>
          </header>

          <div className="glass rounded-2xl p-8 animate-fade-up">
            <div className="flex gap-6 h-[600px]">
              <div className="flex-1">
                <ChatInterface
                  initialMessage="Hi, I'm your integrated Legal AI Assistant with direct access to your database for handling tasks on your behalf."
                />
              </div>
              <div className="w-64">
                <h3 className="font-medium mb-4">Databases</h3>
                <div className="space-y-2">
                  {databases.map(({ icon: Icon, name }) => (
                    <div key={name} className="flex items-center gap-3 p-4 glass rounded-lg glass-hover cursor-pointer">
                      <Icon className="h-5 w-5 text-white/40" />
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
