"use client";

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] sm:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-3 rounded-2xl shadow-sm bg-white/95 backdrop-blur-sm text-gray-800 border border-rose-200/50">
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 bg-gradient-to-r from-rose-600 to-red-700 rounded-full flex items-center justify-center p-1">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-rose-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
          <span className="text-xs text-gray-500 ml-2">typing...</span>
        </div>
      </div>
    </div>
  );
} 