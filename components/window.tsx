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
  paint: { width: "95vw", maxWidth: "800px", height: "90vh", maxHeight: "700px" },
  projects: { width: "95vw", maxWidth: "1000px", height: "90vh", maxHeight: "800px" },
  settings: { width: "95vw", maxWidth: "600px", height: "90vh", maxHeight: "600px" },
  drawings: { width: "95vw", maxWidth: "800px", height: "90vh", maxHeight: "600px" },
  about: { width: "95vw", maxWidth: "800px", height: "90vh", maxHeight: "600px" },
  contact: { width: "95vw", maxWidth: "600px", height: "90vh", maxHeight: "400px" },
  default: { width: "95vw", maxWidth: "400px", height: "90vh", maxHeight: "300px" },
}

export default function Window({ secondaryAccentColor, children, ...props }: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startPos = useRef({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleMove = useCallback(
    (id: string, x: number, y: number) => {
      props.onMove(id, x, y)
    },
    [props.onMove],
  )

  const handleFocus = useCallback(() => {
    props.onFocus()
  }, [props.onFocus])

  const handleMinimize = useCallback(() => {
    props.onMinimize()
  }, [props.onMinimize])

  const handleMaximize = useCallback(() => {
    props.onMaximize()
  }, [props.onMaximize])

  const handleClose = useCallback(() => {
    props.onClose()
  }, [props.onClose])

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
      handleFocus()
    }

    const handleMoveEvent = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current || props.isMaximized) return

      let clientX, clientY
      if ("touches" in e) {
        const touch = e.touches[0]
        clientX = touch.clientX
        clientY = touch.clientY
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }

      const newLeft = clientX - startPos.current.x
      const newTop = clientY - startPos.current.y

      // Prevent dragging outside viewport
      const maxX = window.innerWidth - (windowRef.current?.offsetWidth || 0)
      const maxY = window.innerHeight - (windowRef.current?.offsetHeight || 0)

      const boundedLeft = Math.max(0, Math.min(newLeft, maxX))
      const boundedTop = Math.max(0, Math.min(newTop, maxY))

      handleMove(props.id, boundedLeft, boundedTop)
    }

    const handleEnd = () => {
      isDragging.current = false
    }

    const windowElement = windowRef.current
    if (windowElement) {
      windowElement.addEventListener("mousedown", handleStart)
      windowElement.addEventListener("touchstart", handleStart)
      document.addEventListener("mousemove", handleMoveEvent)
      document.addEventListener("touchmove", handleMoveEvent, { passive: false })
      document.addEventListener("mouseup", handleEnd)
      document.addEventListener("touchend", handleEnd)

      return () => {
        windowElement.removeEventListener("mousedown", handleStart)
        windowElement.removeEventListener("touchstart", handleStart)
        document.removeEventListener("mousemove", handleMoveEvent)
        document.removeEventListener("touchmove", handleMoveEvent)
        document.removeEventListener("mouseup", handleEnd)
        document.removeEventListener("touchend", handleEnd)
      }
    }
  }, [props.id, props.isMaximized, handleMove, handleFocus])

  const centerWindowOnMobile = useCallback(() => {
    if (!props.isMaximized && isMobile) {
      const rect = windowRef.current?.getBoundingClientRect()
      if (rect) {
        const centerX = (window.innerWidth - rect.width) / 2
        const centerY = (window.innerHeight - rect.height) / 2
        handleMove(props.id, centerX, centerY)
      }
    }
  }, [props.isMaximized, isMobile, props.id, handleMove])

  useEffect(() => {
    centerWindowOnMobile()
  }, [centerWindowOnMobile])

  if (props.isMinimized) {
    return null
  }

  const windowSize = WINDOW_SIZES[props.id as keyof typeof WINDOW_SIZES] || WINDOW_SIZES.default

  return (
    <div
      ref={windowRef}
      className={`window ${props.isMaximized ? "fixed inset-0 m-0" : "absolute"}`}
      style={{
        left: props.position.x,
        top: props.position.y,
        zIndex: props.zIndex,
        width: props.isMaximized ? "100%" : windowSize.width,
        maxWidth: props.isMaximized ? "100%" : windowSize.maxWidth,
        height: props.isMaximized ? "calc(100% - 48px)" : windowSize.height,
        maxHeight: props.isMaximized ? "calc(100% - 48px)" : windowSize.maxHeight,
        display: "flex",
        flexDirection: "column",
      }}
      onClick={handleFocus}
    >
      <div className="window-header select-none" style={{ backgroundColor: secondaryAccentColor }}>
        <span className="font-bold">{props.title}</span>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleMinimize()
            }}
            className="neo-brutalist-sm p-1 hover:translate-y-[1px] hover:shadow-[2px_1px_0px_0px_#000]
            active:translate-y-[2px] active:shadow-[1px_0px_0px_0px_#000] transition-all"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleMaximize()
            }}
            className="neo-brutalist-sm p-1 hover:translate-y-[1px] hover:shadow-[2px_1px_0px_0px_#000]
            active:translate-y-[2px] active:shadow-[1px_0px_0px_0px_#000] transition-all"
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleClose()
            }}
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

