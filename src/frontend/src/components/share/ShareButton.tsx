import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonProps {
  paintingId: string;
}

export default function ShareButton({ paintingId }: ShareButtonProps) {
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const url = `${window.location.origin}/painting/${paintingId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this painting',
          url,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Share failed:', error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy link');
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-lg hover:bg-secondary transition-colors touch-target"
      aria-label="Share painting"
    >
      <Share2 className="h-5 w-5 text-muted-foreground hover:text-foreground" />
    </button>
  );
}
