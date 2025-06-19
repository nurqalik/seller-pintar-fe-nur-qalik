"use client"

import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  onConfirm: () => void
}

export default function DeleteConfirmModal({ isOpen, onClose, title, message, onConfirm }: DeleteConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-400/50 bg-opacity-0">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-red-600">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-start space-x-3 mb-6">
          <AlertTriangle className="h-6 w-6 text-red-500 mt-0.5" />
          <p className="text-sm text-gray-700">{message}</p>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white">
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
