export function GeometricLoader() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="relative w-8 h-8">
        {/* Outer rotating ring with zellige-inspired pattern */}
        <div className="absolute inset-0 border-2 border-teal-200 rounded-full animate-spin">
          <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-teal-500 rounded-full transform -translate-x-1/2 -translate-y-0.5"></div>
          <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full transform -translate-x-1/2 translate-y-0.5"></div>
        </div>

        {/* Inner geometric pattern */}
        <div className="absolute inset-1 border border-blue-300 rounded-full animate-pulse">
          <div className="absolute inset-0.5 bg-gradient-to-br from-teal-400 to-blue-400 rounded-full opacity-20 animate-ping"></div>
        </div>

        {/* Center star pattern - zellige inspired */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-gradient-to-br from-teal-500 to-blue-600 transform rotate-45 animate-bounce"></div>
        </div>
      </div>

      <div className="ml-3 text-sm text-gray-600">Analyzing heritage...</div>
    </div>
  )
}
