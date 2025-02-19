"use client"

import { useDesktop, defaultWallpapers } from "@/contexts/desktop-context"
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
  const { wallpaper, setWallpaper, setSecondaryAccentColor } = useDesktop()

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        <div className="space-y-4">
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

          <div>
            <h3 className="text-lg font-semibold mb-2">Secondary Accent Color (Window Headers)</h3>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <Button
                  key={color}
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: color }}
                  onClick={() => setSecondaryAccentColor(color)}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Wallpaper</h3>
            <div className="grid grid-cols-2 gap-4">
              {defaultWallpapers.map((wp, index) => (
                <button
                  key={wp}
                  className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all
                    ${wallpaper === wp ? "border-blue-500 scale-95" : "border-black hover:border-blue-500"}`}
                  onClick={() => setWallpaper(wp)}
                >
                  <img
                    src={wp || "/placeholder.svg"}
                    alt={`Wallpaper ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

