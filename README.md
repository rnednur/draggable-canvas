# Draggable Canvas - Interactive Dashboard Builder

A powerful, data-driven canvas component for creating interactive dashboards with draggable, resizable components. Available in both original and shadcn/ui-compatible versions.

## 🎨 Visual Showcase

### Auto-Layout Feature
![Auto Layout](images/auto-layout.png)
*Click the 🧩 Auto-Layout button to instantly organize all components in a structured grid pattern.*

### Auto-Fit Zoom
![Auto Fit Zoom](images/auto-fit-zoom.png)
*The 🎯 Auto-Fit feature automatically zooms to show all components in the viewport.*

### Turnstile Mode
![Turnstile Mode](images/turnstile-mode.png)
*🎠 Turnstile mode arranges overlapping components in a circular pattern for easy navigation.*

### Carousel Mode  
![Carousel Mode](images/carousel-mode.png)
*🎢 Carousel mode provides linear navigation through your components with smooth transitions.*

## 🚀 Features

### Core Functionality
- **Drag & Drop**: Move components freely around the canvas
- **Resize**: Drag corners to resize any component
- **Delete**: Remove components with hover controls
- **Data-Driven**: Configure content via JSON configuration

### Advanced Features
- **Save/Load**: Persist canvas layouts to localStorage
- **Undo/Redo**: Full history tracking with keyboard shortcuts
- **Export**: Download canvas configuration as JSON
- **Keyboard Shortcuts**: Professional workflow support
- **Multiple Chart Types**: Bar, Line, Pie, Donut, and Metrics
- **Rich Notes**: Colored sticky notes with text content
- **Live Websites**: Embed and interact with external websites
- **Turnstile Mode**: Circular arrangement for managing overlapping cards
- **Carousel Mode**: Linear slideshow navigation through components
- **Auto-fit & Auto-layout**: Smart organization and viewport optimization
- **Enhanced Tooltips**: Informative hover tooltips with keyboard shortcuts

## 🚀 Getting Started

