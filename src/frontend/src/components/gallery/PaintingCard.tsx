import type { Painting } from '../../backend';
import PaintingImage from './PaintingImage';
import ShareButton from '../share/ShareButton';
import { useGetRatings } from '../../hooks/queries/useRatings';
import { Star } from 'lucide-react';

interface PaintingCardProps {
  painting: Painting;
  onClick: () => void;
}

export default function PaintingCard({ painting, onClick }: PaintingCardProps) {
  const { averageRating, totalRatings } = useGetRatings(painting.id);

  return (
    <div className="group relative bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-all cursor-pointer">
      <div onClick={onClick} className="relative">
        <PaintingImage painting={painting} className="w-full h-auto" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0" onClick={onClick}>
            <h3 className="font-semibold text-foreground truncate">{painting.title}</h3>
            <p className="text-xs text-muted-foreground">
              {new Date(Number(painting.created) / 1000000).toLocaleDateString()}
            </p>
          </div>
          
          <ShareButton paintingId={painting.id} />
        </div>

        {averageRating !== null && (
          <div className="flex items-center gap-1 text-sm" onClick={onClick}>
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-medium text-foreground">{averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">({totalRatings})</span>
          </div>
        )}
      </div>
    </div>
  );
}
