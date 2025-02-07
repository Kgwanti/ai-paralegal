import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import ChatWidget from "./components/ChatWidget";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Assistant from "./pages/Assistant";
import Knowledge from "./pages/Knowledge";
import Workflows from "./pages/Workflows";
import Vault from "./pages/Vault";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ai-paralegal" element={<Assistant />} />
          <Route path="/research" element={<Knowledge />} />
          <Route path="/tasks" element={<Workflows />} />
          <Route path="/storage" element={<Vault />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatWidget />
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;