"use client"

import React, { useState, useEffect } from 'react'
import { Canvas, CanvasToolbar, CanvasPalette } from "@/components/ui/canvas"
import type { CanvasItem, CanvasConfig, ChartType, NoteColor } from "@/components/ui/canvas"
import { DraggableItem } from "@/components/draggable-item"
import { LiveWebsiteCard } from "@/components/editable-components"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

// Helper function to create chart components (simplified version)
function createChartComponent(type: ChartType, title: string, width: number, height: number) {
  const sampleData = {
    bar: { values: [120, 190, 300, 500, 200], labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'] },
    line: { values: [100, 150, 120, 280, 350], labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] },
    pie: { values: [35, 25, 20, 15, 5], labels: ['A', 'B', 'C', 'D', 'E'] },
    donut: { values: [40, 30, 20, 10], labels: ['Online', 'Retail', 'Partners', 'Direct'] },
    metrics: { metrics: [{ label: 'Users', value: '1,234' }, { label: 'Revenue', value: '$45K' }] }
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">📊 {title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">📈</div>
          <p className="text-sm text-muted-foreground">{type.charAt(0).toUpperCase() + type.slice(1)} Chart</p>
          <Badge variant="secondary" className="mt-2">Interactive</Badge>
        </div>
      </CardContent>
    </Card>
  )
}

