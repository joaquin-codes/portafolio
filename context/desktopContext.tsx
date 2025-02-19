"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

interface DesktopFile {
  id: string
  name: string
  type: "drawing" | "image"
  content: string
  createdAt: Date
}

interface DesktopContextType {
  wallpaper: string
  setWallpaper: (url: string) => void
  files: DesktopFile[]
  addFile: (file: Omit<DesktopFile, "id" | "createdAt">) => void
  deleteFile: (id: string) => void
  setFileAsWallpaper: (id: string) => void
  secondaryAccentColor: string
  setSecondaryAccentColor: (color: string) => void
}

const DesktopContext = createContext<DesktopContextType | null>(null)

export function DesktopProvider({ children }: { children: React.ReactNode }) {
  const [currentWallpaper, setCurrentWallpaper] = useState("")
  const [files, setFiles] = useState<DesktopFile[]>([])
  const [secondaryAccentColor, setSecondaryAccentColor] = useState("#4B5563")

  const addFile = (file: Omit<DesktopFile, "id" | "createdAt">) => {
    setFiles((prev) => [
      ...prev,
      {
        ...file,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
      },
    ])
  }

  const deleteFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const setFileAsWallpaper = (id: string) => {
    const file = files.find((f) => f.id === id)
    if (file) {
      setCurrentWallpaper(file.content)
    }
  }

  return (
    <DesktopContext.Provider
      value={{
        wallpaper: currentWallpaper,
        setWallpaper: setCurrentWallpaper,
        files,
        addFile,
        deleteFile,
        setFileAsWallpaper,
        secondaryAccentColor,
        setSecondaryAccentColor,
      }}
    >
      {children}
    </DesktopContext.Provider>
  )
}

export function useDesktop() {
  const context = useContext(DesktopContext)
  if (!context) {
    throw new Error("useDesktop must be used within a DesktopProvider")
  }
  return context
}

