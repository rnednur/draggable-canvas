import React from 'react'

/**
 * Interface for universal components that can be added to the canvas
 */
export interface UniversalComponentConfig<T = any> {
  /** The React component to render */
  component: React.ComponentType<T>
  /** Default props for the component */
  defaultProps?: Partial<T>
  /** Custom serialization for save/load functionality */
  serialize?: (props: T) => Record<string, any>
  /** Custom deserialization for save/load functionality */
  deserialize?: (data: Record<string, any>) => T
  /** Validation function to ensure props are correct type */
  validate?: (props: any) => props is T
  /** Display name for the component */
  displayName?: string
  /** Description for documentation */
  description?: string
  /** Default dimensions */
  defaultDimensions?: {
    width: number
    height: number
  }
}

/**
 * Component Registry for managing universal components
 */
class ComponentRegistryClass {
  private components = new Map<string, UniversalComponentConfig>()

  /**
   * Register a new component type
   */
  register<T>(type: string, config: UniversalComponentConfig<T>) {
    if (this.components.has(type)) {
      console.warn(`Component type "${type}" is already registered. Overwriting.`)
    }
    
    this.components.set(type, config)
  }

  /**
   * Get a registered component configuration
   */
  get(type: string): UniversalComponentConfig | undefined {
    return this.components.get(type)
  }

  /**
   * Check if a component type is registered
   */
  has(type: string): boolean {
    return this.components.has(type)
  }

  /**
   * Get all registered component types
   */
  getRegisteredTypes(): string[] {
    return Array.from(this.components.keys())
  }

  /**
   * Unregister a component type
   */
  unregister(type: string): boolean {
    return this.components.delete(type)
  }

  /**
   * Clear all registered components
   */
  clear(): void {
    this.components.clear()
  }

  /**
   * Create a component instance with proper error handling
   */
  createComponent(
    type: string, 
    props: any, 
    key?: string
  ): React.ReactElement | null {
    const config = this.get(type)
    
    if (!config) {
      console.error(`Component type "${type}" is not registered`)
      return null
    }

    try {
      // Validate props if validator is provided
      if (config.validate && !config.validate(props)) {
        console.error(`Invalid props for component type "${type}"`, props)
        return null
      }

      // Merge with default props
      const finalProps = { ...config.defaultProps, ...props }

      // Create the component with error boundary
      return React.createElement(
        ComponentErrorBoundary,
        { 
          key, 
          componentType: type,
          children: React.createElement(config.component, finalProps)
        }
      )
    } catch (error) {
      console.error(`Error creating component "${type}":`, error)
      return null
    }
  }

  /**
   * Serialize component props for save functionality
   */
  serializeProps(type: string, props: any): Record<string, any> {
    const config = this.get(type)
    
    if (config?.serialize) {
      return config.serialize(props)
    }
    
    // Default serialization - only include serializable values
    return this.defaultSerialize(props)
  }

  /**
   * Deserialize component props for load functionality
   */
  deserializeProps(type: string, data: Record<string, any>): any {
    const config = this.get(type)
    
    if (config?.deserialize) {
      return config.deserialize(data)
    }
    
    // Default deserialization
    return data
  }

  /**
   * Default serialization that filters out non-serializable values
   */
  private defaultSerialize(obj: any): Record<string, any> {
    const result: Record<string, any> = {}
    
    for (const [key, value] of Object.entries(obj)) {
      if (this.isSerializable(value)) {
        result[key] = value
      }
    }
    
    return result
  }

  /**
   * Check if a value can be safely serialized to JSON
   */
  private isSerializable(value: any): boolean {
    if (value === null || value === undefined) return true
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return true
    if (Array.isArray(value)) return value.every(item => this.isSerializable(item))
    if (typeof value === 'object') {
      try {
        JSON.stringify(value)
        return true
      } catch {
        return false
      }
    }
    return false
  }
}

/**
 * Error boundary component for individual canvas components
 */
interface ComponentErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ComponentErrorBoundary extends React.Component<
  { children: React.ReactNode; componentType: string },
  ComponentErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; componentType: string }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ComponentErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in component "${this.props.componentType}":`, error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return React.createElement(
        'div',
        { className: 'bg-red-50 border border-red-200 rounded-lg p-4 text-red-700' },
        React.createElement('h3', { className: 'font-semibold' }, 'Component Error'),
        React.createElement(
          'p',
          { className: 'text-sm' },
          `Failed to render component "${this.props.componentType}"`
        ),
        this.state.error && React.createElement(
          'details',
          { className: 'mt-2 text-xs' },
          React.createElement('summary', null, 'Error details'),
          React.createElement(
            'pre',
            { className: 'mt-1 overflow-auto' },
            this.state.error.message
          )
        )
      )
    }

    return this.props.children
  }
}

// Export singleton instance
export const ComponentRegistry = new ComponentRegistryClass() 