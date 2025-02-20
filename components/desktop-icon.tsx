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
  const lastTapTime = useRef(0)
  const [position, setPosition] = useState({ left, top })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    setPosition({ left, top })
  }, [left, top])

  useEffect(() => {
    const icon = iconRef.current
    if (!icon) return

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault() // Prevent default touch behavior
      const touch = e.touches[0]
      startPos.current = {
        x: touch.clientX - position.left,
        y: touch.clientY - position.top,
      }

      // Set up long press detection
      touchTimeout.current = setTimeout(() => {
        isDragging.current = true
        icon.style.opacity = "0.7"
      }, 500)

      // Handle single/double tap
      const now = Date.now()
      const timeSinceLastTap = now - lastTapTime.current
      if (timeSinceLastTap < 300) {
        // Double tap detected
        clearTimeout(touchTimeout.current)
        isDragging.current = false
        onDoubleClick()
      } else if (isMobile) {
        // Single tap on mobile
        clearTimeout(touchTimeout.current)
        touchTimeout.current = setTimeout(() => {
          if (!isDragging.current) {
            onDoubleClick()
          }
        }, 300)
      }
      lastTapTime.current = now
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return

      const touch = e.touches[0]
      const newLeft = touch.clientX - startPos.current.x
      const newTop = touch.clientY - startPos.current.y

      // Prevent dragging outside viewport
      const maxX = window.innerWidth - icon.offsetWidth
      const maxY = window.innerHeight - icon.offsetHeight - 48 // Account for taskbar

      const boundedLeft = Math.max(0, Math.min(newLeft, maxX))
      const boundedTop = Math.max(0, Math.min(newTop, maxY))

      setPosition({ left: boundedLeft, top: boundedTop })
    }

    const handleTouchEnd = () => {
      if (touchTimeout.current) {
        clearTimeout(touchTimeout.current)
      }

      if (isDragging.current) {
        onDragEnd(id, position.left, position.top)
        isDragging.current = false
        icon.style.opacity = "1"
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (isMobile) return // Ignore mouse events on mobile
      isDragging.current = true
      startPos.current = {
        x: e.clientX - position.left,
        y: e.clientY - position.top,
      }
      icon.style.opacity = "0.7"
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || isMobile) return

      const newLeft = e.clientX - startPos.current.x
      const newTop = e.clientY - startPos.current.y

      // Prevent dragging outside viewport
      const maxX = window.innerWidth - icon.offsetWidth
      const maxY = window.innerHeight - icon.offsetHeight - 48 // Account for taskbar

      const boundedLeft = Math.max(0, Math.min(newLeft, maxX))
      const boundedTop = Math.max(0, Math.min(newTop, maxY))

      setPosition({ left: boundedLeft, top: boundedTop })
    }

    const handleMouseUp = () => {
      if (isDragging.current) {
        onDragEnd(id, position.left, position.top)
        isDragging.current = false
        icon.style.opacity = "1"
      }
    }

    // Touch events
    icon.addEventListener("touchstart", handleTouchStart, { passive: false })
    window.addEventListener("touchmove", handleTouchMove, { passive: true })
    window.addEventListener("touchend", handleTouchEnd)

    // Mouse events (desktop only)
    if (!isMobile) {
      icon.addEventListener("mousedown", handleMouseDown)
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      icon.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)

      if (!isMobile) {
        icon.removeEventListener("mousedown", handleMouseDown)
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }

      if (touchTimeout.current) {
        clearTimeout(touchTimeout.current)
      }
    }
  }, [id, onDragEnd, onDoubleClick, isMobile, position])

  return (
    <div
      ref={iconRef}
      className="desktop-icon absolute touch-none"
      style={{
        left: position.left,
        top: position.top,
      }}
      onDoubleClick={isMobile ? undefined : onDoubleClick}
    >
      <div
        className="neo-brutalist-sm w-14 h-14 flex items-center justify-center"
        style={{ backgroundColor: accentColor }}
      >
        <Icon className="w-7 h-7 text-white" />
      </div>
      <span className="text-sm font-medium bg-white/80 px-2 rounded text-center max-w-[120px] line-clamp-2">
        {label}
      </span>
    </div>
  )
}

