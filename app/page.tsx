"use client"

import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import Desktop from "@/components/desktop"

export default function Home() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Desktop />
    </DndProvider>
  )
}

