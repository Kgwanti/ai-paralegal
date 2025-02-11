
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import ChatWidget from "./components/ChatWidget";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Assistant from "./pages/Assistant";
import Knowledge from "./pages/Knowledge";
import Workflows from "./pages/Workflows";
import Vault from "./pages/Vault";
import ClientCommunication from "./pages/ClientCommunication";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/ai-paralegal" element={<ProtectedRoute><Assistant /></ProtectedRoute>} />
          <Route path="/research" element={<ProtectedRoute><Knowledge /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Workflows /></ProtectedRoute>} />
          <Route path="/storage" element={<ProtectedRoute><Vault /></ProtectedRoute>} />
          <Route path="/communications" element={<ProtectedRoute><ClientCommunication /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatWidget />
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
