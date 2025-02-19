"use client"

import { useRef, useEffect, useState } from "react"
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
  const [isMobile, setIsMobile] = useState(false)
  const touchTimeout = useRef<NodeJS.Timeout>()
  const lastTap = useRef(0)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const icon = iconRef.current
    if (!icon) return

    const handleStart = (e: MouseEvent | TouchEvent) => {
      if ("touches" in e) {
        // Touch events
        const touch = e.touches[0]
        startPos.current = {
          x: touch.clientX - icon.offsetLeft,
          y: touch.clientY - icon.offsetTop,
        }

        // Set a timeout for long press
        touchTimeout.current = setTimeout(() => {
          isDragging.current = true
          icon.style.opacity = "0.7"
        }, 500)
      } else {
        // Mouse events
        isDragging.current = true
        startPos.current = {
          x: e.clientX - icon.offsetLeft,
          y: e.clientY - icon.offsetTop,
        }
      }

      icon.style.zIndex = "1000"
      icon.style.transition = "none"
    }

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return

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
      const maxX = window.innerWidth - icon.offsetWidth
      const maxY = window.innerHeight - icon.offsetHeight

      const boundedLeft = Math.max(0, Math.min(newLeft, maxX))
      const boundedTop = Math.max(0, Math.min(newTop, maxY))

      icon.style.left = `${boundedLeft}px`
      icon.style.top = `${boundedTop}px`
    }

    const handleEnd = (e: MouseEvent | TouchEvent) => {
      if (touchTimeout.current) {
        clearTimeout(touchTimeout.current)
      }

      if (!isDragging.current) {
        if ("changedTouches" in e && isMobile) {
          // Handle single tap on mobile
          const now = Date.now()
          const timeDiff = now - lastTap.current
          if (timeDiff < 300) {
            // Double tap detected
            e.preventDefault()
          } else {
            onDoubleClick()
          }
          lastTap.current = now
        }
      } else {
        const rect = icon.getBoundingClientRect()
        onDragEnd(id, rect.left, rect.top)
      }

      isDragging.current = false
      icon.style.opacity = "1"
      icon.style.zIndex = ""
      icon.style.transition = ""
    }

    // Mouse events
    icon.addEventListener("mousedown", handleStart)
    window.addEventListener("mousemove", handleMove)
    window.addEventListener("mouseup", handleEnd)

    // Touch events
    icon.addEventListener("touchstart", handleStart, { passive: true })
    window.addEventListener("touchmove", handleMove, { passive: false })
    window.addEventListener("touchend", handleEnd)

    return () => {
      icon.removeEventListener("mousedown", handleStart)
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("mouseup", handleEnd)

      icon.removeEventListener("touchstart", handleStart)
      window.removeEventListener("touchmove", handleMove)
      window.removeEventListener("touchend", handleEnd)

      if (touchTimeout.current) {
        clearTimeout(touchTimeout.current)
      }
    }
  }, [id, onDragEnd, onDoubleClick, isMobile])

  return (
    <div
      ref={iconRef}
      className="desktop-icon absolute touch-none"
      style={{
        left,
        top,
      }}
      onDoubleClick={isMobile ? undefined : onDoubleClick}
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

