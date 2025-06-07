"use client"

import * as React from "react"
import { useState } from "react"

interface TooltipProps {
  children: React.ReactNode
  content: string
  shortcut?: string
  side?: "top" | "bottom" | "left" | "right"
  className?: string
}

export function Tooltip({ children, content, shortcut, side = "bottom", className = "" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const sideClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2"
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`absolute z-[9999] ${sideClasses[side]} ${className} pointer-events-none`}>
          <div className="bg-black text-white text-sm rounded px-3 py-2 shadow-2xl whitespace-nowrap">
            {content}
            {shortcut && (
              <span className="ml-2 bg-gray-700 px-1 py-0.5 rounded text-xs">
                {shortcut}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
