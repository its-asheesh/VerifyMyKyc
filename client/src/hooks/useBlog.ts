import { useQuery } from "@tanstack/react-query"
import { blogApi } from "../services/api/blogApi"

export function useBlogPosts(params?: { page?: number; limit?: number; tag?: string; q?: string }) {
  return useQuery({
    queryKey: ["blog-posts", params?.page || 1, params?.limit || 10, params?.tag || "", params?.q || ""],
    queryFn: () => blogApi.getPublicPosts(params),
  })
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => blogApi.getPostBySlug(slug),
    enabled: !!slug,
  })
}
