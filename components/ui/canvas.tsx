"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

// Canvas variants using class-variance-authority
const canvasVariants = cva(
  "relative w-full h-screen overflow-auto transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-background to-muted/50",
        minimal: "bg-background",
        dark: "bg-gradient-to-br from-slate-900 to-slate-800",
        grid: "bg-gradient-to-br from-background to-muted/50",
      },
      size: {
        default: "min-h-screen",
        compact: "min-h-[600px]",
        full: "h-screen max-h-screen",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const canvasToolbarVariants = cva(
  "fixed z-50 bg-card border rounded-lg shadow-lg p-2 flex gap-2 transition-all duration-200",
  {
    variants: {
      position: {
        "top-right": "top-4 right-4 flex-col",
        "top-left": "top-4 left-4 flex-col", 
        "bottom-right": "bottom-4 right-4 flex-col",
        "bottom-left": "bottom-4 left-4 flex-col",
        "top-center": "top-4 left-1/2 -translate-x-1/2 flex-row",
        "right-center": "right-4 top-1/2 -translate-y-1/2 flex-col",
      },
      size: {
        sm: "p-1.5 gap-1.5",
        default: "p-2 gap-2", 
        lg: "p-3 gap-3",
      },
    },
    defaultVariants: {
      position: "right-center",
      size: "default",
    },
  }
)

const canvasPaletteVariants = cva(
  "fixed z-50 bg-card border rounded-lg shadow-lg transition-all duration-200",
  {
    variants: {
      position: {
        left: "left-4 top-1/2 -translate-y-1/2",
        right: "right-4 top-1/2 -translate-y-1/2", 
        top: "top-4 left-1/2 -translate-x-1/2",
        bottom: "bottom-4 left-1/2 -translate-x-1/2",
      },
      size: {
        sm: "p-2 max-w-xs",
        default: "p-4 max-w-sm",
        lg: "p-6 max-w-md",
      },
    },
    defaultVariants: {
      position: "left",
      size: "default",
    },
  }
)

// Enhanced interfaces with shadcn patterns
export interface CanvasProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof canvasVariants> {
  config?: CanvasConfig
  editable?: boolean
  showToolbar?: boolean
  showPalette?: boolean
  toolbarPosition?: VariantProps<typeof canvasToolbarVariants>["position"]
  palettePosition?: VariantProps<typeof canvasPaletteVariants>["position"]
  onItemsChange?: (items: CanvasItem[]) => void
  onSave?: (config: CanvasConfig) => void
  onLoad?: () => CanvasConfig | null
  // Palette handlers
  onAddChart?: (type: ChartType) => void
  onAddNote?: (color: NoteColor) => void
  onAddUrl?: (url?: string, title?: string) => void
  onAddComponent?: (type: string) => void
  // Toolbar handlers
  onUndo?: () => void
  onRedo?: () => void
  onClear?: () => void
  onExport?: () => void
  onAutoFit?: () => void
  onAutoLayout?: () => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  onZoomReset?: () => void
  onToggleCarousel?: () => void
  onToggleTurnstile?: () => void
  canUndo?: boolean
  canRedo?: boolean
  carouselMode?: boolean
  turnstileMode?: boolean
}

export interface CanvasToolbarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof canvasToolbarVariants> {
  onSave?: () => void
  onLoad?: () => void
  onUndo?: () => void
  onRedo?: () => void
  onClear?: () => void
  onExport?: () => void
  onAutoFit?: () => void
  onAutoLayout?: () => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  onZoomReset?: () => void
  onToggleCarousel?: () => void
  onToggleTurnstile?: () => void
  canUndo?: boolean
  canRedo?: boolean
  carouselMode?: boolean
  turnstileMode?: boolean
}

export interface CanvasPaletteProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof canvasPaletteVariants> {
  onAddChart?: (type: ChartType) => void
  onAddNote?: (color: NoteColor) => void
  onAddUrl?: (url?: string, title?: string) => void
  onAddComponent?: (type: string) => void
  isOpen?: boolean
  onToggle?: () => void
}

// Canvas Toolbar Component
const CanvasToolbar = React.forwardRef<HTMLDivElement, CanvasToolbarProps>(
  ({ 
    className, 
    position, 
    size,
    onSave,
    onLoad, 
    onUndo,
    onRedo,
    onClear,
    onExport,
    onAutoFit,
    onAutoLayout,
    onZoomIn,
    onZoomOut,
    onZoomReset,
    onToggleCarousel,
    onToggleTurnstile,
    canUndo = false,
    canRedo = false,
    carouselMode = false,
    turnstileMode = false,
    ...props 
  }, ref) => {
    return (
      <TooltipProvider>
        <div
          ref={ref}
          className={cn(canvasToolbarVariants({ position, size }), className)}
          {...props}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onSave}
                size="sm"
                variant="outline"
                className="hover:bg-accent transition-colors"
              >
                💾
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save Canvas <kbd className="text-xs">Ctrl+S</kbd></p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onLoad}
                size="sm"
                variant="outline"
                className="hover:bg-accent transition-colors"
              >
                📁
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Load Canvas</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onUndo}
                size="sm"
                variant="outline"
                disabled={!canUndo}
                className="hover:bg-accent transition-colors"
              >
                ↶
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo <kbd className="text-xs">Ctrl+Z</kbd></p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onRedo}
                size="sm"
                variant="outline"
                disabled={!canRedo}
                className="hover:bg-accent transition-colors"
              >
                ↷
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo <kbd className="text-xs">Ctrl+Y</kbd></p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onToggleTurnstile}
                size="sm"
                variant={turnstileMode ? "default" : "outline"}
                className="hover:bg-accent transition-colors"
              >
                🎠
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Turnstile Mode</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onToggleCarousel}
                size="sm"
                variant={carouselMode ? "default" : "outline"}
                className="hover:bg-accent transition-colors"
              >
                🎢
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Carousel Mode</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onAutoFit}
                size="sm"
                variant="outline"
                className="hover:bg-accent transition-colors"
              >
                🎯
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Auto-Fit <kbd className="text-xs">Ctrl+F</kbd></p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onAutoLayout}
                size="sm"
                variant="outline"
                className="hover:bg-accent transition-colors"
              >
                🧩
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Auto-Layout <kbd className="text-xs">Ctrl+L</kbd></p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onZoomIn}
                size="sm"
                variant="outline"
                className="hover:bg-accent transition-colors"
              >
                🔍
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom In <kbd className="text-xs">Ctrl+=</kbd></p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onZoomOut}
                size="sm"
                variant="outline"
                className="hover:bg-accent transition-colors"
              >
                🔎
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom Out <kbd className="text-xs">Ctrl+-</kbd></p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onZoomReset}
                size="sm"
                variant="outline"
                className="hover:bg-accent transition-colors"
              >
                🔄
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset Zoom <kbd className="text-xs">Ctrl+0</kbd></p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onExport}
                size="sm"
                variant="outline"
                className="hover:bg-accent transition-colors"
              >
                📤
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export Config</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onClear}
                size="sm"
                variant="outline"
                className="hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                🗑️
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear Canvas</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    )
  }
)
CanvasToolbar.displayName = "CanvasToolbar"

