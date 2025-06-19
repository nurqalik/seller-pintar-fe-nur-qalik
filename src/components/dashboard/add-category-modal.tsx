"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { toast } from "sonner"

interface Category {
  name: string
}

interface AddCategoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddCategoryModal({ isOpen, onClose }: AddCategoryModalProps) {
  const [formData, setFormData] = useState({ name: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Category name is required')
      return
    }

    try {
      // Get access token from localStorage
      const accessToken = typeof window !== undefined && localStorage.getItem('authToken')
      
      if (!accessToken) {
        toast.error('Access token not found. Please login again.')
        return
      }

      const response = await axios.post('https://test-fe.mysellerpintar.com/api/categories', {
        name: formData.name.trim()
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      
      const category: Category = response.data
      console.log(category)
      toast.success('Category added successfully!')
      onClose()
      setFormData({ name: "" })
    } catch (error) {
      console.error('Error adding category:', error);

      let errorMessage = 'Failed to add category. Please try again.';

      // Type guard for AxiosError
      function isAxiosError(err: unknown): err is import('axios').AxiosError {
        return (
          typeof err === 'object' &&
          err !== null &&
          'isAxiosError' in err &&
          (err as import('axios').AxiosError).isAxiosError === true
        );
      }

      if (isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 401) {
            errorMessage = 'Unauthorized. Please login again.';
          } else {
            errorMessage =
              (error.response.data as { message?: string; error?: string })?.message ||
              (error.response.data as { message?: string; error?: string })?.error ||
              errorMessage;
          }
        } else if (error.request) {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
      }

      toast.error(errorMessage);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-400/50 bg-opacity-0">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Add New Category</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Add Category
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
