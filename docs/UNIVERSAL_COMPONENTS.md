# Universal Component System

The Draggable Canvas now supports a powerful universal component system that allows you to add **any React component** to the canvas while maintaining full drag, resize, save/load, and export functionality.

## 🎯 Overview

The universal component system provides:
- **Type-safe component registration**
- **Automatic serialization/deserialization** for save/load
- **Error boundaries** for component safety
- **Easy integration** with existing canvas features
- **Backwards compatibility** with existing components

## 🚀 Quick Start

### 1. Using Built-in Universal Components

```tsx
const config = {
  universal: {
    'todo-list': [
      {
        props: {
          title: 'My Tasks',
          items: [
            { id: '1', text: 'Learn universal components', completed: false }
          ]
        },
        x: 100,
        y: 100,
        width: 300,
        height: 400
      }
    ],
    'timer': [
      {
        props: {
          title: 'Focus Timer',
          initialMinutes: 25
        },
        x: 450,
        y: 100
      }
    ]
  }
}

<DynamicCanvas config={config} />
```

### 2. Creating Your Own Universal Component

```tsx
// 1. Create your component
interface MyWidgetProps {
  title: string
  count: number
  color: 'red' | 'blue' | 'green'
}

function MyWidget({ title, count, color }: MyWidgetProps) {
  return (
    <Card className={`w-full h-full bg-${color}-50`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
      </CardContent>
    </Card>
  )
}

// 2. Register your component
import { ComponentRegistry } from '@/lib/component-registry'

ComponentRegistry.register('my-widget', {
  component: MyWidget,
  displayName: 'My Widget',
  description: 'A simple counter widget',
  defaultDimensions: { width: 250, height: 200 },
  defaultProps: {
    title: 'Counter',
    count: 0,
    color: 'blue'
  },
  validate: (props: any): props is MyWidgetProps => {
    return typeof props.title === 'string' && 
           typeof props.count === 'number'
  }
})

// 3. Use in config
const config = {
  universal: {
    'my-widget': [
      {
        props: {
          title: 'Sales Count',
          count: 142,
          color: 'green'
        },
        x: 100,
        y: 100
      }
    ]
  }
}
```

## 📚 Built-in Universal Components

### Todo List (`todo-list`)

Interactive todo list with add/remove/complete functionality.

```tsx
universal: {
  'todo-list': [
    {
      props: {
        title: 'Sprint Tasks',
        items: [
          { id: '1', text: 'Task 1', completed: false },
          { id: '2', text: 'Task 2', completed: true }
        ],
        maxItems: 10
      },
      x: 100,
      y: 100,
      width: 300,
      height: 400
    }
  ]
}
```

**Props:**
- `title?: string` - Widget title
- `items?: TodoItem[]` - Initial todo items
- `maxItems?: number` - Maximum number of todos

### Timer (`timer`)

Countdown timer with start/stop/reset functionality.

```tsx
universal: {
  'timer': [
    {
      props: {
        title: 'Focus Timer',
        initialMinutes: 25,
        autoStart: false
      },
      x: 100,
      y: 100,
      width: 250,
      height: 300
    }
  ]
}
```

**Props:**
- `title?: string` - Timer title
- `initialMinutes?: number` - Starting time in minutes
- `autoStart?: boolean` - Whether to start automatically

### Note (`note`)

Editable sticky note with color options.

```tsx
universal: {
  'note': [
    {
      props: {
        title: 'Meeting Notes',
        content: 'Important points from today...',
        color: 'yellow',
        editable: true
      },
      x: 100,
      y: 100,
      width: 300,
      height: 250
    }
  ]
}
```

**Props:**
- `title?: string` - Note title
- `content?: string` - Note content
- `color?: 'yellow' | 'blue' | 'green' | 'pink' | 'purple'` - Note color
- `editable?: boolean` - Whether the note can be edited

### Weather (`weather`)

Weather display widget with temperature and conditions.

```tsx
universal: {
  'weather': [
    {
      props: {
        city: 'San Francisco',
        temperature: 72,
        condition: 'Sunny',
        humidity: 65
      },
      x: 100,
      y: 100,
      width: 280,
      height: 200
    }
  ]
}
```

**Props:**
- `city?: string` - City name
- `temperature?: number` - Temperature in Fahrenheit
- `condition?: string` - Weather condition
- `humidity?: number` - Humidity percentage

## 🔧 Advanced Usage

### Custom Serialization

For components with complex state or non-serializable props:

