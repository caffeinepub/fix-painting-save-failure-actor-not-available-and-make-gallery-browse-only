import { useState } from 'react';
import { useGetRatings, useRatePainting } from '../../hooks/queries/useRatings';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

interface RatingControlProps {
  paintingId: string;
}

export default function RatingControl({ paintingId }: RatingControlProps) {
  const { userRating } = useGetRatings(paintingId);
  const { mutate: ratePainting, isPending } = useRatePainting();
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleRate = (points: number) => {
    ratePainting(
      { paintingId, points },
      {
        onSuccess: () => {
          toast.success(`Rated ${points}/10`);
        },
        onError: (error) => {
          toast.error('Failed to rate: ' + error.message);
        },
      }
    );
  };

  const displayRating = hoveredRating ?? userRating ?? 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Rate this painting</h3>
        {userRating && (
          <span className="text-sm text-muted-foreground">Your rating: {userRating}/10</span>
        )}
      </div>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
          <button
            key={rating}
            onClick={() => handleRate(rating)}
            onMouseEnter={() => setHoveredRating(rating)}
            onMouseLeave={() => setHoveredRating(null)}
            disabled={isPending}
            className="touch-target p-1 transition-transform hover:scale-110 disabled:opacity-50"
            aria-label={`Rate ${rating} out of 10`}
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                rating <= displayRating
                  ? 'fill-primary text-primary'
                  : 'text-muted-foreground'
              }`}
            />
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {userRating
          ? 'Click to change your rating'
          : 'Click a star to rate from 1 to 10'}
      </p>
    </div>
  );
}
