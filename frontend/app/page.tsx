// frontend/app/page.tsx
"use client";

import React, { useEffect } from "react"; // Added useEffect
import {
  MapPin,
  Star,
  Book,
  Camera,
  Zap,
  Compass,
  Eye,
  MessageCircle,
  Brain,
  Building,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// --- Header Component ---
const Header = () => {
  return (
    <header className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-100 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-morocco-orange rounded-lg flex items-center justify-center">
            <Building className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">
            Medina Navigator
          </span>
        </div>
        <Button className="bg-morocco-orange hover:bg-morocco-orange/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">
          Get Started
        </Button>
      </div>
    </header>
  );
};

// --- HeroSection Component ---
const heroSectionFeaturesData = [
  {
    Icon: Camera,
    title: "🔍 AI Vision",
    description:
      "Identify traditional crafts and decode their cultural significance",
    gradient: "from-morocco-teal to-morocco-navy",
  },
  {
    Icon: MapPin,
    title: "🗺️ Sacred Routes",
    description: "Navigate ancient medinas with culturally-aware pathfinding",
    gradient: "from-morocco-gold to-morocco-orange",
  },
  {
    Icon: Brain,
    title: "🗣️ Cultural Conversations",
    description:
      "Engage in natural voice conversations about Morocco's rich history and traditions",
    gradient: "from-morocco-red to-morocco-teal",
    fullWidth: true,
  },
];

const HeroSection = () => {
  return (
    <section className="morocco-gradient min-h-screen flex items-center relative overflow-hidden geometric-pattern pt-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 star-pattern opacity-30 animate-pulse" />
        <div className="absolute bottom-32 left-16 w-48 h-48 star-pattern opacity-20 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 star-pattern opacity-25 animate-pulse delay-500" />
      </div>
      <div className="absolute inset-0">
        <img
          src="/1ea2337b-ab1b-496c-a506-3551165d98f3.png"
          alt="Moroccan Geometric Pattern"
          className="absolute top-10 right-10 w-32 h-32 opacity-10 animate-pulse"
        />
        <img
          src="/1ea2337b-ab1b-496c-a506-3551165d98f3.png"
          alt="Moroccan Geometric Pattern"
          className="absolute bottom-20 left-10 w-24 h-24 opacity-5 animate-pulse delay-700"
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="space-y-10">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 moroccan-card px-6 py-3 rounded-full backdrop-blur-sm">
              <Star className="w-5 h-5 text-morocco-gold animate-pulse" />
              <span className="text-sm font-bold text-gray-800 tracking-wide">
                AI-Powered Cultural Navigator
              </span>
            </div>
            <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight pb-4">
              Discover the Hidden{" "}
              <span className="bg-gradient-to-r from-morocco-red via-morocco-gold to-morocco-teal bg-clip-text text-transparent">
                Treasures of the Medina
              </span>
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed max-w-xl">
              Your intelligent companion for exploring Morocco's rich cultural
              heritage. Discover hidden stories, decode traditional crafts, and
              navigate ancient medinas with AI guidance.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-gradient-to-r from-morocco-red to-morocco-orange hover:from-morocco-orange hover:to-morocco-gold text-white px-12 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl">
              🕌 Begin Journey
            </Button>
            <Button
              variant="outline"
              className="border-2 border-morocco-teal text-morocco-navy hover:bg-morocco-teal hover:text-white px-12 py-4 rounded-xl font-bold text-lg transition-all backdrop-blur-sm moroccan-card"
            >
              🎯 Explore Features
            </Button>
          </div>
        </div>
        <div className="space-y-8 relative">
          <div className="relative mb-8">
            <img
              src="/a1f5f943-5fb4-4a66-82af-9bdd8a2fdf06.png"
              alt="Traditional Moroccan Architecture"
              className="w-full h-64 object-cover rounded-2xl shadow-2xl moroccan-card"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-morocco-navy/40 to-transparent rounded-2xl" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-lg font-bold">🕌 Sacred Architecture</p>
              <p className="text-sm opacity-90">
                Ancient wisdom meets modern technology
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {heroSectionFeaturesData.map((feature, index) => (
              <Card
                key={index}
                className={`moroccan-card p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105 group ${
                  feature.fullWidth ? "col-span-2" : ""
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                  >
                    <feature.Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- FeaturesSection Component ---
const featuresData = [
  {
    icon: Eye,
    title: "Cultural Object Recognition",
    description:
      "Point your camera at traditional artifacts, zellige tiles, or architectural details to discover their cultural significance and craftsmanship techniques",
    color: "from-morocco-teal to-morocco-navy",
  },
  {
    icon: MapPin,
    title: "Location-Aware Heritage Guide",
    description:
      "AI-powered location intelligence that suggests culturally significant sites, monuments, and hidden gems based on your exact position",
    color: "from-morocco-gold to-morocco-orange",
  },
  {
    icon: MessageCircle,
    title: "Voice Cultural Assistant",
    description:
      "Natural voice conversations about Moroccan history, traditions, architecture, and local customs in multiple languages",
    color: "from-morocco-red to-morocco-orange",
  },
  {
    icon: Compass,
    title: "Sacred Navigation",
    description:
      "Intelligent pathfinding through ancient medinas with respect for cultural sensitivities and prayer times",
    color: "from-morocco-navy to-morocco-teal",
  },
  {
    icon: Book,
    title: "Living Heritage Stories",
    description:
      "Deep dive into the rich oral traditions, architectural marvels, and artisan crafts that define Morocco's cultural identity",
    color: "from-morocco-gold to-morocco-red",
  },
  {
    icon: Zap,
    title: "Real-Time Cultural Events",
    description:
      "Stay connected with live information about festivals, traditional markets, religious observances, and cultural celebrations",
    color: "from-morocco-teal to-morocco-gold",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-morocco-cream to-white relative overflow-hidden geometric-pattern">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-40 h-40 star-pattern opacity-5" />
        <div className="absolute bottom-20 right-20 w-32 h-32 star-pattern opacity-10" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 star-pattern opacity-8" />
      </div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20 pb-8">
          <div className="flex mx-auto items-center justify-center space-x-3 moroccan-card px-6 py-3 rounded-full mb-6 w-max">
            <Star className="w-6 h-6 text-morocco-gold animate-pulse" />
            <span className="text-sm font-bold text-gray-700 tracking-wide uppercase">
              Advanced Cultural Intelligence
            </span>
          </div>
          <h2 className="text-6xl font-bold text-gray-900 mb-8">
            Where Ancient Wisdom Meets{" "}
            <span className="bg-gradient-to-r from-morocco-red via-morocco-gold to-morocco-teal bg-clip-text text-transparent">
              Modern Technology
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Experience Morocco's cultural treasures through an intelligent lens
            that respects tradition while embracing innovation
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <Card
              key={index}
              className="moroccan-card p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-20 h-20 star-pattern opacity-5 group-hover:opacity-10 transition-opacity" />
              <div className="flex flex-col items-start space-y-6">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-all group-hover:scale-110`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-morocco-gold via-morocco-teal to-morocco-red opacity-0 group-hover:opacity-100 transition-opacity" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Footer Component ---
const footerLinks = [
  { name: "About Us", href: "#" },
  { name: "Contact", href: "#" },
  { name: "Privacy Policy", href: "#" },
  { name: "Terms of Service", href: "#" },
];

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center space-y-8">
          <div className="flex items-center space-x-4">
            <Camera className="w-6 h-6 text-morocco-orange" />
            <MapPin className="w-6 h-6 text-morocco-orange" />
            <Brain className="w-6 h-6 text-morocco-orange" />
          </div>
          <nav className="flex flex-wrap justify-center gap-8 text-gray-600">
            {footerLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-morocco-orange transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="text-center text-gray-600">
            <p>
              © {new Date().getFullYear()} Medina Navigator. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main Exported Page Component ---
export default function HomePage() {
  useEffect(() => {
    // Check if the script has already been added to avoid duplicates during HMR
    if (document.getElementById("highleads-chatbot-script")) {
      return;
    }

    const loadChatbotScript = async () => {
      // @ts-ignore // To tell TypeScript that window.__ch will be defined
      window.__ch = {
        id: "26c87f60-03e2-4c75-addb-5f2f7e551ba8",
        url: "https://console.highleads.co",
      };

      try {
        const response = await fetch(
          "https://console.highleads.co/api/chatbot/26c87f60-03e2-4c75-addb-5f2f7e551ba8"
        );
        if (!response.ok) {
          console.error(
            "Highleads API check failed:",
            response.status,
            response.statusText
          );
          return;
        }

        // Ensure the main script loader is only added once
        if (
          document.querySelector(
            'script[src="https://console.highleads.co/widgets/index.js"]'
          )
        ) {
          return;
        }

        var be = document.createElement("script");
        be.id = "highleads-chatbot-script"; // Add an ID to the script
        be.type = "text/javascript";
        be.src = "https://console.highleads.co/widgets/index.js";
        be.async = true; // Good practice for external scripts

        var s = document.getElementsByTagName("script")[0];
        if (s && s.parentNode) {
          s.parentNode.insertBefore(be, s);
        } else {
          // Fallback if no script tag is found (less likely but safe)
          document.head.appendChild(be);
        }
      } catch (error) {
        console.error("Error loading Highleads chatbot script:", error);
      }
    };

    loadChatbotScript();

    // Optional: Cleanup function if the component unmounts,
    // though for a chatbot script that adds a global widget,
    // cleanup might involve removing the widget and the script itself,
    // which can be complex and might not be desired if navigating away and back.
    // For this case, we'll assume the script manages its own presence.
    // return () => {
    //   const scriptElement = document.getElementById('highleads-chatbot-script');
    //   if (scriptElement && scriptElement.parentNode) {
    //     scriptElement.parentNode.removeChild(scriptElement);
    //   }
    //   // You might also need to remove the widget UI and any global variables set by the script
    //   // delete window.__ch; // Be careful with this
    // };
  }, []); // Empty dependency array means this effect runs once after initial render

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
      {/* The chatbot script will append its UI to the body, so no specific placeholder needed here */}
    </div>
  );
}