// Simple static note component - no editing, just display
function createNoteComponent(title: string, content: string, color: NoteColor, width: number, height: number) {
  const colorClasses = {
    yellow: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800',
    blue: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
    green: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
    pink: 'bg-pink-50 border-pink-200 dark:bg-pink-950 dark:border-pink-800',
    purple: 'bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800'
  }

  return (
    <Card className={`w-full h-full ${colorClasses[color]}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          📝 {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 text-sm whitespace-pre-wrap">
          {content}
        </div>
      </CardContent>
    </Card>
  )
}

// Sample items for demonstration
const createSampleItems = (): CanvasItem[] => {
  const items: CanvasItem[] = [
    {
      id: 'demo-chart-1',
      type: 'chart',
      x: 100,
      y: 100,
      width: 350,
      height: 250,
      title: 'Sample Chart',
      chartType: 'bar',
      chartData: { values: [120, 190, 300], labels: ['A', 'B', 'C'] },
      component: createChartComponent('bar', 'Sample Chart', 350, 250)
    },
    {
      id: 'demo-website-1',
      type: 'url',
      x: 150,
      y: 400,
      width: 400,
      height: 300,
      url: 'https://ui.shadcn.com',
      title: 'shadcn/ui',
      component: <LiveWebsiteCard url="https://ui.shadcn.com" title="shadcn/ui" width={400} height={300} />
    }
  ]
  
  return items
}

export default function ShadcnCanvasDemo() {
  const [variant, setVariant] = useState<"default" | "minimal" | "dark" | "grid">("grid")
  const [size, setSize] = useState<"default" | "compact" | "full">("full")
  const [toolbarPosition, setToolbarPosition] = useState<"top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "right-center">("right-center")
  const [items, setItems] = useState<CanvasItem[]>([])
  
  // Canvas state management
  const [history, setHistory] = useState<CanvasItem[][]>([[]])
  const [historyIndex, setHistoryIndex] = useState(0)

  // Advanced features state
  const [turnstileMode, setTurnstileMode] = useState(false)
  const [carouselMode, setCarouselMode] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null)
  const [canvasScale, setCanvasScale] = useState(1)
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })

  // Palette state
  const [paletteOpen, setPaletteOpen] = useState(false)

  // Save to history whenever items change
  const saveToHistory = (newItems: CanvasItem[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push([...newItems])
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // Generate unique IDs
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

  // Get random position for new items
  const getRandomPosition = () => ({
    x: Math.random() * 300 + 100,
    y: Math.random() * 300 + 100
  })

  // Initialize items with simple components
  useEffect(() => {
    if (items.length === 0) {
      const initialItems = createSampleItems()
      
      // Add the demo note
      const demoNote: CanvasItem = {
        id: 'demo-note-1',
        type: 'note',
        x: 500,
        y: 120,
        width: 300,
        height: 200,
        title: 'Sticky Note',
        content: 'This is a shadcn-themed note!\n\n• Draggable & Resizable\n• Themed with CSS variables\n• Dark mode compatible',
        noteColor: 'yellow',
        component: createNoteComponent(
          'Sticky Note',
          'This is a shadcn-themed note!\n\n• Draggable & Resizable\n• Themed with CSS variables\n• Dark mode compatible',
          'yellow',
          300,
          200
        )
      }
      
      const itemsWithNote = [...initialItems, demoNote]
      setItems(itemsWithNote)
      setHistory([itemsWithNote])
      setHistoryIndex(0)
    }
  }, []) // Empty dependency array means this runs once on mount

  // Canvas actions
  const handleSave = () => {
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
        type: item.chartType as ChartType,
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
        color: item.noteColor as NoteColor,
        width: item.width,
        height: item.height,
        x: item.x,
        y: item.y
      }))
    }
    
    console.log('Saving canvas...', { variant, size, config })
    localStorage.setItem('shadcn-canvas-config', JSON.stringify(config))
    alert('Canvas saved to localStorage!')
  }

  const handleLoad = () => {
    try {
      const saved = localStorage.getItem('shadcn-canvas-config')
      if (saved) {
        const config: CanvasConfig = JSON.parse(saved)
        const newItems: CanvasItem[] = []
        
        // Reconstruct items from config
        config.urls?.forEach((urlConfig, index) => {
          newItems.push({
            id: `url-${index + 1}`,
            type: 'url',
            url: urlConfig.url,
            title: urlConfig.title,
            x: urlConfig.x || 100,
            y: urlConfig.y || 100,
            width: urlConfig.width || 400,
            height: urlConfig.height || 300,
            component: <LiveWebsiteCard url={urlConfig.url} title={urlConfig.title} width={urlConfig.width || 400} height={urlConfig.height || 300} />
          })
        })
        
        config.charts?.forEach((chartConfig, index) => {
          newItems.push({
            id: `chart-${index + 1}`,
            type: 'chart',
            title: chartConfig.title,
            chartType: chartConfig.type,
            chartData: chartConfig.data,
            x: chartConfig.x || 100,
            y: chartConfig.y || 100,
            width: chartConfig.width || 350,
            height: chartConfig.height || 250,
            component: createChartComponent(chartConfig.type, chartConfig.title, chartConfig.width || 350, chartConfig.height || 250)
          })
        })
        
        config.notes?.forEach((noteConfig, index) => {
          const noteId = `note-${index + 1}`
          newItems.push({
            id: noteId,
            type: 'note',
            title: noteConfig.title,
            content: noteConfig.content,
            noteColor: noteConfig.color,
            x: noteConfig.x || 100,
            y: noteConfig.y || 100,
            width: noteConfig.width || 300,
            height: noteConfig.height || 200,
            component: createNoteComponent(
              noteConfig.title, 
              noteConfig.content, 
              noteConfig.color || 'yellow', 
              noteConfig.width || 300, 
              noteConfig.height || 200
            )
          })
        })
        
        setItems(newItems)
        saveToHistory(newItems)
        alert('Canvas loaded successfully!')
      } else {
        alert('No saved canvas found!')
      }
    } catch (error) {
      console.error('Error loading canvas:', error)
      alert('Error loading canvas!')
    }
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setItems([...history[historyIndex - 1]])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)  
      setItems([...history[historyIndex + 1]])
    }
  }

  const handleClear = () => {
    if (confirm('Clear all items from canvas?')) {
      const newItems: CanvasItem[] = []
      setItems(newItems)
      saveToHistory(newItems)
    }
  }

  const handleExport = () => {
    const config: CanvasConfig = {
      urls: items.filter(item => item.type === 'url').map(item => ({
        url: item.url!,
        title: item.title!,
        width: item.width,
        height: item.height,
        x: item.x,
        y: item.y
      }))
      // Add other types as needed
    }
    
    const dataStr = JSON.stringify(config, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'shadcn-canvas-config.json'
    link.click()
  }

  // Palette actions
  const handleAddChart = (type: ChartType) => {
    const id = generateId('chart')
    const position = getRandomPosition()
    const width = 350
    const height = 250

    const newItem: CanvasItem = {
      id,
      type: 'chart',
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
      chartType: type,
      chartData: { values: [100, 200, 150], labels: ['A', 'B', 'C'] },
      x: position.x,
      y: position.y,
      width,
      height,
      component: createChartComponent(type, `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`, width, height)
    }

    const newItems = [...items, newItem]
    setItems(newItems)
    saveToHistory(newItems)
  }

  const handleAddNote = (color: NoteColor) => {
    const id = generateId('note')
    const position = getRandomPosition()
    const width = 300
    const height = 200
    const title = 'New Note'
    const content = 'Click to edit this note...\n\nYou can add your own content here!'

    const newItem: CanvasItem = {
      id,
      type: 'note',
      title,
      content,
      noteColor: color,
      x: position.x,
      y: position.y,
      width,
      height,
      component: createNoteComponent(
        title,
        content,
        color,
        width,
        height
      )
    }

    const newItems = [...items, newItem]
    setItems(newItems)
    saveToHistory(newItems)
  }

  const handleAddUrl = (url?: string, title?: string) => {
    const id = generateId('url')
    const position = getRandomPosition()
    const width = 400
    const height = 300

    const defaultUrls = [
      { url: 'https://github.com', title: 'GitHub' },
      { url: 'https://react.dev', title: 'React' },
      { url: 'https://nextjs.org', title: 'Next.js' },
      { url: 'https://tailwindcss.com', title: 'Tailwind' }
    ]

    const selectedUrl = url ? { url, title: title || 'Website' } : defaultUrls[Math.floor(Math.random() * defaultUrls.length)]

    const newItem: CanvasItem = {
      id,
      type: 'url',
      url: selectedUrl.url,
      title: selectedUrl.title,
      x: position.x,
      y: position.y,
      width,
      height,
      component: <LiveWebsiteCard url={selectedUrl.url} title={selectedUrl.title} width={width} height={height} />
    }

    const newItems = [...items, newItem]
    setItems(newItems)
    saveToHistory(newItems)
  }

  const handleAddComponent = (type: string) => {
    // For now, just add a generic component note
    handleAddNote('purple')
  }

  // Advanced Features
  const toggleTurnstileMode = () => {
    setTurnstileMode(!turnstileMode)
    setFocusedItemId(null)
    setCarouselMode(false)
  }

  const toggleCarouselMode = () => {
    setCarouselMode(!carouselMode)
    setCarouselIndex(0)
    setTurnstileMode(false)
  }

  const nextCarouselItem = () => {
    if (carouselMode && items.length > 0) {
      setCarouselIndex((prev) => (prev + 1) % items.length)
    }
  }

  const prevCarouselItem = () => {
    if (carouselMode && items.length > 0) {
      setCarouselIndex((prev) => (prev - 1 + items.length) % items.length)
    }
  }

  const focusOnItem = (itemId: string) => {
    if (turnstileMode) {
      setFocusedItemId(focusedItemId === itemId ? null : itemId)
    }
  }

  // Calculate canvas bounds to fit all items
  const calculateCanvasBounds = () => {
    if (items.length === 0) {
      return { 
        minX: 0, 
        minY: 0, 
        maxX: window.innerWidth || 1200, 
        maxY: window.innerHeight || 800,
        width: window.innerWidth || 1200,
        height: window.innerHeight || 800
      }
    }

    const padding = 100
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity

    items.forEach(item => {
      minX = Math.min(minX, item.x - padding)
      minY = Math.min(minY, item.y - padding)
      maxX = Math.max(maxX, item.x + item.width + padding)
      maxY = Math.max(maxY, item.y + item.height + padding)
    })

    const minWidth = window.innerWidth || 1200
    const minHeight = window.innerHeight || 800
    
    return {
      minX: Math.min(minX, 0),
      minY: Math.min(minY, 0),
      maxX: Math.max(maxX, minWidth),
      maxY: Math.max(maxY, minHeight),
      width: Math.max(maxX - Math.min(minX, 0), minWidth),
      height: Math.max(maxY - Math.min(minY, 0), minHeight)
    }
  }

  const handleAutoFit = () => {
    if (typeof window === 'undefined' || items.length === 0) return

    const bounds = calculateCanvasBounds()
    const container = document.querySelector('.canvas-container') as HTMLElement
    
    if (container) {
      const viewportPadding = 100
      const viewportWidth = window.innerWidth - viewportPadding
      const viewportHeight = window.innerHeight - viewportPadding
      
      const contentWidth = bounds.width
      const contentHeight = bounds.height
      
      const scaleX = viewportWidth / contentWidth
      const scaleY = viewportHeight / contentHeight
      
      const optimalScale = Math.min(scaleX, scaleY, 1)
      
      const scaledContentWidth = contentWidth * optimalScale
      const scaledContentHeight = contentHeight * optimalScale
      
      const offsetX = (viewportWidth - scaledContentWidth) / 2
      const offsetY = (viewportHeight - scaledContentHeight) / 2
      
      setCanvasScale(optimalScale)
      setCanvasOffset({ x: offsetX, y: offsetY })
      
      container.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    }
  }

  const handleResetZoom = () => {
    setCanvasScale(1)
    setCanvasOffset({ x: 0, y: 0 })
  }

  const handleZoomIn = () => {
    const newScale = Math.min(canvasScale * 1.2, 3) // Max zoom 3x
    setCanvasScale(newScale)
  }

  const handleZoomOut = () => {
    const newScale = Math.max(canvasScale / 1.2, 0.1) // Min zoom 0.1x
    setCanvasScale(newScale)
  }

  const handleAutoLayout = () => {
    if (items.length === 0) return

    setTurnstileMode(false)
    setCarouselMode(false)
    setFocusedItemId(null)

    const padding = 50
    const startX = 100
    const startY = 100
    
    const totalItems = items.length
    const cols = Math.ceil(Math.sqrt(totalItems * 1.5))
    
    const maxWidth = Math.max(...items.map(item => item.width))
    const maxHeight = Math.max(...items.map(item => item.height))
    
    const gridWidth = maxWidth + padding
    const gridHeight = maxHeight + padding
    
    const sortedItems = [...items].sort((a, b) => (b.width * b.height) - (a.width * a.height))
    
    const newItems = sortedItems.map((item, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)
      
      const newX = startX + (col * gridWidth)
      const newY = startY + (row * gridHeight)
      
      return { ...item, x: newX, y: newY }
    })
    
    setItems(newItems)
    saveToHistory(newItems)
    
    setTimeout(() => handleAutoFit(), 200)
  }

  // Calculate turnstile positions
  const calculateTurnstilePosition = (index: number, total: number, focused: boolean, isFocused: boolean) => {
    const screenWidth = window.innerWidth || 1200
    const screenHeight = window.innerHeight || 800

    if (isFocused && focused) {
      return {
        x: screenWidth / 2 - 200,
        y: screenHeight / 2 - 150,
        scale: 1.1,
        zIndex: 100,
        opacity: 1
      }
    }

    const centerX = screenWidth / 2
    const centerY = screenHeight / 2
    const radius = Math.min(screenWidth, screenHeight) * 0.3
    const angle = (index / total) * 2 * Math.PI
    
    return {
      x: centerX + Math.cos(angle) * radius - 150,
      y: centerY + Math.sin(angle) * radius - 100,
      scale: focused && !isFocused ? 0.7 : 0.8,
      zIndex: isFocused ? 100 : 10,
      opacity: focused && !isFocused ? 0.6 : 0.9
    }
  }

  // Calculate carousel positions  
  const calculateCarouselPosition = (index: number, total: number, currentIndex: number) => {
    const screenWidth = window.innerWidth || 1200
    const screenHeight = window.innerHeight || 800
    
    const centerX = screenWidth / 2
    const centerY = screenHeight / 2
    const itemWidth = 400
    const itemHeight = 300
    const spacing = itemWidth + 50

    if (index === currentIndex) {
      return {
        x: centerX - itemWidth / 2,
        y: centerY - itemHeight / 2,
        scale: 1,
        opacity: 1,
        zIndex: 100
      }
    } else {
      const offset = (index - currentIndex) * spacing
      return {
        x: centerX - itemWidth / 2 + offset,
        y: centerY - itemHeight / 2,
        scale: 0.8,
        opacity: Math.abs(index - currentIndex) === 1 ? 0.7 : 0.3,
        zIndex: Math.abs(index - currentIndex) === 1 ? 50 : 10
      }
    }
  }

  const addSampleItem = () => {
    const id = `demo-item-${Date.now()}`
    const title = 'New Item'
    const content = 'This is a dynamically added item!'
    
    const newItem = {
      id,
      type: 'note' as const,
      x: Math.random() * 300 + 100,
      y: Math.random() * 300 + 100,
      width: 250,
      height: 180,
      title,
      content,
      noteColor: 'purple' as NoteColor,
      component: createNoteComponent(
        title,
        content,
        'purple',
        250,
        180
      )
    }
    const newItems = [...items, newItem]
    setItems(newItems)
    saveToHistory(newItems)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      // Carousel Mode Shortcuts
      if (carouselMode) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault()
          prevCarouselItem()
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault()
          nextCarouselItem()
        } else if (e.key === 'Escape') {
          e.preventDefault()
          toggleCarouselMode()
        }
        // Number keys to jump to specific slides
        else if (e.key >= '1' && e.key <= '9') {
          const index = parseInt(e.key) - 1
          if (index < items.length) {
            e.preventDefault()
            setCarouselIndex(index)
          }
        }
        return
      }

      // Global shortcuts
      if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        handleSave()
      } else if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      } else if ((e.key === 'y' && (e.ctrlKey || e.metaKey)) || (e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey)) {
        e.preventDefault()
        handleRedo()
      } else if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        handleAutoFit()
      } else if (e.key === 'c' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault()
        toggleCarouselMode()
      } else if (e.key === 't' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault()
        toggleTurnstileMode()
      } else if (e.key === '=' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        handleZoomIn()
      } else if (e.key === '-' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        handleZoomOut()
      } else if (e.key === '0' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        handleResetZoom()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [carouselMode, carouselIndex, historyIndex, history, items.length])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                  ← Back to Original Demo
                </Link>
                <Badge variant="secondary">shadcn/ui Canvas v2.0</Badge>
              </div>
              <h1 className="text-2xl font-bold">shadcn/ui Canvas Demo</h1>
              <p className="text-sm text-muted-foreground">
                Showcase of the shadcn-compatible Canvas component with working functionality
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Items: {items.length} | History: {historyIndex + 1}/{history.length}
              </div>
              <Button
                onClick={() => setPaletteOpen(!paletteOpen)}
                variant={paletteOpen ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-2"
              >
                🎨 {paletteOpen ? 'Hide' : 'Show'} Palette
              </Button>
            </div>
          </div>
          
          {/* Collapsible Palette Section */}
          {paletteOpen && (
            <div className="border-t mt-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Charts Section */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">📊 Charts</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleAddChart('bar')} 
                      className="text-xs h-8"
                    >
                      📊 Bar Chart
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleAddChart('line')} 
                      className="text-xs h-8"
                    >
                      📈 Line Chart
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleAddChart('pie')} 
                      className="text-xs h-8"
                    >
                      🥧 Pie Chart
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleAddChart('donut')} 
                      className="text-xs h-8"
                    >
                      🍩 Donut Chart
                    </Button>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">📝 Notes</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleAddNote('yellow')} 
                      className="text-xs h-8 bg-yellow-50 hover:bg-yellow-100 border-yellow-200"
                    >
                      📝 Yellow Note
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleAddNote('blue')} 
                      className="text-xs h-8 bg-blue-50 hover:bg-blue-100 border-blue-200"
                    >
                      📝 Blue Note
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleAddNote('green')} 
                      className="text-xs h-8 bg-green-50 hover:bg-green-100 border-green-200"
                    >
                      📝 Green Note
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleAddNote('pink')} 
                      className="text-xs h-8 bg-pink-50 hover:bg-pink-100 border-pink-200"
                    >
                      📝 Pink Note
                    </Button>
                  </div>
                </div>

                {/* Websites & Components Section */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">🌐 Components</h4>
                  <div className="space-y-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleAddUrl()} 
                      className="text-xs w-full h-8"
                    >
                      🌐 Add Website
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={addSampleItem} 
                      className="text-xs w-full h-8"
                    >
                      ➕ Add Sample Item
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Canvas Demo */}
      <div className="relative">
        <Canvas
          variant={variant}
          size={size}
          toolbarPosition={toolbarPosition}
          palettePosition="left"
          onSave={handleSave}
          onLoad={() => { handleLoad(); return null; }}
          className="border-t canvas-container"
          showToolbar={true}
          showPalette={false} // Disable built-in palette, using external one
          // Palette handlers
          onAddChart={handleAddChart}
          onAddNote={handleAddNote}
          onAddUrl={handleAddUrl}
          onAddComponent={handleAddComponent}
          // Toolbar handlers
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClear={handleClear}
          onExport={handleExport}
          onAutoFit={handleAutoFit}
          onAutoLayout={handleAutoLayout}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleResetZoom}
          onToggleCarousel={toggleCarouselMode}
          onToggleTurnstile={toggleTurnstileMode}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          carouselMode={carouselMode}
          turnstileMode={turnstileMode}
        >
          {/* Canvas content area with transform */}
          <div
            className="relative w-full h-full"
            style={{
              transform: `scale(${canvasScale}) translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
              transformOrigin: 'top left',
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Render demo items with advanced positioning */}
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
                  onPositionChange={isInSpecialMode ? () => {} : (id, x, y) => {
                    const newItems = items.map(i => i.id === id ? {...i, x, y} : i)
                    setItems(newItems)
                  }}
                  onSizeChange={isInSpecialMode ? () => {} : (id, width, height) => {
                    const newItems = items.map(i => i.id === id ? {...i, width, height} : i)
                    setItems(newItems)
                  }}
                  onDelete={isInSpecialMode ? undefined : (id) => {
                    const newItems = items.filter(i => i.id !== id)
                    setItems(newItems)
                    saveToHistory(newItems)
                  }}
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

            {/* Carousel Mode Items */}
            {carouselMode && items.map((item, index) => {
              const carouselPos = calculateCarouselPosition(index, items.length, carouselIndex)
              
              return (
                <div
                  key={`carousel-${item.id}`}
                  className="absolute transition-all duration-500 ease-in-out pointer-events-none"
                  style={{
                    left: `${carouselPos.x}px`,
                    top: `${carouselPos.y}px`,
                    width: `${item.width}px`,
                    height: `${item.height}px`,
                    transform: `scale(${carouselPos.scale})`,
                    opacity: carouselPos.opacity,
                    zIndex: carouselPos.zIndex
                  }}
                >
                  <div className="w-full h-full bg-white rounded-lg shadow-2xl border-2 overflow-hidden">
                    {item.component}
                  </div>
                </div>
              )
            })}

            {/* Turnstile Mode Overlay */}
            {turnstileMode && (
              <div className="absolute inset-0 bg-black bg-opacity-20 pointer-events-none z-50">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
                  {focusedItemId ? (
                    <div className="bg-black bg-opacity-50 rounded-lg p-4">
                      <p className="text-lg font-semibold">Focused Mode</p>
                      <p className="text-sm opacity-75">Click the focused item again to unfocus</p>
                    </div>
                  ) : (
                    <div className="bg-black bg-opacity-50 rounded-lg p-4">
                      <p className="text-lg font-semibold">🎠 Turnstile Mode</p>
                      <p className="text-sm opacity-75">Click any card to focus on it</p>
                      <p className="text-xs opacity-50 mt-2">Items arranged in a circle • Drag disabled</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Carousel Mode Overlay */}
            {carouselMode && (
              <div className="absolute inset-0 pointer-events-none z-50">
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
                  <div className="bg-black/80 backdrop-blur-sm rounded-xl p-6 text-white text-center min-w-[400px]">
                    <div className="mb-4">
                      <p className="text-xl font-bold">🎢 Carousel Mode</p>
                      <p className="text-sm text-white/75">
                        {items.length > 0 ? `${carouselIndex + 1} of ${items.length}` : 'No items'}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    {items.length > 1 && (
                      <div className="w-full bg-white/20 rounded-full h-1 mb-4">
                        <div 
                          className="bg-white h-1 rounded-full transition-all duration-300"
                          style={{ width: `${((carouselIndex + 1) / items.length) * 100}%` }}
                        />
                      </div>
                    )}

                    {/* Dot Indicators */}
                    {items.length > 1 && (
                      <div className="flex justify-center mb-4 space-x-2">
                        {items.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCarouselIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                              index === carouselIndex 
                                ? 'bg-white scale-110' 
                                : 'bg-white/40 hover:bg-white/60'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-center space-x-2 mb-4">
                      <Button
                        onClick={prevCarouselItem}
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 border-white/30"
                      >
                        ← Previous
                      </Button>
                      <Button
                        onClick={nextCarouselItem}
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 border-white/30"
                      >
                        Next →
                      </Button>
                    </div>

                    <div className="text-xs text-white/50 mt-2">
                      Arrow keys to navigate • Number keys (1-9) to jump • Escape to exit
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Demo overlay for empty canvas */}
            {items.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Card className="w-96 shadow-lg">
                  <CardContent className="text-center p-8">
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className="text-xl font-semibold mb-2">Canvas is Empty</h3>
                    <p className="text-muted-foreground mb-4">
                      Add some items using the toolbar or palette to see the shadcn Canvas in action!
                    </p>
                    <Button onClick={addSampleItem}>
                      Add Sample Item
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </Canvas>
      </div>

      {/* Footer with comparison */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-4">✅ Working Features</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium mb-2">💾 Actions</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Save/Load (Ctrl+S)</li>
                    <li>• Undo/Redo (Ctrl+Z/Y)</li>
                    <li>• Export JSON</li>
                    <li>• Clear canvas</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium mb-2">🎨 Components</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Add charts</li>
                    <li>• Add notes</li>
                    <li>• Add websites</li>
                    <li>• Drag & resize</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">🆚 Original vs shadcn Version</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Functionality:</span>
                  <span>Fully Working ✅</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Theming:</span>
                  <span>CSS Variables ✅</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">State Management:</span>
                  <span>History & Undo ✅</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Composable:</span>
                  <span>shadcn Components ✅</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 