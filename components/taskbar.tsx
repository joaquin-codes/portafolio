"use client"

import { useState, useEffect } from "react"
import { Menu, User, Palette, FolderGit2, Mail, Settings, Power } from "lucide-react"

interface TaskbarProps {
  windows: Array<{
    id: string
    title: string
    isOpen: boolean
    isMinimized: boolean
  }>
  onWindowClick: (id: string) => void
  accentColor: string
}

export default function Taskbar({ windows, onWindowClick, accentColor }: TaskbarProps) {
  const [time, setTime] = useState(new Date())
  const [isStartOpen, setIsStartOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(".start-menu") && !target.closest(".start-button")) {
        setIsStartOpen(false)
      }
    }

    window.addEventListener("click", handleClickOutside)

    return () => {
      clearInterval(timer)
      window.removeEventListener("click", handleClickOutside)
    }
  }, [])

  const startMenuItems = [
    { id: "about", icon: User, label: "About Me" },
    { id: "projects", icon: FolderGit2, label: "Projects" },
    { id: "paint", icon: Palette, label: "Paint" },
    { id: "contact", icon: Mail, label: "Contact" },
    { id: "settings", icon: Settings, label: "Settings" },
  ]

  return (
    <>
      {isStartOpen && (
        <div className="start-menu fixed bottom-12 left-0 w-64 bg-white neo-brutalist p-2 z-50">
          <div className="flex flex-col gap-1">
            {startMenuItems.map((item) => (
              <button
                key={item.id}
                className="flex items-center gap-3 w-full p-2 hover:bg-black/5 rounded-lg text-left"
                onClick={() => {
                  onWindowClick(item.id)
                  setIsStartOpen(false)
                }}
              >
                <item.icon className="w-5 h-5" style={{ color: accentColor }} />
                <span>{item.label}</span>
              </button>
            ))}
            <div className="my-2 border-t border-black/10" />
            <button className="flex items-center gap-3 w-full p-2 hover:bg-black/5 rounded-lg text-left text-red-600">
              <Power className="w-5 h-5" />
              <span>Shut Down</span>
            </button>
          </div>
        </div>
      )}

      <div className="taskbar" style={{ backgroundColor: accentColor }}>
        <button
          className={`start-button flex items-center gap-2 ${isStartOpen ? "translate-y-[2px] shadow-[2px_1px_0px_0px_#000]" : ""}`}
          onClick={() => setIsStartOpen(!isStartOpen)}
        >
          <Menu className="w-4 h-4" />
          <span className="font-bold">Start</span>
        </button>

        <div className="flex-1 flex items-center gap-2 px-4">
          {windows.map(
            (window) =>
              window.isOpen && (
                <button
                  key={window.id}
                  className={`neo-brutalist-sm px-3 py-1 text-sm ${window.isMinimized ? "opacity-50" : ""}`}
                  onClick={() => onWindowClick(window.id)}
                >
                  {window.title}
                </button>
              ),
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="neo-brutalist-sm px-3 py-1 text-sm">{time.toLocaleTimeString()}</div>
          <div className="neo-brutalist-sm px-3 py-1 text-sm">{time.toLocaleDateString()}</div>
        </div>
      </div>
    </>
  )
}

