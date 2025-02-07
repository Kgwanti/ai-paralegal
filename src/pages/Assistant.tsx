
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function Assistant() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      
      <main className="pl-64 min-h-screen">
        <div className="max-w-5xl mx-auto px-8 py-12">
          <header className="mb-12 animate-fade-down">
            <p className="text-sm font-medium text-white/60 mb-2">Assistant</p>
            <h1 className="text-5xl font-serif mb-4">Tailored to Your Expertise</h1>
            <p className="text-lg text-white/60">
              Delegate complex tasks in natural language to your domain specific personal assistant.
            </p>
          </header>

          <div className="glass rounded-2xl p-8 animate-fade-up">
            <Tabs defaultValue="assist">
              <TabsList className="mb-4">
                <TabsTrigger value="assist">Assist</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
              </TabsList>
              
              <TabsContent value="assist">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Query</h3>
                    <Input 
                      placeholder="Compare how these opinions differ or agree on the causation standard under the federal Anti-Kickback Statute."
                      className="glass"
                    />
                  </div>

                  <Button className="w-full glass glass-hover h-12">
                    Ask NexData
                  </Button>

                  <div>
                    <h3 className="font-medium mb-3">Sources</h3>
                    <div className="space-y-2">
                      {["U.S. ex rel Cairns.pdf", "U.S. ex rel Greenfield.pdf"].map((source) => (
                        <div key={source} className="flex items-center gap-3 p-3 glass rounded-lg glass-hover cursor-pointer">
                          <FileText className="h-5 w-5 text-white/40" />
                          <span className="text-sm">{source}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
