"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, CheckCircle, Plus, X } from "lucide-react"

// Example 1: Todo List Component
interface TodoItem {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

interface TodoListProps {
  title?: string
  items?: TodoItem[]
  maxItems?: number
}

export function TodoListComponent({ 
  title = "Todo List", 
  items = [], 
  maxItems = 10 
}: TodoListProps) {
  const [todos, setTodos] = useState<TodoItem[]>(items)
  const [newTodo, setNewTodo] = useState('')

  const addTodo = () => {
    if (newTodo.trim() && todos.length < maxItems) {
      const todo: TodoItem = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date()
      }
      setTodos([...todos, todo])
      setNewTodo('')
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add new todo..."
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            className="flex-1"
          />
          <Button onClick={addTodo} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {todos.map((todo) => (
            <div 
              key={todo.id} 
              className={`flex items-center gap-2 p-2 rounded border ${
                todo.completed ? 'bg-gray-50 text-gray-500' : 'bg-white'
              }`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="rounded"
              />
              <span className={`flex-1 ${todo.completed ? 'line-through' : ''}`}>
                {todo.text}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteTodo(todo.id)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          {todos.filter(t => !t.completed).length} of {todos.length} remaining
        </div>
      </CardContent>
    </Card>
  )
}

// Example 2: Timer Component
interface TimerProps {
  title?: string
  initialMinutes?: number
  autoStart?: boolean
}

export function TimerComponent({ 
  title = "Timer", 
  initialMinutes = 5, 
  autoStart = false 
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60)
  const [isRunning, setIsRunning] = useState(autoStart)
  const [inputMinutes, setInputMinutes] = useState(initialMinutes)

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const resetTimer = () => {
    setTimeLeft(inputMinutes * 60)
    setIsRunning(false)
  }

  const startStop = () => {
    setIsRunning(!isRunning)
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <div className="text-4xl font-mono font-bold">
          {formatTime(timeLeft)}
        </div>
        
        <div className="flex gap-2 justify-center">
          <Button onClick={startStop} variant={isRunning ? "destructive" : "default"}>
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button onClick={resetTimer} variant="outline">
            Reset
          </Button>
        </div>
        
        <div className="flex items-center gap-2 justify-center">
          <Input
            type="number"
            value={inputMinutes}
            onChange={(e) => setInputMinutes(Number(e.target.value) || 1)}
            className="w-20 text-center"
            min="1"
            max="60"
          />
          <span className="text-sm text-gray-500">minutes</span>
        </div>
        
        {timeLeft === 0 && (
          <Badge variant="destructive" className="animate-pulse">
            Time's Up!
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}

// Example 3: Note Taking Component
interface NoteProps {
  title?: string
  content?: string
  color?: 'yellow' | 'blue' | 'green' | 'pink' | 'purple'
  editable?: boolean
}

export function NoteComponent({ 
  title = "Note", 
  content = "", 
  color = "yellow",
  editable = true 
}: NoteProps) {
  const [noteTitle, setNoteTitle] = useState(title)
  const [noteContent, setNoteContent] = useState(content)
  const [isEditing, setIsEditing] = useState(false)

  const colorClasses = {
    yellow: "bg-yellow-100 border-yellow-300",
    blue: "bg-blue-100 border-blue-300", 
    green: "bg-green-100 border-green-300",
    pink: "bg-pink-100 border-pink-300",
    purple: "bg-purple-100 border-purple-300"
  }

  const saveNote = () => {
    setIsEditing(false)
  }

  if (isEditing && editable) {
    return (
      <Card className={`w-full h-full ${colorClasses[color]}`}>
        <CardHeader className="pb-2">
          <Input
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            className="font-semibold bg-transparent border-0 p-0 focus:ring-0"
            placeholder="Note title..."
          />
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            className="bg-transparent border-0 resize-none focus:ring-0 min-h-32"
            placeholder="Write your note..."
          />
          <div className="flex gap-2">
            <Button onClick={saveNote} size="sm">
              Save
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`w-full h-full ${colorClasses[color]} cursor-pointer group`} onClick={() => editable && setIsEditing(true)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{noteTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap text-sm">
          {noteContent || "Click to add content..."}
        </div>
        {editable && (
          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge variant="outline" className="text-xs">
              Click to edit
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Example 4: Weather Widget (Mock data)
interface WeatherProps {
  city?: string
  temperature?: number
  condition?: string
  humidity?: number
}

export function WeatherComponent({ 
  city = "San Francisco", 
  temperature = 72, 
  condition = "Sunny",
  humidity = 65 
}: WeatherProps) {
  const [currentTime, setCurrentTime] = useState<string>('')

  useEffect(() => {
    // Set time only on client side to avoid hydration mismatch
    setCurrentTime(new Date().toLocaleTimeString())
  }, [])

  const getWeatherEmoji = (condition: string) => {
    const conditions: Record<string, string> = {
      'sunny': '☀️',
      'cloudy': '☁️',
      'rainy': '🌧️',
      'snowy': '❄️',
      'stormy': '⛈️'
    }
    return conditions[condition.toLowerCase()] || '🌤️'
  }

  return (
    <Card className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{getWeatherEmoji(condition)}</span>
          {city}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-3xl font-bold">
          {temperature}°F
        </div>
        
        <div className="text-lg opacity-90">
          {condition}
        </div>
        
        <div className="space-y-1 text-sm opacity-80">
          <div>Humidity: {humidity}%</div>
          <div>Feels like: {temperature + 2}°F</div>
        </div>
        
        {currentTime && (
          <div className="text-xs opacity-60 mt-4">
            Last updated: {currentTime}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Export component configurations for easy registration
export const UNIVERSAL_COMPONENTS = {
  'todo-list': {
    component: TodoListComponent,
    displayName: 'Todo List',
    description: 'Interactive todo list with add/remove/complete functionality',
    defaultDimensions: { width: 300, height: 400 },
    defaultProps: {
      title: 'My Tasks',
      items: [] as TodoItem[],
      maxItems: 10
    },
    validate: (props: any): props is TodoListProps => {
      return typeof props === 'object' && 
             (props.title === undefined || typeof props.title === 'string')
    }
  },
  'timer': {
    component: TimerComponent,
    displayName: 'Timer',
    description: 'Countdown timer with start/stop/reset functionality',
    defaultDimensions: { width: 250, height: 300 },
    defaultProps: {
      title: 'Focus Timer',
      initialMinutes: 25,
      autoStart: false
    }
  },
  'note': {
    component: NoteComponent,
    displayName: 'Sticky Note',
    description: 'Editable sticky note with color options',
    defaultDimensions: { width: 300, height: 250 },
    defaultProps: {
      title: 'Quick Note',
      content: '',
      color: 'yellow',
      editable: true
    }
  },
  'weather': {
    component: WeatherComponent,
    displayName: 'Weather Widget',
    description: 'Weather display widget with temperature and conditions',
    defaultDimensions: { width: 280, height: 200 },
    defaultProps: {
      city: 'San Francisco',
      temperature: 72,
      condition: 'Sunny',
      humidity: 65
    }
  }
} as const 