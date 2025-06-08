"use client"

import React, { useState, useEffect } from 'react'
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
import { ComponentRegistry } from "@/lib/component-registry"
import { UNIVERSAL_COMPONENTS } from "@/components/universal-components"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselThumbnail, type CarouselApi } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

// Register built-in universal components immediately
Object.entries(UNIVERSAL_COMPONENTS).forEach(([type, componentConfig]) => {
  ComponentRegistry.register(type, componentConfig)
})

// Enhanced CanvasItem interface to support universal components
interface CanvasItem {
  id: string
  type: 'url' | 'chart' | 'note' | 'component' | 'universal'
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
  // New fields for universal components
  universalType?: string
  props?: any
  // Additional fields for preserving chart types and note colors
  chartType?: string
  noteColor?: string
}

// Enhanced CanvasConfig interface
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
    type: 'bar' | 'line' | 'pie' | 'donut' | 'metrics' | 'kpi'
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
  // New: Universal components config
  universal?: Record<string, Array<{
    props?: any
    width?: number
    height?: number
    x?: number
    y?: number
  }>>
}

interface DynamicCanvasProps {
  config?: CanvasConfig
  editable?: boolean
  showPalette?: boolean // New prop to control palette visibility
  onItemsChange?: (items: CanvasItem[]) => void
}

