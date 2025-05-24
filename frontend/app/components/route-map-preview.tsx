"use client"

import { Navigation, MapPin, Clock, ArrowRight, Compass, Info } from "lucide-react"
import { useState } from "react"

interface RouteMapPreviewProps {
  sites: Array<{
    id: string
    name: string
    nameAr: string
    distance: string
    walkingTime: string
    direction: string
    period: string
    description: string
    rating: number
    coordinates: { lat: number; lng: number }
    googleMapsUrl?: string
    visitDuration?: string
    highlights?: string[]
    tips?: string
  }>
  totalDistance?: string
  totalWalkingTime?: string
  estimatedTotalTime?: string
  routeType?: string
}

export function RouteMapPreview({ 
  sites, 
  totalDistance = "1.2km", 
  totalWalkingTime = "15 min", 
  estimatedTotalTime = "2h 30min",
  routeType = "walking"
}: RouteMapPreviewProps) {
  const [selectedSite, setSelectedSite] = useState<number | null>(null)

  const getSiteInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const getRouteColor = (index: number) => {
    const colors = [
      'from-rose-500 to-pink-600',
      'from-blue-500 to-cyan-600',
      'from-emerald-500 to-teal-600',
      'from-amber-500 to-orange-600',
      'from-purple-500 to-indigo-600',
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6 transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-4 text-white">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5" />
          <h3 className="font-semibold text-lg">Heritage Exploration Route</h3>
        </div>
        <p className="text-sm opacity-90 mt-1">Discover the rich heritage of your surroundings</p>
      </div>

      {/* Map Visualization */}
      <div className="relative bg-gradient-to-br from-blue-50 to-teal-50 p-4 h-48 md:h-56">
        {/* Route Path */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>
          </defs>

          {/* Background grid */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Route line */}
          <path
            d={sites.map((_, i) => {
              const x = 40 + (i * (320 / (sites.length - 1 || 1)))
              const y = 100 + (i % 2 === 0 ? -30 : 30) * (i % 3 === 0 ? 1 : -1)
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
            }).join(' ')}
            stroke="url(#routeGradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="0"
            className="drop-shadow-lg"
          />

          {/* Site markers */}
          {sites.map((site, index) => {
            const x = 40 + (index * (320 / (sites.length - 1 || 1)))
            const y = 100 + (index % 2 === 0 ? -30 : 30) * (index % 3 === 0 ? 1 : -1)
            const isSelected = selectedSite === index
            
            return (
              <g 
                key={site.id} 
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={() => setSelectedSite(selectedSite === index ? null : index)}
              >
                <circle 
                  cx={x} 
                  cy={y} 
                  r={isSelected ? "14" : "10"} 
                  fill="white" 
                  stroke={isSelected ? "#e11d48" : "#db2777"} 
                  strokeWidth={isSelected ? "3" : "2"}
                  className="drop-shadow-md transition-all duration-200"
                />
                <text 
                  x={x} 
                  y={y + 5} 
                  textAnchor="middle" 
                  className="text-xs font-bold fill-rose-700 select-none pointer-events-none"
                >
                  {index + 1}
                </text>

                {/* Site info box */}
                {isSelected && (
                  <foreignObject 
                    x={x + (x > 200 ? -180 : 20)} 
                    y={y + (y > 100 ? -80 : 30)}
                    width="180" 
                    height="auto"
                    className="z-10"
                  >
                    <div className="bg-white rounded-lg shadow-lg p-3 text-left">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {site.name.split(" | ")[0]}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">{site.nameAr}</p>
                        </div>
                        <a 
                          href={site.googleMapsUrl || '#'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-rose-600 hover:text-rose-800"
                          onClick={e => e.stopPropagation()}
                        >
                          <MapPin className="w-4 h-4" />
                        </a>
                      </div>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{site.visitDuration || '30-45 min'}</span>
                        <span className="mx-2">•</span>
                        <span>{site.distance} away</span>
                      </div>
                    </div>
                  </foreignObject>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Route Summary */}
      <div className="p-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-rose-50 rounded-lg p-3">
            <div className="text-xs text-rose-700 font-medium flex items-center justify-center">
              <MapPin className="w-3 h-3 mr-1" /> Sites
            </div>
            <div className="text-lg font-bold text-gray-900 mt-1">{sites.length}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs text-blue-700 font-medium flex items-center justify-center">
              <ArrowRight className="w-3 h-3 mr-1" /> Distance
            </div>
            <div className="text-lg font-bold text-gray-900 mt-1">{totalDistance}</div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-3">
            <div className="text-xs text-emerald-700 font-medium flex items-center justify-center">
              <Clock className="w-3 h-3 mr-1" /> Duration
            </div>
            <div className="text-lg font-bold text-gray-900 mt-1">{estimatedTotalTime}</div>
          </div>
        </div>

        {/* Site List */}
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
          {sites.map((site, index) => (
            <div 
              key={site.id} 
              className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${selectedSite === index ? 'bg-rose-50 border-rose-200' : 'hover:bg-gray-50 border-gray-100'}`}
              onClick={() => setSelectedSite(selectedSite === index ? null : index)}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3 ${[
                'bg-gradient-to-br from-rose-500 to-pink-600',
                'bg-gradient-to-br from-blue-500 to-cyan-600',
                'bg-gradient-to-br from-emerald-500 to-teal-600',
                'bg-gradient-to-br from-amber-500 to-orange-600',
                'bg-gradient-to-br from-purple-500 to-indigo-600',
              ][index % 5]}`}>
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {site.name.split(" | ")[0]}
                </h4>
                <div className="flex items-center text-xs text-gray-500 mt-0.5">
                  <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{site.visitDuration || '30-45 min'}</span>
                  <span className="mx-1">•</span>
                  <span className="truncate">{site.distance} away</span>
                </div>
              </div>
              <a 
                href={site.googleMapsUrl || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-rose-600 hover:text-rose-800 ml-2"
                onClick={e => e.stopPropagation()}
              >
                <MapPin className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        {/* Tips */}
        {sites[0]?.tips && (
          <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-800 flex items-start">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 mr-2 text-amber-600" />
            <div>
              <span className="font-medium">Pro Tip:</span> {sites[0].tips}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
