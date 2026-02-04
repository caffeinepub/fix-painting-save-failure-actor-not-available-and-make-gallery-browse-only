import { useNavigate } from '@tanstack/react-router';
import type { Painting } from '../../backend';
import PaintingCard from './PaintingCard';

interface PaintingGridProps {
  paintings: Painting[];
}

export default function PaintingGrid({ paintings }: PaintingGridProps) {
  const navigate = useNavigate();

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {paintings.map((painting) => (
        <div key={painting.id} className="break-inside-avoid">
          <PaintingCard
            painting={painting}
            onClick={() => navigate({ to: '/painting/$paintingId', params: { paintingId: painting.id } })}
          />
        </div>
      ))}
    </div>
  );
}