// Canvas Palette Component  
const CanvasPalette = React.forwardRef<HTMLDivElement, CanvasPaletteProps>(
  ({ 
    className, 
    position, 
    size,
    onAddChart,
    onAddNote,
    onAddUrl,
    onAddComponent,
    isOpen = false,
    onToggle,
    ...props 
  }, ref) => {
    if (!isOpen) return null

    return (
      <Card
        ref={ref}
        className={cn(canvasPaletteVariants({ position, size }), className)}
        {...props}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Add Components</h3>
            <Button
              onClick={onToggle}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Charts Section */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">📊 Charts</h4>
            <div className="grid grid-cols-2 gap-1">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onAddChart?.('bar')} 
                className="text-xs h-8"
              >
                📊 Bar
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onAddChart?.('line')} 
                className="text-xs h-8"
              >
                📈 Line
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onAddChart?.('pie')} 
                className="text-xs h-8"
              >
                🥧 Pie
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onAddChart?.('donut')} 
                className="text-xs h-8"
              >
                🍩 Donut
              </Button>
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">📝 Notes</h4>
            <div className="grid grid-cols-2 gap-1">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onAddNote?.('yellow')} 
                className="text-xs h-8 bg-yellow-50 hover:bg-yellow-100"
              >
                📝 Yellow
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onAddNote?.('blue')} 
                className="text-xs h-8 bg-blue-50 hover:bg-blue-100"
              >
                📝 Blue
              </Button>
            </div>
          </div>

          {/* Websites Section */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">🌐 Websites</h4>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onAddUrl?.()} 
              className="text-xs w-full h-8"
            >
              🌐 Add Website
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }
)
CanvasPalette.displayName = "CanvasPalette"

