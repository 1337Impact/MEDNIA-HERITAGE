"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Camera,
  Square,
  Play,
  Pause,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MapPin,
  MessageCircle,
} from "lucide-react";

const MoroccanHeritageGuide = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [description, setDescription] = useState("");
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [captureInterval, setCaptureInterval] = useState(5000);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [changeThreshold, setChangeThreshold] = useState(0.3);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const lastImageRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  // Initialize speech services
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");

        if (event.results[event.results.length - 1].isFinal) {
          handleVoiceQuestion(transcript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
    }

    if ("speechSynthesis" in window) {
      synthesisRef.current = window.speechSynthesis;
    }
  }, []);

  // Request camera and microphone access
  const startStream = async () => {
    try {
      const constraints = {
        video: { width: 640, height: 480 },
        audio: audioEnabled,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);
        setError("");

        // Add welcome message with Morocco-specific guidance
        const welcomeMsg =
          "مرحبا! Welcome to your personal Moroccan Heritage Guide! 🇲🇦 I can see what's in front of you and share the rich stories of Morocco's culture, architecture, and traditions. Point your camera at any traditional elements - patterns, crafts, architecture - and I'll tell you their cultural significance. Ask me anything about what you see!";
        setConversation([
          { type: "assistant", content: welcomeMsg, timestamp: new Date() },
        ]);
        speakText(welcomeMsg);

        // Start automatic capture
        startAutomaticCapture();
      }
    } catch (err) {
      setError(`Failed to access camera/microphone: ${err.message}`);
    }
  };

  // Stop the stream
  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }

    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }

    setIsStreaming(false);
    setIsAnalyzing(false);
    setIsListening(false);
    setIsSpeaking(false);
  };

  // Capture screenshot from video
  const captureScreenshot = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    return canvas.toDataURL("image/jpeg", 0.8);
  }, []);

  // Simple image similarity calculation
  const calculateImageSimilarity = (img1, img2) => {
    if (!img1 || !img2) return 0;

    // Compare base64 strings in chunks for better accuracy
    const chunkSize = 1000;
    let matches = 0;
    const totalChunks = Math.min(
      Math.floor(img1.length / chunkSize),
      Math.floor(img2.length / chunkSize)
    );

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const chunk1 = img1.slice(start, start + chunkSize);
      const chunk2 = img2.slice(start, start + chunkSize);
      if (chunk1 === chunk2) matches++;
    }

    return totalChunks > 0 ? matches / totalChunks : 0;
  };

  // Check if scene has changed significantly
  const hasSceneChanged = (currentImage, lastImage) => {
    if (!lastImage) return true;

    // More sophisticated image comparison for better change detection
    const currentSize = currentImage.length;
    const lastSize = lastImage.length;
    const sizeDiff =
      Math.abs(currentSize - lastSize) / Math.max(currentSize, lastSize);

    // Additional check: compare base64 string similarity
    if (currentImage === lastImage) return false;

    // Check for significant visual changes
    const similarity = calculateImageSimilarity(currentImage, lastImage);
    return similarity < 1 - changeThreshold;
  };

  // Analyze image with Morocco heritage context
  const analyzeImage = async (
    imageData,
    isVoiceQuestion = false,
    question = ""
  ) => {
    if (!apiKey) {
      setError("Please enter your Azure OpenAI API key");
      return;
    }

    try {
      setIsAnalyzing(true);

      const azureEndpoint =
        "https://highleads-01.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2025-01-01-preview";

      const systemPrompt = `You are an expert Moroccan heritage and tourism guide with deep knowledge of Morocco's cultural treasures. You specialize in:

🏛️ ARCHITECTURE & SITES:
- Traditional riads, kasbahs, and medinas
- Islamic architecture (minarets, courtyards, arches)
- UNESCO World Heritage sites (Fez, Marrakech, Meknes, etc.)
- Ancient Roman ruins (Volubilis) and Berber settlements

🎨 ART & CRAFTS:
- Zellige (geometric tilework) and intricate mosaics
- Arabic calligraphy and Islamic geometric patterns
- Traditional pottery from Fez and Safi
- Berber carpets and textiles
- Metalwork, leather goods, and woodcarving

🏺 CULTURAL ELEMENTS:
- Traditional Moroccan clothing (djellabas, kaftans, turbans)
- Tea culture and ceremonial objects
- Traditional markets (souks) and their significance
- Religious and cultural symbols
- Historical context and stories behind artifacts

🌍 TOURISM GUIDANCE:
- Provide context tourists need to appreciate what they're seeing
- Explain cultural significance and historical importance
- Share interesting stories and local legends
- Help tourists understand proper etiquette and customs

COMMUNICATION STYLE:
- Be enthusiastic and welcoming like a friendly local guide
- Use vivid, engaging descriptions that bring history to life
- Provide practical insights tourists can use
- Be conversational and encourage questions
- Keep automatic descriptions concise (1-2 sentences) but be detailed when asked specific questions`;

      const userPrompt = isVoiceQuestion
        ? `A tourist is asking: "${question}" about what they see in this image. Please provide a detailed, engaging answer about the Moroccan cultural and heritage aspects. Include historical context, cultural significance, and interesting facts that would fascinate a visitor to Morocco.`
        : 'Analyze this image for any traditional Moroccan, Islamic, or North African cultural elements. If you see architecture, patterns, crafts, clothing, or other heritage items, provide a brief but engaging description. If the scene shows a typical Moroccan setting (medina, riad, souk, etc.), describe its significance. If nothing culturally significant is visible, just say "Exploring..." and wait for the scene to change.';

      const response = await fetch(azureEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: [
                { type: "text", text: userPrompt },
                {
                  type: "image_url",
                  image_url: {
                    url: imageData,
                    detail: "low",
                  },
                },
              ],
            },
          ],
          max_completion_tokens: isVoiceQuestion ? 300 : 150,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      const newDescription =
        result.choices[0]?.message?.content || "No description available";

      if (isVoiceQuestion) {
        const newMessage = {
          type: "assistant",
          content: newDescription,
          timestamp: new Date(),
        };
        setConversation((prev) => [...prev, newMessage]);
        speakText(newDescription);
      } else {
        // Only update and speak if scene changed significantly
        if (hasSceneChanged(imageData, lastImageRef.current)) {
          // Only speak if there's meaningful cultural content (not just "Exploring...")
          setDescription(newDescription);
          if (!newDescription.toLowerCase().includes("exploring...")) {
            speakText(newDescription);
          }
          lastImageRef.current = imageData;
        }
      }

      setError("");
    } catch (err) {
      setError(`Analysis failed: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Text-to-speech
  const speakText = (text) => {
    if (!synthesisRef.current || !audioEnabled) return;

    synthesisRef.current.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthesisRef.current.speak(utterance);
  };

  // Handle voice questions
  const handleVoiceQuestion = async (question) => {
    if (!question.trim()) return;

    const userMessage = {
      type: "user",
      content: question,
      timestamp: new Date(),
    };
    setConversation((prev) => [...prev, userMessage]);

    const currentImage = captureScreenshot();
    if (currentImage) {
      await analyzeImage(currentImage, true, question);
    }
  };

  // Toggle voice recognition
  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition not supported in this browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Start automatic capture and analysis
  const startAutomaticCapture = () => {
    intervalRef.current = setInterval(() => {
      const imageData = captureScreenshot();
      if (imageData && !isAnalyzing) {
        analyzeImage(imageData);
      }
    }, captureInterval);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  // Update interval when changed
  useEffect(() => {
    if (isStreaming && intervalRef.current) {
      clearInterval(intervalRef.current);
      startAutomaticCapture();
    }
  }, [captureInterval, isStreaming]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <MapPin className="w-10 h-10 text-yellow-400" />
            Moroccan Heritage Guide
          </h1>
          <p className="text-orange-200">
            Explore Morocco's rich culture and traditions with AI-powered
            guidance
          </p>
        </div>

        {/* API Key Input */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <label className="block text-white font-medium mb-2">
            Azure OpenAI API Key (required)
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Azure OpenAI API key"
            className="w-full px-4 py-3 bg-black/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Controls */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-white font-medium mb-2">
                Scan Interval (ms)
              </label>
              <input
                type="number"
                value={captureInterval}
                onChange={(e) => setCaptureInterval(Number(e.target.value))}
                min="3000"
                max="15000"
                step="1000"
                className="w-full px-3 py-2 bg-black/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Scene Sensitivity
              </label>
              <select
                value={changeThreshold}
                onChange={(e) => setChangeThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 bg-black/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value={0.1}>High (Sensitive)</option>
                <option value={0.3}>Medium (Balanced)</option>
                <option value={0.5}>Low (Major changes only)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  audioEnabled
                    ? "bg-green-500 text-white"
                    : "bg-gray-500 text-white"
                }`}
              >
                {audioEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
                Audio {audioEnabled ? "On" : "Off"}
              </button>
            </div>

            <div className="flex gap-2">
              {!isStreaming ? (
                <button
                  onClick={startStream}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all transform hover:scale-105"
                >
                  <Play className="w-4 h-4" />
                  Start Guide
                </button>
              ) : (
                <button
                  onClick={stopStream}
                  className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all transform hover:scale-105"
                >
                  <Square className="w-4 h-4" />
                  Stop
                </button>
              )}
            </div>
          </div>

          {isStreaming && (
            <div className="flex gap-4">
              <button
                onClick={toggleListening}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  isListening
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
                {isListening ? "Stop Listening" : "Ask Questions"}
              </button>

              {(isAnalyzing || isSpeaking) && (
                <div className="flex items-center gap-2 text-white">
                  <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                  {isAnalyzing ? "Analyzing..." : "Speaking..."}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Feed */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Camera View
            </h2>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted
                playsInline
              />
            </div>
            <canvas ref={canvasRef} className="hidden" />

            {description && (
              <div className="mt-4 p-4 bg-black/20 rounded-lg border border-white/20">
                <h3 className="text-white font-medium mb-2">Current Scene:</h3>
                <p className="text-white/90 text-sm">{description}</p>
              </div>
            )}
          </div>

          {/* Conversation */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Conversation
            </h2>

            <div className="bg-black/20 rounded-lg p-4 h-80 overflow-y-auto border border-white/20">
              {conversation.length === 0 ? (
                <p className="text-white/50 italic text-center">
                  {isStreaming
                    ? "🕌 Ready to explore Morocco's heritage! Point your camera at traditional elements and ask questions..."
                    : "🇲🇦 Start your Moroccan heritage journey by activating the guide"}
                </p>
              ) : (
                <div className="space-y-3">
                  {conversation.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg ${
                        msg.type === "user"
                          ? "bg-blue-500/20 border-l-4 border-blue-400 text-blue-100"
                          : "bg-orange-500/20 border-l-4 border-orange-400 text-orange-100"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-xs">
                          {msg.type === "user" ? "You" : "Guide"}
                        </span>
                        <span className="text-xs opacity-60">
                          {msg.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {isListening && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 text-green-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Listening for your question...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 bg-red-500/20 border border-red-500/50 rounded-2xl p-4">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Tourism Usage Guide */}
        <div className="mt-8 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">
            🧭 How to Use Your Heritage Guide:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/80 text-sm">
            <div>
              <h4 className="font-medium text-green-300 mb-2">
                📱 Getting Started:
              </h4>
              <ul className="space-y-1">
                <li>• Enter your API key</li>
                <li>• Click "Start Guide"</li>
                <li>• Allow camera access</li>
                <li>• Point at heritage elements</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-300 mb-2">
                🎯 Best Results:
              </h4>
              <ul className="space-y-1">
                <li>• Focus on traditional patterns</li>
                <li>• Capture architectural details</li>
                <li>• Show crafts and artifacts</li>
                <li>• Ask specific questions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-orange-300 mb-2">
                🗣️ Voice Features:
              </h4>
              <ul className="space-y-1">
                <li>• Click "Ask Questions" to talk</li>
                <li>• Ask about cultural significance</li>
                <li>• Request historical context</li>
                <li>• Get audio descriptions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Info */}
        <div className="mt-6 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">
            🇲🇦 Moroccan Heritage Expertise:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80 text-sm">
            <div>
              <h4 className="font-medium text-orange-300 mb-2">
                🏛️ Architecture & Sites:
              </h4>
              <ul className="space-y-1">
                <li>• Riads, kasbahs, and medinas</li>
                <li>• Islamic geometric patterns</li>
                <li>• UNESCO heritage sites</li>
                <li>• Traditional building techniques</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-orange-300 mb-2">
                🎨 Crafts & Culture:
              </h4>
              <ul className="space-y-1">
                <li>• Zellige tilework & mosaics</li>
                <li>• Berber textiles & carpets</li>
                <li>• Traditional pottery & metalwork</li>
                <li>• Arabic calligraphy & symbols</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoroccanHeritageGuide;
