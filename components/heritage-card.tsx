"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, MapPin, Clock, Lightbulb, Link } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface HeritageInfo {
  title: string
  period: string
  description: string
  significance: string
  location: string
  tips: string[]
  relatedElements: string[]
  confidence: number
}

interface HeritageCardProps {
  heritageInfo: HeritageInfo
}

export function HeritageCard({ heritageInfo }: HeritageCardProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const confidenceColor =
    heritageInfo.confidence > 0.8
      ? "bg-green-100 text-green-800"
      : heritageInfo.confidence > 0.6
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800"

  return (
    <Card className="border-orange-200 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl text-gray-900 mb-1">{heritageInfo.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              {heritageInfo.period}
            </CardDescription>
          </div>
          <Badge className={`${confidenceColor} border-0`}>{Math.round(heritageInfo.confidence * 100)}% match</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Description */}
        <p className="text-gray-700 leading-relaxed">{heritageInfo.description}</p>

        {/* Location */}
        <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
          <MapPin className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-700">{heritageInfo.location}</p>
        </div>

        <Separator className="bg-orange-200" />

        {/* Expandable Sections */}
        <div className="space-y-3">
          {/* Cultural Significance */}
          <div>
            <Button
              variant="ghost"
              onClick={() => toggleSection("significance")}
              className="w-full justify-between p-0 h-auto text-left hover:bg-transparent"
            >
              <span className="font-medium text-gray-900">Cultural Significance</span>
              {expandedSection === "significance" ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </Button>
            {expandedSection === "significance" && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 leading-relaxed">{heritageInfo.significance}</p>
              </div>
            )}
          </div>

          {/* Visitor Tips */}
          <div>
            <Button
              variant="ghost"
              onClick={() => toggleSection("tips")}
              className="w-full justify-between p-0 h-auto text-left hover:bg-transparent"
            >
              <span className="font-medium text-gray-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-orange-500" />
                Visitor Tips
              </span>
              {expandedSection === "tips" ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </Button>
            {expandedSection === "tips" && (
              <div className="mt-2 space-y-2">
                {heritageInfo.tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-orange-50 rounded">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Related Elements */}
          <div>
            <Button
              variant="ghost"
              onClick={() => toggleSection("related")}
              className="w-full justify-between p-0 h-auto text-left hover:bg-transparent"
            >
              <span className="font-medium text-gray-900 flex items-center gap-2">
                <Link className="w-4 h-4 text-orange-500" />
                Related Elements
              </span>
              {expandedSection === "related" ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </Button>
            {expandedSection === "related" && (
              <div className="mt-2 flex flex-wrap gap-2">
                {heritageInfo.relatedElements.map((element, index) => (
                  <Badge key={index} variant="outline" className="border-orange-300 text-orange-700 bg-orange-50">
                    {element}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
