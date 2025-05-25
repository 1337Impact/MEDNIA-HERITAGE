"use client";

import { useState, useRef, useEffect, use } from "react";
import {
  Camera,
  Send,
  ImageIcon,
  X,
  Sparkles,
  MapPin,
  Navigation,
  Star,
  LineChart,
} from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GeometricLoader } from "@/components/geometric-loader";
import { ChatMessage } from "@/app/components/chat-message";
import { RouteCard } from "@/app/components/route-card";
import { LocationButton } from "@/components/location-button";
import { PhotoMenu } from "@/components/photo-menu";
import { TypingIndicator } from "@/components/typing-indicator";
import Link from "next/link";

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
    sites: Array<{
      id: string;
      name: string;
      nameAr: string;
      distance: string;
      walkingTime: string;
      direction: string;
      period: string;
      description: string;
      rating: number;
      visitors: string;
      coordinates: { lat: number; lng: number };
      googleMapsUrl: string;
      visitDuration: string;
      highlights: string[];
      tips: string;
    }>;
    totalDistance: string;
    totalWalkingTime: string;
    estimatedTotalTime: string;
    routeType: string;
  };
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface ApiHeritageSite {
  name: string;
  nameAr: string;
  distance: string;
  walkingTime: string;
  direction: string;
  period: string;
  description: string;
  rating: number;
  visitors: string;
  coordinates: { lat: number; lng: number };
  googleMapsUrl: string;
  visitDuration: string;
  highlights: string[];
  tips: string;
}

interface ApiResponse {
  spots: ApiHeritageSite[];
}

