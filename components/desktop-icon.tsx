"use client"

import { useRef, useEffect } from "react"
import type { LucideIcon } from "lucide-react"

interface DesktopIconProps {
  id: string
  left: number
  top: number
  icon: LucideIcon
  label: string
  onDoubleClick: () => void
  onDragEnd: (id: string, left: number, top: number) => void
  accentColor: string
}

export default function DesktopIcon({
  id,
  left,
  top,
  icon: Icon,
  label,
  onDoubleClick,
  onDragEnd,
  accentColor,
}: DesktopIconProps) {
  const iconRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const icon = iconRef.current
    if (!icon) return

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true
      startPos.current = {
        x: e.clientX - icon.offsetLeft,
        y: e.clientY - icon.offsetTop,
      }
      icon.style.zIndex = "1000"
      icon.style.transition = "none"
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const newLeft = e.clientX - startPos.current.x
      const newTop = e.clientY - startPos.current.y
      icon.style.left = `${newLeft}px`
      icon.style.top = `${newTop}px`
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging.current) return
      isDragging.current = false
      icon.style.zIndex = ""
      icon.style.transition = ""
      const newLeft = e.clientX - startPos.current.x
      const newTop = e.clientY - startPos.current.y
      onDragEnd(id, newLeft, newTop)
    }

    icon.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      icon.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [id, onDragEnd])

  return (
    <div
      ref={iconRef}
      className="desktop-icon absolute"
      style={{
        left,
        top,
      }}
      onDoubleClick={onDoubleClick}
    >
      <div
        className="neo-brutalist-sm w-12 h-12 flex items-center justify-center"
        style={{ backgroundColor: accentColor }}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="text-sm font-medium bg-white/80 px-2 rounded">{label}</span>
    </div>
  )
}

