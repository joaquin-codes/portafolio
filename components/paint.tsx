"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useDesktop } from "@/contexts/desktop-context"
import { Save } from "lucide-react"

const colors = [
  "#000000",
  "#808080",
  "#800000",
  "#808000",
  "#008000",
  "#008080",
  "#000080",
  "#800080",
  "#808040",
  "#004040",
  "#0080FF",
  "#004080",
  "#8000FF",
  "#804000",
  "#FFFFFF",
  "#C0C0C0",
  "#FF0000",
  "#FFFF00",
  "#00FF00",
  "#00FFFF",
  "#0000FF",
  "#FF00FF",
  "#FFFF80",
  "#00FF80",
  "#80FFFF",
  "#8080FF",
  "#FF0080",
  "#FF8040",
]

export default function Paint() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState("#000000")
  const [tool, setTool] = useState("brush")
  const { addFile } = useDesktop()
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (context && canvas) {
      // Set canvas size to match container
      canvas.width = 800
      canvas.height = 600
      context.fillStyle = "#FFFFFF"
      context.fillRect(0, 0, canvas.width, canvas.height)
    }
  }, [])

  const getCanvasPoint = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if ("touches" in e) {
      const touch = e.touches[0]
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      }
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      }
    }
  }

  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    const point = getCanvasPoint(e)
    if (!point) return

    const context = canvasRef.current?.getContext("2d")
    if (context) {
      setIsDrawing(true)
      setLastPos(point)
      context.beginPath()
      context.moveTo(point.x, point.y)
    }
  }

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return
    const point = getCanvasPoint(e)
    if (!point) return

    const context = canvasRef.current?.getContext("2d")
    if (context) {
      context.lineTo(point.x, point.y)
      context.strokeStyle = tool === "eraser" ? "#FFFFFF" : color
      context.lineWidth = tool === "eraser" ? 20 : 2
      context.lineCap = "round"
      context.stroke()
      setLastPos(point)
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const saveDrawing = () => {
    const canvas = canvasRef.current
    if (canvas) {
      // Create a temporary canvas to handle the background
      const tempCanvas = document.createElement("canvas")
      tempCanvas.width = canvas.width
      tempCanvas.height = canvas.height
      const tempCtx = tempCanvas.getContext("2d")

      if (tempCtx) {
        // Fill white background
        tempCtx.fillStyle = "#FFFFFF"
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
        // Draw the original canvas content
        tempCtx.drawImage(canvas, 0, 0)

        const dataUrl = tempCanvas.toDataURL()
        const name = `Drawing ${new Date().toLocaleString()}`
        addFile({
          name,
          type: "drawing",
          content: dataUrl,
        })
        alert("Drawing saved successfully!")
      }
    }
  }

  return (
    <div className="bg-gray-200 border-2 border-black w-full h-full flex flex-col">
      <div className="bg-gray-300 px-2 py-1 text-sm border-b-2 border-black flex justify-between items-center">
        <div className="hidden sm:flex">
          <span className="mr-4">File</span>
          <span className="mr-4">Edit</span>
          <span className="mr-4">View</span>
          <span className="mr-4">Image</span>
          <span className="mr-4">Options</span>
          <span>Help</span>
        </div>
        <Button variant="ghost" className="h-7 px-2 flex items-center gap-1" onClick={saveDrawing}>
          <Save className="w-4 h-4" />
          Save
        </Button>
      </div>
      <div className="flex flex-1 min-h-0">
        <div className="w-8 bg-gray-300 p-0.5 border-r-2 border-black">
          <Button
            variant="ghost"
            className={`w-7 h-7 p-0 min-w-0 mb-0.5 ${tool === "brush" ? "bg-gray-400 border-2 border-black shadow-inner" : ""}`}
            onClick={() => setTool("brush")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M18 12l-8-8-6 6c-2 2-2 5 0 7s5 2 7 0l7-7" />
              <path d="M17 7l3 3" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            className={`w-7 h-7 p-0 min-w-0 mb-0.5 ${tool === "eraser" ? "bg-gray-400 border-2 border-black shadow-inner" : ""}`}
            onClick={() => setTool("eraser")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M20 20H7L3 16C2 15 2 13 3 12L13 2L22 11L20 20Z" />
              <path d="M17 17L7 7" />
            </svg>
          </Button>
        </div>
        <div className="flex-1 relative bg-white">
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
      </div>
      <div className="flex bg-gray-300 p-1 border-t-2 border-black overflow-x-auto">
        <div className="flex flex-wrap gap-1">
          {colors.map((c) => (
            <Button
              key={c}
              variant="ghost"
              className={`w-6 h-6 p-0 min-w-0 ${color === c ? "ring-2 ring-black" : ""}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>
      <div className="bg-gray-300 px-2 py-1 text-sm border-t-2 border-black hidden sm:block">
        For Help, click Help Topics on the Help Menu.
      </div>
    </div>
  )
}

