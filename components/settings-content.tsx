import { Button } from "@/components/ui/button"

const colorOptions = [
  "#3b82f6", // Blue
  "#ef4444", // Red
  "#10b981", // Green
  "#f59e0b", // Yellow
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#6366f1", // Indigo
  "#14b8a6", // Teal
]

interface SettingsContentProps {
  setAccentColor: (color: string) => void
}

export default function SettingsContent({ setAccentColor }: SettingsContentProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      <div>
        <h3 className="text-lg font-semibold mb-2">Accent Color</h3>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((color) => (
            <Button
              key={color}
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: color }}
              onClick={() => setAccentColor(color)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

