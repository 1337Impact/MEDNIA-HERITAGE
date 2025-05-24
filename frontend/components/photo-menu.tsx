"use client"

import { Camera, Upload } from "lucide-react"
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
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Menu */}
      <div className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50 min-w-48">
        <div className="p-2">
          <Button
            onClick={() => {
              onTakePhoto()
              onClose()
            }}
            variant="ghost"
            className="w-full justify-start gap-3 h-12 hover:bg-teal-50 text-gray-700"
          >
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
              <Camera className="w-4 h-4 text-teal-600" />
            </div>
            Take Photo
          </Button>

          <Button
            onClick={() => {
              onUploadPhoto()
              onClose()
            }}
            variant="ghost"
            className="w-full justify-start gap-3 h-12 hover:bg-blue-50 text-gray-700"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Upload className="w-4 h-4 text-blue-600" />
            </div>
            Upload Photo
          </Button>
        </div>
      </div>
    </>
  )
}
