"use client"

import { useEffect, useState } from "react"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/dashboard/sidebar"
import Pagination from "@/components/dashboard/pagination"
import AddCategoryModal from "@/components/dashboard/add-category-modal"
import EditCategoryModal from "@/components/dashboard/edit-category-modal"
import DeleteConfirmModal from "@/components/dashboard/delete-confirm-modal"
import axios from "axios"
import { toast } from "sonner"

interface Category {
  id: number
  name: string,
  createdAt: string,
  updatedAt: string,
  userId: string
}

// const mockCategories: Category[] = [
//   {
//     id: 1,
//     name: "Technology",
//     createdAt: "2024-01-15T10:30:00Z",
//     updatedAt: "2024-01-15T10:30:00Z",
//     userId: "user_123"
//   },
//   {
//     id: 2,
//     name: "Design",
//     createdAt: "2024-01-16T14:20:00Z",
//     updatedAt: "2024-01-16T14:20:00Z",
//     userId: "user_456"
//   },
//   {
//     id: 3,
//     name: "Development",
//     createdAt: "2024-01-17T09:15:00Z",
//     updatedAt: "2024-01-17T09:15:00Z",
//     userId: "user_789"
//   },
//   {
//     id: 4,
//     name: "Business",
//     createdAt: "2024-01-18T16:45:00Z",
//     updatedAt: "2024-01-18T16:45:00Z",
//     userId: "user_101"
//   },
//   {
//     id: 5,
//     name: "Marketing",
//     createdAt: "2024-01-19T11:30:00Z",
//     updatedAt: "2024-01-19T11:30:00Z",
//     userId: "user_202"
//   },
//   {
//     id: 6,
//     name: "Productivity",
//     createdAt: "2024-01-20T13:25:00Z",
//     updatedAt: "2024-01-20T13:25:00Z",
//     userId: "user_303"
//   },
//   {
//     id: 7,
//     name: "AI & Machine Learning",
//     createdAt: "2024-01-21T08:40:00Z",
//     updatedAt: "2024-01-21T08:40:00Z",
//     userId: "user_404"
//   },
//   {
//     id: 8,
//     name: "Mobile Development",
//     createdAt: "2024-01-22T15:10:00Z",
//     updatedAt: "2024-01-22T15:10:00Z",
//     userId: "user_505"
//   },
//   {
//     id: 9,
//     name: "Web Development",
//     createdAt: "2024-01-23T12:55:00Z",
//     updatedAt: "2024-01-23T12:55:00Z",
//     userId: "user_606"
//   },
//   {
//     id: 10,
//     name: "Data Science",
//     createdAt: "2024-01-24T17:20:00Z",
//     updatedAt: "2024-01-24T17:20:00Z",
//     userId: "user_707"
//   },
//   {
//     id: 11,
//     name: "DevOps",
//     createdAt: "2024-01-25T10:05:00Z",
//     updatedAt: "2024-01-25T10:05:00Z",
//     userId: "user_808"
//   },
//   {
//     id: 12,
//     name: "Security",
//     createdAt: "2024-01-26T14:35:00Z",
//     updatedAt: "2024-01-26T14:35:00Z",
//     userId: "user_909"
//   },
// ]

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [totalData, setTotalData] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  console.log("categories:", categories)

  const itemsPerPage = 10

  useEffect(() => {
    const fetchCategories = async () => {
        setIsLoading(true)
      try {
        const accessToken = localStorage.getItem('authToken')
        
        if (!accessToken) {
          console.error('Access token not found')
          return
        }

        const response = await axios.get(`https://test-fe.mysellerpintar.com/api/categories?page=${currentPage}&limit=${itemsPerPage}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })
        
        setCategories(response.data?.data)
        setTotalPages(response.data?.totalPages)
        setTotalData(response.data?.totalData)
        console.log(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [currentPage])

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsEditModalOpen(true)
  }

  const handleDelete = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteModalOpen(true)
  }

  const onConfirmDelete = async (categoryId: number) => {
    try {
      // Get access token from localStorage
      const accessToken = typeof window !== undefined && localStorage.getItem('authToken')
      
      if (!accessToken) {
        toast.error('Access token not found. Please login again.')
        return
      }
  
      const response = await axios.delete(`https://test-fe.mysellerpintar.com/api/categories/${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('Category deleted:', response.data)
      toast.success('Category deleted successfully!')
      setIsDeleteModalOpen(false)
    } catch (error) {
      console.error('Error deleting category:', error);
      
      let errorMessage = 'Failed to delete category. Please try again.';

      // Type guard for AxiosError (without using any or unknown)
      if (typeof error === "object" && error !== null && "isAxiosError" in error && (error as import("axios").AxiosError).isAxiosError) {
        const axiosError = error as import("axios").AxiosError<{ message?: string; error?: string }>;
        if (axiosError.response) {
          if (axiosError.response.status === 401) {
            errorMessage = 'Unauthorized. Please login again.';
          } else {
            errorMessage = axiosError.response.data?.message || axiosError.response.data?.error || errorMessage;
          }
        } else if (axiosError.request) {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
      }
      
      toast.error(errorMessage)
    }
  }

  return (
    <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Categories</h1>
              <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-600">Total Categories : {totalData}</p>
              <div className="mt-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by category name"
                    className="h-10 w-full max-w-md rounded border border-gray-300 pl-10 pr-4 text-sm focus:outline-none"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
  
            <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Name
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
                  {categories?.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </td>
                      {/* <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-500">{category.createdAt}</div>
                      </td> */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(category)}
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
  
            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalData={totalData}/>
            )}
          </div>
        </main>
  
        <AddCategoryModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
  
        <EditCategoryModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          category={selectedCategory}
        />
  
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Category"
          message={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
          onConfirm={() => onConfirmDelete(selectedCategory?.id ?? 0)}
        />        
    </div>
  )
}
