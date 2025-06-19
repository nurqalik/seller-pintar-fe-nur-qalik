"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from "axios"
import Image from "next/image"

interface user {
  id: string
  username: string
}

interface category {
  id: string
  userId: string
  name: string
  createdAt: string
  updatedAt: string
}

interface Article {
  id: string
  userId: string
  categoryId: string
  title: string
  content: string
  imageUrl: string
  createdAt: string
  updatedAt: string
  category: category
  user: user
}

interface EditArticleModalProps {
  isOpen: boolean
  onClose: () => void
  article: Article | null
  onEdit: (article: Article) => void
}

export default function EditArticleModal({ isOpen, onClose, article }: EditArticleModalProps) {
  const [formData, setFormData] = useState({
    title: article?.title || "",
    category: article?.categoryId || "",
    thumbnail: article?.imageUrl || "",
  })
  const [categories, setCategories] = useState<category[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const fetchCategories = async () => {
      try {
        const accessToken = localStorage.getItem('authToken')
        if (!accessToken) return
        const response = await axios.get(`https://test-fe.mysellerpintar.com/api/categories`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })
        setCategories(response.data?.data || [])
      } catch (error) {
        console.log(error)
        setCategories([])
      }
    }
    fetchCategories()
  }, [isOpen])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      const accessToken = typeof window !== undefined && localStorage.getItem('authToken')
      try {
        const uploadData = new FormData()
        uploadData.append('file', file)
        const uploadRes = await axios.post('https://test-fe.mysellerpintar.com/api/upload', imageFile, {
          headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'multipart/form-data' }
        })
        setFormData(prev => ({
          ...prev,
          thumbnail: uploadRes.data.url
        }))
      } catch (error) {
        console.log(error)
        // handle error if needed
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    const accessToken = typeof window !== undefined && localStorage.getItem('authToken')
    try {
      await axios.put(
        `https://test-fe.mysellerpintar.com/api/articles/${article?.id}`,
        {
          title: formData.title,
          categoryId: formData.category,
          imageUrl: formData.thumbnail
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )
      onClose()
    } catch (err) {
      console.log(err)
      // handle error
    } finally {
      setUploading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (!isOpen || !article) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-400/50 bg-opacity-0">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Edit Article</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail Image
            </label>
            <input
              type="file"
              id="thumbnail"
              name="thumbnail"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.thumbnail && (
              <Image src={formData.thumbnail} alt="Thumbnail" className="mt-2 h-16 w-16 object-cover rounded" />
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={uploading}>
              {uploading ? 'Updating...' : 'Update Article'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
