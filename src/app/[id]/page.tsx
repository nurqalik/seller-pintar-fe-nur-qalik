"use client";
import { useParams } from "next/navigation";
import ArticlePage from "@/components/article/article-page";

export default function Page() {
  const params = useParams();
  // Ensure we get the [id] param as a string
  let articleId: string | undefined;
  if (params && typeof params.id === "string") {
    articleId = params.id;
  } else if (params && Array.isArray(params.id)) {
    articleId = params.id[0];
  }
  if (!articleId) {
    return <div>Article not found.</div>;
  }
  return <ArticlePage articleId={articleId} />;
}
