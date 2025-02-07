
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Upload, Search, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Index() {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => setIsDragging(false);
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop logic here
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      
      <main className="pl-64 min-h-screen">
        <div className="max-w-5xl mx-auto px-8 py-12">
          <header className="mb-12 animate-fade-down">
            <h1 className="text-5xl font-serif mb-4">Secure Storage,<br />Smart Analysis</h1>
            <p className="text-lg text-white/60">
              Upload, store, and analyze thousands of documents using powerful generative AI.
            </p>
          </header>

          <div 
            className={cn(
              "glass rounded-2xl p-12 text-center animate-fade-up cursor-pointer",
              "border-2 border-dashed border-white/10 transition-all duration-300",
              isDragging && "border-white/30 bg-white/[0.06]"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-white/40" />
            <h3 className="text-xl font-medium mb-2">Drop your documents here</h3>
            <p className="text-sm text-white/60 mb-6">
              Support for PDF, DOC, DOCX formats
            </p>
            <button className="px-6 py-3 glass glass-hover rounded-lg text-sm font-medium">
              Browse Files
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-8">
            {["Reps & Warranties", "M&A Deal Points", "Complaint Analysis"].map((title) => (
              <div key={title} className="glass rounded-xl p-6 animate-fade-up glass-hover cursor-pointer">
                <Search className="h-5 w-5 mb-4 text-white/40" />
                <h3 className="font-medium mb-2">{title}</h3>
                <p className="text-sm text-white/60">
                  Quick analysis template
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
