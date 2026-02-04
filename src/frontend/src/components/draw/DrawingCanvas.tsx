import { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { Tool } from '../../pages/DrawPage';

interface DrawingCanvasProps {
  tool: Tool;
  color: string;
  size: number;
  opacity: number;
}

export interface DrawingCanvasRef {
  exportImage: () => Uint8Array<ArrayBuffer>;
  undo: () => void;
}

const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(
  ({ tool, color, size, opacity }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lineStart, setLineStart] = useState<{ x: number; y: number } | null>(null);
    const historyRef = useRef<ImageData[]>([]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      saveHistory(ctx);
    }, []);

    const saveHistory = (ctx: CanvasRenderingContext2D) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      historyRef.current.push(imageData);
      
      if (historyRef.current.length > 20) {
        historyRef.current.shift();
      }
    };

    const undo = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (historyRef.current.length > 1) {
        historyRef.current.pop();
        const previousState = historyRef.current[historyRef.current.length - 1];
        ctx.putImageData(previousState, 0, 0);
      }
    };

    useImperativeHandle(ref, () => ({
      exportImage: () => {
        const canvas = canvasRef.current;
        if (!canvas) return new Uint8Array(0) as Uint8Array<ArrayBuffer>;
        
        const dataUrl = canvas.toDataURL('image/png');
        const base64 = dataUrl.split(',')[1];
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes as Uint8Array<ArrayBuffer>;
      },
      undo,
    }));

    const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      setIsDrawing(true);
      const coords = getCoordinates(e);

      if (tool === 'line') {
        setLineStart(coords);
      } else {
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
      }
    };

    const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const coords = getCoordinates(e);

      if (tool === 'line') {
        return;
      }

      ctx.strokeStyle = color;
      ctx.globalAlpha = opacity;
      ctx.lineWidth = size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (tool === 'pencil') {
        ctx.lineWidth = size * 0.5;
      }

      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    };

    const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (tool === 'line' && lineStart) {
        const coords = getCoordinates(e);
        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(lineStart.x, lineStart.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
        
        setLineStart(null);
      }

      ctx.closePath();
      ctx.globalAlpha = 1;
      setIsDrawing(false);
      saveHistory(ctx);
    };

    return (
      <canvas
        ref={canvasRef}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerLeave={stopDrawing}
        className="w-full max-w-2xl aspect-square bg-white rounded-xl shadow-soft cursor-crosshair touch-none"
        style={{ touchAction: 'none' }}
      />
    );
  }
);

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;
