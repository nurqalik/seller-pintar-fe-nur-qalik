"use client"

import { useEffect, useState } from "react"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import ArticleTable from "@/components/dashboard/article-table"
import AddArticleModal from "@/components/dashboard/add-article-modal"
import Sidebar from "@/components/dashboard/sidebar"
import axios from "axios"
import { useTotalArticle } from "../../../store/userdata"

interface Category {
  id: string
  name: string,
  createdAt: string,
  updatedAt: string,
  userId: string
}

export default function Dashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isloading, setIsLoading] = useState(false)
  const [category, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [input, setInput] = useState('')
  const [rawInput, setRawInput] = useState('')
  const { totalArticle } = useTotalArticle()

  console.log(category)

  // Debounce effect for search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setInput(rawInput)
    }, 300)
    return () => {
      clearTimeout(handler)
    }
  }, [rawInput])

  useEffect(() => {
    const fetchCategories = async () => {
        setIsLoading(true)
      try {
        const accessToken = localStorage.getItem('authToken')
        
        if (!accessToken) {
          console.error('Access token not found')
          return
        }

        const response = await axios.get(`https://test-fe.mysellerpintar.com/api/categories`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })
        
        setCategories(response.data?.data)
        console.log(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    console.log(totalArticle)
  }, [totalArticle])
  

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Articles</h1>
            <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Article
            </Button>
          </div>
          <div className="mt-6">
            <p className="text-sm text-gray-600">Total Articles : {Number(totalArticle?.total)}</p>
            <div className="mt-4 flex gap-4">
              {isloading ? <div>Loading...</div> : (
              <div className="relative inline-block">
                <select
                  className="h-10 w-32 appearance-none rounded border border-gray-300 bg-white pl-3 pr-8 text-sm focus:outline-none"
                  defaultValue=""
                >
                  <option value="" onClick={() => setSelectedCategory('')}>
                    Category
                  </option>
                  {category.map((category:Category) => (
                  <option key={category?.id} value={category?.id} onClick={() => setSelectedCategory(category?.id)}>{category?.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              )}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by title"
                  className="h-10 w-full rounded border border-gray-300 pl-10 pr-4 text-sm focus:outline-none"
                  onChange={(e) => setRawInput(e.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          <ArticleTable categoryId={selectedCategory} title={input} />
        </div>
      </main>
      <AddArticleModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  )
}
