import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import blogApi, { type BlogPost, type CreateBlogPostData, type UpdateBlogPostData, type BlogStatus, type AdminBlogListResponse } from '../services/api/blogApi'

export const useBlogPosts = (params?: { page?: number; limit?: number; status?: BlogStatus | ''; tag?: string; q?: string }) => {
  return useQuery<AdminBlogListResponse>({
    queryKey: ['blog-posts', params?.page || 1, params?.limit || 10, params?.status || '', params?.tag || '', params?.q || ''],
    queryFn: () => blogApi.getPosts(params),
    placeholderData: keepPreviousData,
  })
}

export const useCreateBlogPost = () => {
  const qc = useQueryClient()
  return useMutation<BlogPost, Error, CreateBlogPostData>({
    mutationFn: blogApi.createPost.bind(blogApi),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blog-posts'] })
    },
  })
}

export const useUpdateBlogPost = () => {
  const qc = useQueryClient()
  return useMutation<BlogPost, Error, { id: string; data: UpdateBlogPostData }>({
    mutationFn: ({ id, data }) => blogApi.updatePost(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['blog-posts'] })
      qc.invalidateQueries({ queryKey: ['blog-post', id] })
    },
  })
}

export const useDeleteBlogPost = () => {
  const qc = useQueryClient()
  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: blogApi.deletePost.bind(blogApi),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blog-posts'] })
    },
  })
}

export const useToggleBlogPostStatus = () => {
  const qc = useQueryClient()
  return useMutation<BlogPost, Error, string>({
    mutationFn: blogApi.togglePostStatus.bind(blogApi),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['blog-posts'] })
      qc.invalidateQueries({ queryKey: ['blog-post', id] })
    },
  })
}
