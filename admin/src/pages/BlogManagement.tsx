import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, EyeOff, FileText, Loader2 } from 'lucide-react'
import { useBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost, useToggleBlogPostStatus } from '../hooks/useBlog'
import type { BlogPost } from '../services/api/blogApi'
import Quill from 'quill'
import '../styles/blog.css'
import 'quill/dist/quill.snow.css'
import { Button, FormModal, StatusBadge } from '../components/common'
interface BlogFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<BlogPost>) => void
  isLoading: boolean
  editData?: BlogPost | null
}

const BlogForm: React.FC<BlogFormProps> = ({ isOpen, onClose, onSubmit, isLoading, editData }) => {
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '', slug: '', excerpt: '', content: '', coverImage: '', tags: [], status: 'draft', author: ''
  })
  const [tagsInput, setTagsInput] = useState('')
  const editorContainerRef = React.useRef<HTMLDivElement | null>(null)
  const quillRef = React.useRef<Quill | null>(null)
  const textChangeHandlerRef = React.useRef<((delta: any, old: any, source: string) => void) | null>(null)

  React.useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title,
        slug: editData.slug,
        excerpt: editData.excerpt || '',
        content: editData.content,
        coverImage: editData.coverImage || '',
        tags: editData.tags || [],
        status: editData.status,
        author: editData.author || ''
      })
      setTagsInput((editData.tags || []).join(', '))
    } else {
      setFormData({ title: '', slug: '', excerpt: '', content: '', coverImage: '', tags: [], status: 'draft', author: '' })
      setTagsInput('')
    }
  }, [editData])

  // Initialize Quill editor once when modal opens
  React.useEffect(() => {
    if (!isOpen) return
    if (editorContainerRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorContainerRef.current, {
        theme: 'snow',
        placeholder: 'Write your blog content here...',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
          ],
        },
      })
      const handler = () => {
        const html = quillRef.current!.root.innerHTML
        setFormData((d) => ({ ...d, content: html }))
      }
      textChangeHandlerRef.current = handler
      quillRef.current.on('text-change', handler)
      // Seed initial content
      if (formData.content) {
        quillRef.current.clipboard.dangerouslyPasteHTML(formData.content)
      }
      // Ensure a decent min-height for the editor
      const editorEl = editorContainerRef.current.querySelector('.ql-editor') as HTMLElement | null
      if (editorEl) editorEl.style.minHeight = '240px'
    }
    return () => {
      if (quillRef.current && textChangeHandlerRef.current) {
        quillRef.current.off('text-change', textChangeHandlerRef.current)
        textChangeHandlerRef.current = null
        quillRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // When we switch between edit/create, reflect content in existing editor
  React.useEffect(() => {
    if (!isOpen || !quillRef.current) return
    quillRef.current.setText('')
    if (formData.content) {
      quillRef.current.clipboard.dangerouslyPasteHTML(formData.content)
    }
  }, [isOpen, formData.content])



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    const payload = { ...formData, tags: parsedTags as string[] }
    onSubmit(payload)
  }

  // if (!isOpen) return null - handled by FormModal

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${editData ? 'Edit' : 'Add'} Blog Post`}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      size="xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input value={formData.title || ''} onChange={(e) => setFormData((d) => ({ ...d, title: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug (optional)</label>
          <input value={formData.slug || ''} onChange={(e) => setFormData((d) => ({ ...d, slug: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" placeholder="auto-generated from title" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
          <input value={formData.coverImage || ''} onChange={(e) => setFormData((d) => ({ ...d, coverImage: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
          <input value={formData.author || ''} onChange={(e) => setFormData((d) => ({ ...d, author: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" placeholder="Author name" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
        <textarea value={formData.excerpt || ''} onChange={(e) => setFormData((d) => ({ ...d, excerpt: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" rows={2} placeholder="Short summary" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
        <div className="border rounded-lg">
          <div ref={editorContainerRef} className="px-0" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
          <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="kyc, compliance, onboarding" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select value={formData.status || 'draft'} onChange={(e) => setFormData((d) => ({ ...d, status: e.target.value as any }))} className="w-full px-3 py-2 border rounded-lg">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

    </FormModal>
  )
}

const BlogManagement: React.FC = () => {
  const page = 1
  const limit = 12
  const { data, isLoading, error } = useBlogPosts({ page, limit })

  const createPost = useCreateBlogPost()
  const updatePost = useUpdateBlogPost()
  const deletePost = useDeleteBlogPost()
  const toggleStatus = useToggleBlogPostStatus()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)

  const items: BlogPost[] = data?.items ?? []

  const handleSubmit = async (payload: Partial<BlogPost>) => {
    try {
      if (editing) {
        await updatePost.mutateAsync({ id: editing._id, data: payload })
      } else {
        await createPost.mutateAsync(payload as any)
      }
      setIsFormOpen(false)
      setEditing(null)
    } catch (e) {
      console.error('Failed to save post', e)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this post?')) {
      try { await deletePost.mutateAsync(id) } catch (e) { console.error(e) }
    }
  }

  const handleToggle = async (id: string) => {
    try { await toggleStatus.mutateAsync(id) } catch (e) { console.error(e) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-1">Create, edit and publish blog posts for your website.</p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Post
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>
      ) : error ? (
        <div className="text-center text-red-600 py-16">Failed to load posts.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((post: BlogPost) => (
            <motion.div key={post._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">{post.title}</h3>
                  <StatusBadge status={post.status} />
                </div>
                {post.coverImage && (
                  <div className="mb-3">
                    <img src={post.coverImage} alt={post.title} className="w-full h-36 object-cover rounded-md border" />
                  </div>
                )}
                {post.excerpt && <p className="text-sm text-gray-600 mb-3 line-clamp-3">{post.excerpt}</p>}
                {!post.excerpt && (
                  <div className="prose prose-sm max-w-none text-gray-700 mb-3 line-clamp-3 overflow-hidden blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
                )}
                <div className="text-xs text-blue-600 font-medium mb-3">
                  {post.tags?.slice(0, 4).map((t: string) => (<span key={t} className="mr-2">#{t}</span>))}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <FileText className="w-4 h-4" />
                  <span>{new Date(post.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t">
                  <button onClick={() => { setEditing(post); setIsFormOpen(true) }} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"> <Edit className="w-3 h-3" /> Edit</button>
                  <button onClick={() => handleToggle(post._id)} className="flex items-center justify-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"> {post.status === 'published' ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />} </button>
                  <button onClick={() => handleDelete(post._id)} className="flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"> <Trash2 className="w-3 h-3" /> </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <BlogForm isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setEditing(null) }} onSubmit={handleSubmit} isLoading={createPost.isPending || updatePost.isPending} editData={editing} />
    </div>
  )
}

export default BlogManagement
