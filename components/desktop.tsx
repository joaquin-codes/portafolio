"use client"

import { useState, useCallback, useEffect } from "react"
import DesktopIcon from "./desktop-icon"
import Window from "./window"
import Taskbar from "./taskbar"
import { User, Palette, FolderGit2, Mail, Settings } from "lucide-react"
import Paint from "./paint"
import SettingsContent from "./settings-content"

interface IconPosition {
  id: string
  left: number
  top: number
}

interface WindowState {
  id: string
  title: string
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
  component: string
  position: { x: number; y: number }
  previousPosition?: { x: number; y: number }
}

export default function Desktop() {
  const [iconPositions, setIconPositions] = useState<IconPosition[]>([
    { id: "about", left: 20, top: 20 },
    { id: "projects", left: 20, top: 100 },
    { id: "paint", left: 20, top: 180 },
    { id: "contact", left: 20, top: 260 },
    { id: "settings", left: 20, top: 340 },
  ])

  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: "about",
      title: "About Me",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 0,
      component: "AboutMe",
      position: { x: 100, y: 100 },
    },
    {
      id: "projects",
      title: "Projects",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 0,
      component: "Projects",
      position: { x: 150, y: 150 },
    },
    {
      id: "paint",
      title: "Paint",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 0,
      component: "Paint",
      position: { x: 200, y: 200 },
    },
    {
      id: "contact",
      title: "Contact",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 0,
      component: "Contact",
      position: { x: 250, y: 250 },
    },
    {
      id: "settings",
      title: "Settings",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 0,
      component: "Settings",
      position: { x: 300, y: 300 },
    },
  ])

  const [maxZIndex, setMaxZIndex] = useState(0)
  const [accentColor, setAccentColor] = useState("#3b82f6")

  useEffect(() => {
    document.documentElement.style.setProperty("--accent-color", accentColor)
    document.documentElement.style.setProperty("--accent-color-hover", adjustColor(accentColor, -20))
  }, [accentColor])

  const moveIcon = useCallback((id: string, left: number, top: number) => {
    setIconPositions((prev) => prev.map((icon) => (icon.id === id ? { ...icon, left, top } : icon)))
  }, [])

  const openWindow = useCallback(
    (id: string) => {
      const newZIndex = maxZIndex + 1
      setMaxZIndex(newZIndex)
      setWindows((prev) =>
        prev.map((window) =>
          window.id === id ? { ...window, isOpen: true, isMinimized: false, zIndex: newZIndex } : window,
        ),
      )
    },
    [maxZIndex],
  )

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id ? { ...window, isOpen: false, isMinimized: false, isMaximized: false } : window,
      ),
    )
  }, [])

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.map((window) => (window.id === id ? { ...window, isMinimized: true } : window)))
  }, [])

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((window) => {
        if (window.id === id) {
          if (!window.isMaximized) {
            return {
              ...window,
              isMaximized: true,
              previousPosition: window.position,
              position: { x: 0, y: 0 },
            }
          } else {
            return {
              ...window,
              isMaximized: false,
              position: window.previousPosition || window.position,
            }
          }
        }
        return window
      }),
    )
  }, [])

  const bringToFront = useCallback(
    (id: string) => {
      const newZIndex = maxZIndex + 1
      setMaxZIndex(newZIndex)
      setWindows((prev) =>
        prev.map((window) => (window.id === id ? { ...window, zIndex: newZIndex, isMinimized: false } : window)),
      )
    },
    [maxZIndex],
  )

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) => prev.map((window) => (window.id === id ? { ...window, position: { x, y } } : window)))
  }, [])

  const iconComponents = {
    about: User,
    projects: FolderGit2,
    paint: Palette,
    contact: Mail,
    settings: Settings,
  }

  return (
    <div
      className="h-screen w-screen overflow-hidden relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FaVgjqqgAy2nj6DAWfrBHb0eOJ9G2Y.png)`,
      }}
    >
      {/* Desktop Icons */}
      {iconPositions.map(({ id, left, top }) => (
        <DesktopIcon
          key={id}
          id={id}
          left={left}
          top={top}
          icon={iconComponents[id as keyof typeof iconComponents]}
          label={id.charAt(0).toUpperCase() + id.slice(1)}
          onDoubleClick={() => openWindow(id)}
          onDragEnd={moveIcon}
          accentColor={accentColor}
        />
      ))}

      {/* Windows */}
      {windows.map(
        (window) =>
          window.isOpen && (
            <Window
              key={window.id}
              id={window.id}
              title={window.title}
              zIndex={window.zIndex}
              position={window.position}
              isMinimized={window.isMinimized}
              isMaximized={window.isMaximized}
              onClose={() => closeWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              onMaximize={() => maximizeWindow(window.id)}
              onFocus={() => bringToFront(window.id)}
              onMove={updateWindowPosition}
            >
              <WindowContent type={window.component} setAccentColor={setAccentColor} />
            </Window>
          ),
      )}

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        onWindowClick={(id) => {
          const window = windows.find((w) => w.id === id)
          if (window?.isOpen) {
            if (window.isMinimized) {
              bringToFront(id)
            } else {
              minimizeWindow(id)
            }
          } else {
            openWindow(id)
          }
        }}
        accentColor={accentColor}
      />
    </div>
  )
}

function WindowContent({ type, setAccentColor }: { type: string; setAccentColor: (color: string) => void }) {
  switch (type) {
    case "AboutMe":
      return (
        <div className="p-4">
          <h2 className="text-xl mb-4">About Me</h2>
          <p>Hello! I'm a developer who loves creating unique web experiences.</p>
        </div>
      )
    case "Projects":
      return (
        <div className="p-4">
          <h2 className="text-xl mb-4">My Projects</h2>
          <ul className="list-disc pl-4">
            <li>Project 1</li>
            <li>Project 2</li>
            <li>Project 3</li>
          </ul>
        </div>
      )
    case "Paint":
      return <Paint />
    case "Contact":
      return (
        <div className="p-4">
          <h2 className="text-xl mb-4">Contact Me</h2>
          <p>Email: example@example.com</p>
        </div>
      )
    case "Settings":
      return <SettingsContent setAccentColor={setAccentColor} />
    default:
      return null
  }
}

function adjustColor(color: string, amount: number) {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        ("0" + Math.min(255, Math.max(0, Number.parseInt(color, 16) + amount)).toString(16)).substr(-2),
      )
  )
}

