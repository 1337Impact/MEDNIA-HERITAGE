'use client';

import { MapPin, Clock, ArrowRight, Users, Star, Info, Moon, Ruler, Compass, Calendar } from "lucide-react";
import Link from "next/link";

// Moroccan-inspired patterns
const moroccanPatterns = [
  'bg-[url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")]',
  'bg-[url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 30v12h12l-5-5 5 5h16l-5-5 5 5h12V30l-5 5 5-5H30l5 5-5-5H12l5 5-5-5H0z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")]',
  'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l-5.374 5.373 5.374 5.373-5.374 5.373 5.374 5.373-5.374 5.373 5.374 5.373-5.374 5.373 5.374 5.373-5.374 5.373 5.374 5.373-5.374 5.373L49.253 60l-5.374-5.373L38.506 60l-5.374-5.373L27.759 60l-5.374-5.373L17.012 60l-5.374-5.373L6.266 60 .892 54.627l5.374-5.373L.892 43.88l5.374-5.373L.892 33.134l5.374-5.373L.892 22.388l5.374-5.373L.892 11.642l5.374-5.373L.892.896 6.266-4.477l5.374 5.373L17.013-4.48l5.374 5.373L27.76-4.48l5.374 5.373L38.506-4.48l5.374 5.373L49.254-4.48l5.373 5.373z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")]',
];

const getPattern = (index: number) => {
  return moroccanPatterns[index % moroccanPatterns.length];
};

interface RouteStop {
  id: string;
  name: string;
  nameAr: string;
  period: string;
  description: string;
  rating: number;
  visitors: string;
  visitDuration: string;
  highlights: string[];
  tips: string;
  googleMapsUrl: string;
  distance: string;
  walkingTime: string;
  direction: string;
}

interface RouteCardProps {
  stops: RouteStop[];
  totalDistance: string;
  totalWalkingTime: string;
  estimatedTotalTime: string;
}

export function RouteCard({ stops, totalDistance, totalWalkingTime, estimatedTotalTime }: RouteCardProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-amber-900/90 via-amber-800/80 to-amber-900/90 backdrop-blur-lg shadow-xl">
      {/* Route Header */}
      <div className={`bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 p-5 text-white relative overflow-hidden ${getPattern(0)}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 via-amber-800/20 to-amber-900/40"></div>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Heritage Exploration Route</h3>
            <p className="text-sm opacity-90">Discover the rich history of the area</p>
          </div>
          <div className="bg-amber-700/30 p-2 rounded-lg text-center backdrop-blur-sm border border-amber-600/20 hover:border-amber-400/30 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <Compass className="w-5 h-5 text-amber-200" />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
          <div className="bg-white/10 p-2 rounded-lg text-center">
            <p className="text-xs opacity-80">Stops</p>
            <p className="font-medium">{stops.length}</p>
          </div>
          <div className="bg-white/10 p-2 rounded-lg text-center">
            <p className="text-xs opacity-80">Distance</p>
            <p className="font-medium">{totalDistance}</p>
          </div>
          <div className="bg-white/10 p-2 rounded-lg text-center">
            <p className="text-xs opacity-80">Total Time</p>
            <p className="font-medium">{estimatedTotalTime}</p>
          </div>
        </div>
      </div>

      {/* Route Stops */}
      <div className="divide-y divide-white/10">
        {stops.map((stop, index) => (
          <div key={stop.id} className="p-4 hover:bg-white/5 transition-colors">
            <div className="flex">
              {/* Stop Number */}
              <div className="flex flex-col items-center mr-4">
                <div className="w-8 h-8 rounded-full bg-amber-700/30 text-amber-100 border-2 border-amber-400/40 flex items-center justify-center font-medium relative shadow-inner">
              <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping"></div>
                  {index + 1}
                </div>
                {index < stops.length - 1 && (
                  <div className="w-0.5 h-full bg-gradient-to-b from-amber-400/40 via-amber-500/30 to-transparent my-1"></div>
                )}
              </div>
              
              {/* Stop Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{stop.name}</h4>
                    <span className="text-amber-100/80 italic">{stop.nameAr}</span>
                  </div>
                  <div className="flex items-center bg-amber-600/30 text-amber-100 px-2.5 py-0.5 rounded-full text-xs border border-amber-400/30 shadow-sm">
                    <Star className="w-3 h-3 mr-1 fill-amber-300 text-amber-300" />
                    <span className="font-semibold">{stop.rating}</span>
                  </div>
                </div>

                <div className="text-sm text-amber-50 space-y-1.5">
                  <div className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
                    <span>{stop.visitDuration} visit • {stop.walkingTime} walk</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
                    <span>{stop.visitors}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
                    <span>{stop.distance} • {stop.direction}</span>
                  </div>
                </div>

                {stop.highlights && stop.highlights.length > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center text-xs font-medium text-amber-200 mb-1.5">
                      <Info className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
                      Highlights
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {stop.highlights.slice(0, 3).map((highlight, i) => (
                        <span 
                          key={i}
                          className="inline-block px-2.5 py-0.5 bg-amber-600/30 text-amber-100 text-xs rounded-full border border-amber-400/30 shadow-sm hover:bg-amber-600/40 transition-colors"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {stop.tips && (
                  <div className="mt-3 p-2.5 bg-amber-900/40 border-l-3 border-amber-400/60 text-xs text-amber-50 rounded-r backdrop-blur-sm shadow-inner">
                    <p><span className="font-medium">Tip:</span> {stop.tips}</p>
                  </div>
                )}

                <div className="mt-2 flex justify-end">
                  <Link 
                    href={stop.googleMapsUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-medium text-amber-300 hover:text-amber-200 transition-colors duration-200 hover:underline decoration-amber-300/50 underline-offset-2"
                  >
                    View on Map <ArrowRight className="w-3 h-3 ml-1.5 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Route Footer */}
      <div className="border-t border-amber-700/30 p-3 bg-gradient-to-r from-amber-900/40 via-amber-800/30 to-amber-900/40 backdrop-blur-sm">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center text-amber-100">
            <Clock className="w-4 h-4 mr-1.5 text-amber-300" />
            <span>Total walking: <span className="font-semibold text-white">{totalWalkingTime}</span></span>
          </div>
          <div className="text-sm font-medium text-amber-200">
            <span className="text-white font-semibold">{stops.length}</span> stops • <span className="text-white font-semibold">{totalDistance}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
