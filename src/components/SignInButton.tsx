
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from '@/components/ui/use-toast';

export const SignInButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({
          title: "Account created!",
          description: "Welcome to BibleWordle!",
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Welcome back!",
          description: "Successfully signed in.",
        });
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Authentication Error",
        description: isRegister 
          ? "Failed to create account. Please try again." 
          : "Failed to sign in. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-techBrightTeal hover:bg-techBrightTeal/90 text-white">
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleAuth}>
          <DialogHeader>
            <DialogTitle>{isRegister ? "Create Account" : "Sign In"}</DialogTitle>
            <DialogDescription>
              {isRegister 
                ? "Create an account to save your progress and compete on leaderboards." 
                : "Sign in to track your achievements and join the leaderboard."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={isRegister ? "new-password" : "current-password"}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRegister(!isRegister)}
              className="w-full sm:w-auto"
            >
              {isRegister ? "Already have an account?" : "Need an account?"}
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto bg-faithPurple hover:bg-faithPurple/90"
            >
              {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
