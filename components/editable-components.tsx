"\"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Heart,
  MessageCircle,
  Share2,
  Star,
  ShoppingCart,
  Play,
  Calendar,
  MapPin,
  Users,
  Edit3,
  Check,
  X,
} from "lucide-react"
import { useState } from "react"

interface EditableBlogPostProps {
  initialData?: {
    title: string
    excerpt: string
    author: string
    likes: number
    comments: number
    bgColor: string
  }
}

export function EditableBlogPost({ initialData }: EditableBlogPostProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [data, setData] = useState({
    title: "10 Tips for Better Design",
    excerpt: "Learn the fundamentals of great design with these essential tips...",
    author: "John Doe",
    likes: 24,
    comments: 8,
    bgColor: "from-purple-400 to-pink-400",
    ...initialData,
  })

  const [editData, setEditData] = useState(data)

  const handleSave = () => {
    setData(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(data)
    setIsEditing(false)
  }

  const bgColorOptions = [
    { name: "Purple-Pink", value: "from-purple-400 to-pink-400" },
    { name: "Blue-Cyan", value: "from-blue-400 to-cyan-400" },
    { name: "Green-Blue", value: "from-green-400 to-blue-500" },
    { name: "Red-Pink", value: "from-red-400 to-pink-500" },
    { name: "Yellow-Orange", value: "from-yellow-400 to-orange-500" },
  ]

  if (isEditing) {
    return (
      <Card className="w-80 bg-white border-2 border-blue-300">
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Edit Blog Post</span>
            <div className="flex space-x-1">
              <Button size="sm" onClick={handleSave} className="h-7 px-2">
                <Check className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel} className="h-7 px-2">
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Input
            placeholder="Title"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="text-sm"
          />

          <Textarea
            placeholder="Excerpt"
            value={editData.excerpt}
            onChange={(e) => setEditData({ ...editData, excerpt: e.target.value })}
            className="text-sm h-20"
          />

          <Input
            placeholder="Author"
            value={editData.author}
            onChange={(e) => setEditData({ ...editData, author: e.target.value })}
            className="text-sm"
          />

          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Likes"
              value={editData.likes}
              onChange={(e) => setEditData({ ...editData, likes: Number.parseInt(e.target.value) || 0 })}
              className="text-sm"
            />
            <Input
              type="number"
              placeholder="Comments"
              value={editData.comments}
              onChange={(e) => setEditData({ ...editData, comments: Number.parseInt(e.target.value) || 0 })}
              className="text-sm"
            />
          </div>

          <div>
            <span className="text-xs text-gray-600">Background:</span>
            <div className="grid grid-cols-2 gap-1 mt-1">
              {bgColorOptions.map((option) => (
                <Button
                  key={option.value}
                  size="sm"
                  variant={editData.bgColor === option.value ? "default" : "outline"}
                  onClick={() => setEditData({ ...editData, bgColor: option.value })}
                  className="text-xs h-6"
                >
                  {option.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-80 bg-white border-2 border-gray-200 group relative">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsEditing(true)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 h-7 px-2"
      >
        <Edit3 className="h-3 w-3" />
      </Button>

      <div className={`h-32 bg-gradient-to-r ${data.bgColor} rounded-t-lg`}></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{data.title}</CardTitle>
        <p className="text-sm text-gray-600">{data.excerpt}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>
                {data.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600">{data.author}</span>
          </div>
          <div className="flex space-x-4 text-gray-500">
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span className="text-xs">{data.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{data.comments}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface EditableProductProps {
  initialData?: {
    name: string
    price: number
    rating: number
    reviews: number
    bgColor: string
  }
}

export function EditableProduct({ initialData }: EditableProductProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [data, setData] = useState({
    name: "Wireless Headphones",
    price: 99,
    rating: 5,
    reviews: 128,
    bgColor: "from-blue-400 to-cyan-400",
    ...initialData,
  })

  const [editData, setEditData] = useState(data)

  const handleSave = () => {
    setData(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(data)
    setIsEditing(false)
  }

  const bgColorOptions = [
    { name: "Blue-Cyan", value: "from-blue-400 to-cyan-400" },
    { name: "Purple-Pink", value: "from-purple-400 to-pink-400" },
    { name: "Green-Blue", value: "from-green-400 to-blue-500" },
    { name: "Red-Pink", value: "from-red-400 to-pink-500" },
    { name: "Yellow-Orange", value: "from-yellow-400 to-orange-500" },
  ]

  if (isEditing) {
    return (
      <Card className="w-64 bg-white border-2 border-blue-300">
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Edit Product</span>
            <div className="flex space-x-1">
              <Button size="sm" onClick={handleSave} className="h-7 px-2">
                <Check className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel} className="h-7 px-2">
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Input
            placeholder="Product Name"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="text-sm"
          />

          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Price"
              value={editData.price}
              onChange={(e) => setEditData({ ...editData, price: Number.parseInt(e.target.value) || 0 })}
              className="text-sm"
            />
            <Input
              type="number"
              placeholder="Reviews"
              value={editData.reviews}
              onChange={(e) => setEditData({ ...editData, reviews: Number.parseInt(e.target.value) || 0 })}
              className="text-sm"
            />
          </div>

          <div>
            <span className="text-xs text-gray-600">Rating (1-5):</span>
            <Input
              type="number"
              min="1"
              max="5"
              value={editData.rating}
              onChange={(e) =>
                setEditData({ ...editData, rating: Math.min(5, Math.max(1, Number.parseInt(e.target.value) || 1)) })
              }
              className="text-sm mt-1"
            />
          </div>

          <div>
            <span className="text-xs text-gray-600">Background:</span>
            <div className="grid grid-cols-1 gap-1 mt-1">
              {bgColorOptions.map((option) => (
                <Button
                  key={option.value}
                  size="sm"
                  variant={editData.bgColor === option.value ? "default" : "outline"}
                  onClick={() => setEditData({ ...editData, bgColor: option.value })}
                  className="text-xs h-6"
                >
                  {option.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-64 bg-white border-2 border-gray-200 group relative">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsEditing(true)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 h-7 px-2"
      >
        <Edit3 className="h-3 w-3" />
      </Button>

      <div className={`h-40 bg-gradient-to-br ${data.bgColor} rounded-t-lg flex items-center justify-center`}>
        <div className="w-20 h-20 bg-white rounded-lg shadow-lg"></div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{data.name}</h3>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < data.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          ))}
          <span className="text-sm text-gray-600 ml-2">({data.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">${data.price}</span>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface EditableSocialPostProps {
  initialData?: {
    author: string
    content: string
    timeAgo: string
    likes: number
    comments: number
    shares: number
    bgColor: string
  }
}

export function EditableSocialPost({ initialData }: EditableSocialPostProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [data, setData] = useState({
    author: "Sarah Miller",
    content: "Just finished an amazing hike! The view from the top was absolutely breathtaking 🏔️ #nature #hiking",
    timeAgo: "2 hours ago",
    likes: 42,
    comments: 12,
    shares: 5,
    bgColor: "from-green-400 to-blue-500",
    ...initialData,
  })

  const [editData, setEditData] = useState(data)

  const handleSave = () => {
    setData(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(data)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <Card className="w-72 bg-white border-2 border-blue-300">
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Edit Social Post</span>
            <div className="flex space-x-1">
              <Button size="sm" onClick={handleSave} className="h-7 px-2">
                <Check className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel} className="h-7 px-2">
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Input
            placeholder="Author Name"
            value={editData.author}
            onChange={(e) => setEditData({ ...editData, author: e.target.value })}
            className="text-sm"
          />

          <Textarea
            placeholder="Post Content"
            value={editData.content}
            onChange={(e) => setEditData({ ...editData, content: e.target.value })}
            className="text-sm h-20"
          />

          <Input
            placeholder="Time ago (e.g., 2 hours ago)"
            value={editData.timeAgo}
            onChange={(e) => setEditData({ ...editData, timeAgo: e.target.value })}
            className="text-sm"
          />

          <div className="grid grid-cols-3 gap-2">
            <Input
              type="number"
              placeholder="Likes"
              value={editData.likes}
              onChange={(e) => setEditData({ ...editData, likes: Number.parseInt(e.target.value) || 0 })}
              className="text-sm"
            />
            <Input
              type="number"
              placeholder="Comments"
              value={editData.comments}
              onChange={(e) => setEditData({ ...editData, comments: Number.parseInt(e.target.value) || 0 })}
              className="text-sm"
            />
            <Input
              type="number"
              placeholder="Shares"
              value={editData.shares}
              onChange={(e) => setEditData({ ...editData, shares: Number.parseInt(e.target.value) || 0 })}
              className="text-sm"
            />
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-72 bg-white border-2 border-gray-200 group relative">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsEditing(true)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 h-7 px-2"
      >
        <Edit3 className="h-3 w-3" />
      </Button>

      <CardHeader className="pb-2">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback className="bg-gradient-to-r from-pink-400 to-red-400 text-white">
              {data.author
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{data.author}</p>
            <p className="text-xs text-gray-500">{data.timeAgo}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-3">{data.content}</p>
        <div className={`h-32 bg-gradient-to-r ${data.bgColor} rounded-lg mb-3`}></div>
        <div className="flex items-center justify-between text-gray-500">
          <div className="flex space-x-4">
            <div className="flex items-center space-x-1 cursor-pointer hover:text-red-500">
              <Heart className="h-4 w-4" />
              <span className="text-xs">{data.likes}</span>
            </div>
            <div className="flex items-center space-x-1 cursor-pointer hover:text-blue-500">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{data.comments}</span>
            </div>
            <div className="flex items-center space-x-1 cursor-pointer hover:text-green-500">
              <Share2 className="h-4 w-4" />
              <span className="text-xs">{data.shares}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Keep the original static components for backward compatibility
export function BlogPostCard() {
  return <EditableBlogPost />
}

export function ProductCard() {
  return <EditableProduct />
}

export function SocialMediaPost() {
  return <EditableSocialPost />
}

export function VideoCard() {
  return (
    <Card className="w-80 bg-white border-2 border-gray-200">
      <div className="relative h-44 bg-gradient-to-br from-red-400 to-pink-500 rounded-t-lg flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-20 rounded-t-lg"></div>
        <Button size="lg" variant="secondary" className="relative z-10 rounded-full w-16 h-16">
          <Play className="h-6 w-6 ml-1" />
        </Button>
        <Badge className="absolute top-2 right-2 bg-red-600">LIVE</Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{"How to Build Amazing UIs"}</h3>
        <p className="text-sm text-gray-600 mb-2">{"Learn the secrets of creating beautiful user interfaces..."}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-blue-500 text-white text-xs">TC</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600">Tech Channel</span>
          </div>
          <span className="text-xs text-gray-500">1.2K views</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function EventCard() {
  return (
    <Card className="w-72 bg-white border-2 border-gray-200">
      <div className="h-32 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-t-lg flex items-center justify-center">
        <Calendar className="h-12 w-12 text-white" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">Design Conference 2024</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>March 15, 2024</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>San Francisco, CA</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>500+ attendees</span>
          </div>
        </div>
        <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700">Register Now</Button>
      </CardContent>
    </Card>
  )
}

export function NewsletterCard() {
  return (
    <Card className="w-80 bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-orange-300 text-white">
      <CardContent className="p-6 text-center">
        <h3 className="font-bold text-xl mb-2">{"Stay Updated!"}</h3>
        <p className="text-sm mb-4 opacity-90">{"Get the latest news and updates delivered straight to your inbox."}</p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 rounded-lg text-gray-800 text-sm"
          />
          <Button className="w-full bg-white text-orange-600 hover:bg-gray-100">Subscribe</Button>
        </div>
        <p className="text-xs mt-3 opacity-75">{"No spam, unsubscribe anytime"}</p>
      </CardContent>
    </Card>
  )
}

export function LiveWebsiteCard({
  url,
  title,
  width = 400,
  height = 300,
}: { url: string; title: string; width?: number; height?: number }) {
  const [hasError, setHasError] = useState(false)

  const openUrl = () => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Card className="bg-white border-2 border-gray-300 overflow-hidden group relative" style={{ width, height: height + 60 }}>
      <CardHeader className="py-2 px-3 bg-gray-100 border-b">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-xs text-gray-600 truncate flex-1 cursor-pointer hover:text-blue-600" onClick={openUrl}>
            {title}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={openUrl}
            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 px-2 text-xs"
          >
            Open
          </Button>
        </div>
      </CardHeader>
      <div className="relative" style={{ height }}>
        {hasError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-500">
            <div className="text-4xl mb-2">🚫</div>
            <p className="text-sm text-center px-4">This website blocks embedding for security reasons.</p>
            <p className="text-xs text-center px-4 mt-1">Try a different website or visit it directly.</p>
            <Button
              size="sm"
              onClick={openUrl}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Open in New Tab
            </Button>
          </div>
        ) : (
          <>
            <iframe
              src={url}
              className="w-full h-full border-0"
              title={title}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              loading="lazy"
              onError={() => setHasError(true)}
            />
            <div 
              className="absolute inset-0 bg-transparent pointer-events-none drag-overlay group-hover:pointer-events-auto group-hover:bg-blue-500 group-hover:bg-opacity-10 cursor-pointer transition-all duration-200"
              onClick={openUrl}
              title={`Click to open ${title} in new tab`}
            ></div>
          </>
        )}
      </div>
    </Card>
  )
}

export function WebsitePreview({ url, title }: { url: string; title: string }) {
  const openUrl = () => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Card className="w-80 bg-white border-2 border-gray-200 overflow-hidden group relative">
      <CardHeader className="py-2 px-3 bg-gray-50 border-b">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
          <span className="text-xs text-gray-600 truncate flex-1 cursor-pointer hover:text-blue-600" onClick={openUrl}>
            {title}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={openUrl}
            className="opacity-0 group-hover:opacity-100 transition-opacity h-5 px-2 text-xs"
          >
            Open
          </Button>
        </div>
      </CardHeader>
      <div className="relative h-60">
        <iframe
          src={url}
          className="w-full h-full border-0 scale-75 origin-top-left"
          title={title}
          sandbox="allow-scripts allow-same-origin"
          loading="lazy"
          style={{ width: "133.33%", height: "133.33%" }}
        />
        <div 
          className="absolute inset-0 bg-transparent pointer-events-none group-hover:pointer-events-auto group-hover:bg-blue-500 group-hover:bg-opacity-10 cursor-pointer transition-all duration-200"
          onClick={openUrl}
          title={`Click to open ${title} in new tab`}
        ></div>
      </div>
    </Card>
  )
}

// Data Analysis Components
export function ChartCard() {
  return (
    <Card className="w-80 bg-white border-2 border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Sales Analytics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-40 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-4 flex items-end space-x-2">
          {/* Simple bar chart visualization */}
          <div className="flex items-end space-x-1 h-full">
            <div className="w-8 bg-blue-400 rounded-t" style={{ height: '60%' }}></div>
            <div className="w-8 bg-blue-500 rounded-t" style={{ height: '80%' }}></div>
            <div className="w-8 bg-blue-600 rounded-t" style={{ height: '45%' }}></div>
            <div className="w-8 bg-blue-700 rounded-t" style={{ height: '90%' }}></div>
            <div className="w-8 bg-blue-800 rounded-t" style={{ height: '70%' }}></div>
          </div>
          <div className="flex-1 text-right">
            <p className="text-2xl font-bold text-blue-700">$24.5K</p>
            <p className="text-sm text-gray-600">This Month</p>
          </div>
        </div>
        <div className="mt-3 flex justify-between text-sm text-gray-600">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function MetricsCard() {
  return (
    <Card className="w-72 bg-white border-2 border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span>Key Metrics</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">1,234</p>
            <p className="text-xs text-gray-600">Active Users</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">89.2%</p>
            <p className="text-xs text-gray-600">Conversion</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">$45.6K</p>
            <p className="text-xs text-gray-600">Revenue</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">2.4s</p>
            <p className="text-xs text-gray-600">Load Time</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function KPICard() {
  return (
    <Card className="w-64 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-2 border-indigo-300">
      <CardContent className="p-6 text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
            <div className="text-2xl">📊</div>
          </div>
          <h3 className="font-bold text-xl mb-1">Monthly Growth</h3>
          <p className="text-3xl font-bold">+23.5%</p>
        </div>
        <div className="space-y-2 text-sm opacity-90">
          <div className="flex justify-between">
            <span>Target:</span>
            <span>20%</span>
          </div>
          <div className="flex justify-between">
            <span>Achieved:</span>
            <span>23.5%</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{ width: '117.5%' }}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function DataTableCard() {
  return (
    <Card className="w-96 bg-white border-2 border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-500 rounded"></div>
          <span>Recent Transactions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-gray-600 border-b pb-2">
            <span>Date</span>
            <span>Customer</span>
            <span>Amount</span>
            <span>Status</span>
          </div>
          {[
            { date: "Dec 7", customer: "John D.", amount: "$124.50", status: "Paid", statusColor: "bg-green-100 text-green-800" },
            { date: "Dec 6", customer: "Sarah M.", amount: "$89.99", status: "Pending", statusColor: "bg-yellow-100 text-yellow-800" },
            { date: "Dec 5", customer: "Mike R.", amount: "$234.00", status: "Paid", statusColor: "bg-green-100 text-green-800" },
            { date: "Dec 4", customer: "Lisa K.", amount: "$67.25", status: "Failed", statusColor: "bg-red-100 text-red-800" },
          ].map((row, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 text-xs py-2 border-b border-gray-100">
              <span className="text-gray-600">{row.date}</span>
              <span className="font-medium">{row.customer}</span>
              <span className="font-semibold">{row.amount}</span>
              <Badge className={`text-xs px-2 py-1 ${row.statusColor}`}>
                {row.status}
              </Badge>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-xs">
          View All Transactions
        </Button>
      </CardContent>
    </Card>
  )
}
