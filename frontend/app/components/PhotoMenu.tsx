"use client"
import { Camera, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PhotoMenuProps {
  isOpen: boolean
  onClose: () => void
  onTakePhoto: () => void
  onUploadPhoto: () => void
}

export function PhotoMenu({ isOpen, onClose, onTakePhoto, onUploadPhoto }: PhotoMenuProps) {
  if (!isOpen) return null

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-rose-200/50 overflow-hidden">
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-800">📸 Capture Heritage</h3>
          <Button onClick={onClose} variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-rose-100">
            <X className="w-3 h-3" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onTakePhoto}
            variant="outline"
            size="sm"
            className="flex flex-col items-center gap-1 sm:gap-2 h-auto py-2 sm:py-3 border-rose-200 hover:bg-rose-50"
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />
            <span className="text-xs font-medium text-center leading-tight">
              التقط صورة
              <br />
              Take Photo
            </span>
          </Button>

          <Button
            onClick={onUploadPhoto}
            variant="outline"
            size="sm"
            className="flex flex-col items-center gap-1 sm:gap-2 h-auto py-2 sm:py-3 border-rose-200 hover:bg-rose-50"
          >
            <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />
            <span className="text-xs font-medium text-center leading-tight">
              ارفع صورة
              <br />
              Upload Photo
            </span>
          </Button>
        </div>

        <p className="text-xs text-gray-600 mt-2 sm:mt-3 text-center">
          Focus on architectural details, patterns, or decorative elements
        </p>
      </div>
    </div>
  )
}
