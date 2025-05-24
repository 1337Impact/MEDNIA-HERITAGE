"use client"

export function GeometricLoader() {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="relative">
        {/* Moroccan geometric pattern loader */}
        <div className="w-8 h-8 relative">
          {/* Outer star */}
          <div className="absolute inset-0 animate-spin">
            <svg viewBox="0 0 32 32" className="w-full h-full">
              <path
                d="M16 2 L20 12 L30 12 L22 18 L26 28 L16 22 L6 28 L10 18 L2 12 L12 12 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-rose-600"
              />
            </svg>
          </div>

          {/* Inner diamond */}
          <div className="absolute inset-2 animate-pulse">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path d="M12 2 L18 8 L12 14 L6 8 Z" fill="currentColor" className="text-red-700" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-rose-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
        <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
        <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
      </div>
    </div>
  )
}
