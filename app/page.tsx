"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Camera, Send, ImageIcon, X, Sparkles, MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GeometricLoader } from "@/components/geometric-loader"
import { ChatMessage } from "@/components/chat-message"
import { PhotoMenu } from "@/components/photo-menu"
import { LocationButton } from "@/components/location-button"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  image?: string
  timestamp: Date
  heritageInfo?: {
    title: string
    period: string
    description: string
    significance: string
    location: string
    tips: string[]
    relatedElements: string[]
    confidence: number
  }
}

interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
}

export default function MedinaGuide() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content:
        "مرحبا! Welcome to your personal Medina heritage guide. Share a photo of any architectural detail, doorway, or decoration and I'll tell you its story and significance. You can also explore heritage sites around your current location! 🏛️",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showPhotoMenu, setShowPhotoMenu] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
    setTimeout(scrollToBottom, 100)
  }

  const getCurrentLocation = useCallback(async () => {
    setIsLocating(true)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        })
      })

      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      }

      setCurrentLocation(locationData)

      addMessage({
        type: "assistant",
        content: `📍 **Location Found!**

**Coordinates:** ${locationData.latitude.toFixed(6)}, ${locationData.longitude.toFixed(6)}
**Accuracy:** ±${Math.round(locationData.accuracy)}m

I've pinpointed your location! Now you can explore the heritage sites around you. Click "Explore Surrounding" to discover what historical treasures are nearby! 🗺️`,
      })
    } catch (error) {
      let errorMessage = "I couldn't access your location. "

      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please enable location permissions in your browser settings."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable."
            break
          case error.TIMEOUT:
            errorMessage += "Location request timed out. Please try again."
            break
        }
      }

      addMessage({
        type: "assistant",
        content: `❌ ${errorMessage}

You can still use the app by taking photos of heritage elements around you! 📸`,
      })
    } finally {
      setIsLocating(false)
    }
  }, [])

  const exploreSurrounding = useCallback(async () => {
    if (!currentLocation) {
      addMessage({
        type: "assistant",
        content: "Please use 'Locate Me' first to find heritage sites around you! 📍",
      })
      return
    }

    setIsAnalyzing(true)

    addMessage({
      type: "assistant",
      content: "🔍 Searching for heritage sites around you...",
    })

    // Simulate API call to heritage database
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock heritage sites near Fes medina (you would replace this with real API data)
    const nearbyHeritage = [
      {
        name: "Bab Boujloud (Blue Gate)",
        distance: "150m",
        direction: "Northeast",
        period: "1913 (Alaouite Dynasty)",
        description: "The iconic blue and green tiled gateway to Fes el-Bali",
      },
      {
        name: "Al-Attarine Madrasa",
        distance: "300m",
        direction: "East",
        period: "1323-1325 (Marinid Dynasty)",
        description: "Exquisite example of Marinid architecture with intricate zellige work",
      },
      {
        name: "Chouara Tannery",
        distance: "450m",
        direction: "Southeast",
        period: "11th Century",
        description: "One of the oldest leather tanneries in the world, still operating today",
      },
    ]

    const heritageList = nearbyHeritage
      .map(
        (site) =>
          `🏛️ **${site.name}**
📏 ${site.distance} ${site.direction}
📅 ${site.period}
${site.description}`,
      )
      .join("\n\n")

    addMessage({
      type: "assistant",
      content: `🗺️ **Heritage Sites Near You**

${heritageList}

Take a photo of any of these sites or their architectural details to learn more about their history and significance! You can also ask me specific questions about what you see. 📸✨`,
    })

    setIsAnalyzing(false)
  }, [currentLocation])

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setShowCamera(true)
        setShowPhotoMenu(false)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
    setShowCamera(false)
  }, [])

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL("image/jpeg")
        stopCamera()

        addMessage({
          type: "user",
          content: "What can you tell me about this?",
          image: imageData,
        })

        analyzeImage(imageData)
      }
    }
  }, [stopCamera])

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        setShowPhotoMenu(false)

        addMessage({
          type: "user",
          content: "What can you tell me about this?",
          image: imageData,
        })

        analyzeImage(imageData)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true)

    const loadingMessage: Message = {
      id: "loading",
      type: "assistant",
      content: "Analyzing your photo...",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, loadingMessage])

    await new Promise((resolve) => setTimeout(resolve, 3000))

    setMessages((prev) => prev.filter((msg) => msg.id !== "loading"))

    const mockHeritageInfo = {
      title: "Zellige Tilework",
      period: "10th Century - Present",
      description:
        "This is a beautiful example of traditional Moroccan zellige tilework. Each tile is hand-cut from clay and glazed in vibrant colors, creating intricate geometric patterns that have adorned Moroccan architecture for over a millennium.",
      significance:
        "These geometric patterns reflect Islamic artistic principles, avoiding figurative representation while creating infinite, meditative designs that symbolize the unity and continuity of creation.",
      location: "Found throughout Moroccan palaces, mosques, and traditional houses",
      tips: [
        "Notice how each tile is slightly different - they're all hand-cut",
        "The patterns create optical illusions of movement",
        "This blue and white combination is called 'Fassi' style",
      ],
      relatedElements: ["Tadelakt plaster", "Cedar wood carvings", "Horseshoe arches"],
      confidence: 0.92,
    }

    addMessage({
      type: "assistant",
      content: `I can see this is **${mockHeritageInfo.title}** from the **${mockHeritageInfo.period}**! 

${mockHeritageInfo.description}

**Cultural Significance:**
${mockHeritageInfo.significance}

**What to look for:**
${mockHeritageInfo.tips.map((tip) => `• ${tip}`).join("\n")}

Would you like to know more about any specific aspect of this tilework? 🎨`,
      heritageInfo: mockHeritageInfo,
    })

    setIsAnalyzing(false)
  }

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      addMessage({
        type: "user",
        content: inputValue,
      })

      setTimeout(() => {
        addMessage({
          type: "assistant",
          content:
            "That's a great question! I'd be happy to help you learn more about Moroccan heritage. Feel free to share a photo of any architectural element you'd like to explore, or ask me about specific aspects of what you've already discovered. 🏛️",
        })
      }, 1000)

      setInputValue("")
    }
  }

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* Zellige Background */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `url('/images/zellige-patter.png')`,
          backgroundSize: "400px 400px",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-teal-800/80 to-green-900/80" />

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-teal-200 relative z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Heritage Guide</h1>
              <p className="text-sm text-gray-600">Your AI Medina companion</p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 relative z-10">
        <div className="max-w-md mx-auto space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isAnalyzing && (
            <div className="flex justify-start">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 max-w-xs shadow-sm">
                <GeometricLoader />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Camera View Overlay */}
      {showCamera && (
        <div className="absolute inset-0 bg-black z-50 flex flex-col">
          <div className="flex-1 relative">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-4 border-2 border-white/30 rounded-lg pointer-events-none">
              <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-white/60"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-white/60"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-white/60"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-white/60"></div>
            </div>
          </div>

          <div className="p-6 bg-black/50 backdrop-blur-sm">
            <div className="max-w-md mx-auto flex items-center justify-center gap-6">
              <Button
                onClick={stopCamera}
                variant="outline"
                size="lg"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <X className="w-5 h-5 mr-2" />
                Cancel
              </Button>

              <Button onClick={capturePhoto} size="lg" className="bg-white text-black hover:bg-gray-100 px-8">
                <Camera className="w-5 h-5 mr-2" />
                Capture
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white/95 backdrop-blur-sm border-t border-teal-200 p-4 relative z-10">
        <div className="max-w-md mx-auto space-y-3">
          {/* Location Buttons */}
          <div className="flex gap-2">
            <LocationButton
              onClick={getCurrentLocation}
              isLoading={isLocating}
              icon={<MapPin className="w-4 h-4" />}
              text="Locate Me"
              variant="outline"
              className="flex-1"
            />
            <LocationButton
              onClick={exploreSurrounding}
              isLoading={false}
              icon={<Navigation className="w-4 h-4" />}
              text="Explore Surrounding"
              variant="default"
              className="flex-1"
              disabled={!currentLocation}
            />
          </div>

          {/* Chat Input */}
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about Moroccan heritage..."
                className="pr-12 bg-white/80 border-teal-200 focus:border-teal-400"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button
                onClick={() => setShowPhotoMenu(!showPhotoMenu)}
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-teal-100"
              >
                <ImageIcon className="w-4 h-4 text-teal-600" />
              </Button>
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white h-10 w-10 p-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Photo Menu */}
          <PhotoMenu
            isOpen={showPhotoMenu}
            onClose={() => setShowPhotoMenu(false)}
            onTakePhoto={startCamera}
            onUploadPhoto={() => fileInputRef.current?.click()}
          />
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