```tsx
ComponentRegistry.register('my-complex-widget', {
  component: MyComplexWidget,
  serialize: (props) => ({
    // Only serialize what's needed
    title: props.title,
    data: props.data.map(item => ({ id: item.id, value: item.value }))
  }),
  deserialize: (data) => ({
    // Reconstruct props from serialized data
    title: data.title,
    data: data.data.map(item => new DataModel(item.id, item.value))
  })
})
```

### Validation

Add prop validation to catch errors early:

```tsx
ComponentRegistry.register('validated-widget', {
  component: MyWidget,
  validate: (props: any): props is MyWidgetProps => {
    return typeof props.title === 'string' &&
           typeof props.count === 'number' &&
           props.count >= 0 &&
           ['red', 'blue', 'green'].includes(props.color)
  }
})
```

### Error Handling

Components are automatically wrapped in error boundaries. If a component crashes, it shows a helpful error message instead of breaking the entire canvas.

## 🎨 Component Development Best Practices

### 1. Make Components Responsive

```tsx
function ResponsiveWidget({ title }: { title: string }) {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="truncate">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        {/* Content that adapts to container size */}
      </CardContent>
    </Card>
  )
}
```

### 2. Handle Props Gracefully

```tsx
function RobustWidget({ 
  title = "Default Title",
  data = [],
  onUpdate = () => {}
}: WidgetProps) {
  // Always provide defaults and handle edge cases
  if (!data.length) {
    return <div>No data available</div>
  }
  
  // Component logic...
}
```

### 3. Use Semantic Sizing

```tsx
ComponentRegistry.register('my-widget', {
  component: MyWidget,
  defaultDimensions: { 
    width: 300,   // Enough for content
    height: 250   // Reasonable aspect ratio
  }
})
```

### 4. Optimize for Performance

```tsx
import { memo } from 'react'

const OptimizedWidget = memo(function MyWidget(props: WidgetProps) {
  // Component implementation
})

ComponentRegistry.register('optimized-widget', {
  component: OptimizedWidget
})
```

## 🔄 Migration from Legacy Components

If you have existing custom components, migration is straightforward:

### Before (Legacy)
```tsx
const config = {
  components: [
    {
      type: 'my-custom-type',
      props: { title: 'My Component' }
    }
  ]
}
```

### After (Universal)
```tsx
// Register once
ComponentRegistry.register('my-custom-type', {
  component: MyCustomComponent
})

// Use in config
const config = {
  universal: {
    'my-custom-type': [
      {
        props: { title: 'My Component' }
      }
    ]
  }
}
```

## 🐛 Troubleshooting

### Component Not Rendering

1. **Check Registration**: Ensure the component is registered before use
2. **Verify Props**: Check that props match the component's interface
3. **Console Errors**: Look for validation or runtime errors

### Serialization Issues

1. **Avoid Functions**: Don't include functions in props
2. **Simple Objects**: Keep props serializable (strings, numbers, plain objects)
3. **Custom Serialization**: Use serialize/deserialize for complex data

### Performance Issues

1. **Memoization**: Use `React.memo()` for expensive components
2. **Prop Optimization**: Avoid creating new objects in props
3. **Lazy Loading**: Consider lazy loading for heavy components

## 📖 API Reference

### ComponentRegistry

#### `register<T>(type: string, config: UniversalComponentConfig<T>)`
Register a new component type.

#### `get(type: string): UniversalComponentConfig | undefined`
Get a registered component configuration.

#### `createComponent(type: string, props: any, key?: string): React.ReactElement | null`
Create a component instance with error handling.

#### `serializeProps(type: string, props: any): Record<string, any>`
Serialize component props for save functionality.

#### `deserializeProps(type: string, data: Record<string, any>): any`
Deserialize component props for load functionality.

### UniversalComponentConfig<T>

```tsx
interface UniversalComponentConfig<T = any> {
  component: React.ComponentType<T>
  defaultProps?: Partial<T>
  serialize?: (props: T) => Record<string, any>
  deserialize?: (data: Record<string, any>) => T
  validate?: (props: any) => props is T
  displayName?: string
  description?: string
  defaultDimensions?: { width: number; height: number }
}
```

## 🎉 Examples

Check out the demo at `http://localhost:3000` to see all universal components in action!

The demo includes:
- ✅ Todo list with interactive tasks
- ⏱️ Countdown timer with controls  
- 📝 Editable sticky notes
- 🌤️ Weather widgets for multiple cities
- 📊 All existing chart types
- 🌐 Website embeds

Try dragging, resizing, saving, and exporting to see how everything works together seamlessly! 