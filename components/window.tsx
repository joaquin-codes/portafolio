"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { X, Minus, Square } from "lucide-react"

interface WindowProps {
  id: string
  title: string
  children: React.ReactNode
  zIndex: number
  position: { x: number; y: number }
  isMinimized: boolean
  isMaximized: boolean
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onFocus: () => void
  onMove: (id: string, x: number, y: number) => void
}

export default function Window({
  id,
  title,
  children,
  zIndex,
  position,
  isMinimized,
  isMaximized,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
}: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current && windowRef.current && !isMaximized) {
        const newX = e.clientX - startPos.current.x
        const newY = e.clientY - startPos.current.y
        onMove(id, newX, newY)
      }
    }

    const handleMouseUp = () => {
      isDragging.current = false
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [id, onMove, isMaximized])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      isDragging.current = true
      startPos.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      }
      onFocus()
    }
  }

  if (isMinimized) {
    return null
  }

  return (
    <div
      ref={windowRef}
      className={`window ${isMaximized ? "fixed inset-0 m-0" : ""}`}
      style={{
        left: isMaximized ? 0 : position.x,
        top: isMaximized ? 0 : position.y,
        zIndex,
        width: isMaximized ? "100%" : undefined,
        height: isMaximized ? "calc(100% - 48px)" : undefined,
      }}
      onClick={onFocus}
    >
      <div className="window-header" onMouseDown={handleMouseDown}>
        <span className="font-bold">{title}</span>
        <div className="flex gap-2">
          <button
            onClick={onMinimize}
            className="neo-brutalist-sm p-1 hover:translate-y-[1px] hover:shadow-[2px_1px_0px_0px_#000]
            active:translate-y-[2px] active:shadow-[1px_0px_0px_0px_#000] transition-all"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={onMaximize}
            className="neo-brutalist-sm p-1 hover:translate-y-[1px] hover:shadow-[2px_1px_0px_0px_#000]
            active:translate-y-[2px] active:shadow-[1px_0px_0px_0px_#000] transition-all"
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="neo-brutalist-sm p-1 hover:translate-y-[1px] hover:shadow-[2px_1px_0px_0px_#000]
            active:translate-y-[2px] active:shadow-[1px_0px_0px_0px_#000] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div
        className="bg-white overflow-auto"
        style={{
          height: isMaximized ? "calc(100% - 40px)" : undefined,
        }}
      >
        {children}
      </div>
    </div>
  )
}