interface ChatHistoryItem {
  id: number;
  user_id: number;
  user_message: string;
  ai_response: string;
  timestamp: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const setCookie = (name: string, value: string, days = 30) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const loadLocationFromCookies = (setCurrentLocation: any) => {
  const savedLat = getCookie("heritage_latitude");
  const savedLng = getCookie("heritage_longitude");

  if (savedLat && savedLng) {
    const locationData: LocationData = {
      latitude: Number.parseFloat(savedLat),
      longitude: Number.parseFloat(savedLng),
      accuracy: 100,
    };
    setCurrentLocation(locationData);
    return locationData;
  }
  return null;
};

const fetchHeritageLocations = async (
  latitude: number,
  longitude: number,
  userId: string
): Promise<ApiResponse> => {
  const url = `${API_BASE_URL}/suggest-locations?location=${latitude},${longitude}&user_id=${userId}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

const sendChatMessage = async (
  message: string,
  userId: string,
  currentLocation: LocationData | null
): Promise<any> => {
  const locationParam = currentLocation
    ? `${currentLocation.latitude},${currentLocation.longitude}`
    : "";
  const url = `${API_BASE_URL}/chat?user_id=${userId}${
    locationParam ? `&location=${locationParam}` : ""
  }`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error(
      `Chat API Error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

const fetchChatHistory = async (userId: string): Promise<ChatHistoryItem[]> => {
  try {
    const url = `${API_BASE_URL}/messages?user_id=${encodeURIComponent(
      userId
    )}`;

    const response = await axios.get<ChatHistoryItem[]>(url, {
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    console.log("Chat history for user", userId, ":", response.data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to fetch chat history:", error.message);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
    } else {
      console.error("An unexpected error occurred:", error);
    }
    return [];
  }
};

const calculateRouteStats = (sites: ApiHeritageSite[]) => {
  const walkingTimes = sites.map((site) => {
    const timeStr = site.walkingTime.replace(/[^\d]/g, "");
    return Number.parseInt(timeStr) || 0;
  });

  const distances = sites.map((site) => {
    const distanceStr = site.distance.replace(/[^\d]/g, "");
    return Number.parseInt(distanceStr) || 0;
  });

  const totalWalkingMinutes = walkingTimes.reduce((sum, time) => sum + time, 0);
  const totalDistanceMeters = distances.reduce((sum, dist) => sum + dist, 0);

  const visitTimes = sites.map((site) => {
    const visitStr = site.visitDuration.split("-")[0].replace(/[^\d]/g, "");
    return Number.parseInt(visitStr) || 30;
  });
  const totalVisitMinutes = visitTimes.reduce((sum, time) => sum + time, 0);
  const totalTimeMinutes = totalWalkingMinutes + totalVisitMinutes;

  return {
    totalDistance:
      totalDistanceMeters > 1000
        ? `${(totalDistanceMeters / 1000).toFixed(1)}km`
        : `${totalDistanceMeters}m`,
    totalWalkingTime:
      totalWalkingMinutes > 60
        ? `${Math.floor(totalWalkingMinutes / 60)}h ${
            totalWalkingMinutes % 60
          }min`
        : `${totalWalkingMinutes} min`,
    estimatedTotalTime:
      totalTimeMinutes > 60
        ? `${Math.floor(totalTimeMinutes / 60)}h ${totalTimeMinutes % 60}min`
        : `${totalTimeMinutes} min`,
  };
};

const convertChatHistoryToMessages = (
  chatHistory: ChatHistoryItem[]
): Message[] => {
  const messages: Message[] = [];

  const sortedHistory = chatHistory.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  sortedHistory.forEach((item) => {
    messages.push({
      id: `user-${item.id}`,
      type: "user",
      content: item.user_message,
      timestamp: new Date(item.timestamp),
    });

    messages.push({
      id: `ai-${item.id}`,
      type: "assistant",
      content: item.ai_response,
      timestamp: new Date(item.timestamp),
    });
  });

  return messages;
};

interface PageParams {
  id: string;
}

interface PageProps {
  params: Promise<PageParams> | PageParams;
}

export default function MedinaGuide({ params }: PageProps) {
  const resolvedParams = "then" in params ? use(params) : params;
  const userId = resolvedParams.id;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null
  );
  const [isLocating, setIsLocating] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        loadLocationFromCookies(setCurrentLocation);
        const chatHistory = await fetchChatHistory(userId);
        const convertedMessages = convertChatHistoryToMessages(chatHistory);

        if (convertedMessages.length === 0) {
          setMessages([
            {
              id: "welcome",
              type: "assistant",
              content:
                "Welcome to your personal Medina heritage guide! Share a photo of any architectural detail, doorway, or decoration and I'll tell you its story and significance. You can also explore heritage sites around your current location! 🕌✨",
              timestamp: new Date(),
            },
          ]);
        } else {
          setMessages(convertedMessages);
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
        setMessages([
          {
            id: "welcome",
            type: "assistant",
            content:
              "Welcome to your personal Medina heritage guide! Share a photo of any architectural detail, doorway, or decoration and I'll tell you its story and significance. You can also explore heritage sites around your current location! 🕌✨",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadInitialData();
  }, [userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setTimeout(scrollToBottom, 100);
  };

  const getCurrentLocation = async () => {
    setIsLocating(true);

    const savedLocation = loadLocationFromCookies(setCurrentLocation);
    if (savedLocation) {
      setIsLocating(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          });
        }
      );

      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };

      setCookie("heritage_latitude", locationData.latitude.toString());
      setCookie("heritage_longitude", locationData.longitude.toString());

      setCurrentLocation(locationData);
    } catch (error) {
      let errorMessage = "I can't find your location. ";

      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage +=
              "Please enable location permissions in your browser settings, or manually set your location by visiting a heritage site and taking a photo.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage +=
              "Location information is unavailable. You can still explore by taking photos of heritage elements around you!";
            break;
          case error.TIMEOUT:
            errorMessage +=
              "Location request timed out. Please try again or explore by taking photos.";
            break;
        }
      } else {
        errorMessage +=
          "Please enable location services or explore by taking photos of heritage elements around you!";
      }

      addMessage({
        type: "assistant",
        content: `❌ ${errorMessage}

**Alternative Options:**
📸 Take photos of heritage elements for instant analysis
🗺️ Manually explore popular heritage sites in Morocco
🏛️ Ask me about specific Moroccan architectural features

*Tip: If you visit any heritage site, take a photo and I'll help identify your location based on the architectural elements!*`,
      });
    } finally {
      setIsLocating(false);
    }
  };

