# Draggable Canvas - Interactive Dashboard Builder

A powerful, data-driven canvas component for creating interactive dashboards with draggable, resizable components.

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
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 How to Use

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

### Method 2: Use as a Component Library

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

### Method 3: Customize and Build Your Own

#### Step 1: Create Your Data

```javascript
// data/dashboard-config.js
export const myDashboardConfig = {
  charts: [
    // Bar Chart Example
    {
      type: "bar",
      title: "Revenue by Quarter",
      data: {
        values: [25000, 32000, 28000, 35000],
        labels: ["Q1", "Q2", "Q3", "Q4"]
      },
      x: 50,
      y: 50,
      width: 350,
      height: 250
    },
    
    // Line Chart Example
    {
      type: "line", 
      title: "User Growth",
      data: {
        values: [100, 150, 120, 280, 350, 400],
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
      },
      x: 450,
      y: 50,
      width: 350,
      height: 250
    },
    
    // Pie Chart Example
    {
      type: "pie",
      title: "Market Share",
      data: {
        values: [35, 25, 20, 15, 5],
        labels: ["Product A", "Product B", "Product C", "Product D", "Others"]
      },
      x: 50,
      y: 350,
      width: 300,
      height: 300
    },
    
    // Metrics Dashboard
    {
      type: "metrics",
      title: "Key Performance Indicators",
      data: {
        metrics: [
          { label: "Total Users", value: "12,345" },
          { label: "Revenue", value: "$125.6K" },
          { label: "Conversion Rate", value: "3.2%" },
          { label: "Active Sessions", value: "1,892" }
        ]
      },
      x: 450,
      y: 350,
      width: 350,
      height: 200
    }
  ],
  
  notes: [
    {
      title: "Project Goals",
      content: "1. Increase user engagement by 25%\n2. Launch new feature by Q2\n3. Improve conversion rate",
      color: "blue",
      x: 850,
      y: 50,
      width: 300,
      height: 250
    },
    {
      title: "Team Meeting Notes",
      content: "Discussed quarterly targets and resource allocation for upcoming projects.",
      color: "green", 
      x: 850,
      y: 350,
      width: 300,
      height: 200
    }
  ],
  
  urls: [
    {
      url: "https://analytics.google.com",
      title: "Google Analytics",
      x: 50,
      y: 700,
      width: 500,
      height: 350
    },
    {
      url: "https://github.com/your-repo",
      title: "Project Repository", 
      x: 600,
      y: 700,
      width: 500,
      height: 350
    }
  ]
}
```

#### Step 2: Create Your Dashboard Component

```tsx
// components/MyDashboard.tsx
import { DynamicCanvas } from '../app/page'
import { myDashboardConfig } from '../data/dashboard-config'

export default function MyDashboard() {
  const handleItemsChange = (items) => {
    console.log('Canvas items changed:', items)
    // Save to database, localStorage, etc.
  }

  return (
    <div className="w-full h-screen">
      <header className="bg-gray-100 p-4 border-b">
        <h1 className="text-2xl font-bold">My Business Dashboard</h1>
      </header>
      
      <DynamicCanvas 
        config={myDashboardConfig}
        editable={true}
        onItemsChange={handleItemsChange}
      />
    </div>
  )
}
```

## 🎮 Interactive Controls

### Keyboard Shortcuts
- `Ctrl/Cmd + S` - Save canvas to localStorage
- `Ctrl/Cmd + Z` - Undo last action
- `Ctrl/Cmd + Y` - Redo last undone action  
- `Delete` - Remove selected items

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
| 🎠 | Turnstile Mode | Arrange items in a circle for easy viewing |
| 📤 | Export Config | Download canvas configuration as JSON |
| 🗑️ | Clear Canvas | Remove all items from canvas |

## 📊 Chart Configuration Guide

### Bar Charts
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

### Line Charts
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

### Pie/Donut Charts
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

### Metrics Dashboard
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

## 📝 Notes Configuration

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

### Available Colors
- **yellow**: Classic sticky note color
- **blue**: Professional, calming
- **green**: Success, positive notes  
- **pink**: Important, attention-grabbing
- **purple**: Creative, brainstorming

## 🌐 Website Embedding

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

### Popular Embedding Examples

```javascript
// Google Analytics
{
  url: "https://analytics.google.com", 
  title: "Analytics Dashboard",
  width: 800,
  height: 600
}

// GitHub Repository
{
  url: "https://github.com/your-username/your-repo",
  title: "Project Repository", 
  width: 700,
  height: 500
}

// Monitoring Dashboard
{
  url: "https://your-monitoring-tool.com/dashboard",
  title: "System Monitoring",
  width: 900,
  height: 600
}
```

## 🎠 Turnstile Mode

When your canvas gets crowded, use Turnstile Mode for better organization:

