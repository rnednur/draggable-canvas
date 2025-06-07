"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DraggableItem } from "@/components/draggable-item"
import {
  BlogPostCard,
  ProductCard,
  SocialMediaPost,
  VideoCard,
  EventCard,
  NewsletterCard,
  LiveWebsiteCard,
  WebsitePreview,
} from "@/components/editable-components"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RotateCcw, Plus, Globe, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip } from "@/components/ui/tooltip"

interface CanvasItem {
  id: string
  type: 'url' | 'chart' | 'note' | 'component'
  component?: React.ReactNode
  data?: any
  x: number
  y: number
  width: number
  height: number
  title?: string
  content?: string
  url?: string
  chartData?: any
}

interface CanvasConfig {
  urls?: Array<{
    url: string
    title: string
    width?: number
    height?: number
    x?: number
    y?: number
  }>
  charts?: Array<{
    type: 'bar' | 'line' | 'pie' | 'metrics' | 'kpi'
    title: string
    data: any
    width?: number
    height?: number
    x?: number
    y?: number
  }>
  notes?: Array<{
    title: string
    content: string
    color?: string
    width?: number
    height?: number
    x?: number
    y?: number
  }>
  components?: Array<{
    type: string
    props?: any
    width?: number
    height?: number
    x?: number
    y?: number
  }>
}

interface DynamicCanvasProps {
  config?: CanvasConfig
  editable?: boolean
  onItemsChange?: (items: CanvasItem[]) => void
}

