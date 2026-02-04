import { useNavigate } from '@tanstack/react-router';
import { useGetGallery } from '../hooks/queries/useGallery';
import { useCurrentUser } from '../hooks/useCurrentUser';
import PaintingGrid from '../components/gallery/PaintingGrid';
import { ArrowLeft, Loader2, ImageOff } from 'lucide-react';

export default function GalleryPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useCurrentUser();
  const { data: paintings, isLoading } = useGetGallery();

  if (!isAuthenticated) {
    navigate({ to: '/' });
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors touch-target"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back</span>
          </button>
          
          <h1 className="text-2xl font-bold text-foreground">Gallery</h1>
          
          <div className="w-20" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : paintings && paintings.length > 0 ? (
          <PaintingGrid paintings={paintings} />
        ) : (
          <div className="text-center py-20">
            <ImageOff className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg text-muted-foreground">No paintings to display yet</p>
            <p className="text-sm text-muted-foreground/70 mt-2">
              Paintings created by users will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