### How to Use
1. **Activate**: Click the 🎠 button in the toolbar
2. **View**: All items arrange in a circle around the center
3. **Focus**: Click any item to bring it to center and enlarge it
4. **Navigate**: Click other items to switch focus
5. **Exit**: Click 🎠 again to return to normal mode

### When to Use Turnstile Mode
- **Crowded Canvas**: Too many overlapping components
- **Presentations**: Showcase components one at a time
- **Review Sessions**: Systematically examine each component
- **Organization**: Get overview of all components

## 💾 Save & Export Options

### Save to Browser Storage
```javascript
// Automatically saves when you click Save button
// Data persists between browser sessions
```

### Export Configuration
```javascript
// Click Export button to download JSON file
// Use this file to recreate the same dashboard later
```

### Programmatic Save
```tsx
const handleSave = (canvasItems) => {
  // Save to your backend
  fetch('/api/dashboard', {
    method: 'POST',
    body: JSON.stringify({ items: canvasItems })
  })
}

<DynamicCanvas onItemsChange={handleSave} />
```

## 🎯 Common Use Cases & Examples

### 1. Business Executive Dashboard

```javascript
const executiveDashboard = {
  charts: [
    {
      type: "metrics",
      title: "Key Performance Indicators", 
      data: {
        metrics: [
          { label: "Monthly Revenue", value: "$2.4M" },
          { label: "Customer Growth", value: "+12%" },
          { label: "Market Share", value: "23%" },
          { label: "Team Size", value: "85" }
        ]
      }
    },
    {
      type: "line",
      title: "Revenue Trend (12 months)",
      data: {
        values: [1.8, 2.1, 1.9, 2.3, 2.0, 2.4, 2.2, 2.6, 2.3, 2.7, 2.4, 2.4],
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      }
    }
  ],
  urls: [
    { url: "https://analytics.google.com", title: "Google Analytics" },
    { url: "https://salesforce.com", title: "CRM Dashboard" }
  ]
}
```

### 2. Development Team Dashboard

```javascript
const devDashboard = {
  charts: [
    {
      type: "bar",
      title: "Sprint Velocity",
      data: {
        values: [23, 28, 31, 27, 35],
        labels: ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5"]
      }
    },
    {
      type: "pie", 
      title: "Bug Distribution",
      data: {
        values: [15, 8, 12, 5],
        labels: ["Frontend", "Backend", "Database", "DevOps"]
      }
    }
  ],
  urls: [
    { url: "https://github.com/your-org/project", title: "GitHub Repository" },
    { url: "https://your-ci-cd.com", title: "CI/CD Pipeline" }
  ],
  notes: [
    {
      title: "Sprint Goals",
      content: "• Complete user authentication\n• Fix critical bugs\n• Deploy to staging",
      color: "blue"
    }
  ]
}
```

### 3. Marketing Campaign Dashboard

```javascript
const marketingDashboard = {
  charts: [
    {
      type: "metrics",
      title: "Campaign Performance",
      data: {
        metrics: [
          { label: "Impressions", value: "1.2M" },
          { label: "Clicks", value: "45.6K" },
          { label: "Conversions", value: "2.3K" },
          { label: "ROI", value: "245%" }
        ]
      }
    },
    {
      type: "donut",
      title: "Traffic Sources", 
      data: {
        values: [40, 25, 20, 15],
        labels: ["Social Media", "Email", "Paid Ads", "Organic"]
      }
    }
  ],
  urls: [
    { url: "https://facebook.com/insights", title: "Facebook Analytics" },
    { url: "https://ads.google.com", title: "Google Ads" }
  ]
}
```

## 🔧 Advanced Customization

### Custom Styling

```tsx
// Wrap the canvas with custom styling
<div className="custom-dashboard">
  <style jsx>{`
    .custom-dashboard {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }
  `}</style>
  <DynamicCanvas config={myConfig} />
</div>
```

### Event Handling

```tsx
function AdvancedDashboard() {
  const handleItemSelect = (itemId) => {
    console.log('Item selected:', itemId)
  }
  
  const handleItemMove = (itemId, x, y) => {
    console.log('Item moved:', itemId, 'to', x, y)
  }
  
  return (
    <DynamicCanvas
      config={myConfig}
      onItemSelect={handleItemSelect}
      onItemMove={handleItemMove}
    />
  )
}
```

## 🔧 Technical Details

- **Framework**: Next.js 15.2.4 with React 19
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks with history tracking
- **Persistence**: localStorage for save/load functionality
- **Export**: JSON configuration download
- **Charts**: Recharts library for data visualization
- **TypeScript**: Full type safety throughout

## 📈 Future Enhancements

- [ ] Real-time collaboration
- [ ] More chart libraries integration
- [ ] Custom component plugins
- [ ] Cloud save/sync
- [ ] Template gallery
- [ ] Mobile responsive design
- [ ] Zoom and pan controls
- [ ] Grid snapping
- [ ] Multi-select operations

---

Built with ❤️ using Next.js, React, and Tailwind CSS 