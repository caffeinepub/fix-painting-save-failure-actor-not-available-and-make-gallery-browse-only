import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetPainting } from '../hooks/queries/useGallery';
import { useGetRatings } from '../hooks/queries/useRatings';
import { useCurrentUser } from '../hooks/useCurrentUser';
import PaintingImage from '../components/gallery/PaintingImage';
import RatingControl from '../components/ratings/RatingControl';
import ShareButton from '../components/share/ShareButton';
import { ArrowLeft, Loader2, Star } from 'lucide-react';

export default function PaintingDetailPage() {
  const navigate = useNavigate();
  const { paintingId } = useParams({ from: '/painting/$paintingId' });
  const { data: painting, isLoading } = useGetPainting(paintingId);
  const { averageRating, totalRatings } = useGetRatings(paintingId);
  const { isAuthenticated } = useCurrentUser();

  if (!isAuthenticated) {
    navigate({ to: '/' });
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!painting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Painting not found</p>
          <button
            onClick={() => navigate({ to: '/gallery' })}
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate({ to: '/gallery' })}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors touch-target"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Gallery</span>
          </button>
          
          <ShareButton paintingId={paintingId} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
          <div className="aspect-square bg-muted/30 flex items-center justify-center">
            <PaintingImage painting={painting} className="max-w-full max-h-full object-contain" />
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">{painting.title}</h1>
              <p className="text-sm text-muted-foreground">
                Created {new Date(Number(painting.created) / 1000000).toLocaleDateString()}
              </p>
            </div>

            {averageRating !== null && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-medium text-foreground">
                  {averageRating.toFixed(1)}
                </span>
                <span>({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})</span>
              </div>
            )}

            <div className="border-t border-border pt-6">
              <RatingControl paintingId={paintingId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