function DynamicCanvas({ 
  config = {}, 
  editable = true,
  onItemsChange 
}: DynamicCanvasProps) {
  const [items, setItems] = useState<CanvasItem[]>(() => {
    const initialItems: CanvasItem[] = []
    let idCounter = 1

    // Process URLs from config
    config.urls?.forEach(urlConfig => {
      initialItems.push({
        id: `url-${idCounter++}`,
        type: 'url',
        url: urlConfig.url,
        title: urlConfig.title,
        x: urlConfig.x || Math.random() * 300 + 100,
        y: urlConfig.y || Math.random() * 300 + 100,
        width: urlConfig.width || 400,
        height: urlConfig.height || 300,
        component: <LiveWebsiteCard url={urlConfig.url} title={urlConfig.title} width={urlConfig.width || 400} height={urlConfig.height || 300} />
      })
    })

    // Process charts from config
    config.charts?.forEach(chartConfig => {
      initialItems.push({
        id: `chart-${idCounter++}`,
        type: 'chart',
        title: chartConfig.title,
        chartData: chartConfig.data,
        x: chartConfig.x || Math.random() * 300 + 100,
        y: chartConfig.y || Math.random() * 300 + 100,
        width: chartConfig.width || 350,
        height: chartConfig.height || 250,
        component: createChartComponent(chartConfig.type, chartConfig.title, chartConfig.data, chartConfig.width || 350, chartConfig.height || 250)
      })
    })

    // Process notes from config
    config.notes?.forEach(noteConfig => {
      initialItems.push({
        id: `note-${idCounter++}`,
        type: 'note',
        title: noteConfig.title,
        content: noteConfig.content,
        x: noteConfig.x || Math.random() * 300 + 100,
        y: noteConfig.y || Math.random() * 300 + 100,
        width: noteConfig.width || 300,
        height: noteConfig.height || 200,
        component: createNoteComponent(noteConfig.title, noteConfig.content, noteConfig.color, noteConfig.width || 300, noteConfig.height || 200)
      })
    })

    return initialItems
  })

  const [instructionsOpen, setInstructionsOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [history, setHistory] = useState<CanvasItem[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [turnstileMode, setTurnstileMode] = useState(false)
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null)

  // Save current state to history
  const saveToHistory = (newItems: CanvasItem[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push([...newItems])
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // Undo functionality
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setItems([...history[historyIndex - 1]])
    }
  }

  // Redo functionality
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setItems([...history[historyIndex + 1]])
    }
  }

  // Save canvas to localStorage
  const saveCanvas = () => {
    const canvasData = {
      items,
      timestamp: Date.now(),
      version: '1.0'
    }
    localStorage.setItem('canvas-layout', JSON.stringify(canvasData))
    alert('Canvas saved successfully!')
  }

  // Load canvas from localStorage
  const loadCanvas = () => {
    try {
      const saved = localStorage.getItem('canvas-layout')
      if (saved) {
        const { items: savedItems } = JSON.parse(saved)
        setItems(savedItems)
        saveToHistory(savedItems)
        alert('Canvas loaded successfully!')
      } else {
        alert('No saved canvas found!')
      }
    } catch (error) {
      alert('Error loading canvas!')
    }
  }

  // Clear canvas
  const clearCanvas = () => {
    if (confirm('Are you sure you want to clear the canvas?')) {
      const newItems: CanvasItem[] = []
      setItems(newItems)
      saveToHistory(newItems)
    }
  }

  // Export canvas configuration
  const exportConfig = () => {
    const config = {
      urls: items.filter(item => item.type === 'url').map(item => ({
        url: item.url!,
        title: item.title!,
        width: item.width,
        height: item.height,
        x: item.x,
        y: item.y
      })),
      charts: items.filter(item => item.type === 'chart').map(item => ({
        type: 'bar', // You'd need to store the actual chart type
        title: item.title!,
        data: item.chartData,
        width: item.width,
        height: item.height,
        x: item.x,
        y: item.y
      })),
      notes: items.filter(item => item.type === 'note').map(item => ({
        title: item.title!,
        content: item.content!,
        color: 'yellow', // You'd need to store the actual color
        width: item.width,
        height: item.height,
        x: item.x,
        y: item.y
      }))
    }
    
    const dataStr = JSON.stringify(config, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'canvas-config.json'
    link.click()
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editable) return
      
      const isCtrlOrCmd = e.ctrlKey || e.metaKey
      
      if (isCtrlOrCmd && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if (isCtrlOrCmd && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      } else if (isCtrlOrCmd && e.key === 's') {
        e.preventDefault()
        saveCanvas()
      } else if (e.key === 'Delete' && selectedItems.size > 0) {
        e.preventDefault()
        const newItems = items.filter(item => !selectedItems.has(item.id))
        setItems(newItems)
        saveToHistory(newItems)
        setSelectedItems(new Set())
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [editable, historyIndex, history, selectedItems, items])

  // Helper function to create chart components
  function createChartComponent(type: string, title: string, data: any, width: number, height: number) {
    const style = { width, height: height - 60 } // Account for header
    
    switch (type) {
      case 'bar':
        return (
          <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden" style={{ width, height }}>
            <div className="p-3 border-b bg-blue-50">
              <h3 className="font-semibold text-gray-800">{title}</h3>
            </div>
            <div className="p-4 flex items-end space-x-2" style={style}>
              {data?.values?.map((value: number, index: number) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="bg-blue-500 rounded-t w-8" 
                    style={{ height: `${(value / Math.max(...data.values)) * 80}%` }}
                  ></div>
                  <span className="text-xs mt-1">{data.labels?.[index] || index}</span>
                </div>
              ))}
            </div>
          </div>
        )
      case 'line':
        return (
          <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden" style={{ width, height }}>
            <div className="p-3 border-b bg-green-50">
              <h3 className="font-semibold text-gray-800">{title}</h3>
            </div>
            <div className="p-4 relative" style={style}>
              <svg width="100%" height="100%" className="overflow-visible">
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  points={data?.values?.map((value: number, index: number) => 
                    `${(index / (data.values.length - 1)) * 100}%,${100 - (value / Math.max(...data.values)) * 80}%`
                  ).join(' ') || ''}
                />
                {data?.values?.map((value: number, index: number) => (
                  <circle
                    key={index}
                    cx={`${(index / (data.values.length - 1)) * 100}%`}
                    cy={`${100 - (value / Math.max(...data.values)) * 80}%`}
                    r="3"
                    fill="#10b981"
                  />
                ))}
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs">
                {data?.labels?.map((label: string, index: number) => (
                  <span key={index}>{label}</span>
                ))}
              </div>
            </div>
          </div>
        )
      case 'pie':
      case 'donut':
        const total = data?.values?.reduce((sum: number, val: number) => sum + val, 0) || 1
        let currentAngle = 0
        const centerX = 50
        const centerY = 50
        const radius = type === 'donut' ? 35 : 40
        const innerRadius = type === 'donut' ? 20 : 0
        
        return (
          <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden" style={{ width, height }}>
            <div className="p-3 border-b bg-purple-50">
              <h3 className="font-semibold text-gray-800">{title}</h3>
            </div>
            <div className="p-4 flex items-center justify-center" style={style}>
              <svg width="200" height="200" viewBox="0 0 100 100">
                {data?.values?.map((value: number, index: number) => {
                  const angle = (value / total) * 360
                  const startAngle = currentAngle
                  const endAngle = currentAngle + angle
                  currentAngle += angle
                  
                  const x1 = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180)
                  const y1 = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180)
                  const x2 = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180)
                  const y2 = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180)
                  
                  const largeArcFlag = angle > 180 ? 1 : 0
                  
                  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
                  const color = colors[index % colors.length]
                  
                  const pathData = [
                    `M ${centerX} ${centerY}`,
                    `L ${x1} ${y1}`,
                    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    'Z'
                  ].join(' ')
                  
                  if (type === 'donut') {
                    const ix1 = centerX + innerRadius * Math.cos((startAngle - 90) * Math.PI / 180)
                    const iy1 = centerY + innerRadius * Math.sin((startAngle - 90) * Math.PI / 180)
                    const ix2 = centerX + innerRadius * Math.cos((endAngle - 90) * Math.PI / 180)
                    const iy2 = centerY + innerRadius * Math.sin((endAngle - 90) * Math.PI / 180)
                    
                    const donutPath = [
                      `M ${x1} ${y1}`,
                      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                      `L ${ix2} ${iy2}`,
                      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix1} ${iy1}`,
                      'Z'
                    ].join(' ')
                    
                    return <path key={index} d={donutPath} fill={color} />
                  }
                  
                  return <path key={index} d={pathData} fill={color} />
                })}
              </svg>
            </div>
          </div>
        )
      case 'metrics':
        return (
          <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden" style={{ width, height }}>
            <div className="p-3 border-b bg-green-50">
              <h3 className="font-semibold text-gray-800">{title}</h3>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4" style={style}>
              {data?.metrics?.map((metric: any, index: number) => (
                <div key={index} className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-lg font-bold text-blue-600">{metric.value}</p>
                  <p className="text-xs text-gray-600">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        )
      default:
        return (
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 flex items-center justify-center" style={{ width, height }}>
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-gray-600">{type} chart</p>
            </div>
          </div>
        )
    }
  }

  // Helper function to create note components
  function createNoteComponent(title: string, content: string, color = 'yellow', width: number, height: number) {
    const colorClasses = {
      yellow: 'bg-yellow-100 border-yellow-300',
      blue: 'bg-blue-100 border-blue-300',
      green: 'bg-green-100 border-green-300',
      pink: 'bg-pink-100 border-pink-300',
      purple: 'bg-purple-100 border-purple-300'
    }

    return (
      <div className={`border-2 rounded-lg p-4 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.yellow}`} style={{ width, height }}>
        <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
        <div className="text-sm text-gray-700 overflow-y-auto" style={{ height: height - 80 }}>
          {content}
        </div>
      </div>
    )
  }

  const handlePositionChange = (id: string, x: number, y: number) => {
    const newItems = items.map((item) => (item.id === id ? { ...item, x, y } : item))
    setItems(newItems)
    onItemsChange?.(newItems)
  }

  const handleSizeChange = (id: string, width: number, height: number) => {
    const newItems = items.map((item) => (item.id === id ? { ...item, width, height } : item))
    setItems(newItems)
    onItemsChange?.(newItems)
  }

  const deleteItem = (id: string) => {
    const newItems = items.filter((item) => item.id !== id)
    setItems(newItems)
    saveToHistory(newItems)
    onItemsChange?.(newItems)
  }

  // Calculate turnstile positions
  const calculateTurnstilePosition = (index: number, total: number, focused: boolean, isFocused: boolean) => {
    if (isFocused && focused) {
      // Focused item goes to center
      return {
        x: window.innerWidth / 2 - 200, // Center horizontally (assuming 400px width)
        y: window.innerHeight / 2 - 150, // Center vertically (assuming 300px height)
        scale: 1.1,
        zIndex: 100,
        opacity: 1
      }
    }

    // Arrange other items in a circle around the center
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.3
    const angle = (index / total) * 2 * Math.PI
    
    return {
      x: centerX + Math.cos(angle) * radius - 150, // Offset for card width
      y: centerY + Math.sin(angle) * radius - 100, // Offset for card height
      scale: focused && !isFocused ? 0.7 : 0.8,
      zIndex: isFocused ? 100 : 10,
      opacity: focused && !isFocused ? 0.6 : 0.9
    }
  }

  // Toggle turnstile mode
  const toggleTurnstileMode = () => {
    setTurnstileMode(!turnstileMode)
    setFocusedItemId(null)
  }

  // Focus on a specific item in turnstile mode
  const focusOnItem = (itemId: string) => {
    if (turnstileMode) {
      setFocusedItemId(focusedItemId === itemId ? null : itemId)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {editable && (
        <>
          {/* Toolbar */}
          <div className="fixed top-4 left-4 z-50 bg-white rounded-lg shadow-lg p-2 flex gap-2">
            <Tooltip content="💾 Save Canvas - Saves your current layout to browser storage" shortcut="Ctrl+S" side="bottom">
              <Button
                onClick={saveCanvas}
                size="sm"
                variant="outline"
                className="hover:bg-blue-50 transition-colors"
                title="💾 Save Canvas (Ctrl+S)"
              >
                💾
              </Button>
            </Tooltip>
            
            <Tooltip content="📁 Load Canvas - Restores your previously saved layout" side="bottom">
              <Button
                onClick={loadCanvas}
                size="sm"
                variant="outline"
                className="hover:bg-green-50 transition-colors"
                title="📁 Load Canvas"
              >
                📁
              </Button>
            </Tooltip>
            
            <Tooltip content="↶ Undo - Reverts the last action" shortcut="Ctrl+Z" side="bottom">
              <Button
                onClick={undo}
                size="sm"
                variant="outline"
                disabled={historyIndex <= 0}
                className="hover:bg-yellow-50 transition-colors disabled:opacity-50"
                title="↶ Undo (Ctrl+Z)"
              >
                ↶
              </Button>
            </Tooltip>
            
            <Tooltip content="↷ Redo - Restores the last undone action" shortcut="Ctrl+Y" side="bottom">
              <Button
                onClick={redo}
                size="sm"
                variant="outline"
                disabled={historyIndex >= history.length - 1}
                className="hover:bg-yellow-50 transition-colors disabled:opacity-50"
                title="↷ Redo (Ctrl+Y)"
              >
                ↷
              </Button>
            </Tooltip>
            
            <Tooltip content="🎠 Turnstile Mode - Circular layout for overlapping cards" side="bottom">
              <Button
                onClick={toggleTurnstileMode}
                size="sm"
                variant={turnstileMode ? "default" : "outline"}
                className={`transition-colors ${turnstileMode ? 'bg-purple-100 hover:bg-purple-200' : 'hover:bg-purple-50'}`}
                title="🎠 Turnstile Mode"
              >
                🎠
              </Button>
            </Tooltip>
            
            <Tooltip content="📤 Export Configuration - Downloads your canvas setup as JSON" side="bottom">
              <Button
                onClick={exportConfig}
                size="sm"
                variant="outline"
                className="hover:bg-orange-50 transition-colors"
                title="📤 Export Configuration"
              >
                📤
              </Button>
            </Tooltip>
            
            <Tooltip content="🗑️ Clear Canvas - Removes all items (with confirmation)" side="bottom">
              <Button
                onClick={clearCanvas}
                size="sm"
                variant="outline"
                className="hover:bg-red-50 transition-colors"
                title="🗑️ Clear Canvas"
              >
                🗑️
              </Button>
            </Tooltip>
          </div>

          {/* Instructions */}
          <div className="fixed top-4 right-4 z-50">
            <Tooltip content="❓ Help & Instructions - Shows keyboard shortcuts and usage tips" side="left">
              <Button
                onClick={() => setInstructionsOpen(!instructionsOpen)}
                className="rounded-full w-12 h-12 shadow-lg mb-2 hover:bg-blue-50 transition-colors"
                variant={instructionsOpen ? "default" : "outline"}
              >
                {instructionsOpen ? "✕" : "❓"}
              </Button>
            </Tooltip>

            {instructionsOpen && (
              <div className="bg-white rounded-lg shadow-lg p-4 border max-w-xs">
                <h3 className="font-semibold text-sm text-gray-700 mb-2">How to Use</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Drag components to move them</li>
                  <li>• Drag bottom-right corner to resize</li>
                  <li>• Hover over items to see controls</li>
                  <li>• 🎠 Turnstile mode for overlapping cards</li>
                  <li>• Click cards in turnstile to focus</li>
                  <li>• Ctrl+S to save, Ctrl+Z to undo</li>
                  <li>• Delete key to remove selected items</li>
                  <li>• Pass config prop for data-driven content</li>
                </ul>
              </div>
            )}
          </div>
        </>
      )}

      {/* Canvas */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />

        {/* Draggable Items */}
        {items.map((item, index) => {
          const turnstilePos = turnstileMode 
            ? calculateTurnstilePosition(index, items.length, focusedItemId !== null, item.id === focusedItemId)
            : null

          return (
            <DraggableItem
              key={item.id}
              id={item.id}
              initialX={turnstileMode ? turnstilePos!.x : item.x}
              initialY={turnstileMode ? turnstilePos!.y : item.y}
              initialWidth={item.width}
              initialHeight={item.height}
              onPositionChange={turnstileMode ? () => {} : handlePositionChange}
              onSizeChange={turnstileMode ? () => {} : handleSizeChange}
              onDelete={editable && !turnstileMode ? deleteItem : undefined}
              resizable={!turnstileMode}
              style={{
                transform: turnstileMode ? `scale(${turnstilePos!.scale})` : 'scale(1)',
                opacity: turnstileMode ? turnstilePos!.opacity : 1,
                zIndex: turnstileMode ? turnstilePos!.zIndex : 'auto',
                transition: turnstileMode ? 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                cursor: turnstileMode ? 'pointer' : 'move'
              }}
              onClick={turnstileMode ? () => focusOnItem(item.id) : undefined}
              disabled={turnstileMode}
            >
              {item.component}
            </DraggableItem>
          )
        })}

        {/* Turnstile Mode Overlay */}
        {turnstileMode && (
          <div className="absolute inset-0 bg-black bg-opacity-20 pointer-events-none z-5">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center pointer-events-none">
              {focusedItemId ? (
                <div className="bg-black bg-opacity-50 rounded-lg p-4">
                  <p className="text-lg font-semibold">Focused Mode</p>
                  <p className="text-sm opacity-75">Click the focused item again to unfocus</p>
                </div>
              ) : (
                <div className="bg-black bg-opacity-50 rounded-lg p-4">
                  <p className="text-lg font-semibold">🎠 Turnstile Mode</p>
                  <p className="text-sm opacity-75">Click any card to focus on it</p>
                  <p className="text-xs opacity-50 mt-2">Items are arranged in a circle • Drag and resize disabled</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CanvasDemo() {
  const sampleConfig: CanvasConfig = {
    urls: [
      {
        url: "https://example.com",
        title: "Example Website",
        width: 400,
        height: 300,
        x: 100,
        y: 100
      },
      {
        url: "https://httpbin.org/html",
        title: "HTTPBin Demo",
        width: 350,
        height: 250,
        x: 600,
        y: 150
      }
    ],
    charts: [
      {
        type: 'bar',
        title: 'Sales Data',
        data: {
          values: [120, 190, 300, 500, 200],
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
        },
        width: 400,
        height: 300,
        x: 200,
        y: 450
      },
      {
        type: 'line',
        title: 'Growth Trend',
        data: {
          values: [100, 150, 120, 280, 350, 400],
          labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6']
        },
        width: 400,
        height: 300,
        x: 650,
        y: 450
      },
      {
        type: 'pie',
        title: 'Market Share',
        data: {
          values: [35, 25, 20, 15, 5],
          labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Others']
        },
        width: 350,
        height: 300,
        x: 1100,
        y: 450
      },
      {
        type: 'donut',
        title: 'Revenue Sources',
        data: {
          values: [40, 30, 20, 10],
          labels: ['Online', 'Retail', 'Partners', 'Direct']
        },
        width: 350,
        height: 300,
        x: 1500,
        y: 450
      },
      {
        type: 'metrics',
        title: 'Key Metrics',
        data: {
          metrics: [
            { label: 'Users', value: '1,234' },
            { label: 'Revenue', value: '$45.6K' },
            { label: 'Conversion', value: '89.2%' },
            { label: 'Growth', value: '+23%' }
          ]
        },
        width: 350,
        height: 250,
        x: 1100,
        y: 100
      }
    ],
    notes: [
      {
        title: 'Project Notes',
        content: 'This is a sample note that can contain any text content. You can resize and move it around the canvas. Try the new features:\n\n• Save/Load (Ctrl+S)\n• Undo/Redo (Ctrl+Z/Y)\n• Export config\n• Multiple chart types',
        color: 'yellow',
        width: 300,
        height: 250,
        x: 1500,
        y: 100
      },
      {
        title: 'Important Reminder',
        content: 'Remember to update the dashboard with latest metrics before the meeting. The new charts look great!',
        color: 'pink',
        width: 280,
        height: 150,
        x: 1850,
        y: 200
      },
      {
        title: 'Feature List',
        content: '✅ Drag & Drop\n✅ Resize\n✅ Delete\n✅ Save/Load\n✅ Undo/Redo\n✅ Export\n✅ Multiple Charts\n✅ Keyboard Shortcuts',
        color: 'green',
        width: 250,
        height: 200,
        x: 1850,
        y: 450
      }
    ]
  }

  return <DynamicCanvas config={sampleConfig} editable={true} />
}

// Export DynamicCanvas as a named export for reuse
export { DynamicCanvas }
