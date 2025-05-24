import { Clock, MapPin } from "lucide-react"

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

interface ChatMessageProps {
  message: Message
  isAnalyzing?: boolean
}

export function ChatMessage({ message, isAnalyzing = false }: ChatMessageProps) {
  const isUser = message.type === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-xs lg:max-w-md ${isUser ? "order-2" : "order-1"}`}>
        {/* Avatar */}
        <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              isUser ? "bg-gradient-to-br from-teal-500 to-blue-600" : "bg-gradient-to-br from-orange-500 to-red-500"
            }`}
          >
            <span className="text-white text-sm font-medium">{isUser ? "U" : "🏛️"}</span>
          </div>

          <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
            {/* Message Bubble */}
            <div
              className={`rounded-2xl px-4 py-3 shadow-sm ${
                isUser
                  ? "bg-gradient-to-br from-teal-500 to-blue-600 text-white"
                  : "bg-white/90 backdrop-blur-sm text-gray-900"
              } ${isUser ? "rounded-br-md" : "rounded-bl-md"}`}
            >
              {/* Loading state */}
              {isAnalyzing && (
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse delay-300"></div>
                </div>
              )}
              
              {/* Image if present */}
              {message.image && (
                <div className="mb-3">
                  <img
                    src={message.image || "/placeholder.svg"}
                    alt="Shared photo"
                    className="rounded-lg max-w-full h-auto max-h-48 object-cover"
                  />
                </div>
              )}

              {/* Message content */}
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>

              {/* Heritage info badges */}
              {message.heritageInfo && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs opacity-80">
                    <Clock className="w-3 h-3" />
                    <span>{message.heritageInfo.period}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs opacity-80">
                    <MapPin className="w-3 h-3" />
                    <span>Confidence: {Math.round(message.heritageInfo.confidence * 100)}%</span>
                  </div>
                </div>
              )}
            </div>

            {/* Timestamp */}
            <div className={`text-xs text-white/70 mt-1 px-2 ${isUser ? "text-right" : "text-left"}`}>
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
