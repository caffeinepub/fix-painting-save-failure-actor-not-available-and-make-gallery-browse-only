import type { Painting } from '../../backend';

interface PaintingImageProps {
  painting: Painting;
  className?: string;
}

export default function PaintingImage({ painting, className = '' }: PaintingImageProps) {
  const imageUrl = painting.image.getDirectURL();

  return (
    <img
      src={imageUrl}
      alt={painting.title}
      className={className}
      loading="lazy"
    />
  );
}
