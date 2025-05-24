'use client';

import { GoogleMap, Marker, Polyline, useLoadScript } from '@react-google-maps/api';
import { useMemo } from 'react';

interface Location {
  lat: number;
  lng: number;
  name: string;
  nameAr: string;
  description: string;
}

interface RouteMapProps {
  locations: Location[];
}

const libraries: ('places' | 'drawing' | 'geometry' | 'localContext' | 'visualization')[] = ['places'];

const RouteMap = ({ locations }: RouteMapProps) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const mapCenter = useMemo(() => {
    if (locations.length === 0) return { lat: 31.63, lng: -7.98 }; // Default to Marrakesh
    
    // Calculate center point of all locations
    const avgLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
    const avgLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;
    
    return { lat: avgLat, lng: avgLng };
  }, [locations]);

  if (loadError) {
    return <div className="p-4 text-red-500">Error loading maps. Please try again later.</div>;
  }

  if (!isLoaded) {
    return <div className="p-4 text-gray-500">Loading map...</div>;
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden">
      <GoogleMap
        zoom={13}
        center={mapCenter}
        mapContainerClassName="w-full h-full"
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          zoomControl: true,
        }}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={{ lat: location.lat, lng: location.lng }}
            title={location.name}
            label={{
              text: (index + 1).toString(),
              color: 'white',
              fontWeight: 'bold',
            }}
          />
        ))}
        
        {locations.length > 1 && (
          <Polyline
            path={locations.map(loc => ({ lat: loc.lat, lng: loc.lng }))}
            options={{
              strokeColor: '#3B82F6',
              strokeOpacity: 0.8,
              strokeWeight: 4,
              clickable: false,
              draggable: false,
              editable: false,
              visible: true,
              zIndex: 1,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default RouteMap;
