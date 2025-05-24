"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"

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
      size="sm"
      className={`${className} transition-all duration-200 h-8 sm:h-10`}
    >
      {isLoading ? (
        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
      ) : (
        <span className="mr-1 sm:mr-2">{icon}</span>
      )}
      <span className="text-xs font-medium hidden sm:inline">{text}</span>
      <span className="text-xs font-medium sm:hidden">{text.split(" | ")[0]}</span>
    </Button>
  )
}
