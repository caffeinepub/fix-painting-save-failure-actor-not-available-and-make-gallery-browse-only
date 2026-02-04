import { useState } from 'react';

interface ColorPaletteProps {
  color: string;
  onColorChange: (color: string) => void;
}

const presetColors = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  '#FFC0CB', '#A52A2A', '#808080', '#FFD700', '#4B0082',
];

export default function ColorPalette({ color, onColorChange }: ColorPaletteProps) {
  const [customColor, setCustomColor] = useState(color);

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    onColorChange(newColor);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Color</h3>
      
      <div className="grid grid-cols-5 gap-2">
        {presetColors.map((presetColor) => (
          <button
            key={presetColor}
            onClick={() => onColorChange(presetColor)}
            className={`w-full aspect-square rounded-lg border-2 transition-all touch-target ${
              color === presetColor
                ? 'border-primary scale-110'
                : 'border-border hover:border-primary/50'
            }`}
            style={{ backgroundColor: presetColor }}
            aria-label={`Select color ${presetColor}`}
          />
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Custom Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={customColor}
            onChange={handleCustomColorChange}
            className="w-16 h-12 rounded-lg border-2 border-border cursor-pointer"
          />
          <input
            type="text"
            value={customColor}
            onChange={(e) => {
              setCustomColor(e.target.value);
              if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                onColorChange(e.target.value);
              }
            }}
            className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
            placeholder="#000000"
          />
        </div>
      </div>
    </div>
  );
}