### Quick Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/draggable-canvas.git
   cd draggable-canvas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Original Demo: [http://localhost:3000](http://localhost:3000)
   - shadcn Demo: [http://localhost:3000/shadcn-demo](http://localhost:3000/shadcn-demo)

## 📋 Component Versions

This project provides two versions of the canvas component:

### 🔄 Original Dynamic Canvas
- Located in `app/page.tsx`
- Monolithic component with all functionality included
- Perfect for quick prototyping and standalone use
- All features work out of the box

### 🎨 shadcn/ui Compatible Canvas  
- Located in `components/ui/canvas.tsx`
- Follows shadcn/ui patterns and conventions
- Composable architecture with separate components
- Better for design systems and component libraries
- Consistent theming and dark mode support

## 📚 Usage Guide

# Original Dynamic Canvas

### Method 1: Run the Demo Application

The easiest way to get started is to run the included demo:

```bash
npm run dev
```

This will show you a full-featured dashboard with:
- Sample charts (bar, line, pie, metrics)
- Sticky notes with different colors
- Live website embeds
- All interactive features working

### Method 2: Use as a Component

#### Basic Integration

```tsx
import { DynamicCanvas } from './app/page'

function MyApp() {
  return (
    <div>
      <h1>My Dashboard</h1>
      <DynamicCanvas />
    </div>
  )
}
```

#### With Custom Configuration

```tsx
import { DynamicCanvas } from './app/page'

function MyDashboard() {
  const dashboardConfig = {
    charts: [
      {
        type: "bar",
        title: "Monthly Sales",
        data: {
          values: [120, 190, 300, 500, 200],
          labels: ["Jan", "Feb", "Mar", "Apr", "May"]
        },
        x: 50,
        y: 100,
        width: 400,
        height: 300
      }
    ],
    notes: [
      {
        title: "Team Notes",
        content: "Remember to review Q1 results",
        color: "yellow",
        x: 500,
        y: 100,
        width: 300,
        height: 200
      }
    ],
    urls: [
      {
        url: "https://github.com",
        title: "GitHub",
        x: 100,
        y: 450,
        width: 600,
        height: 400
      }
    ]
  }

  return <DynamicCanvas config={dashboardConfig} editable={true} />
}
```

# shadcn/ui Compatible Canvas

### Installation

#### 1. Add Required Dependencies

```bash
npm install @radix-ui/react-tooltip class-variance-authority
```

#### 2. Install shadcn Components

```bash
npx shadcn-ui@latest add button input badge card tooltip
```

#### 3. Use the Canvas Component

The canvas component is already included in `components/ui/canvas.tsx`.

### Basic Usage

```tsx
import { Canvas } from "@/components/ui/canvas"

export function MyCanvas() {
  return (
    <Canvas variant="grid" size="full">
      {/* Your draggable items go here */}
    </Canvas>
  )
}
```

### Advanced Usage with Handlers

```tsx
import { Canvas } from "@/components/ui/canvas"

export function AdvancedCanvas() {
  const handleSave = (config) => {
    console.log('Saving config:', config)
  }

  const handleAddChart = (type) => {
    console.log('Adding chart:', type)
  }

  const handleAddNote = (color) => {
    console.log('Adding note:', color)
  }

  return (
    <Canvas 
      variant="grid"
      size="full"
      showToolbar={true}
      showPalette={true}
      toolbarPosition="top-right"
      palettePosition="left"
      onSave={handleSave}
      onAddChart={handleAddChart}
      onAddNote={handleAddNote}
      className="border-2 border-dashed"
    />
  )
}
```

### Using Individual Components

```tsx
import { 
  Canvas, 
  CanvasToolbar, 
  CanvasPalette 
} from "@/components/ui/canvas"

export function CustomCanvas() {
  return (
    <div className="relative">
      <Canvas variant="minimal" showToolbar={false} showPalette={false}>
        {/* Content */}
      </Canvas>
      
      {/* Custom positioned toolbar */}
      <CanvasToolbar 
        position="top-center"
        onSave={() => {}}
        onLoad={() => {}}
      />
      
      {/* Custom palette */}
      <CanvasPalette 
        position="bottom"
        isOpen={true}
        onAddChart={(type) => console.log('Add chart:', type)}
      />
    </div>
  )
}
```

### shadcn Canvas Variants

#### Canvas Variants

```tsx
// Default gradient background
<Canvas variant="default" />

// Minimal clean background  
<Canvas variant="minimal" />

// Dark theme
<Canvas variant="dark" />

// Grid background
<Canvas variant="grid" />
```

#### Sizes

```tsx
// Full screen height
<Canvas size="full" />

// Minimum screen height with scroll
<Canvas size="default" />

// Compact 600px height
<Canvas size="compact" />
```

#### Toolbar Positions

```tsx
<Canvas toolbarPosition="top-right" />
<Canvas toolbarPosition="top-left" />
<Canvas toolbarPosition="bottom-right" />
<Canvas toolbarPosition="bottom-left" />
<Canvas toolbarPosition="top-center" />
<Canvas toolbarPosition="right-center" />
```

### Theming

The shadcn canvas respects your shadcn/ui theme configuration:

```css
/* In your CSS variables */
:root {
  --background: 0 0% 100%;
  --card: 0 0% 100%;
  --border: 214.3 31.8% 91.4%;
  --muted: 210 40% 98%;
  /* ... other variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --card: 222.2 84% 4.9%;
  --border: 217.2 32.6% 17.5%;
  --muted: 217.2 32.6% 17.5%;
  /* ... other variables */
}
```

## 🎮 Interactive Controls

### Keyboard Shortcuts
- `Ctrl/Cmd + S` - Save canvas to localStorage
- `Ctrl/Cmd + Z` - Undo last action
- `Ctrl/Cmd + Y` - Redo last undone action  
- `Delete` - Remove selected items
- `Ctrl/Cmd + F` - Auto-fit all items in viewport
- `Ctrl/Cmd + Shift + C` - Toggle Carousel mode
- `Ctrl/Cmd + Shift + T` - Toggle Turnstile mode
- `Arrow Keys` - Navigate carousel (when in Carousel mode)

### Mouse Controls
- **Drag**: Click and drag any component to move it
- **Resize**: Drag the blue triangle in bottom-right corner
- **Delete**: Click the red X button that appears on hover
- **Select**: Click on components to select them

### Toolbar Features

| Button | Function | Description |
|--------|----------|-------------|
| 💾 | Save Canvas | Saves current layout to browser storage |
| 📁 | Load Canvas | Loads previously saved layout |
| ↶ | Undo | Undo last change |
| ↷ | Redo | Redo last undone change |
| 🎯 | Auto-fit | Scale and center to show all items |
| 🧩 | Auto-layout | Arrange items in structured grid |
| 🎠 | Turnstile Mode | Arrange items in a circle for easy viewing |
| 🎢 | Carousel Mode | Linear slideshow navigation |
| 📤 | Export Config | Download canvas configuration as JSON |
| 🗑️ | Clear Canvas | Remove all items from canvas |

## 📊 Data Configuration Guide

### Chart Configuration

#### Bar Charts
Perfect for comparing values across categories:

```javascript
{
  type: "bar",
  title: "Sales by Region",
  data: {
    values: [120, 190, 300, 500, 200],
    labels: ["North", "South", "East", "West", "Central"]
  },
  x: 100,      // X position on canvas
  y: 100,      // Y position on canvas  
  width: 400,  // Chart width
  height: 300  // Chart height
}
```

#### Line Charts
Great for showing trends over time:

```javascript
{
  type: "line",
  title: "Monthly Revenue Trend",
  data: {
    values: [1000, 1500, 1200, 2800, 3500, 4200],
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  },
  x: 100,
  y: 100,
  width: 450,
  height: 250
}
```

#### Pie/Donut Charts
Ideal for showing proportions:

```javascript
{
  type: "pie", // or "donut"
  title: "Budget Allocation",
  data: {
    values: [40, 25, 20, 10, 5],
    labels: ["Marketing", "Development", "Sales", "Support", "Other"]
  },
  x: 100,
  y: 100,
  width: 350,
  height: 350
}
```

#### Metrics Dashboard
Display key performance indicators:

```javascript
{
  type: "metrics",
  title: "Business Metrics",
  data: {
    metrics: [
      { label: "Monthly Revenue", value: "$45,200" },
      { label: "New Customers", value: "127" },
      { label: "Conversion Rate", value: "12.5%" },
      { label: "Customer Satisfaction", value: "4.8/5" }
    ]
  },
  x: 100,
  y: 100,
  width: 400,
  height: 250
}
```

### Notes Configuration

Create sticky notes with different colors and content:

```javascript
{
  title: "Meeting Notes",
  content: "Key discussion points:\n• Q4 targets exceeded\n• New product launch planned\n• Team expansion needed",
  color: "yellow", // Options: yellow, blue, green, pink, purple
  x: 100,
  y: 100,
  width: 300,
  height: 250
}
```

#### Available Colors
- **yellow**: Classic sticky note color
- **blue**: Professional, calming
- **green**: Success, positive notes  
- **pink**: Important, attention-grabbing
- **purple**: Creative, brainstorming

### Website Embedding

Embed live, interactive websites directly in your dashboard:

```javascript
{
  url: "https://example.com",
  title: "Live Website Preview",
  x: 100,
  y: 100,
  width: 600,
  height: 400
}
```

## 🔄 Migration Guide

### From Original to shadcn Canvas

If you're migrating from the original `DynamicCanvas` to the shadcn version:

1. **Replace imports:**
   ```tsx
   // Old
   import { DynamicCanvas } from "@/app/page"
   
   // New
   import { Canvas } from "@/components/ui/canvas"
   ```

2. **Update props:**
   ```tsx
   // Old
   <DynamicCanvas config={config} editable={true} showPalette={true} />
   
   // New
   <Canvas config={config} editable={true} showPalette={true} variant="grid" />
   ```

3. **Add event handlers:**
   ```tsx
   // shadcn version requires explicit handlers
   <Canvas 
     onSave={handleSave}
     onLoad={handleLoad}
     onAddChart={handleAddChart}
     onAddNote={handleAddNote}
     onUndo={handleUndo}
     onRedo={handleRedo}
   />
   ```

## 🌟 Publishing as shadcn Component

To make the shadcn canvas available as an installable component:

### Component Registry Entry

```json
{
  "name": "canvas",
  "dependencies": [
    "@radix-ui/react-tooltip",
    "class-variance-authority"
  ],
  "registryDependencies": [
    "button",
    "input", 
    "badge",
    "card",
    "tooltip"
  ],
  "files": ["ui/canvas.tsx"],
  "type": "components:ui"
}
```

### Installation Command

```bash
npx shadcn-ui@latest add canvas
```

## 🎯 Choosing the Right Version

### Use Original Dynamic Canvas When:
- ✅ You want everything to work out of the box
- ✅ You need rapid prototyping
- ✅ You're building a standalone dashboard
- ✅ You don't need extensive theming customization

### Use shadcn Canvas When:
- ✅ You're building a design system
- ✅ You need consistent theming across components
- ✅ You want composable, reusable components
- ✅ You're contributing to open source libraries
- ✅ You need TypeScript-first development experience

## 📈 Benefits Comparison

| Feature | Original Canvas | shadcn Canvas |
|---------|----------------|---------------|
| Setup Time | ⚡ Instant | 🔧 Requires setup |
| Customization | 🎨 Limited | 🎨🎨🎨 Extensive |
| Theme Support | 🌓 Basic | 🌓🌓 Advanced |
| Type Safety | ✅ Good | ✅✅ Excellent |
| Reusability | 📦 Moderate | 📦📦 High |
| Community | 👥 Project-specific | 👥👥 shadcn ecosystem |

## 🚀 Contributing

We welcome contributions to both versions of the canvas component! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Drag and drop with [react-draggable](https://github.com/react-grid-layout/react-draggable)
- Resizing with [react-resizable-box](https://github.com/bokuweb/react-resizable-box)