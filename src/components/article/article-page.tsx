'use client'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import axios from "axios"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useUserDataStore } from "../../../store/userdata";
import { useRouter } from "next/navigation";

interface ArticlePageProps {
  articleId: string
}

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

export default function ArticlePage({ articleId }: ArticlePageProps) {
  const [article, setArticle] = useState<Article | null>(null)
  const [recommendedArticles, setRecommendedArticles] = useState<Article[]>([])
  const [username, setUsername] = useState("");
  const router = useRouter();
  const clearUserData = useUserDataStore((state) => state.clearUserData);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUsername(localStorage.getItem("username") || "");
    }
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const accessToken = localStorage.getItem("authToken");
        const headers = accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            }
          : {};

        const response = await axios.get(
          `https://test-fe.mysellerpintar.com/api/articles/${articleId}`,
          { headers }
        );
        setArticle(response.data);

        // Fetch recommended articles from the same category, excluding the current article
        if (response.data) {
          const recRes = await axios.get(
            `https://test-fe.mysellerpintar.com/api/articles?category=${response.data.categoryId}&limit=4`,
            { headers }
          );
          const recs = (recRes.data?.data || []).filter(
            (a: Article) => a.id !== articleId
          );
          setRecommendedArticles(recs.slice(0, 3));
        }
      } catch (e) {
        console.log(e)
        setArticle(null);
        setRecommendedArticles([]);
      }
    };
    fetchArticle();
  }, [articleId]);

  console.log(article,recommendedArticles)

  const handleLogout = () => {
    clearUserData();
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
    }
    router.push("/login");
  };

  if (!article) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Same as main page */}
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

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6 p-0 h-auto font-normal text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Button>
        </Link>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="secondary" className="text-sm">
              {article.category?.name}
            </Badge>
            <span className="text-gray-500 text-sm">{article.createdAt?.slice(0, 10)}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{article.title}</h1>
        </div>

        {/* Article Image */}
        <div className="aspect-video relative mb-8 rounded-lg overflow-hidden">
          <Image src={article.imageUrl || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          {article.content?.split("\n\n").map((paragraph: string, index: number) => (
            <p key={index} className="mb-6 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tags */}
        <div className="flex gap-2 mb-12">
          {article.category?.name && (
            <Badge variant="outline" className="text-sm">
              {article.category.name}
            </Badge>
          )}
        </div>
      </div>

      {/* Recommended Articles */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">More from {article.category?.name}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {recommendedArticles.map((recArticle) => (
              <Link href={`/${recArticle.id}`} key={recArticle.id}>
                <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all cursor-pointer h-full hover:cursor-pointer hover:scale-105 duration-300">
                  <div className="aspect-video relative">
                    <Image
                      src={recArticle.imageUrl || "/placeholder.svg"}
                      alt={recArticle.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="text-xs text-gray-500 mb-2">{recArticle.createdAt?.slice(0, 10)}</div>
                    <h3 className="font-semibold text-base mb-2 leading-tight line-clamp-2">{recArticle.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{recArticle.content}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
