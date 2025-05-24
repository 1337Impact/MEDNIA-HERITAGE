"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface LocationButtonProps {
  onClick: () => void
  isLoading: boolean
  icon: React.ReactNode
  text: string
  variant?: "default" | "outline"
  className?: string
  disabled?: boolean
}

export function LocationButton({
  onClick,
  isLoading,
  icon,
  text,
  variant = "default",
  className = "",
  disabled = false,
}: LocationButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading || disabled}
      variant={variant}
      className={`h-10 ${
        variant === "outline"
          ? "border-teal-300 text-teal-700 hover:bg-teal-50"
          : "bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white"
      } ${className}`}
    >
      {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <span className="mr-2">{icon}</span>}
      {text}
    </Button>
  )
}
