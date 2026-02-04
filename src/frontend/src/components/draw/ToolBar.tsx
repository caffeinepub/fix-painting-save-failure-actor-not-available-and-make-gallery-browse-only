import { Brush, Pencil, Minus, Undo } from 'lucide-react';
import { Tool } from '../../pages/DrawPage';

interface ToolBarProps {
  tool: Tool;
  onToolChange: (tool: Tool) => void;
  size: number;
  onSizeChange: (size: number) => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
  onUndo: () => void;
}

export default function ToolBar({
  tool,
  onToolChange,
  size,
  onSizeChange,
  opacity,
  onOpacityChange,
  onUndo,
}: ToolBarProps) {
  const tools: { id: Tool; icon: typeof Brush; label: string }[] = [
    { id: 'brush', icon: Brush, label: 'Brush' },
    { id: 'pencil', icon: Pencil, label: 'Pencil' },
    { id: 'line', icon: Minus, label: 'Line' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Tools</h3>
        <div className="grid grid-cols-3 gap-2">
          {tools.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => onToolChange(id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all touch-target ${
                tool === id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-foreground mb-3 block">
          Size: {size}px
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={size}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-foreground mb-3 block">
          Opacity: {Math.round(opacity * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={opacity}
          onChange={(e) => onOpacityChange(Number(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      <button
        onClick={onUndo}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-border hover:border-primary/50 text-foreground hover:text-primary transition-all touch-target"
      >
        <Undo className="h-5 w-5" />
        <span className="font-medium">Undo</span>
      </button>
    </div>
  );
}
