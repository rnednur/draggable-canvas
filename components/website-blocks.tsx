"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, Star, ShoppingCart, Play, Calendar, MapPin, Users } from "lucide-react"
import { useState } from "react"

export function BlogPostCard() {
  return (
    <Card className="w-80 bg-white border-2 border-gray-200">
      <div className="h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-t-lg"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{"10 Tips for Better Design"}</CardTitle>
        <p className="text-sm text-gray-600">{"Learn the fundamentals of great design with these essential tips..."}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600">John Doe</span>
          </div>
          <div className="flex space-x-4 text-gray-500">
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span className="text-xs">24</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">8</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProductCard() {
  return (
    <Card className="w-64 bg-white border-2 border-gray-200">
      <div className="h-40 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-t-lg flex items-center justify-center">
        <div className="w-20 h-20 bg-white rounded-lg shadow-lg"></div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">Wireless Headphones</h3>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-sm text-gray-600 ml-2">(128)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">$99</span>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function SocialMediaPost() {
  return (
    <Card className="w-72 bg-white border-2 border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback className="bg-gradient-to-r from-pink-400 to-red-400 text-white">SM</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">Sarah Miller</p>
            <p className="text-xs text-gray-500">2 hours ago</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-3">
          {"Just finished an amazing hike! The view from the top was absolutely breathtaking 🏔️ #nature #hiking"}
        </p>
        <div className="h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg mb-3"></div>
        <div className="flex items-center justify-between text-gray-500">
          <div className="flex space-x-4">
            <div className="flex items-center space-x-1 cursor-pointer hover:text-red-500">
              <Heart className="h-4 w-4" />
              <span className="text-xs">42</span>
            </div>
            <div className="flex items-center space-x-1 cursor-pointer hover:text-blue-500">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">12</span>
            </div>
            <div className="flex items-center space-x-1 cursor-pointer hover:text-green-500">
              <Share2 className="h-4 w-4" />
              <span className="text-xs">5</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
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

  return (
    <Card className="bg-white border-2 border-gray-300 overflow-hidden" style={{ width, height: height + 60 }}>
      <CardHeader className="py-2 px-3 bg-gray-100 border-b">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-xs text-gray-600 truncate flex-1">{title}</span>
        </div>
      </CardHeader>
      <div className="relative" style={{ height }}>
        {hasError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-500">
            <div className="text-4xl mb-2">🚫</div>
            <p className="text-sm text-center px-4">This website blocks embedding for security reasons.</p>
            <p className="text-xs text-center px-4 mt-1">Try a different website or visit it directly.</p>
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
            <div className="absolute inset-0 bg-transparent pointer-events-none drag-overlay"></div>
          </>
        )}
      </div>
    </Card>
  )
}

export function WebsitePreview({ url, title }: { url: string; title: string }) {
  return (
    <Card className="w-80 bg-white border-2 border-gray-200 overflow-hidden">
      <CardHeader className="py-2 px-3 bg-gray-50 border-b">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
          <span className="text-xs text-gray-600 truncate flex-1">{title}</span>
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
        <div className="absolute inset-0 bg-transparent pointer-events-none"></div>
      </div>
    </Card>
  )
}
