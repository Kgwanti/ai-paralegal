
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
          className="w-[200%] h-[200%] max-w-none max-h-none animate-slow-spin"
        >
          <path
            d="M500,500 L500,100 A400,400 0 0,1 900,500 A400,400 0 0,1 500,900 A400,400 0 0,1 100,500 A400,400 0 0,1 500,100"
            fill="none"
            stroke="white"
            strokeWidth="1"
            className="animate-fibonacci-draw"
          />
          <path
            d="M500,500 L500,250 A250,250 0 0,1 750,500 A250,250 0 0,1 500,750 A250,250 0 0,1 250,500 A250,250 0 0,1 500,250"
            fill="none"
            stroke="white"
            strokeWidth="1"
            className="animate-fibonacci-draw [animation-delay:0.5s]"
          />
          <path
            d="M500,500 L500,350 A150,150 0 0,1 650,500 A150,150 0 0,1 500,650 A150,150 0 0,1 350,500 A150,150 0 0,1 500,350"
            fill="none"
            stroke="white"
            strokeWidth="1"
            className="animate-fibonacci-draw [animation-delay:1s]"
          />
          <path
            d="M500,500 L500,425 A75,75 0 0,1 575,500 A75,75 0 0,1 500,575 A75,75 0 0,1 425,500 A75,75 0 0,1 500,425"
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
