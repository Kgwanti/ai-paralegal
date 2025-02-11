
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Success",
          description: "Please check your email to verify your account.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Fibonacci Spiral SVG */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <svg
          width="1000"
          height="1000"
          viewBox="0 0 1000 1000"
          className="w-full h-full max-w-[150%] max-h-[150%] animate-slow-spin"
        >
          <path
            d="M500,500 L500,200 A300,300 0 0,1 800,500 A300,300 0 0,1 500,800 A300,300 0 0,1 200,500 A300,300 0 0,1 500,200"
            fill="none"
            stroke="white"
            strokeWidth="1"
            className="animate-fibonacci-draw"
          />
          <path
            d="M500,500 L500,320 A180,180 0 0,1 680,500 A180,180 0 0,1 500,680 A180,180 0 0,1 320,500 A180,180 0 0,1 500,320"
            fill="none"
            stroke="white"
            strokeWidth="1"
            className="animate-fibonacci-draw [animation-delay:0.5s]"
          />
          <path
            d="M500,500 L500,400 A100,100 0 0,1 600,500 A100,100 0 0,1 500,600 A100,100 0 0,1 400,500 A100,100 0 0,1 500,400"
            fill="none"
            stroke="white"
            strokeWidth="1"
            className="animate-fibonacci-draw [animation-delay:1s]"
          />
          <path
            d="M500,500 L500,450 A50,50 0 0,1 550,500 A50,50 0 0,1 500,550 A50,50 0 0,1 450,500 A50,50 0 0,1 500,450"
            fill="none"
            stroke="white"
            strokeWidth="1"
            className="animate-fibonacci-draw [animation-delay:1.5s]"
          />
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass rounded-xl p-8 backdrop-blur-lg">
          <h2 className="text-2xl font-serif mb-6 text-center">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-white/60 hover:text-white"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
