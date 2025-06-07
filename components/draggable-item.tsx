"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"

interface DraggableItemProps {
  children: React.ReactNode
  initialX?: number
  initialY?: number
  initialWidth?: number
  initialHeight?: number
  id: string
  onPositionChange?: (id: string, x: number, y: number) => void
  onSizeChange?: (id: string, width: number, height: number) => void
  onDelete?: (id: string) => void
  resizable?: boolean
  style?: React.CSSProperties
  onClick?: () => void
  disabled?: boolean
}

export function DraggableItem({ 
  children, 
  initialX = 0, 
  initialY = 0, 
  initialWidth = 300,
  initialHeight = 200,
  id, 
  onPositionChange, 
  onSizeChange,
  onDelete,
  resizable = true,
  style,
  onClick,
  disabled
}: DraggableItemProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY })
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const itemRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't start dragging if disabled or clicking on the delete button or resize handle
    if (disabled || 
        (e.target as HTMLElement).closest('.delete-button') || 
        (e.target as HTMLElement).closest('.resize-handle')) {
      return
    }
    
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })

    // Enable pointer events on drag overlays when dragging starts
    const dragOverlays = itemRef.current?.querySelectorAll(".drag-overlay")
    dragOverlays?.forEach((overlay) => {
      ;(overlay as HTMLElement).style.pointerEvents = "auto"
    })

    e.preventDefault()
  }

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    })
    e.preventDefault()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onDelete?.(id)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (disabled && onClick) {
      e.stopPropagation()
      onClick()
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newPosition = {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        }
        setPosition(newPosition)
        onPositionChange?.(id, newPosition.x, newPosition.y)
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y
        const newSize = {
          width: Math.max(200, resizeStart.width + deltaX),
          height: Math.max(150, resizeStart.height + deltaY)
        }
        setSize(newSize)
        onSizeChange?.(id, newSize.width, newSize.height)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)

      // Disable pointer events on drag overlays when dragging stops
      const dragOverlays = itemRef.current?.querySelectorAll(".drag-overlay")
      dragOverlays?.forEach((overlay) => {
        ;(overlay as HTMLElement).style.pointerEvents = "none"
      })
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isResizing, dragStart, resizeStart, id, onPositionChange, onSizeChange])

  return (
    <div
      ref={itemRef}
      className={`absolute cursor-move select-none transition-shadow duration-200 group ${
        isDragging || isResizing ? "shadow-2xl scale-105 z-50" : "shadow-lg hover:shadow-xl z-10"
      }`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        transform: isDragging ? "rotate(2deg)" : "rotate(0deg)",
        ...style
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      {onDelete && (
        <button
          className="delete-button absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 cursor-pointer"
          onClick={handleDelete}
          title="Delete item"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      
      {resizable && (
        <div
          className="resize-handle absolute bottom-0 right-0 w-4 h-4 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-se-resize z-10"
          onMouseDown={handleResizeStart}
          title="Resize"
          style={{
            clipPath: "polygon(100% 0%, 0% 100%, 100% 100%)"
          }}
        />
      )}
      
      <div className="w-full h-full overflow-hidden">
        {children}
      </div>
    </div>
  )
}
