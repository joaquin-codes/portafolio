"use client"

import { useState, useCallback, useEffect } from "react"
import DesktopIcon from "./desktop-icon"
import Window from "./window"
import Taskbar from "./taskbar"
import { User, Palette, FolderGit2, Mail, Settings, Image } from "lucide-react"
import Paint from "./paint"
import SettingsContent from "./settings-content"
import { DesktopProvider, useDesktop } from "@/contexts/desktop-context"
import DrawingsFolder from "./drawings-folder"
import ProjectsContent from "./projects-content"

// Interfaces
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

// Desktop content component
function DesktopContent() {
  const { wallpaper, secondaryAccentColor } = useDesktop()
  const [iconPositions, setIconPositions] = useState<IconPosition[]>([
    { id: "about", left: 20, top: 20 },
    { id: "projects", left: 20, top: 100 },
    { id: "paint", left: 20, top: 180 },
    { id: "contact", left: 20, top: 260 },
    { id: "settings", left: 20, top: 340 },
    { id: "drawings", left: 20, top: 420 },
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
    {
      id: "drawings",
      title: "Drawings",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 0,
      component: "Drawings",
      position: { x: 350, y: 350 },
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
      setWindows((prev) => {
        const existingWindowIndex = prev.findIndex((window) => window.id === id)
        if (existingWindowIndex !== -1) {
          // Window exists, update its state
          const newZIndex = maxZIndex + 1
          setMaxZIndex(newZIndex)
          return prev.map((window, index) =>
            index === existingWindowIndex ? { ...window, isOpen: true, isMinimized: false, zIndex: newZIndex } : window,
          )
        } else {
          // Window doesn't exist, create a new one
          const newZIndex = maxZIndex + 1
          setMaxZIndex(newZIndex)
          return [
            ...prev,
            {
              id,
              title: id.charAt(0).toUpperCase() + id.slice(1),
              isOpen: true,
              isMinimized: false,
              isMaximized: false,
              zIndex: newZIndex,
              component: id,
              position: { x: 100, y: 100 },
            },
          ]
        }
      })
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

  const bringToFront = useCallback((id: string) => {
    setMaxZIndex((prevZIndex) => {
      const newZIndex = prevZIndex + 1
      setWindows((prev) =>
        prev.map((window) =>
          window.id === id ? { ...window, zIndex: newZIndex, isMinimized: false, isOpen: true } : window,
        ),
      )
      return newZIndex
    })
  }, [])

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) => prev.map((window) => (window.id === id ? { ...window, position: { x, y } } : window)))
  }, [])

  const iconComponents = {
    about: User,
    projects: FolderGit2,
    paint: Palette,
    contact: Mail,
    settings: Settings,
    drawings: Image,
  }

  return (
    <div
      className="h-screen w-screen overflow-hidden relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${wallpaper})`,
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
              secondaryAccentColor={secondaryAccentColor}
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
              // If the window is already open and not minimized, just bring it to front
              bringToFront(id)
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

// Main Desktop component that provides the context
export default function Desktop() {
  return (
    <DesktopProvider>
      <DesktopContent />
    </DesktopProvider>
  )
}

function WindowContent({ type, setAccentColor }: { type: string; setAccentColor: (color: string) => void }) {
  switch (type) {
    case "AboutMe":
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">About Me</h2>
          <div className="space-y-6">
            <p className="text-lg">
              Hi, I'm Joaquin, a Software Engineering student about to finish my degree at the European Atlantic
              University in Spain. I'm passionate about Data Science and halfway through the Google Advanced Data
              Science certificate. I recently founded an NGO focused on youth projects with the European Union. I'm now
              seeking internships to apply my skills and grow in the field of Data Science.
            </p>
            <div>
              <h3 className="text-xl font-bold mb-4">Skills</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p>• Python (Pandas, NumPy, Matplotlib, Scikit-Learn)</p>
                  <p>• SQL (MySQL)</p>
                  <p>• C#</p>
                  <p>• Excel (Advanced formulas, PivotTables, Data Visualization)</p>
                </div>
                <div className="space-y-2">
                  <p>• Power BI</p>
                  <p>• Machine Learning (Supervised & Unsupervised)</p>
                  <p>• Statistical Analysis & Data Modeling</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    case "Contact":
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Contact Me</h2>
          <div className="space-y-4">
            <p className="text-xl font-bold">JOAQUIN RODRIGUEZ</p>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                <a href="tel:+34602472374" className="hover:underline">
                  +34 602472374
                </a>
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                <a href="mailto:joaquin00rf@gmail.com" className="hover:underline">
                  joaquin00rf@gmail.com
                </a>
              </p>
              <p>
                <span className="font-semibold">GitHub:</span>{" "}
                <a
                  href="https://github.com/joaquin-codes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  github.com/joaquin-codes
                </a>
              </p>
              <p>
                <span className="font-semibold">LinkedIn:</span>{" "}
                <a
                  href="https://linkedin.com/in/joaquin-codes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  linkedin.com/in/joaquin-codes/
                </a>
              </p>
            </div>
          </div>
        </div>
      )
    case "Projects":
      return <ProjectsContent />
    case "Paint":
      return <Paint />
    case "Settings":
      return <SettingsContent setAccentColor={setAccentColor} />
    case "Drawings":
      return <DrawingsFolder />
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

