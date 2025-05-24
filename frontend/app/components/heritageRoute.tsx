"use client"

import { MapPin, Clock, Star, Navigation, ExternalLink, Route } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeritageSite {
  id: string
  name: string
  nameAr: string
  distance: string
  walkingTime: string
  direction: string
  period: string
  description: string
  rating: number
  visitors: string
  coordinates: { lat: number; lng: number }
  googleMapsUrl: string
  visitDuration: string
  highlights: string[]
  tips: string
}

interface HeritageRouteProps {
  sites: HeritageSite[]
  totalDistance: string 
  totalWalkingTime: string
  estimatedTotalTime: string
  routeType: string
}

export function HeritageRoute({ sites, totalDistance, totalWalkingTime, estimatedTotalTime }: HeritageRouteProps) {
  const openInGoogleMaps = (site: HeritageSite) => {
    window.open(site.googleMapsUrl, "_blank")
  }

  const openFullRoute = () => {
    const waypoints = sites.map((site) => `${site.coordinates.lat},${site.coordinates.lng}`).join("|")
    const routeUrl = `https://maps.google.com/maps/dir/${waypoints}/data=!3m1!4b1!4m2!4m1!3e2`
    window.open(routeUrl, "_blank")
  }

  return (
    <div className="mt-4 bg-gradient-to-br from-rose-50 to-red-50 rounded-xl border border-rose-200 overflow-hidden">
      {/* Route Header */}
      <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Route className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold">Heritage Walking Route</h3>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/10 rounded-lg p-2">
            <div className="text-xs opacity-80">Walking Distance</div>
            <div className="font-bold">{totalDistance}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-2">
            <div className="text-xs opacity-80">Walking Time</div>
            <div className="font-bold">{totalWalkingTime}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-2">
            <div className="text-xs opacity-80">Total Visit</div>
            <div className="font-bold">{estimatedTotalTime}</div>
          </div>
        </div>

        <Button
          onClick={openFullRoute}
          className="w-full mt-3 bg-white/20 hover:bg-white/30 text-white border border-white/30"
          size="sm"
        >
          <Navigation className="w-4 h-4 mr-2" />
          Open Complete Route in Google Maps
        </Button>
      </div>

      {/* Route Sites */}
      <div className="p-4">
        <div className="relative">
          {sites.map((site, index) => (
            <div key={site.id} className="relative">
              {/* Connecting Line */}
              {index < sites.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-20 bg-gradient-to-b from-rose-400 to-red-500 z-0"></div>
              )}

              {/* Site Card */}
              <div className="relative bg-white rounded-xl border border-rose-200 p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
                {/* Step Number */}
                <div className="absolute -left-2 top-4 w-12 h-8 bg-gradient-to-r from-rose-600 to-red-700 text-white rounded-full flex items-center justify-center text-sm font-bold z-10">
                  {index + 1}
                </div>

                <div className="ml-8">
                  {/* Site Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1">{site.name}</h4>
                      <p className="text-xs text-gray-600 mb-2">{site.period}</p>

                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>
                            {site.distance} {site.direction}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{site.walkingTime} walk</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current text-amber-500" />
                          <span>{site.rating}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => openInGoogleMaps(site)}
                      size="sm"
                      variant="outline"
                      className="border-rose-300 text-rose-700 hover:bg-rose-50 ml-2"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Maps
                    </Button>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-700 mb-3 leading-relaxed">{site.description}</p>

                  {/* Visit Info */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-rose-50 rounded-lg p-2">
                      <div className="text-xs text-rose-700 font-medium mb-1">Visit Duration</div>
                      <div className="text-xs text-gray-700">{site.visitDuration}</div>
                    </div>
                    <div className="bg-rose-50 rounded-lg p-2">
                      <div className="text-xs text-rose-700 font-medium mb-1">Current Visitors</div>
                      <div className="text-xs text-gray-700">{site.visitors}</div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-3">
                    <div className="text-xs text-rose-700 font-medium mb-2">🎯 Highlights</div>
                    <div className="flex flex-wrap gap-1">
                      {site.highlights.map((highlight, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-medium"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  {site.tips && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
                      <div className="text-xs text-amber-700 font-medium mb-1">💡 Tip</div>
                      <div className="text-xs text-gray-700">{site.tips}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Route Footer */}
        <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-sm font-medium text-emerald-800">Route Complete!</span>
          </div>
          <p className="text-xs text-emerald-700">
            You've explored {sites.length} magnificent heritage sites. Take photos and ask me about any architectural
            details you discover along the way! 📸✨
          </p>
        </div>
      </div>
    </div>
  )
}
