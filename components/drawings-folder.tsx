"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDesktop } from "@/contexts/desktop-context"
import { Trash2, Image } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DrawingsFolder() {
  const { files, deleteFile, setFileAsWallpaper } = useDesktop()
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; fileId: string } | null>(null)

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null)
    window.addEventListener("click", handleClickOutside)
    return () => window.removeEventListener("click", handleClickOutside)
  }, [])

  const handleContextMenu = (e: React.MouseEvent, fileId: string) => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      fileId,
    })
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Drawings</h2>
      <div className="grid grid-cols-4 gap-4">
        {files
          .filter((f) => f.type === "drawing")
          .map((file) => (
            <div key={file.id} className="relative group" onContextMenu={(e) => handleContextMenu(e, file.id)}>
              <div className="aspect-video rounded-lg overflow-hidden border-2 border-black">
                <img src={file.content || "/placeholder.svg"} alt={file.name} className="w-full h-full object-cover" />
              </div>
              <p className="mt-1 text-sm truncate">{file.name}</p>
            </div>
          ))}
      </div>

      {contextMenu && (
        <div
          className="fixed z-50 bg-white neo-brutalist-sm py-1"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            className="w-full px-4 py-1 text-left hover:bg-gray-100 flex items-center gap-2"
            onClick={() => {
              setFileAsWallpaper(contextMenu.fileId)
              setContextMenu(null)
            }}
          >
            <Image className="w-4 h-4" />
            Set as wallpaper
          </Button>
          <Button
            className="w-full px-4 py-1 text-left hover:bg-gray-100 flex items-center gap-2 text-red-600"
            onClick={() => {
              deleteFile(contextMenu.fileId)
              setContextMenu(null)
            }}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      )}
    </div>
  )
}

