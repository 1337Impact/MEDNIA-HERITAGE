"use client";

import Link from "next/link";
import {
  Camera,
  Navigation2,
  LandmarkIcon,
  MapPin,
  Globe2,
  Clock,
  Info,
  ChefHat,
  History,
  Star,
  MapIcon,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-moroccan-terracotta/5 to-moroccan-gold/10">
      {/* Traditional Pattern Overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-10 moroccan-pattern" />

      {/* Header */}
      <header className="flex items-center justify-between border-b border-solid border-moroccan-brown/20 px-4 py-3 md:px-6 lg:px-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
              <LandmarkIcon className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900">
              Medina Navigator
            </h1>
          </div>
          <Link
            href="/chat"
            className="flex h-8 md:h-10 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl px-3 md:px-4 bg-moroccan-terracotta text-white text-sm font-bold leading-normal tracking-[0.015em]"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mt-[72px] pt-16">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-24">
          <div className="grid gap-12 md:grid-cols-2 md:gap-8">
            <div className="flex flex-col justify-center">
              <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl">
                Discover the Hidden
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  {" "}
                  Treasures{" "}
                </span>
                of the Medina
              </h1>
              <p className="mb-8 text-lg text-gray-600 md:text-xl">
                Your AI-powered guide to Morocco's rich cultural heritage. Snap
                photos, explore history, and navigate traditional markets with
                real-time insights.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/chat"
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-moroccan-terracotta text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
                >
                  <Camera className="h-5 w-5" />
                  Start Exploring
                </Link>
                <button className="flex items-center gap-2 rounded-full border-2 border-orange-100 bg-white px-8 py-3 font-semibold text-orange-600 transition-all hover:border-orange-200 hover:bg-orange-50">
                  <Info className="h-5 w-5" />
                  Learn More
                </button>
              </div>
            </div>
            {/* Feature Cards */}
            <div className="relative">
              <div className="absolute inset-0 -left-4 -top-4 rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 blur-2xl" />
              <div className="relative grid gap-4">
                <div className="rounded-2xl border border-amber-100 bg-white/80 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                    <Camera className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    Instant Recognition
                  </h3>
                  <p className="text-gray-600">
                    Take a photo of any architectural detail, craft, or landmark
                    and get instant historical context
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-white/80 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                    <Navigation2 className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    Smart Navigation
                  </h3>
                  <p className="text-gray-600">
                    Discover nearby heritage sites, traditional food spots, and
                    artisan workshops
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-white/80 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                    <Globe2 className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    Cultural Insights
                  </h3>
                  <p className="text-gray-600">
                    Learn about local traditions, etiquette, and the stories
                    behind every corner
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="bg-gradient-to-b from-amber-50 to-orange-50 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
              Everything You Need to Explore the Medina
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: MapPin,
                  title: "Location Aware",
                  description:
                    "Real-time updates about heritage sites and points of interest around you",
                },
                {
                  icon: ChefHat,
                  title: "Food Discovery",
                  description:
                    "Find authentic local cuisine and traditional food spots nearby",
                },
                {
                  icon: History,
                  title: "Historical Context",
                  description:
                    "Learn about the rich history and cultural significance of every location",
                },
                {
                  icon: Star,
                  title: "Local Recommendations",
                  description:
                    "Get insider tips and recommendations from local experts",
                },
                {
                  icon: MapIcon,
                  title: "Custom Routes",
                  description:
                    "Create personalized walking tours based on your interests",
                },
                {
                  icon: Clock,
                  title: "Real-Time Updates",
                  description:
                    "Stay informed about opening hours, prices, and crowd levels",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group relative rounded-2xl border border-amber-100 bg-white p-6 transition-all hover:border-amber-200 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 text-orange-600 group-hover:from-amber-100 group-hover:to-orange-100">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <footer className="flex flex-col gap-6 px-5 py-10 text-center @container">
          <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
            <Link
              href="#"
              className="text-moroccan-brown text-base font-normal leading-normal min-w-40"
            >
              About Us
            </Link>
            <Link
              href="#"
              className="text-moroccan-brown text-base font-normal leading-normal min-w-40"
            >
              Contact
            </Link>
            <Link
              href="#"
              className="text-moroccan-brown text-base font-normal leading-normal min-w-40"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-moroccan-brown text-base font-normal leading-normal min-w-40"
            >
              Terms of Service
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#"
              className="text-moroccan-brown hover:text-moroccan-terracotta"
            >
              <Camera className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="text-moroccan-brown hover:text-moroccan-terracotta"
            >
              <Navigation2 className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="text-moroccan-brown hover:text-moroccan-terracotta"
            >
              <Globe2 className="h-5 w-5" />
            </Link>
          </div>
          <p className="text-moroccan-brown text-base font-normal leading-normal">
            &copy; 2023 Medina Navigator. All rights reserved.
          </p>
        </footer>
      </section>
    </div>
  );
}
