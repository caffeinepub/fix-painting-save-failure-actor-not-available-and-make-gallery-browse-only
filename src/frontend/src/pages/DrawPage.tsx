import { useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useCompletePainting } from '../hooks/mutations/useCompletePainting';
import { useActorStatus } from '../hooks/useActorStatus';
import DrawingCanvas from '../components/draw/DrawingCanvas';
import ToolBar from '../components/draw/ToolBar';
import ColorPalette from '../components/draw/ColorPalette';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';
import { Alert, AlertDescription } from '../components/ui/alert';

export type Tool = 'brush' | 'pencil' | 'line';

export default function DrawPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useCurrentUser();
  const { isLoading: actorLoading, isError: actorError, isReady: actorReady } = useActorStatus();
  const [tool, setTool] = useState<Tool>('brush');
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(5);
  const [opacity, setOpacity] = useState(1);
  const canvasRef = useRef<{ exportImage: () => Uint8Array<ArrayBuffer>; undo: () => void } | null>(null);
  const { mutate: completePainting, isPending } = useCompletePainting();

  if (!isAuthenticated) {
    navigate({ to: '/' });
    return null;
  }

  const handleComplete = () => {
    // Prevent save if actor is not ready
    if (!actorReady) {
      toast.error('Unable to save. Please wait or refresh the page.');
      return;
    }

    if (!canvasRef.current) return;
    
    const imageBytes = canvasRef.current.exportImage();
    if (imageBytes.length === 0) {
      toast.error('Please draw something first!');
      return;
    }

    const title = `Painting ${new Date().toLocaleDateString()}`;
    const blob = ExternalBlob.fromBytes(imageBytes);

    completePainting(
      { image: blob, title },
      {
        onSuccess: () => {
          toast.success('Painting completed!');
          navigate({ to: '/gallery' });
        },
        onError: (error) => {
          toast.error('Failed to save painting: ' + error.message);
        },
      }
    );
  };

  const handleUndo = () => {
    canvasRef.current?.undo();
  };

  // Disable complete button if actor is loading or errored, or if mutation is pending
  const isCompleteDisabled = !actorReady || isPending;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-background">
      <div className="border-b border-border bg-card px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate({ to: '/dashboard' })}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors touch-target"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Back</span>
        </button>
        
        <h1 className="text-lg font-semibold text-foreground">Create Your Artwork</h1>
        
        <button
          onClick={handleComplete}
          disabled={isCompleteDisabled}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-target"
        >
          <Check className="h-5 w-5" />
          <span className="hidden sm:inline">
            {actorLoading ? 'Loading...' : isPending ? 'Saving...' : 'Complete'}
          </span>
        </button>
      </div>

      {actorError && (
        <div className="px-4 pt-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Unable to connect to the backend. Saving is currently unavailable. Please refresh the page or try logging in again.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-4 bg-muted/30">
          <DrawingCanvas
            ref={canvasRef}
            tool={tool}
            color={color}
            size={size}
            opacity={opacity}
          />
        </div>

        <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-border bg-card p-4 space-y-6 overflow-y-auto">
          <ToolBar
            tool={tool}
            onToolChange={setTool}
            size={size}
            onSizeChange={setSize}
            opacity={opacity}
            onOpacityChange={setOpacity}
            onUndo={handleUndo}
          />
          
          <ColorPalette color={color} onColorChange={setColor} />
        </div>
      </div>
    </div>
  );
}
