import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useUserDataStore } from "../../../store/userdata";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface user {
  id: string;
  username: string;
}

interface category {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Article {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  category: category;
  user: user;
}

export default function HomepageComponent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();
  const clearUserData = useUserDataStore((state) => state.clearUserData);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUsername(localStorage.getItem("username") || "");
    }
  }, []);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://test-fe.mysellerpintar.com/api/categories"
        );
        setCategories(response.data?.data || []);
      } catch (e) {
        console.log(e)
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(
          `https://test-fe.mysellerpintar.com/api/articles?category=${selectedCategory}&title=${debouncedSearch}`
        );
        setArticles(response.data?.data || []);
      } catch (e) {
        console.log(e)
        setArticles([]);
      }
    };
    fetchArticles();
  }, [selectedCategory, debouncedSearch]);

  const handleLogout = () => {
    clearUserData();
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
    }
    router.push("/login");
  };

  // const thumbnails = [
  //   "/placeholder.svg?height=60&width=60",
  //   "/placeholder.svg?height=60&width=60",
  //   "/placeholder.svg?height=60&width=60",
  //   "/placeholder.svg?height=60&width=60",
  //   "/placeholder.svg?height=60&width=60",
  //   "/placeholder.svg?height=60&width=60",
  //   "/placeholder.svg?height=60&width=60",
  //   "/placeholder.svg?height=60&width=60",
  //   "/placeholder.svg?height=60&width=60",
  //   "/placeholder.svg?height=60&width=60",
  // ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-white">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xs font-bold">L</span>
            </div>
            <span className="font-semibold">Logipsum</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-white/20 text-white text-xs">
                      {username?.slice(0, 2).toUpperCase() || "US"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{username || "User"}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 w-full flex mx-auto to-blue-500 px-6 py-16">
        <div className="max-w-4xl mx-auto text-center text-white w-full flex flex-col gay-2">
          <p className="text-sm mb-2 opacity-90 font-semibold">Blog genzet</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            The Journal : Design Resources,
            <br />
            Interviews, and Industry News
          </h1>
          <p className="text-lg mb-8 opacity-90">
            Your daily dose of design insights!
          </p>
          <div className="flex items-center justify-center gap-4 mb-8 flex-col md:flex-row md:gap-x-4 md:gap-y-0 gap-y-2">
            <select
              className="bg-white text-blue-600 hover:bg-gray-100 w-48 rounded px-3 py-2"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 w-4 h-4" />
              <input
                placeholder="Search articles..."
                className="pl-10 bg-white text-blue-600 placeholder:text-blue-400 border-white w-64 rounded px-3 py-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Articles Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Showing - {articles.length} articles
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link href={`/${article.id}`} key={article.id} className="w-full">
                  <Card
                    key={article.id}
                    className="overflow-hidden border-0 shadow-sm hover:scale-105 transition-all duration-300 hover:cursor-pointer flex flex-col h-full"
                  >
                    <div className="aspect-video relative w-full">
                      <Image
                        src={article.imageUrl || "/placeholder.svg"}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={false}
                      />
                    </div>
                    <CardContent className="p-4 md:p-6 flex flex-col flex-1">
                      <div className="text-xs text-gray-500 mb-2">
                        {article.category?.name}
                      </div>
                      <h3 className="font-semibold text-lg mb-3 leading-tight line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                        {article.content}
                      </p>
                      <div className="flex gap-2 mt-auto">
                        <Badge variant="secondary" className="text-xs">
                          {article.category?.name}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
