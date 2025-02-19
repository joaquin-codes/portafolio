"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
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

export default function Window({ secondaryAccentColor, children, ...props }: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startPos = useRef({ x: 0, y: 0 })
  const [position, setPosition] = useState(props.position)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current && windowRef.current && !props.isMaximized) {
        const newX = e.clientX - startPos.current.x
        const newY = e.clientY - startPos.current.y
        props.onMove(props.id, newX, newY)
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
  }, [props.id, props.isMaximized, props.onMove]) // Updated dependency array

  useEffect(() => {
    if (props.isMaximized) {
      setPosition({ x: 0, y: 0 })
    } else {
      setPosition(props.position)
    }
  }, [props.isMaximized, props.position]) // Updated dependency array

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      isDragging.current = true
      startPos.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      }
      props.onFocus()
    }
  }

  if (props.isMinimized) {
    return null
  }

  return (
    <div
      ref={windowRef}
      className={`window ${props.isMaximized ? "fixed inset-0 m-0" : ""}`}
      style={{
        left: position.x,
        top: position.y,
        zIndex: props.zIndex,
        width: props.isMaximized ? "100%" : "auto",
        height: props.isMaximized ? "calc(100% - 48px)" : "auto",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={props.onFocus}
    >
      <div className="window-header" style={{ backgroundColor: secondaryAccentColor }} onMouseDown={handleMouseDown}>
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
      <div
        className="bg-white overflow-auto"
        style={{
          height: props.isMaximized ? "calc(100% - 40px)" : "300px", // Add default height
          width: props.isMaximized ? "100%" : "400px", // Add default width
        }}
      >
        {children}
      </div>
    </div>
  )
}