function DynamicCanvas({ 
  config = {}, 
  editable = true,
  showPalette = true,
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
        chartType: chartConfig.type,
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
        noteColor: noteConfig.color || 'yellow',
        x: noteConfig.x || Math.random() * 300 + 100,
        y: noteConfig.y || Math.random() * 300 + 100,
        width: noteConfig.width || 300,
        height: noteConfig.height || 200,
        component: createNoteComponent(noteConfig.title, noteConfig.content, noteConfig.color, noteConfig.width || 300, noteConfig.height || 200)
      })
    })

    // Process legacy components from config
    config.components?.forEach(componentConfig => {
      initialItems.push({
        id: `component-${idCounter++}`,
        type: 'component',
        data: componentConfig,
        x: componentConfig.x || Math.random() * 300 + 100,
        y: componentConfig.y || Math.random() * 300 + 100,
        width: componentConfig.width || 300,
        height: componentConfig.height || 200,
        component: <div className="p-4 border rounded bg-gray-50">Legacy Component: {componentConfig.type}</div>
      })
    })

    // Process universal components from config
    if (config.universal) {
      Object.entries(config.universal).forEach(([universalType, instances]) => {
        instances.forEach(instanceConfig => {
          const componentConfig = ComponentRegistry.get(universalType)
          const defaultDimensions = componentConfig?.defaultDimensions || { width: 300, height: 200 }
          
          const component = ComponentRegistry.createComponent(
            universalType,
            instanceConfig.props || {},
            `universal-${idCounter}`
          )

          if (component) {
            initialItems.push({
              id: `universal-${idCounter++}`,
              type: 'universal',
              universalType,
              props: instanceConfig.props || {},
              x: instanceConfig.x || Math.random() * 300 + 100,
              y: instanceConfig.y || Math.random() * 300 + 100,
              width: instanceConfig.width || defaultDimensions.width,
              height: instanceConfig.height || defaultDimensions.height,
              component
            })
          }
        })
      })
    }

    return initialItems
  })

  const [instructionsOpen, setInstructionsOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [history, setHistory] = useState<CanvasItem[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [turnstileMode, setTurnstileMode] = useState(false)
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null)
  // Carousel mode state
  const [carouselMode, setCarouselMode] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)
  // State for zoom/scale
  const [canvasScale, setCanvasScale] = useState(1)
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })
  
  // Enhanced carousel state
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [carouselAutoplay, setCarouselAutoplay] = useState(false)
  const [carouselSpeed, setCarouselSpeed] = useState(3000)
  const [carouselThumbnails, setCarouselThumbnails] = useState(true)
  const [carouselTransition, setCarouselTransition] = useState<'slide' | 'fade' | 'scale'>('slide')

  // Component palette state
  const [paletteOpen, setPaletteOpen] = useState(false)

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

  // Enhanced export canvas configuration
  const exportConfig = () => {
    const config: CanvasConfig = {
      urls: items.filter(item => item.type === 'url').map(item => ({
        url: item.url!,
        title: item.title!,
        width: item.width,
        height: item.height,
        x: item.x,
        y: item.y
      })),
      charts: items.filter(item => item.type === 'chart').map(item => ({
        type: (item.chartType || 'bar') as 'bar' | 'line' | 'pie' | 'donut' | 'metrics' | 'kpi', // Type assertion
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
        color: item.noteColor || 'yellow', // Use stored note color
        width: item.width,
        height: item.height,
        x: item.x,
        y: item.y
      })),
      components: items.filter(item => item.type === 'component').map(item => ({
        type: item.data?.type || 'unknown',
        props: item.data?.props || {},
        width: item.width,
        height: item.height,
        x: item.x,
        y: item.y
      }))
    }

    // Add universal components to export
    const universalItems = items.filter(item => item.type === 'universal')
    if (universalItems.length > 0) {
      config.universal = {}
      
      universalItems.forEach(item => {
        const type = item.universalType!
        if (!config.universal![type]) {
          config.universal![type] = []
        }
        
        // Serialize props using the registry
        const serializedProps = ComponentRegistry.serializeProps(type, item.props || {})
        
        config.universal![type].push({
          props: serializedProps,
          width: item.width,
          height: item.height,
          x: item.x,
          y: item.y
        })
      })
    }
    
    const dataStr = JSON.stringify(config, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'canvas-config.json'
    link.click()
  }

  // Enhanced save canvas to localStorage with universal component support
  const saveCanvas = () => {
    try {
      // Convert items to serializable format
      const serializableItems = items.map(item => {
        if (item.type === 'universal') {
          return {
            ...item,
            component: null, // Remove React component for serialization
            props: ComponentRegistry.serializeProps(item.universalType!, item.props || {})
          }
        }
        return {
          ...item,
          component: null // Remove React component for serialization
        }
      })

      const canvasData = {
        items: serializableItems,
        timestamp: Date.now(),
        version: '2.0' // Updated version for universal component support
      }
      
      localStorage.setItem('canvas-layout', JSON.stringify(canvasData))
      alert('Canvas saved successfully!')
    } catch (error) {
      console.error('Error saving canvas:', error)
      alert('Error saving canvas!')
    }
  }

  // Enhanced load canvas from localStorage with universal component support
  const loadCanvas = () => {
    try {
      const saved = localStorage.getItem('canvas-layout')
      if (saved) {
        const { items: savedItems, version } = JSON.parse(saved)
        
        // Reconstruct components based on version
        const reconstructedItems = savedItems.map((item: any) => {
          if (item.type === 'universal' && item.universalType) {
            // Deserialize props and recreate universal component
            const deserializedProps = ComponentRegistry.deserializeProps(
              item.universalType, 
              item.props || {}
            )
            
            const component = ComponentRegistry.createComponent(
              item.universalType,
              deserializedProps,
              item.id
            )
            
            return {
              ...item,
              props: deserializedProps,
              component
            }
          } else if (item.type === 'chart') {
            // Recreate chart component
            return {
              ...item,
              component: createChartComponent(
                'bar', // Default type - you might want to store this
                item.title || 'Chart',
                item.chartData,
                item.width,
                item.height
              )
            }
          } else if (item.type === 'note') {
            // Recreate note component
            return {
              ...item,
              component: createNoteComponent(
                item.title || 'Note',
                item.content || '',
                'yellow', // Default color - you might want to store this
                item.width,
                item.height
              )
            }
          } else if (item.type === 'url') {
            // Recreate URL component
            return {
              ...item,
              component: <LiveWebsiteCard 
                url={item.url} 
                title={item.title} 
                width={item.width} 
                height={item.height} 
              />
            }
          }
          
          return item
        })
        
        setItems(reconstructedItems)
        saveToHistory(reconstructedItems)
        alert('Canvas loaded successfully!')
      } else {
        alert('No saved canvas found!')
      }
    } catch (error) {
      console.error('Error loading canvas:', error)
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

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Carousel Mode Shortcuts
      if (carouselMode) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault()
          prevCarouselItem()
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault()
          nextCarouselItem()
        } else if (e.key === ' ' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault()
          toggleCarouselAutoplay()
        } else if (e.key === 't' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault()
          toggleCarouselThumbnails()
        } else if (e.key === 'Escape') {
          e.preventDefault()
          toggleCarouselMode()
        }
        // Number keys to jump to specific slides
        else if (e.key >= '1' && e.key <= '9') {
          const index = parseInt(e.key) - 1
          if (index < items.length) {
            e.preventDefault()
            goToCarouselItem(index)
          }
        }
        return
      }

      // Global shortcuts
      if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        saveCanvas()
      } else if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if ((e.key === 'y' && (e.ctrlKey || e.metaKey)) || (e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey)) {
        e.preventDefault()
        redo()
      } else if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        autoFitCanvas()
      } else if (e.key === 'c' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault()
        toggleCarouselMode()
      } else if (e.key === 't' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault()
        toggleTurnstileMode()
      } else if (e.key === 'Delete' && selectedItems.size > 0) {
        e.preventDefault()
        selectedItems.forEach(deleteItem)
        setSelectedItems(new Set())
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [carouselMode, carouselAutoplay, selectedItems, items.length])

  // Helper function to create chart components
  function createChartComponent(type: string, title: string, data: any, width: number, height: number) {
    switch (type) {
      case 'bar':
        return (
          <div className="w-full h-full bg-white border-2 border-gray-200 rounded-lg overflow-hidden flex flex-col">
            <div className="p-3 border-b bg-blue-50 flex-shrink-0">
              <h3 className="font-semibold text-gray-800">{title}</h3>
            </div>
            <div className="p-4 flex items-end space-x-2 flex-1 min-h-0">
              {data?.values?.map((value: number, index: number) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="bg-blue-500 rounded-t w-full max-w-8" 
                    style={{ height: `${(value / Math.max(...data.values)) * 80}%` }}
                  ></div>
                  <span className="text-xs mt-1 truncate">{data.labels?.[index] || index}</span>
                </div>
              ))}
            </div>
          </div>
        )
      case 'line':
        return (
          <div className="w-full h-full bg-white border-2 border-gray-200 rounded-lg overflow-hidden flex flex-col">
            <div className="p-3 border-b bg-green-50 flex-shrink-0">
              <h3 className="font-semibold text-gray-800">{title}</h3>
            </div>
            <div className="p-4 relative flex-1 min-h-0">
              <svg className="w-full h-full overflow-visible">
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
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs px-4">
                {data?.labels?.map((label: string, index: number) => (
                  <span key={index} className="truncate">{label}</span>
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
          <div className="w-full h-full bg-white border-2 border-gray-200 rounded-lg overflow-hidden flex flex-col">
            <div className="p-3 border-b bg-purple-50 flex-shrink-0">
              <h3 className="font-semibold text-gray-800">{title}</h3>
            </div>
            <div className="p-4 flex items-center justify-center flex-1 min-h-0">
              <svg className="w-full h-full min-w-[100px] min-h-[100px]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
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
          <div className="w-full h-full bg-white border-2 border-gray-200 rounded-lg overflow-hidden flex flex-col">
            <div className="p-3 border-b bg-green-50 flex-shrink-0">
              <h3 className="font-semibold text-gray-800">{title}</h3>
            </div>
            <div className="p-2 flex-1 min-h-0">
              <div className="grid grid-cols-2 gap-2 h-full">
                {data?.metrics?.map((metric: any, index: number) => (
                  <div key={index} className="text-center p-2 bg-gray-50 rounded flex flex-col justify-center min-h-[60px]">
                    <p className="font-bold text-blue-600 truncate text-sm sm:text-lg">{metric.value}</p>
                    <p className="text-gray-600 truncate text-xs">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="w-full h-full bg-white border-2 border-gray-200 rounded-lg p-4 flex items-center justify-center">
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
      <div className={`w-full h-full border-2 rounded-lg p-4 flex flex-col ${colorClasses[color as keyof typeof colorClasses] || colorClasses.yellow}`}>
        <h3 className="font-semibold text-gray-800 mb-2 flex-shrink-0">{title}</h3>
        <div className="text-sm text-gray-700 overflow-y-auto flex-1 whitespace-pre-wrap">
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
    const newItems = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, width, height }
        
        // Recreate components that need to respond to size changes
        if (item.type === 'chart') {
          updatedItem.component = createChartComponent(
            item.chartType || 'bar', // Use stored chart type
            item.title || 'Chart',
            item.chartData,
            width,
            height
          )
        } else if (item.type === 'note') {
          updatedItem.component = createNoteComponent(
            item.title || 'Note',
            item.content || '',
            item.noteColor || 'yellow', // Use stored note color
            width,
            height
          )
        } else if (item.type === 'url') {
          updatedItem.component = <LiveWebsiteCard 
            url={item.url!} 
            title={item.title!} 
            width={width} 
            height={height} 
          />
        }
        
        return updatedItem
      }
      return item
    })
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
    // Fallback for SSR
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800

    if (isFocused && focused) {
      // Focused item goes to center
      return {
        x: screenWidth / 2 - 200, // Center horizontally (assuming 400px width)
        y: screenHeight / 2 - 150, // Center vertically (assuming 300px height)
        scale: 1.1,
        zIndex: 100,
        opacity: 1
      }
    }

    // Arrange other items in a circle around the center
    const centerX = screenWidth / 2
    const centerY = screenHeight / 2
    const radius = Math.min(screenWidth, screenHeight) * 0.3
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
    setCarouselMode(false) // Disable carousel when enabling turnstile
  }

  // Focus on a specific item in turnstile mode
  const focusOnItem = (itemId: string) => {
    if (turnstileMode) {
      setFocusedItemId(focusedItemId === itemId ? null : itemId)
    }
  }

  // Calculate carousel positions
  const calculateCarouselPosition = (index: number, total: number, currentIndex: number) => {
    // Fallback for SSR
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800
    
    const centerX = screenWidth / 2
    const centerY = screenHeight / 2
    const itemWidth = 400
    const itemHeight = 300
    const spacing = itemWidth + 50 // Space between items

    if (index === currentIndex) {
      // Current item in center
      return {
        x: centerX - itemWidth / 2,
        y: centerY - itemHeight / 2,
        scale: 1,
        opacity: 1,
        zIndex: 100
      }
    } else {
      // Other items positioned to the sides
      const offset = (index - currentIndex) * spacing
      return {
        x: centerX - itemWidth / 2 + offset,
        y: centerY - itemHeight / 2,
        scale: 0.8,
        opacity: Math.abs(index - currentIndex) === 1 ? 0.7 : 0.3, // Adjacent items more visible
        zIndex: Math.abs(index - currentIndex) === 1 ? 50 : 10
      }
    }
  }

  // Toggle carousel mode
  const toggleCarouselMode = () => {
    setCarouselMode(!carouselMode)
    setCarouselIndex(0)
    setTurnstileMode(false) // Disable turnstile when enabling carousel
    
    // If enabling carousel mode, setup the API after a brief delay
    if (!carouselMode) {
      setTimeout(() => {
        if (carouselApi) {
          carouselApi.scrollTo(0)
        }
      }, 100)
    }
  }

  // Navigate carousel - Enhanced with Embla API
  const nextCarouselItem = () => {
    if (carouselMode && items.length > 0) {
      if (carouselApi) {
        carouselApi.scrollNext()
      } else {
        // Fallback to custom logic
        setCarouselIndex((prev) => (prev + 1) % items.length)
      }
    }
  }

  const prevCarouselItem = () => {
    if (carouselMode && items.length > 0) {
      if (carouselApi) {
        carouselApi.scrollPrev()
      } else {
        // Fallback to custom logic  
        setCarouselIndex((prev) => (prev - 1 + items.length) % items.length)
      }
    }
  }

  // Go to specific carousel item - Enhanced
  const goToCarouselItem = (index: number) => {
    if (carouselMode) {
      if (carouselApi) {
        carouselApi.scrollTo(index)
      } else {
        setCarouselIndex(index)
      }
    }
  }

  // New: Toggle autoplay
  const toggleCarouselAutoplay = () => {
    setCarouselAutoplay(!carouselAutoplay)
  }

  // New: Change carousel speed
  const changeCarouselSpeed = (speed: number) => {
    setCarouselSpeed(speed)
  }

  // New: Toggle thumbnails
  const toggleCarouselThumbnails = () => {
    setCarouselThumbnails(!carouselThumbnails)
  }

  // New: Change transition effect
  const changeCarouselTransition = (transition: 'slide' | 'fade' | 'scale') => {
    setCarouselTransition(transition)
  }

  // Enhanced: Listen to carousel API changes
  React.useEffect(() => {
    if (!carouselApi) return

    const onSelect = () => {
      const newIndex = carouselApi.selectedScrollSnap()
      setCarouselIndex(newIndex)
    }

    carouselApi.on("select", onSelect)
    return () => {
      carouselApi.off("select", onSelect)
    }
  }, [carouselApi])

  // Calculate canvas bounds to fit all items
  const calculateCanvasBounds = () => {
    if (items.length === 0) {
      // Fallback dimensions for SSR
      const fallbackWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
      const fallbackHeight = typeof window !== 'undefined' ? window.innerHeight : 800
      return { 
        minX: 0, 
        minY: 0, 
        maxX: fallbackWidth, 
        maxY: fallbackHeight,
        width: fallbackWidth,
        height: fallbackHeight
      }
    }

    const padding = 100 // Extra space around items
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity

    items.forEach(item => {
      minX = Math.min(minX, item.x - padding)
      minY = Math.min(minY, item.y - padding)
      maxX = Math.max(maxX, item.x + item.width + padding)
      maxY = Math.max(maxY, item.y + item.height + padding)
    })

    // Ensure minimum canvas size with SSR fallbacks
    const minWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
    const minHeight = typeof window !== 'undefined' ? window.innerHeight : 800
    
    return {
      minX: Math.min(minX, 0),
      minY: Math.min(minY, 0),
      maxX: Math.max(maxX, minWidth),
      maxY: Math.max(maxY, minHeight),
      width: Math.max(maxX - Math.min(minX, 0), minWidth),
      height: Math.max(maxY - Math.min(minY, 0), minHeight)
    }
  }

  // Auto-fit: scale and position to show all components in viewport
  const autoFitCanvas = () => {
    if (typeof window === 'undefined' || items.length === 0) return

    const bounds = calculateCanvasBounds()
    const container = document.querySelector('.canvas-container') as HTMLElement
    
    if (container) {
      // Get viewport dimensions (subtract some padding for better visual)
      const viewportPadding = 100
      const viewportWidth = window.innerWidth - viewportPadding
      const viewportHeight = window.innerHeight - viewportPadding
      
      // Calculate the content dimensions
      const contentWidth = bounds.width
      const contentHeight = bounds.height
      
      // Calculate scale factors for both dimensions
      const scaleX = viewportWidth / contentWidth
      const scaleY = viewportHeight / contentHeight
      
      // Use the smaller scale to ensure everything fits
      const optimalScale = Math.min(scaleX, scaleY, 1) // Don't scale up beyond 100%
      
      // Calculate the center position for the scaled content
      const scaledContentWidth = contentWidth * optimalScale
      const scaledContentHeight = contentHeight * optimalScale
      
      const offsetX = (viewportWidth - scaledContentWidth) / 2
      const offsetY = (viewportHeight - scaledContentHeight) / 2
      
      // Apply the scale and offset
      setCanvasScale(optimalScale)
      setCanvasOffset({ x: offsetX, y: offsetY })
      
      // Reset scroll to top-left since we're using transform
      container.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  // Reset zoom to 100%
  const resetZoom = () => {
    setCanvasScale(1)
    setCanvasOffset({ x: 0, y: 0 })
  }

  // Focus on a specific item (scroll to it)
  const focusOnComponent = (itemId: string) => {
    if (typeof window === 'undefined') return
    
    const item = items.find(i => i.id === itemId)
    if (!item) return

    // Reset zoom first
    resetZoom()

    const container = document.querySelector('.canvas-container') as HTMLElement
    if (container) {
      const centerX = item.x + (item.width / 2) - (window.innerWidth / 2)
      const centerY = item.y + (item.height / 2) - (window.innerHeight / 2)
      
      container.scrollTo({
        left: Math.max(0, centerX),
        top: Math.max(0, centerY),
        behavior: 'smooth'
      })
    }
  }

  // Auto-layout: Arrange all items in a structured grid
  const autoLayoutItems = () => {
    if (items.length === 0) return

    // Disable special modes first
    setTurnstileMode(false)
    setCarouselMode(false)
    setFocusedItemId(null)

    const padding = 50 // Space between items
    const startX = 100 // Starting X position
    const startY = 100 // Starting Y position
    
    // Calculate optimal grid dimensions
    const totalItems = items.length
    const cols = Math.ceil(Math.sqrt(totalItems * 1.5)) // Slightly wider than square
    const rows = Math.ceil(totalItems / cols)
    
    // Find the largest item dimensions to use as base grid size
    const maxWidth = Math.max(...items.map(item => item.width))
    const maxHeight = Math.max(...items.map(item => item.height))
    
    // Calculate grid spacing
    const gridWidth = maxWidth + padding
    const gridHeight = maxHeight + padding
    
    // Sort items by size (largest first) for better arrangement
    const sortedItems = [...items].sort((a, b) => (b.width * b.height) - (a.width * a.height))
    
    const newItems = sortedItems.map((item, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)
      
      const newX = startX + (col * gridWidth)
      const newY = startY + (row * gridHeight)
      
      return {
        ...item,
        x: newX,
        y: newY
      }
    })
    
    setItems(newItems)
    saveToHistory(newItems)
    onItemsChange?.(newItems)
    
    // Auto-fit to show the newly arranged items
    setTimeout(() => {
      autoFitCanvas()
    }, 200)
  }

  // Helper function to generate unique IDs
  const generateId = (type: string) => {
    const existingIds = items.map(item => item.id)
    let counter = 1
    let newId = `${type}-${counter}`
    while (existingIds.includes(newId)) {
      counter++
      newId = `${type}-${counter}`
    }
    return newId
  }

  // Helper function to get random position that doesn't overlap
  const getRandomPosition = () => {
    const margin = 100
    const maxAttempts = 10
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const x = Math.random() * 800 + margin
      const y = Math.random() * 600 + margin
      
      // Check if this position overlaps with existing items
      const overlaps = items.some(item => 
        x < item.x + item.width + margin &&
        x + 400 > item.x - margin &&
        y < item.y + item.height + margin &&
        y + 300 > item.y - margin
      )
      
      if (!overlaps) {
        return { x, y }
      }
    }
    
    // Fallback: just use a random position
    return {
      x: Math.random() * 400 + margin,
      y: Math.random() * 400 + margin
    }
  }

  // Add new chart component
  const addChart = (type: 'bar' | 'line' | 'pie' | 'donut' | 'metrics') => {
    const id = generateId('chart')
    const position = getRandomPosition()
    const width = 400
    const height = 300

    // Sample data based on chart type
    const sampleData = {
      bar: {
        values: [120, 190, 300, 500, 200, 350],
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      },
      line: {
        values: [100, 150, 120, 280, 350, 400],
        labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6']
      },
      pie: {
        values: [30, 25, 20, 15, 10],
        labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Others']
      },
      donut: {
        values: [40, 30, 20, 10],
        labels: ['Online', 'Retail', 'Partners', 'Direct']
      },
      metrics: {
        metrics: [
          { label: 'Users', value: '2,456' },
          { label: 'Revenue', value: '$78.3K' },
          { label: 'Conversion', value: '92.1%' },
          { label: 'Growth', value: '+18%' }
        ]
      }
    }

    const newItem: CanvasItem = {
      id,
      type: 'chart',
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
      chartData: sampleData[type],
      chartType: type,
      x: position.x,
      y: position.y,
      width,
      height,
      component: createChartComponent(type, `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`, sampleData[type], width, height)
    }

    const newItems = [...items, newItem]
    setItems(newItems)
    saveToHistory(newItems)
    onItemsChange?.(newItems)
  }

  // Add new note component
  const addNote = (color: 'yellow' | 'blue' | 'green' | 'pink' | 'purple' = 'yellow') => {
    const id = generateId('note')
    const position = getRandomPosition()
    const width = 300
    const height = 200

    const newItem: CanvasItem = {
      id,
      type: 'note',
      title: 'New Note',
      content: 'Click to edit this note...\n\nYou can:\n• Resize it\n• Move it around\n• Delete it\n• Add your own content',
      noteColor: color,
      x: position.x,
      y: position.y,
      width,
      height,
      component: createNoteComponent('New Note', 'Click to edit this note...\n\nYou can:\n• Resize it\n• Move it around\n• Delete it\n• Add your own content', color, width, height)
    }

    const newItems = [...items, newItem]
    setItems(newItems)
    saveToHistory(newItems)
    onItemsChange?.(newItems)
  }

  // Add new URL component
  const addUrl = (url?: string, title?: string) => {
    const id = generateId('url')
    const position = getRandomPosition()
    const width = 400
    const height = 300

    const defaultUrls = [
      { url: 'https://github.com', title: 'GitHub' },
      { url: 'https://google.com', title: 'Google' },
      { url: 'https://stackoverflow.com', title: 'Stack Overflow' },
      { url: 'https://npmjs.com', title: 'NPM Registry' },
      { url: 'https://react.dev', title: 'React Docs' },
      { url: 'https://tailwindcss.com', title: 'Tailwind CSS' },
      { url: 'https://vercel.com', title: 'Vercel' },
      { url: 'https://nextjs.org', title: 'Next.js' }
    ]

    // Fix: Properly select random URL when no specific URL is provided
    let finalUrl: string
    let finalTitle: string

    if (url) {
      finalUrl = url
      finalTitle = title || 'Website'
    } else {
      // Pick a truly random URL from the array
      const randomIndex = Math.floor(Math.random() * defaultUrls.length)
      const selectedUrl = defaultUrls[randomIndex]
      finalUrl = selectedUrl.url
      finalTitle = selectedUrl.title
    }

    const newItem: CanvasItem = {
      id,
      type: 'url',
      url: finalUrl,
      title: finalTitle,
      x: position.x,
      y: position.y,
      width,
      height,
      component: <LiveWebsiteCard url={finalUrl} title={finalTitle} width={width} height={height} />
    }

    const newItems = [...items, newItem]
    setItems(newItems)
    saveToHistory(newItems)
    onItemsChange?.(newItems)
  }

  // Add new universal component
  const addUniversalComponent = (type: string) => {
    const componentConfig = ComponentRegistry.get(type)
    if (!componentConfig) return

    const id = generateId('universal')
    const position = getRandomPosition()
    const dimensions = componentConfig.defaultDimensions || { width: 300, height: 200 }

    // Sample props for different component types
    const sampleProps = {
      'todo-list': {
        title: 'My Tasks',
        items: [
          { id: '1', text: 'Test the new component', completed: false, createdAt: new Date() },
          { id: '2', text: 'Add more items', completed: false, createdAt: new Date() }
        ],
        maxItems: 10
      },
      'timer': {
        title: 'Work Timer',
        initialMinutes: 15,
        autoStart: false
      },
      'note': {
        title: 'Quick Note',
        content: 'This is a universal note component!',
        color: 'blue',
        editable: true
      },
      'weather': {
        city: 'New York',
        temperature: Math.floor(Math.random() * 40 + 40),
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Snowy'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40 + 40)
      }
    }

    const props = sampleProps[type as keyof typeof sampleProps] || {}
    const component = ComponentRegistry.createComponent(type, props, id)

    if (component) {
      const newItem: CanvasItem = {
        id,
        type: 'universal',
        universalType: type,
        props,
        x: position.x,
        y: position.y,
        width: dimensions.width,
        height: dimensions.height,
        component
      }

      const newItems = [...items, newItem]
      setItems(newItems)
      saveToHistory(newItems)
      onItemsChange?.(newItems)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {editable && (
        <>
          {/* Toolbar */}
          <div className="fixed top-1/2 right-4 z-50 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 transform -translate-y-1/2">
            <Tooltip content="💾 Save Canvas - Saves your current layout to browser storage" shortcut="Ctrl+S" side="left">
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
            
            <Tooltip content="📁 Load Canvas - Restores your previously saved layout" side="left">
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
            
            <Tooltip content="↶ Undo - Reverts the last action" shortcut="Ctrl+Z" side="left">
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
            
            <Tooltip content="↷ Redo - Restores the last undone action" shortcut="Ctrl+Y" side="left">
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
            
            <Tooltip content="🎠 Turnstile Mode - Circular layout for overlapping cards" side="left">
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
            
            <Tooltip content="🎢 Carousel Mode - Linear navigation through items" side="left">
              <Button
                onClick={toggleCarouselMode}
                size="sm"
                variant={carouselMode ? "default" : "outline"}
                className={`transition-colors ${carouselMode ? 'bg-pink-100 hover:bg-pink-200' : 'hover:bg-pink-50'}`}
                title="🎢 Carousel Mode"
              >
                🎢
              </Button>
            </Tooltip>
            
            <Tooltip content="🎯 Auto-Fit - Center view to show all components" shortcut="Ctrl+F" side="left">
              <Button
                onClick={autoFitCanvas}
                size="sm"
                variant="outline"
                className="hover:bg-indigo-50 transition-colors"
                title="🎯 Auto-Fit Canvas (Ctrl+F)"
              >
                🎯
              </Button>
            </Tooltip>
            
            <Tooltip content="🔍 Reset Zoom - Return to 100% zoom level" side="left">
              <Button
                onClick={resetZoom}
                size="sm"
                variant="outline"
                className="hover:bg-cyan-50 transition-colors"
                title="🔍 Reset Zoom"
              >
                🔍
              </Button>
            </Tooltip>
            
            <Tooltip content="🧩 Auto-Layout - Arrange all items in a structured grid" side="left">
              <Button
                onClick={autoLayoutItems}
                size="sm"
                variant="outline"
                className="hover:bg-purple-50 transition-colors"
                title="🧩 Auto-Layout Grid"
              >
                🧩
              </Button>
            </Tooltip>
            
            <Tooltip content="📤 Export Configuration - Downloads your canvas setup as JSON" side="left">
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
            
            <Tooltip content="🗑️ Clear Canvas - Removes all items (with confirmation)" side="left">
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

            {showPalette && (
              <Tooltip content="🎨 Component Palette - Add new components to the canvas" side="left">
                <Button
                  onClick={() => setPaletteOpen(!paletteOpen)}
                  size="sm"
                  variant={paletteOpen ? "default" : "outline"}
                  className={`transition-colors ${paletteOpen ? 'bg-green-100 hover:bg-green-200' : 'hover:bg-green-50'}`}
                  title="🎨 Component Palette"
                >
                  🎨
                </Button>
              </Tooltip>
            )}
          </div>

          {/* Component Palette */}
          {showPalette && paletteOpen && (
            <div className="fixed top-1/2 left-4 z-50 bg-white rounded-lg shadow-lg p-4 border max-w-xs transform -translate-y-1/2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-700">Add Components</h3>
                <Button
                  onClick={() => setPaletteOpen(false)}
                  size="sm"
                  variant="ghost"
                  className="w-6 h-6 p-0"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-3">
                {/* Charts Section */}
                <div>
                  <h4 className="text-xs font-medium text-gray-600 mb-2">📊 Charts</h4>
                  <div className="grid grid-cols-2 gap-1">
                    <Button size="sm" variant="outline" onClick={() => addChart('bar')} className="text-xs">
                      📊 Bar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => addChart('line')} className="text-xs">
                      📈 Line
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => addChart('pie')} className="text-xs">
                      🥧 Pie
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => addChart('donut')} className="text-xs">
                      🍩 Donut
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => addChart('metrics')} className="text-xs col-span-2">
                      📋 Metrics
                    </Button>
                  </div>
                </div>

                {/* Notes Section */}
                <div>
                  <h4 className="text-xs font-medium text-gray-600 mb-2">📝 Notes</h4>
                  <div className="grid grid-cols-2 gap-1">
                    <Button size="sm" variant="outline" onClick={() => addNote('yellow')} className="text-xs bg-yellow-50">
                      📝 Yellow
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => addNote('blue')} className="text-xs bg-blue-50">
                      📝 Blue
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => addNote('green')} className="text-xs bg-green-50">
                      📝 Green
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => addNote('pink')} className="text-xs bg-pink-50">
                      📝 Pink
                    </Button>
                  </div>
                </div>

                {/* Websites Section */}
                <div>
                  <h4 className="text-xs font-medium text-gray-600 mb-2">🌐 Websites</h4>
                  <div className="space-y-1">
                    <Button size="sm" variant="outline" onClick={() => addUrl()} className="text-xs w-full">
                      🌐 Random Site
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => addUrl('https://github.com', 'GitHub')} className="text-xs w-full">
                      🐙 GitHub
                    </Button>
                  </div>
                </div>

                {/* Universal Components Section */}
                <div>
                  <h4 className="text-xs font-medium text-gray-600 mb-2">🔧 Components</h4>
                  <div className="grid grid-cols-2 gap-1">
                    <Button size="sm" variant="outline" onClick={() => addUniversalComponent('todo-list')} className="text-xs">
                      ✅ Todo
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => addUniversalComponent('timer')} className="text-xs">
                      ⏰ Timer
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => addUniversalComponent('weather')} className="text-xs">
                      🌤️ Weather
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => addUniversalComponent('note')} className="text-xs">
                      📄 U-Note
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                  <li>• 🎨 Component palette to add new items</li>
                  <li>• 🎠 Turnstile mode for overlapping cards</li>
                  <li>• Click cards in turnstile to focus</li>
                  <li>• 🎢 Enhanced carousel with Embla</li>
                  <li>• Arrow keys/swipe to navigate carousel</li>
                  <li>• Number keys (1-9) jump to slides</li>
                  <li>• Ctrl+Space: toggle autoplay</li>
                  <li>• Ctrl+T: toggle thumbnails</li>
                  <li>• Escape: exit carousel mode</li>
                  <li>• 🎯 Auto-fit zooms to show all</li>
                  <li>• 🔍 Reset zoom to return to 100%</li>
                  <li>• 🧩 Auto-layout to arrange in grid</li>
                  <li>• Scroll to navigate large canvases</li>
                  <li>• Ctrl+S to save, Ctrl+Z to undo</li>
                  <li>• Ctrl+Shift+C: carousel mode</li>
                  <li>• Ctrl+Shift+T: turnstile mode</li>
                  <li>• Delete key to remove selected items</li>
                  <li>• Pass config prop for data-driven content</li>
                </ul>
              </div>
            )}
          </div>
        </>
      )}

      {/* Canvas */}
      <div className="relative w-full h-screen overflow-auto canvas-container" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#cbd5e1 #f1f5f9'
      }}>
        {/* Dynamic canvas size based on item positions */}
        <div 
          className="relative" 
          style={{ 
            width: `${calculateCanvasBounds().width}px`,
            height: `${calculateCanvasBounds().height}px`,
            minWidth: '100vw',
            minHeight: '100vh',
            transform: `scale(${canvasScale}) translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
            transformOrigin: 'top left',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
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

          {/* Draggable Items - Hide when in carousel mode */}
          {!carouselMode && items.map((item, index) => {
            const turnstilePos = turnstileMode 
              ? calculateTurnstilePosition(index, items.length, focusedItemId !== null, item.id === focusedItemId)
              : null

            const isInSpecialMode = turnstileMode

            return (
              <DraggableItem
                key={item.id}
                id={item.id}
                initialX={turnstileMode ? turnstilePos!.x : item.x}
                initialY={turnstileMode ? turnstilePos!.y : item.y}
                initialWidth={item.width}
                initialHeight={item.height}
                onPositionChange={isInSpecialMode ? () => {} : handlePositionChange}
                onSizeChange={isInSpecialMode ? () => {} : handleSizeChange}
                onDelete={editable && !isInSpecialMode ? deleteItem : undefined}
                resizable={!isInSpecialMode}
                style={{
                  transform: turnstileMode ? `scale(${turnstilePos!.scale})` : 'scale(1)',
                  opacity: turnstileMode ? turnstilePos!.opacity : 1,
                  zIndex: turnstileMode ? turnstilePos!.zIndex : 'auto',
                  transition: isInSpecialMode ? 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                  cursor: isInSpecialMode ? 'pointer' : 'move'
                }}
                onClick={turnstileMode ? () => focusOnItem(item.id) : undefined}
                disabled={isInSpecialMode}
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

          {/* Enhanced Carousel Mode Overlay */}
          {carouselMode && (
            <div className="absolute inset-0 pointer-events-none z-5">
              {/* Enhanced Carousel Container */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Carousel
                  setApi={setCarouselApi}
                  className="w-full max-w-6xl pointer-events-auto"
                  opts={{
                    align: "center",
                    loop: true,
                    skipSnaps: false,
                    dragFree: false,
                  }}
                  plugins={[]}
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {items.map((item, index) => (
                      <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-full">
                        <div className="flex items-center justify-center h-[70vh]">
                          <div 
                            className={`relative bg-white rounded-lg shadow-2xl border-2 overflow-hidden transition-all duration-500 ${
                              carouselTransition === 'scale' ? 'hover:scale-105' : ''
                            } ${
                              carouselTransition === 'fade' ? 'animate-in fade-in-0' : ''
                            }`}
                            style={{
                              width: `${item.width}px`,
                              height: `${item.height}px`,
                              maxWidth: '90vw',
                              maxHeight: '70vh'
                            }}
                          >
                            {item.component}
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  
                  {/* Enhanced Navigation */}
                  <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/95 hover:bg-white border-2 shadow-xl" />
                  <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/95 hover:bg-white border-2 shadow-xl" />
                </Carousel>
              </div>

              {/* Enhanced Control Panel */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
                <div className="bg-black/80 backdrop-blur-sm rounded-xl p-6 text-white text-center min-w-[400px]">
                  {/* Title */}
                  <div className="mb-4">
                    <p className="text-xl font-bold">🎢 Enhanced Carousel Mode</p>
                    <p className="text-sm text-white/75">
                      {items.length > 0 ? `${carouselIndex + 1} of ${items.length}` : 'No items'}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  {items.length > 1 && (
                    <div className="w-full bg-white/20 rounded-full h-1 mb-4">
                      <div 
                        className="bg-white h-1 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${((carouselIndex + 1) / items.length) * 100}%` 
                        }}
                      />
                    </div>
                  )}

                  {/* Dot Indicators */}
                  {items.length > 1 && (
                    <div className="flex justify-center mb-4 space-x-2">
                      {items.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToCarouselItem(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                            index === carouselIndex 
                              ? 'bg-white scale-110' 
                              : 'bg-white/40 hover:bg-white/60'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Control Buttons */}
                  <div className="flex justify-center space-x-2 mb-4">
                    <Button
                      onClick={toggleCarouselAutoplay}
                      size="sm"
                      variant={carouselAutoplay ? "default" : "outline"}
                      className={`${carouselAutoplay ? 'bg-green-600 hover:bg-green-700' : 'bg-white/20 hover:bg-white/30'} border-white/30`}
                    >
                      {carouselAutoplay ? '⏸️' : '▶️'}
                    </Button>
                    
                    <Button
                      onClick={toggleCarouselThumbnails}
                      size="sm"
                      variant={carouselThumbnails ? "default" : "outline"}
                      className={`${carouselThumbnails ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white/20 hover:bg-white/30'} border-white/30`}
                    >
                      🖼️
                    </Button>

                    <select
                      value={carouselSpeed}
                      onChange={(e) => changeCarouselSpeed(Number(e.target.value))}
                      className="px-2 py-1 text-xs bg-white/20 border border-white/30 rounded text-white"
                    >
                      <option value={1000} className="text-black">1s</option>
                      <option value={2000} className="text-black">2s</option>
                      <option value={3000} className="text-black">3s</option>
                      <option value={5000} className="text-black">5s</option>
                    </select>

                    <select
                      value={carouselTransition}
                      onChange={(e) => changeCarouselTransition(e.target.value as 'slide' | 'fade' | 'scale')}
                      className="px-2 py-1 text-xs bg-white/20 border border-white/30 rounded text-white"
                    >
                      <option value="slide" className="text-black">Slide</option>
                      <option value="fade" className="text-black">Fade</option>
                      <option value="scale" className="text-black">Scale</option>
                    </select>
                  </div>

                  {/* Enhanced Thumbnails Preview */}
                  {carouselThumbnails && items.length > 1 && (
                    <div className="flex justify-center space-x-2 overflow-x-auto max-w-full pb-2 px-2">
                      {items.map((item, index) => (
                        <CarouselThumbnail
                          key={index}
                          index={index}
                          isActive={index === carouselIndex}
                          onClick={() => goToCarouselItem(index)}
                          className="flex-shrink-0 border-white/30 hover:border-white/60"
                        >
                          <div 
                            className={`w-full h-full bg-gradient-to-br ${
                              item.type === 'chart' ? 'from-blue-400 to-blue-600' :
                              item.type === 'note' ? 'from-yellow-400 to-orange-500' :
                              item.type === 'url' ? 'from-green-400 to-teal-500' :
                              'from-purple-400 to-pink-500'
                            } flex items-center justify-center text-lg`}
                            title={item.title || `${item.type} ${index + 1}`}
                          >
                            {item.type === 'chart' ? '📊' : 
                             item.type === 'note' ? '📝' : 
                             item.type === 'url' ? '🌐' : '📦'}
                          </div>
                        </CarouselThumbnail>
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-white/50 mt-2">
                    Swipe, arrow keys, or click to navigate • Enhanced with Embla Carousel
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
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
        content: 'This is a sample note that can contain any text content. You can resize and move it around the canvas. Try the new features:\n\n• Save/Load (Ctrl+S)\n• Undo/Redo (Ctrl+Z/Y)\n• Export config\n• Multiple chart types\n• Universal Components!',
        color: 'yellow',
        width: 300,
        height: 280,
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
      }
    ],
    // NEW: Universal Components Demo
    universal: {
      'todo-list': [
        {
          props: {
            title: 'Sprint Tasks',
            items: [
              { id: '1', text: 'Complete universal component system', completed: true, createdAt: new Date() },
              { id: '2', text: 'Update documentation', completed: false, createdAt: new Date() },
              { id: '3', text: 'Add more example components', completed: false, createdAt: new Date() }
            ],
            maxItems: 10
          },
          x: 100,
          y: 800,
          width: 320,
          height: 400
        }
      ],
      'timer': [
        {
          props: {
            title: 'Focus Timer',
            initialMinutes: 25,
            autoStart: false
          },
          x: 450,
          y: 800,
          width: 280,
          height: 350
        }
      ],
      'note': [
        {
          props: {
            title: 'Universal Notes',
            content: 'This is a universal note component!\n\nIt can be:\n• Edited inline\n• Styled with colors\n• Saved and loaded\n• Exported',
            color: 'blue',
            editable: true
          },
          x: 750,
          y: 800,
          width: 300,
          height: 280
        }
      ],
      'weather': [
        {
          props: {
            city: 'San Francisco',
            temperature: 68,
            condition: 'Sunny',
            humidity: 65
          },
          x: 1080,
          y: 800,
          width: 300,
          height: 220
        },
        {
          props: {
            city: 'New York',
            temperature: 45,
            condition: 'Cloudy',
            humidity: 78
          },
          x: 1400,
          y: 800,
          width: 300,
          height: 220
        }
      ]
    }
  }

  return <DynamicCanvas config={sampleConfig} showPalette={true} />
}

// Export DynamicCanvas as a named export for reuse
export { DynamicCanvas }
