"use client";

import { Clock, Star } from "lucide-react";
import MarkdownPreview from "@uiw/react-markdown-preview";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  image?: string;
  timestamp: Date;
  heritageInfo?: {
    title: string;
    period: string;
    description: string;
    significance: string;
    location: string;
    tips: string[];
    relatedElements: string[];
    confidence: number;
  };
  heritageRoute?: {
    sites: any[]; // Replace 'any' with a more specific type if possible
    totalDistance: number;
    totalWalkingTime: number;
    estimatedTotalTime: number;
    routeType: string;
  };
}

interface ChatMessageProps {
  message: Message;
  isAnalyzing?: boolean;
}

export function ChatMessage({
  message,
  isAnalyzing = false,
}: ChatMessageProps) {
  const isUser = message.type === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] sm:max-w-md lg:max-w-lg xl:max-w-xl px-3 sm:px-4 py-3 rounded-2xl shadow-sm ${
          isUser
            ? "bg-gradient-to-r from-rose-600 to-red-700 text-white"
            : "bg-white/95 backdrop-blur-sm text-gray-800 border border-rose-200/50"
        }`}
      >
        {message.image && (
          <div className="mb-3">
            <img
              src={message.image || "/placeholder.svg"}
              alt="Uploaded heritage photo"
              className="w-full h-32 sm:h-48 object-cover rounded-lg border-2 border-amber-200/50"
            />
          </div>
        )}
        {message.content && (
          <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">
            <MarkdownPreview
              source={message.content}
              style={{
                backgroundColor: "transparent",
                padding: "4px",
                color: "inherit",
                fontSize: "inherit",
                lineHeight: "inherit",
                fontFamily: "inherit",
              }}
            />
          </div>
        )}

        {message.heritageInfo && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-br from-rose-50 to-red-50 rounded-xl border border-rose-200">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-rose-600 to-red-700 rounded-full flex items-center justify-center">
                <Star className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
              </div>
              <span className="text-xs font-semibold text-rose-700 uppercase tracking-wide">
                Heritage Details
              </span>
              <div className="ml-auto flex items-center gap-1 text-xs text-rose-600">
                <span>
                  {Math.round(message.heritageInfo.confidence * 100)}% confident
                </span>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3 text-xs">
              <div>
                <h4 className="font-semibold text-rose-800 mb-1">
                  📍 Location
                </h4>
                <p className="text-gray-700">{message.heritageInfo.location}</p>
              </div>

              <div>
                <h4 className="font-semibold text-rose-800 mb-1">
                  🏛️ Related Elements
                </h4>
                <div className="flex flex-wrap gap-1">
                  {message.heritageInfo.relatedElements.map(
                    (element, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-medium"
                      >
                        {element}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className={`flex items-center gap-2 mt-2 text-xs ${
            isUser ? "text-rose-100" : "text-gray-500"
          }`}
        >
          <Clock className="w-3 h-3" />
          <span>
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
