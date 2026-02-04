import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Palette, Image, Heart } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/20 to-accent/10">
        <div className="w-full max-w-md text-center space-y-8">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-primary/10">
                <Palette className="h-16 w-16 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground">Welcome to Painto</h1>
            <p className="text-lg text-muted-foreground">
              Create beautiful artwork, share with the community, and discover amazing paintings
            </p>
          </div>
          
          <button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 disabled:opacity-50 transition-all shadow-soft hover:shadow-medium touch-target"
          >
            {isLoggingIn ? 'Signing In...' : 'Sign In to Start'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">What would you like to do?</h1>
          <p className="text-lg text-muted-foreground">Choose an option to get started</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate({ to: '/draw' })}
            className="group relative overflow-hidden rounded-2xl bg-card border-2 border-border hover:border-primary p-8 transition-all hover:shadow-medium touch-target"
          >
            <div className="relative z-10 space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Palette className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Draw</h2>
              <p className="text-muted-foreground">
                Create a new masterpiece with professional drawing tools
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          <button
            onClick={() => navigate({ to: '/gallery' })}
            className="group relative overflow-hidden rounded-2xl bg-card border-2 border-border hover:border-accent p-8 transition-all hover:shadow-medium touch-target"
          >
            <div className="relative z-10 space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <Image className="h-12 w-12 text-accent" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Gallery</h2>
              <p className="text-muted-foreground">
                Explore and rate amazing artwork from the community
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    </div>
  );
}