// Main Canvas Component
const Canvas = React.forwardRef<HTMLDivElement, CanvasProps>(
  ({ 
    className, 
    variant, 
    size,
    config,
    editable = true,
    showToolbar = true,
    showPalette = true,
    toolbarPosition = "right-center",
    palettePosition = "left",
    onItemsChange,
    onSave,
    onLoad,
    children,
    onAddChart,
    onAddNote,
    onAddUrl,
    onAddComponent,
    onUndo,
    onRedo,
    onClear,
    onExport,
    onAutoFit,
    onAutoLayout,
    onZoomIn,
    onZoomOut,
    onZoomReset,
    onToggleCarousel,
    onToggleTurnstile,
    canUndo = false,
    canRedo = false,
    carouselMode = false,
    turnstileMode = false,
    ...props 
  }, ref) => {
    const [paletteOpen, setPaletteOpen] = React.useState(false)

    return (
      <div 
        ref={ref}
        className={cn(canvasVariants({ variant, size }), className)}
        {...props}
      >
        {/* Grid Background for grid variant */}
        {variant === "grid" && (
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />
        )}

        {/* Canvas Content */}
        <div className="relative w-full h-full">
          {children}
        </div>

        {/* Toolbar */}
        {editable && showToolbar && (
          <CanvasToolbar
            position={toolbarPosition}
            onSave={() => onSave?.({})}
            onLoad={onLoad}
            onUndo={onUndo}
            onRedo={onRedo}
            onClear={onClear}
            onExport={onExport}
            onAutoFit={onAutoFit}
            onAutoLayout={onAutoLayout}
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
            onZoomReset={onZoomReset}
            onToggleCarousel={onToggleCarousel}
            onToggleTurnstile={onToggleTurnstile}
            canUndo={canUndo}
            canRedo={canRedo}
            carouselMode={carouselMode}
            turnstileMode={turnstileMode}
          />
        )}

        {/* Palette */}
        {editable && showPalette && (
          <>
            {/* Palette Toggle Button */}
            <Button
              onClick={() => setPaletteOpen(!paletteOpen)}
              size="sm"
              variant={paletteOpen ? "default" : "outline"}
              className="fixed bottom-4 left-4 z-50 shadow-lg"
            >
              🎨
            </Button>
            
            <CanvasPalette
              position={palettePosition}
              isOpen={paletteOpen}
              onToggle={() => setPaletteOpen(false)}
              onAddChart={onAddChart}
              onAddNote={onAddNote}
              onAddUrl={onAddUrl}
              onAddComponent={onAddComponent}
            />
          </>
        )}
      </div>
    )
  }
)
Canvas.displayName = "Canvas"

export { 
  Canvas, 
  CanvasToolbar, 
  CanvasPalette,
  canvasVariants,
  canvasToolbarVariants,
  canvasPaletteVariants 
}

// Type definitions
export type ChartType = 'bar' | 'line' | 'pie' | 'donut' | 'metrics'
export type NoteColor = 'yellow' | 'blue' | 'green' | 'pink' | 'purple'

export interface CanvasConfig {
  urls?: Array<{
    url: string
    title: string
    width?: number
    height?: number
    x?: number
    y?: number
  }>
  charts?: Array<{
    type: ChartType
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
    color?: NoteColor
    width?: number
    height?: number
    x?: number
    y?: number
  }>
  universal?: Record<string, Array<{
    props?: any
    width?: number
    height?: number
    x?: number
    y?: number
  }>>
}

export interface CanvasItem {
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
  universalType?: string
  props?: any
  chartType?: string
  noteColor?: string
}

// Usage example:
/*
<Canvas 
  variant="grid" 
  size="full"
  toolbarPosition="right-center"
  palettePosition="left"
  onSave={(config) => console.log('Save config:', config)}
  onLoad={() => null}
>
  <DraggableItem id="example" initialX={100} initialY={100}>
    <div className="p-4 bg-card border rounded-lg">
      Example content
    </div>
  </DraggableItem>
</Canvas>
*/ 