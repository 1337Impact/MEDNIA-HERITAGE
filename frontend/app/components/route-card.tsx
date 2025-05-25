'use client';

import { MapPin, Clock, ArrowRight, Users, Star, Info, Moon, Ruler, Compass, Calendar } from "lucide-react";
import Link from "next/link";

// Subtle geometric patterns
const patterns = [
  'bg-[url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23f3f4f6\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")]',
];

const getPattern = () => patterns[0];

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
    <div className="p-4 space-y-3">
      {/* Route Header Card */}
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Heritage Exploration Route</h3>
              <p className="text-sm text-gray-500">Discover the rich history of the area</p>
            </div>
            <div className="bg-rose-50 p-2 rounded-lg text-center border border-rose-100 shadow-sm">
              <Compass className="w-5 h-5 text-rose-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
              <p className="text-xs text-gray-500">Stops</p>
              <p className="font-medium text-rose-600">{stops.length}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
              <p className="text-xs text-gray-500">Distance</p>
              <p className="font-medium text-rose-600">{totalDistance}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
              <p className="text-xs text-gray-500">Total Time</p>
              <p className="font-medium text-rose-600">{estimatedTotalTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Route Stops */}
      {stops.map((stop, index) => (
        <div key={stop.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
          <div className="p-4">
            <div className="flex">
              {/* Stop Number */}
              <div className="flex flex-col items-center mr-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-600 to-rose-700 text-white flex items-center justify-center font-medium relative shadow-sm">
                  {index + 1}
                </div>
                {index < stops.length - 1 && (
                  <div className="w-0.5 h-24 bg-gradient-to-b from-rose-200 to-transparent my-2 opacity-50"></div>
                )}
              </div>
              
              {/* Stop Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900 hover:text-rose-700 transition-colors">{stop.name}</h4>
                    <span className="text-gray-500 text-sm">{stop.nameAr}</span>
                  </div>
                  <div className="flex items-center bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full text-xs border border-rose-100 shadow-sm">
                    <Star className="w-3 h-3 mr-1 fill-rose-500 text-rose-500" />
                    <span className="font-semibold">{stop.rating}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-2 mt-3 bg-gray-50/50 rounded-lg p-2.5">
                  <div className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1.5 text-rose-500" />
                    <span>{stop.visitDuration} visit • {stop.walkingTime} walk</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1.5 text-rose-500" />
                    <span>{stop.visitors}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-rose-500" />
                    <span>{stop.distance} • {stop.direction}</span>
                  </div>
                </div>

                {stop.highlights && stop.highlights.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center text-xs font-medium text-rose-700 mb-2">
                      <Info className="w-3.5 h-3.5 mr-1.5 text-rose-600" />
                      Highlights
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {stop.highlights.slice(0, 3).map((highlight, i) => (
                        <span 
                          key={i}
                          className="inline-block px-2.5 py-1 bg-rose-50 text-rose-700 text-xs rounded-full border border-rose-100 shadow-sm hover:shadow transition-shadow"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {stop.tips && (
                  <div className="mt-4 p-3 bg-gray-50 border-l-2 border-rose-300 text-xs text-gray-600 rounded-lg shadow-sm">
                    <p><span className="font-medium text-rose-700">Tip:</span> {stop.tips}</p>
                  </div>
                )}

                <div className="mt-3 flex justify-end">
                  <Link 
                    href={stop.googleMapsUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-medium text-rose-600 hover:text-rose-700 transition-colors duration-200 bg-rose-50 px-3 py-1.5 rounded-full shadow-sm hover:shadow group"
                  >
                    View on Map <ArrowRight className="w-3 h-3 ml-1.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Summary Footer Card */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-1.5 text-rose-500" />
            <span>Total walking: <span className="font-semibold text-rose-700">{totalWalkingTime}</span></span>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-rose-700">{stops.length}</span> stops • <span className="font-semibold text-rose-700">{totalDistance}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
