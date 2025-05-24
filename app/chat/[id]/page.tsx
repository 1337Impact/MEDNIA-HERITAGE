"use client";

import type React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  Camera,
  Send,
  ImageIcon,
  X,
  Sparkles,
  MapPin,
  Navigation,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GeometricLoader } from "@/components/geometric-loader";
import { ChatMessage } from "@/components/chat-message";
import { PhotoMenu } from "@/components/photo-menu";
import { LocationButton } from "@/components/location-button";

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
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export default function MedinaGuide() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content:
        "أهلاً وسهلاً! Welcome to your personal Medina heritage guide. Share a photo of any architectural detail, doorway, or decoration and I'll tell you its story and significance. You can also explore heritage sites around your current location! 🕌✨",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null
  );
  const [isLocating, setIsLocating] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  function setLocationCookies(lat: number, lon: number) {
    document.cookie = `latitude=${lat}; path=/; max-age=86400`; // 1 day
    document.cookie = `longitude=${lon}; path=/; max-age=86400`;
  }

  function getLocationCookies() {
    const cookies = document.cookie.split("; ");
    const location: { latitude?: number; longitude?: number } = {};
    cookies.forEach((cookie) => {
      const [key, value] = cookie.split("=");
      if (key === "latitude") {
        location.latitude = parseFloat(value);
      } else if (key === "longitude") {
        location.longitude = parseFloat(value);
      }
    });
    return location;
  }

  const getCurrentLocation = useCallback(async () => {
    setIsLocating(true);

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

      setCurrentLocation(locationData);
      setLocationCookies(locationData.latitude, locationData.longitude); // 👈 store in cookies

      addMessage({
        type: "assistant",
        content: `🧭 **موقعك محدد! Location Found!**

**إحداثيات | Coordinates:** ${locationData.latitude.toFixed(
          6
        )}, ${locationData.longitude.toFixed(6)}
**دقة | Accuracy:** ±${Math.round(locationData.accuracy)}m

Perfect! I've found your location. Now you can discover the magnificent heritage sites around you. Click "استكشف المحيط | Explore Surrounding" to uncover the historical treasures nearby! 🗺️✨`,
      });
    } catch (error) {
      try {
        const res = await fetch("/set-geolocation");
        const json = await res.json();

        const lat = json?.location?.location?.latitude;
        const lon = json?.location?.location?.longitude;

        if (lat != null && lon != null) {
          const locationData: LocationData = {
            latitude: lat,
            longitude: lon,
            accuracy: 10000,
          };

          setCurrentLocation(locationData);
          setLocationCookies(lat, lon); // 👈 store in cookies

          addMessage({
            type: "assistant",
            content: `📡 **تم تحديد موقع تقريبي | Approximate Location Set**

**إحداثيات | Coordinates:** ${lat.toFixed(6)}, ${lon.toFixed(6)}
(This is based on your IP address, so it may be less accurate.)

Explore nearby heritage sites and discover history around you! 🏛️🌍`,
          });
        } else {
          throw new Error("Fallback location unavailable");
        }
      } catch (fallbackError) {
        let errorMessage =
          "لا يمكنني الوصول إلى موقعك | I couldn't access your location. ";

        if (error instanceof GeolocationPositionError) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage +=
                "Please enable location permissions in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "Location request timed out. Please try again.";
              break;
          }
        }

        addMessage({
          type: "assistant",
          content: `❌ ${errorMessage}

You can still explore by taking photos of heritage elements around you! 📸🏛️`,
        });
      }
    } finally {
      setIsLocating(false);
    }
  }, []);

  const exploreSurrounding = useCallback(async () => {
    if (!currentLocation) {
      addMessage({
        type: "assistant",
        content:
          "من فضلك استخدم 'حدد موقعي' أولاً | Please use 'Locate Me' first to find heritage sites around you! 📍",
      });
      return;
    }

    setIsAnalyzing(true);

    addMessage({
      type: "assistant",
      content:
        "🔍 أبحث عن المواقع التراثية حولك | Searching for heritage sites around you...",
    });

    await new Promise((resolve) => setTimeout(resolve, 2500));

    const nearbyHeritage = [
      {
        name: "باب بوجلود | Bab Boujloud",
        nameAr: "الباب الأزرق",
        distance: "150m",
        direction: "Northeast",
        period: "1913 (العهد العلوي | Alaouite Dynasty)",
        description:
          "The iconic blue and green tiled gateway to Fes el-Bali, symbolizing the entrance to the ancient medina",
        rating: 4.8,
        visitors: "2.3k today",
      },
      {
        name: "مدرسة العطارين | Al-Attarine Madrasa",
        nameAr: "مدرسة العطارين",
        distance: "300m",
        direction: "East",
        period: "1323-1325 (المرينيون | Marinid Dynasty)",
        description:
          "Masterpiece of Marinid architecture featuring exquisite zellige work and carved cedar",
        rating: 4.9,
        visitors: "1.8k today",
      },
      {
        name: "دباغة الشوارة | Chouara Tannery",
        nameAr: "دباغة الشوارة",
        distance: "450m",
        direction: "Southeast",
        period: "القرن 11 | 11th Century",
        description:
          "One of the world's oldest leather tanneries, preserving ancient Moroccan craftsmanship",
        rating: 4.6,
        visitors: "3.1k today",
      },
    ];

    const heritageList = nearbyHeritage
      .map(
        (site) =>
          `🕌 **${site.name}**
📏 ${site.distance} ${site.direction}
📅 ${site.period}
⭐ ${site.rating} • 👥 ${site.visitors}
${site.description}`
      )
      .join("\n\n");

    addMessage({
      type: "assistant",
      content: `🗺️ **المواقع التراثية القريبة منك | Heritage Sites Near You**

${heritageList}

Take a photo of any of these magnificent sites or their architectural details to discover their fascinating stories! You can also ask me specific questions about what you see. 📸✨

*Tip: Look for the intricate zellige patterns, carved plaster (tadelakt), and cedar wood details that make Moroccan architecture unique!*`,
    });

    setIsAnalyzing(false);
  }, [currentLocation]);

  const startCamera = useCallback(async () => {
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
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
    setShowCamera(false);
  }, []);

  const capturePhoto = useCallback(() => {
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
          content:
            "ما الذي يمكنك إخباري عنه؟ | What can you tell me about this?",
          image: imageData,
        });

        analyzeImage(imageData);
      }
    }
  }, [stopCamera]);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target?.result as string;
          setShowPhotoMenu(false);

          addMessage({
            type: "user",
            content:
              "ما الذي يمكنك إخباري عنه؟ | What can you tell me about this?",
            image: imageData,
          });

          analyzeImage(imageData);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true);

    const loadingMessage: Message = {
      id: "loading",
      type: "assistant",
      content: "أحلل صورتك... | Analyzing your photo...",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, loadingMessage]);

    await new Promise((resolve) => setTimeout(resolve, 3500));

    setMessages((prev) => prev.filter((msg) => msg.id !== "loading"));

    const mockHeritageInfo = {
      title: "فن الزليج | Zellige Tilework",
      period: "القرن 10 - الحاضر | 10th Century - Present",
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
        "تادلاكت | Tadelakt plaster",
        "نقش الأرز | Cedar wood carvings",
        "الأقواس المغربية | Horseshoe arches",
      ],
      confidence: 0.94,
    };

    addMessage({
      type: "assistant",
      content: `✨ **${mockHeritageInfo.title}** من **${
        mockHeritageInfo.period
      }**

${mockHeritageInfo.description}

**الأهمية الثقافية | Cultural Significance:**
${mockHeritageInfo.significance}

**ما يجب ملاحظته | What to observe:**
${mockHeritageInfo.tips.map((tip) => `🔹 ${tip}`).join("\n")}

**عناصر مرتبطة | Related Elements:**
${mockHeritageInfo.relatedElements.map((element) => `• ${element}`).join("\n")}

Would you like to know more about the craftsmanship process or the symbolic meaning of these specific patterns? 🎨✨`,
      heritageInfo: mockHeritageInfo,
    });

    setIsAnalyzing(false);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      addMessage({
        type: "user",
        content: inputValue,
      });

      setTimeout(() => {
        addMessage({
          type: "assistant",
          content:
            "سؤال ممتاز! | That's a wonderful question! I'd be delighted to help you discover more about Moroccan heritage. Feel free to share a photo of any architectural element, decorative detail, or historical site you'd like to explore, or ask me about specific aspects of what you've already discovered. 🏛️✨\n\n*Remember: Every stone, tile, and carving in Morocco tells a story of centuries-old craftsmanship and cultural heritage!*",
        });
      }, 1200);

      setInputValue("");
    }
  };

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
        <div className="w-full max-w-4xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-rose-600 via-red-600 to-orange-700 rounded-full flex items-center justify-center shadow-lg border-2 border-rose-300/50">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-red-800 to-rose-700 bg-clip-text text-transparent truncate">
                دليل التراث | Heritage Guide
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                Your AI Medina companion
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-1 text-rose-600">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                <span className="text-xs sm:text-sm font-semibold">4.9</span>
              </div>
              <p className="text-xs text-gray-500">Trusted guide</p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages - Scrollable Area */}
      <div className="flex-1 overflow-hidden relative z-10">
        <div className="h-full overflow-y-auto px-4 py-4 sm:py-6">
          <div className="w-full max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isAnalyzing && (
              <div className="flex justify-start">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 sm:px-6 py-3 sm:py-4 max-w-xs sm:max-w-sm shadow-lg border border-amber-200/50">
                  <GeometricLoader />
                  <p className="text-xs sm:text-sm text-gray-600 mt-2 text-center">
                    Discovering heritage...
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
            {/* Extra padding at bottom for mobile keyboards */}
            <div className="h-4 sm:h-6" />
          </div>
        </div>
      </div>

      {/* Camera View Overlay */}
      {showCamera && (
        <div className="absolute inset-0 bg-black z-50 flex flex-col">
          <div className="flex-1 relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Moroccan-inspired camera overlay */}
            <div className="absolute inset-4 border-2 border-rose-400/60 rounded-lg pointer-events-none">
              <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-l-4 border-t-4 border-rose-400 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-r-4 border-t-4 border-rose-400 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-l-4 border-b-4 border-rose-400 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-r-4 border-b-4 border-rose-400 rounded-br-lg"></div>

              {/* Center focus indicator */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 border-2 border-rose-400/80 rounded-full">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-rose-400 rounded-full"></div>
              </div>
            </div>

            {/* Instructions */}
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
                إلغاء | Cancel
              </Button>

              <Button
                onClick={capturePhoto}
                size="lg"
                className="bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white px-6 sm:px-8 shadow-lg border-2 border-rose-300/50 text-sm sm:text-base"
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                التقط | Capture
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Input Area at Bottom */}
      <div className="bg-white/95 backdrop-blur-md border-t-2 border-rose-400/30 relative z-10 shadow-lg flex-shrink-0">
        <div className="w-full max-w-4xl mx-auto p-3 sm:p-4">
          <div className="space-y-3">
            {/* Location Buttons with Moroccan styling */}
            <div className="flex gap-2">
              <LocationButton
                onClick={getCurrentLocation}
                isLoading={isLocating}
                icon={<MapPin className="w-3 h-3 sm:w-4 sm:h-4" />}
                text="حدد موقعي | Locate Me"
                variant="outline"
                className="flex-1 border-red-300 text-red-700 hover:bg-red-50 text-xs sm:text-sm"
              />
              <LocationButton
                onClick={exploreSurrounding}
                isLoading={false}
                icon={<Navigation className="w-3 h-3 sm:w-4 sm:h-4" />}
                text="استكشف المحيط | Explore"
                variant="default"
                className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-xs sm:text-sm"
                disabled={!currentLocation}
              />
            </div>

            {/* Chat Input with enhanced styling */}
            <div className="flex items-end gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="اسأل عن التراث المغربي... | Ask about Moroccan heritage..."
                  className="pr-10 sm:pr-12 bg-white/90 border-2 border-rose-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 rounded-xl text-sm sm:text-base h-10 sm:h-12"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button
                  onClick={() => setShowPhotoMenu(!showPhotoMenu)}
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 sm:h-10 sm:w-10 p-0 hover:bg-rose-100 rounded-lg"
                >
                  <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 text-rose-600" />
                </Button>
              </div>

              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-rose-600 via-red-600 to-orange-700 hover:from-rose-700 hover:via-red-700 hover:to-orange-800 text-white h-10 w-10 sm:h-12 sm:w-12 p-0 rounded-xl shadow-lg border-2 border-rose-300/50 flex-shrink-0"
              >
                <Send className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>

            {/* Photo Menu */}
            <PhotoMenu
              isOpen={showPhotoMenu}
              onClose={() => setShowPhotoMenu(false)}
              onTakePhoto={startCamera}
              onUploadPhoto={() => fileInputRef.current?.click()}
            />
          </div>
        </div>
      </div>

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
