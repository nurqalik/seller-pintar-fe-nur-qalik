"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import EditArticleModal from "./edit-article-modal"
import DeleteConfirmModal from "./delete-confirm-modal"
import Pagination from "./pagination"
import { toast } from "sonner"
import axios from "axios"
import { useTotalArticle } from "../../../store/userdata"

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

// const mockArticles: Article[] = [
//   {
//     id: 1,
//     title: "Cybersecurity Essentials Every Developer Should Know",
//     category: "Technology",
//     createdAt: "April 13, 2025 10:56:12",
//     thumbnail: "/placeholder.svg?height=60&width=60",
//   },
//   {
//     id: 2,
//     title: "The Future of Work: Remote-First Teams and Digital Tools",
//     category: "Technology",
//     createdAt: "April 13, 2025 10:56:12",
//     thumbnail: "/placeholder.svg?height=60&width=60",
//   },
//   {
//     id: 3,
//     title: "Design Systems: Why Your Team Needs One in 2025",
//     category: "Technology",
//     createdAt: "April 13, 2025 10:56:12",
//     thumbnail: "/placeholder.svg?height=60&width=60",
//   },
//   {
//     id: 4,
//     title: "Web3 and the Decentralized Internet: What You Need to...",
//     category: "Technology",
//     createdAt: "April 13, 2025 10:56:12",
//     thumbnail: "/placeholder.svg?height=60&width=60",
//   },
//   {
//     id: 5,
//     title: "Debugging Like a Pro: Tools & Techniques for Faster Fixes",
//     category: "Technology",
//     createdAt: "April 13, 2025 10:56:12",
//     thumbnail: "/placeholder.svg?height=60&width=60",
//   },
//   {
//     id: 6,
//     title: "Accessibility in Design: More Than Just Compliance",
//     category: "Technology",
//     createdAt: "April 13, 2025 10:56:12",
//     thumbnail: "/placeholder.svg?height=60&width=60",
//   },
//   {
//     id: 7,
//     title: "Figma's New Dev Mode: A Game-Changer for Designers & Developers",
//     category: "Technology",
//     createdAt: "April 13, 2025 10:56:12",
//     thumbnail: "/placeholder.svg?height=60&width=60",
//   },
//   {
//     id: 8,
//     title: "How AI Is Changing the Game in Front-End Development",
//     category: "Technology",
//     createdAt: "April 13, 2025 10:56:12",
//     thumbnail: "/placeholder.svg?height=60&width=60",
//   },
//   {
//     id: 9,
//     title: "UI Trends Dominating 2025",
//     category: "Technology",
//     createdAt: "April 13, 2025 10:56:12",
//     thumbnail: "/placeholder.svg?height=60&width=60",
//   },
//   {
//     id: 10,
//     title: "Debugging Like a Pro: Tools & Techniques for Faster Fixes",
//     category: "Technology",
//     createdAt: "April 13, 2025 10:56:12",
//     thumbnail: "/placeholder.svg?height=60&width=60",
//   },
//   // Add more articles to test pagination
//   {
//     id: 11,
//     title: "Advanced React Patterns for 2025",
//     category: "Development",
//     createdAt: "April 14, 2025 09:30:00",
//     thumbnail: "/placeholder.svg?height=60&width=60",
//   },
//   {
//     id: 12,
//     title: "Building Scalable APIs with Node.js",
//     category: "Development",
//     createdAt: "April 14, 2025 11:45:00",
//     thumbnail: "/placeholder.svg?height=60&width=60",
//   },
// ]

export default function ArticleTable({categoryId, title}: {categoryId: string, title: string}) {
  const [articles, setArticles] = useState<Article[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const { setTotalArticle } = useTotalArticle()
  const itemsPerPage = 10
  
  console.log(categoryId, title)

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true)
      try {
        const accessToken = localStorage.getItem('authToken')
        
        if (!accessToken) {
          toast.error('Access token not found. Please login again.')
          return
        }

        const response = await axios.get(`https://test-fe.mysellerpintar.com/api/articles?page=${currentPage}&limit=${itemsPerPage}&category=${categoryId}&title=${title}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })
        
        setArticles(response.data?.data)
        setTotalPages(response.data?.page)
        console.log(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching articles:', error)
        setIsLoading(false)
      }
    }

    fetchArticles()
  }, [categoryId, title, currentPage])

  useEffect(() => {
    setTotalArticle(articles.length)
  }, [articles, setTotalArticle])


  const handleEdit = (article: Article) => {
    setSelectedArticle(article)
    setIsEditModalOpen(true)
  }

  const handleDelete = (article: Article) => {
    setSelectedArticle(article)
    setIsDeleteModalOpen(true)
  }

  console.log(selectedArticle)

  const confirmDelete = async () => {
    if (selectedArticle) {
      try {
        const accessToken = typeof window !== undefined && localStorage.getItem('authToken')
        if (!accessToken) {
          toast.error('Access token not found. Please login again.')
          return
        }
        await axios.delete(`https://test-fe.mysellerpintar.com/api/articles/${selectedArticle.id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })
        setArticles(articles.filter((article) => article.id !== selectedArticle.id))
        toast.success('Article deleted successfully!')
      } catch (error) {
        console.log(error)
        const errorMessage = 'Failed to delete article. Please try again.'
        toast.error(errorMessage)
      } finally {
        setIsDeleteModalOpen(false)
        setSelectedArticle(null)
      }
    }
  }

  const handleEditArticle = (updatedArticle: Article) => {
    setArticles(articles.map((article) => (article.id === updatedArticle.id ? updatedArticle : article)))
  }

  return (
    <>
      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Thumbnails
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Created at
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Actions
              </th>
            </tr>
          </thead>
          {isLoading ? <div>Loading...</div> : (
            <tbody className="divide-y divide-gray-200 bg-white">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="h-12 w-12 overflow-hidden rounded-md">
                    <Image
                      src={article.imageUrl || "/placeholder.svg"}
                      alt={article.title}
                      width={60}
                      height={60}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{article.title}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-500">{article.category?.name}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-500">{article.createdAt}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(article)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(article)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          )}
        </table>
      </div>

      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalData={0} />}

      <EditArticleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        article={selectedArticle}
        onEdit={handleEditArticle}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Article"
        message={`Are you sure you want to delete "${selectedArticle?.title}"? This action cannot be undone.`}
      />
    </>
  )
}