  const exploreSurrounding = async () => {

    await getCurrentLocation();
    let locationToUse = currentLocation;

    if (!locationToUse) {
      locationToUse = loadLocationFromCookies(setCurrentLocation);
    }

    if (!locationToUse) {
      addMessage({
        type: "assistant",
        content: `📍 **Location Not Available**

I need your location to find heritage sites around you. Please:

🧭 **Enable Location:** Click "Locate Me" to share your current position
📸 **Take a Photo:** Capture any heritage element and I'll help identify your area
🗺️ **Manual Exploration:** Ask me about specific Moroccan cities or heritage sites

**Popular Heritage Areas:**
• Fes Medina
• Marrakech Medina
• Chefchaouen
• Meknes
• Rabat

Which area would you like to explore? 🕌✨`,
      });
      return;
    }

    setIsAnalyzing(true);

    const locationSource = currentLocation ? "current" : "saved";

    try {
      const apiResponse = await fetchHeritageLocations(
        locationToUse.latitude,
        locationToUse.longitude,
        userId
      );

      if (!apiResponse.spots || apiResponse.spots.length === 0) {
        addMessage({
          type: "assistant",
          content: `😔 **No Heritage Sites Found**

I couldn't find any heritage sites near your current location. This might be because:

🗺️ You're in an area without registered heritage sites
📡 The heritage database doesn't have coverage for this region
🔄 Try a different location or explore popular heritage areas

**Suggestions:**
📸 Take a photo of any architectural element you see
🏛️ Ask me about specific Moroccan heritage sites
🗺️ Try exploring from a known heritage area like Fes or Marrakech`,
        });
        setIsAnalyzing(false);
        return;
      }

      const transformedSites = apiResponse.spots.map((spot, index) => ({
        id: `site-${index}`,
        name: spot.name,
        nameAr: spot.nameAr,
        distance: spot.distance,
        walkingTime: spot.walkingTime,
        direction: spot.direction,
        period: spot.period,
        description: spot.description,
        rating: spot.rating,
        visitors: spot.visitors,
        coordinates: spot.coordinates,
        googleMapsUrl: spot.googleMapsUrl,
        visitDuration: spot.visitDuration,
        highlights: spot.highlights,
        tips: spot.tips,
      }));

      const routeStats = calculateRouteStats(apiResponse.spots);

      addMessage({
        type: "assistant",
        content: `🗺️ **Heritage Exploration Route**
      📍 **Location Source:** ${
        locationSource === "current" ? "Current GPS" : "Previously Saved"
      }

      I've discovered ${
        transformedSites.length
      } magnificent heritage sites near you! Here's your personalized walking route:

      **📊 Route Summary:**
      🚶‍♂️ Total Walking: ${routeStats.totalWalkingTime} (${
          routeStats.totalDistance
        })
      ⏱️ Estimated Visit Time: ${routeStats.estimatedTotalTime}
      🎯 Sites: ${transformedSites.length} heritage locations

      Click on any site below to open in Google Maps, or follow the complete itinerary! 🗺️✨`,
        heritageRoute: {
          sites: transformedSites,
          totalDistance: routeStats.totalDistance,
          totalWalkingTime: routeStats.totalWalkingTime,
          estimatedTotalTime: routeStats.estimatedTotalTime,
          routeType: "walking",
        },
      });
    } catch (error) {
      console.error("API Error:", error);
      addMessage({
        type: "assistant",
        content: `❌ **Connection Error**

I'm having trouble connecting to the heritage database right now. This could be due to:

🌐 Network connectivity issues
🔧 Temporary server maintenance
📡 API service unavailable

**What you can do:**
🔄 Try again in a few moments
📸 Take photos of heritage elements for analysis
💬 Ask me questions about Moroccan architecture
🗺️ Explore manually using popular heritage sites

*The service should be back online shortly. Thank you for your patience!*`,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
        setShowPhotoMenu(false);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg");
        stopCamera();

        addMessage({
          type: "user",
          content: "What can you tell me about this?",
          image: imageData,
        });

        analyzeImage(imageData);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setShowPhotoMenu(false);

        addMessage({
          type: "user",
          content: "What can you tell me about this?",
          image: imageData,
        });

        analyzeImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true);

    const loadingMessage: Message = {
      id: "loading",
      type: "assistant",
      content: "Analyzing your photo...",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, loadingMessage]);

    await new Promise((resolve) => setTimeout(resolve, 3500));

    setMessages((prev) => prev.filter((msg) => msg.id !== "loading"));

    const mockHeritageInfo = {
      title: "Zellige Tilework",
      period: "10th Century - Present",
      description:
        "This is a magnificent example of traditional Moroccan zellige tilework. Each tile (called 'furmah') is hand-cut from clay sourced from Salé and glazed in vibrant colors, creating intricate geometric patterns that have adorned Moroccan architecture for over a millennium.",
      significance:
        "These geometric patterns reflect Islamic artistic principles of 'tawhid' (unity), avoiding figurative representation while creating infinite, meditative designs that symbolize the unity and continuity of creation. The mathematical precision represents divine order.",
      location:
        "Found throughout Moroccan palaces, mosques, riads, and traditional houses",
      tips: [
        "Notice how each tile is slightly different - they're all hand-cut by master craftsmen (maâlems)",
        "The patterns create optical illusions of movement and infinity",
        "This blue and white combination is called 'Fassi' style, originating from Fes",
        "The imperfections are intentional - they represent human humility before divine perfection",
      ],
      relatedElements: [
        "Tadelakt plaster",
        "Cedar wood carvings",
        "Horseshoe arches",
      ],
      confidence: 0.94,
    };

    addMessage({
      type: "assistant",
      content: `✨ **${mockHeritageInfo.title}** from **${
        mockHeritageInfo.period
      }**

${mockHeritageInfo.description}

**Cultural Significance:**
${mockHeritageInfo.significance}

**What to observe:**
${mockHeritageInfo.tips.map((tip) => `🔹 ${tip}`).join("\n")}

**Related Elements:**
${mockHeritageInfo.relatedElements.map((element) => `• ${element}`).join("\n")}

Would you like to know more about the craftsmanship process or the symbolic meaning of these specific patterns? 🎨✨`,
      heritageInfo: mockHeritageInfo,
    });

    setIsAnalyzing(false);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage = inputValue.trim();

      addMessage({
        type: "user",
        content: userMessage,
      });

      setInputValue("");
      setIsAnalyzing(true);

      try {
        const chatResponse = await sendChatMessage(
          userMessage,
          userId,
          currentLocation
        );

        if (chatResponse.spots && chatResponse.spots.length > 0) {
          // Add a message with the route map
          addMessage({
            type: "assistant",
            content: "Here's a suggested route for your heritage exploration:",
            heritageRoute: {
              sites: chatResponse.spots.map((spot: any) => ({
                ...spot,
                id: spot.name.toLowerCase().replace(/\s+/g, "-"),
                coordinates: spot.coordinates || { lat: 0, lng: 0 },
                highlights: spot.highlights || [],
                tips: spot.tips || "",
              })),
              totalDistance:
                chatResponse.spots
                  .reduce((sum: number, spot: any) => {
                    const dist = parseFloat(spot.distance) || 0;
                    return sum + dist;
                  }, 0)
                  .toFixed(1) + "km",
              totalWalkingTime:
                chatResponse.spots.reduce((sum: number, spot: any) => {
                  const time = parseInt(spot.walkingTime) || 0;
                  return sum + time;
                }, 0) + " min",
              estimatedTotalTime:
                chatResponse.spots.reduce((sum: number, spot: any) => {
                  const duration = spot.visitDuration.split("-")[0];
                  const time = parseInt(duration) || 0;
                  return sum + time;
                }, 0) + " min",
              routeType: "Heritage Exploration",
            },
          });
        }

        // Add the text response if available
        if (
          chatResponse.response ||
          chatResponse.ai_response ||
          chatResponse.message
        ) {
          addMessage({
            type: "assistant",
            content:
              chatResponse.response ||
              chatResponse.ai_response ||
              chatResponse.message,
          });
        }
      } catch (error) {
        console.error("Chat API Error:", error);

        addMessage({
          type: "assistant",
          content:
            "That's a wonderful question! I'd be delighted to help you discover more about Moroccan heritage. Feel free to share a photo of any architectural element, decorative detail, or historical site you'd like to explore, or ask me about specific aspects of what you've already discovered. 🏛️✨\n\n*Remember: Every stone, tile, and carving in Morocco tells a story of centuries-old craftsmanship and cultural heritage!*",
        });
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      if (userId) {
        formData.append('user_id', userId);
      }

      // Add loading message
      addMessage({
        type: "user",
        content: "Analyzing uploaded image...",
        image: URL.createObjectURL(file)
      });

      // Make API request
      const response = await fetch(`${API_BASE_URL}/analyze-image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      
      // Add API response to chat
      addMessage({
        type: "assistant",
        content: data.response || "Here's what I found in your image...",
        heritageInfo: data.heritageInfo
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      addMessage({
        type: "assistant",
        content: "Sorry, I couldn't process your image. Please try again."
      });
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleImageUpload(file);
      setShowImageModal(false);
    }
  };

  const handleCameraCapture = async () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            await handleImageUpload(file);
            stopCamera();
            setShowImageModal(false);
          }
        }, 'image/jpeg');
      }
    }
  };

  if (isLoadingHistory) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-red-900/90 via-rose-800/90 to-orange-900/90">
        <div className="text-center">
          <GeometricLoader />
          <p className="text-white mt-4 text-lg">
            Loading your heritage journey...
          </p>
          <p className="text-rose-200 text-sm">User ID: {userId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* Moroccan Pattern Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23be185d' fillOpacity='0.4'%3E%3Cpath d='M30 30l15-15v30l-15-15zm0 0l-15 15h30l-15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 via-rose-800/90 to-orange-900/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-transparent" />
      </div>

      {/* Header with Moroccan styling */}
      <header className="bg-white/95 backdrop-blur-md shadow-lg border-b-2 border-rose-400/30 relative z-10 flex-shrink-0">
        <div className="flex justify-between items-center w-full max-w-4xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-rose-600 via-red-600 to-orange-700 rounded-full flex items-center justify-center shadow-lg border-2 border-rose-300/50">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-red-800 to-rose-700 bg-clip-text text-transparent truncate">
                Heritage Guide
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                Your AI Medina companion
              </p>
            </div>
          </div>
          <div className="">
            <Link
              href="/realtime-insight"
              className="text-md font-semibold p-2 px-5 text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            >
              Ask AI Guide!
            </Link>
          </div>
        </div>
      </header>

      {/* Chat Messages - Scrollable Area */}
      <div className="flex-1 overflow-hidden relative z-10">
        <div className="h-full overflow-y-auto px-4 py-4 sm:py-6">
          <div className="w-full max-w-4xl pb-24 mx-auto space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="w-full">
                <ChatMessage
                  message={message}
                  isAnalyzing={isAnalyzing && message.type === "assistant"}
                />
                {message.heritageRoute && (
                  <div className="mt-2 ml-12">
                    <RouteCard
                      stops={message.heritageRoute.sites}
                      totalDistance={message.heritageRoute.totalDistance}
                      totalWalkingTime={message.heritageRoute.totalWalkingTime}
                      estimatedTotalTime={
                        message.heritageRoute.estimatedTotalTime
                      }
                    />
                  </div>
                )}
              </div>
            ))}
            {isAnalyzing && (
              <div className="w-full mb-4">
                <TypingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
            <div className="h-4 sm:h-6" />
          </div>

          {showCamera && (
            <div className="absolute inset-0 bg-black z-50 flex flex-col">
              <div className="flex-1 relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-4 border-2 border-rose-400/60 rounded-lg pointer-events-none">
                  <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-l-4 border-t-4 border-rose-400 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-r-4 border-t-4 border-rose-400 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-l-4 border-b-4 border-rose-400 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-r-4 border-b-4 border-rose-400 rounded-br-lg"></div>

                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 border-2 border-rose-400/80 rounded-full">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-rose-400 rounded-full"></div>
                  </div>
                </div>

                <div className="absolute top-4 sm:top-8 left-4 right-4 text-center">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2">
                    <p className="text-white text-xs sm:text-sm font-medium">
                      📸 Position heritage element in frame
                    </p>
                    <p className="text-rose-300 text-xs">
                      Focus on architectural details, patterns, or decorations
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 bg-gradient-to-t from-black via-black/80 to-transparent flex-shrink-0">
                <div className="w-full max-w-4xl mx-auto flex items-center justify-center gap-4 sm:gap-6">
                  <Button
                    onClick={stopCamera}
                    variant="outline"
                    size="lg"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm text-sm sm:text-base"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Cancel
                  </Button>

                  <Button
                    onClick={capturePhoto}
                    size="lg"
                    className="bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white px-6 sm:px-8 shadow-lg border-2 border-rose-300/50 text-sm sm:text-base"
                  >
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Capture
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 fixed bottom-0 w-full">
            <div className="w-full max-w-4xl mx-auto">
               <div className="flex items-end gap-2 bg-white rounded-xl shadow-lg border">
                 <div className="flex gap-1 px-2 py-2">
                   <div className="relative group">
                     <button
                       onClick={() => setShowImageModal(true)}
                       className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                     >
                       <ImageIcon className="w-5 h-5" />
                     </button>
                     <div className="absolute bottom-full mb-2 hidden group-hover:block">
                       <div className="bg-gray-900 text-white text-sm py-1 px-2 rounded-md whitespace-nowrap">
                         Upload Photo
                       </div>
                       <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                     </div>
                   </div>
                   <div className="relative group">
                     <button
                       onClick={exploreSurrounding}
                       className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                     >
                       <Navigation className="w-5 h-5" />
                     </button>
                     <div className="absolute bottom-full mb-2 hidden group-hover:block">
                       <div className="bg-gray-900 text-white text-sm py-1 px-2 rounded-md whitespace-nowrap">
                         Explore Surrounding
                       </div>
                       <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                     </div>
                   </div>
                 </div>

                 <div className="flex-1 flex items-center">
                   <input
                     value={inputValue}
                     onChange={(e) => setInputValue(e.target.value)}
                     placeholder="Ask about Moroccan heritage..."
                     className="flex-1 px-2 py-3 bg-transparent border-0 focus:outline-none focus:ring-0 text-sm"
                     onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                   />
                 </div>

                 <button
                   onClick={handleSendMessage}
                   disabled={!inputValue.trim()}
                   className="p-2 m-2 bg-black hover:bg-gray-800 text-white rounded-lg flex items-center justify-center disabled:opacity-50 disabled:hover:bg-black transition-colors"
                 >
                   <Send className="w-4 h-4" />
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Upload Image</h3>
                <button 
                  onClick={() => setShowImageModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <button
                onClick={() => {
                  startCamera();
                  setShowImageModal(false);
                }}
                className="w-full py-3 px-4 bg-black text-white rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
              >
                <Camera className="w-5 h-5" />
                Take Photo
              </button>
              
              <label className="block">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 bg-gray-100 text-gray-900 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                >
                  <ImageIcon className="w-5 h-5" />
                  Upload from Device
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
