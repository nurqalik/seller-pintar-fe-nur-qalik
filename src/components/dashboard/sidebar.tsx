"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, Grid, LogOut } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-blue-600 text-white">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center">
          <svg
            className="mr-2 h-6 w-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <path d="M8 12h8v2H8z" />
          </svg>
          <span className="text-xl font-bold">Logoipsum</span>
        </Link>
      </div>
      <nav className="mt-6 flex flex-col px-4">
        <Link
          href="/dashboard"
          className={`mb-2 flex items-center rounded-md px-4 py-3 text-white transition-colors ${
            pathname === "/dashboard" ? "bg-blue-700" : "hover:bg-blue-700"
          }`}
        >
          <FileText className="mr-3 h-5 w-5" />
          <span>Articles</span>
        </Link>
        <Link
          href="/dashboard/category"
          className={`mb-2 flex items-center rounded-md px-4 py-3 text-white transition-colors ${
            pathname === "/dashboard/category" ? "bg-blue-700" : "hover:bg-blue-700"
          }`}
        >
          <Grid className="mr-3 h-5 w-5" />
          <span>Category</span>
        </Link>
        <Link
          href="/login"
          className="mb-2 flex items-center rounded-md px-4 py-3 text-white transition-colors hover:bg-blue-700"
          onClick={() => {
            if (typeof window !== "undefined") {
              localStorage.removeItem("authToken");
              localStorage.removeItem("role");
              localStorage.removeItem("username");
            }
          }}
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span>Logout</span>
        </Link>
      </nav>
    </div>
  )
}
