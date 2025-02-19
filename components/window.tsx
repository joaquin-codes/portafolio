"use client"

import type React from "react"
import { useRef, useEffect, useState, useCallback } from "react"
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
  secondaryAccentColor: string
}

const WINDOW_SIZES = {
  paint: { width: "90vw", maxWidth: "800px", height: "80vh", maxHeight: "700px" },
  projects: { width: "90vw", maxWidth: "1000px", height: "80vh", maxHeight: "800px" },
  settings: { width: "90vw", maxWidth: "600px", height: "80vh", maxHeight: "600px" },
  drawings: { width: "90vw", maxWidth: "800px", height: "80vh", maxHeight: "600px" },
  default: { width: "90vw", maxWidth: "400px", height: "80vh", maxHeight: "300px" },
}

export default function Window({ secondaryAccentColor, children, ...props }: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startPos = useRef({ x: 0, y: 0 })
  const [position, setPosition] = useState(props.position)

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging.current || !windowRef.current || props.isMaximized) return

      const newX = clientX - startPos.current.x
      const newY = clientY - startPos.current.y

      // Get window dimensions
      const windowWidth = windowRef.current.offsetWidth
      const windowHeight = windowRef.current.offsetHeight

      // Get viewport dimensions
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // Calculate bounds
      const maxX = viewportWidth - windowWidth
      const maxY = viewportHeight - windowHeight

      // Constrain position within viewport
      const boundedX = Math.max(0, Math.min(newX, maxX))
      const boundedY = Math.max(0, Math.min(newY, maxY))

      props.onMove(props.id, boundedX, boundedY)
    },
    [props.id, props.isMaximized, props.onMove],
  )

  useEffect(() => {
    const handleStart = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(".window-header")) return

      isDragging.current = true
      const rect = windowRef.current?.getBoundingClientRect()
      if (!rect) return

      if ("touches" in e) {
        const touch = e.touches[0]
        startPos.current = {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        }
      } else {
        startPos.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        }
      }
      props.onFocus()
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
    }

    const handleEnd = () => {
      isDragging.current = false
    }

    const window = windowRef.current
    if (window) {
      window.addEventListener("mousedown", handleStart)
      window.addEventListener("touchstart", handleStart)
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("mouseup", handleEnd)
      document.addEventListener("touchend", handleEnd)

      return () => {
        window.removeEventListener("mousedown", handleStart)
        window.removeEventListener("touchstart", handleStart)
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("touchmove", handleTouchMove)
        document.removeEventListener("mouseup", handleEnd)
        document.removeEventListener("touchend", handleEnd)
      }
    }
  }, [props.onFocus, handleMove])

  useEffect(() => {
    if (props.isMaximized) {
      setPosition({ x: 0, y: 0 })
    } else {
      setPosition(props.position)
    }
  }, [props.isMaximized, props.position])

  if (props.isMinimized) {
    return null
  }

  const windowSize = WINDOW_SIZES[props.id as keyof typeof WINDOW_SIZES] || WINDOW_SIZES.default

  // Center window on mobile if not maximized
  useEffect(() => {
    if (!props.isMaximized && window.innerWidth <= 768) {
      const rect = windowRef.current?.getBoundingClientRect()
      if (rect) {
        const centerX = (window.innerWidth - rect.width) / 2
        const centerY = (window.innerHeight - rect.height) / 2
        props.onMove(props.id, centerX, centerY)
      }
    }
  }, [props.id, props.isMaximized, props.onMove])

  return (
    <div
      ref={windowRef}
      className={`window ${props.isMaximized ? "fixed inset-0 m-0" : "absolute"}`}
      style={{
        left: position.x,
        top: position.y,
        zIndex: props.zIndex,
        width: props.isMaximized ? "100%" : windowSize.width,
        maxWidth: props.isMaximized ? "100%" : windowSize.maxWidth,
        height: props.isMaximized ? "calc(100% - 48px)" : windowSize.height,
        maxHeight: props.isMaximized ? "calc(100% - 48px)" : windowSize.maxHeight,
        display: "flex",
        flexDirection: "column",
      }}
      onClick={props.onFocus}
    >
      <div className="window-header select-none" style={{ backgroundColor: secondaryAccentColor }}>
        <span className="font-bold">{props.title}</span>
        <div className="flex gap-2">
          <button
            onClick={props.onMinimize}
            className="neo-brutalist-sm p-1 hover:translate-y-[1px] hover:shadow-[2px_1px_0px_0px_#000]
            active:translate-y-[2px] active:shadow-[1px_0px_0px_0px_#000] transition-all"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={props.onMaximize}
            className="neo-brutalist-sm p-1 hover:translate-y-[1px] hover:shadow-[2px_1px_0px_0px_#000]
            active:translate-y-[2px] active:shadow-[1px_0px_0px_0px_#000] transition-all"
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            onClick={props.onClose}
            className="neo-brutalist-sm p-1 hover:translate-y-[1px] hover:shadow-[2px_1px_0px_0px_#000]
            active:translate-y-[2px] active:shadow-[1px_0px_0px_0px_#000] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 bg-white overflow-auto">{children}</div>
    </div>
  )
}

