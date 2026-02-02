"use client"

import React from "react"
import { motion } from "framer-motion"
import { Link, useSearchParams } from "react-router-dom"
import { useBlogPosts } from "../../hooks/useBlog"

const BlogListPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const page = Number(searchParams.get("page") || 1)
  const tag = searchParams.get("tag") || ""
  const q = searchParams.get("q") || ""

  const { data, isLoading, isError } = useBlogPosts({ page, limit: 9, tag, q })


  return (
    <section className="py-12 px-4 md:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-3xl md:text-4xl font-bold text-gray-900">
            Blog
          </motion.h1>
          <p className="text-gray-600 mt-2">Insights on KYC, compliance, onboarding and identity verification.</p>
        </div>

        {/* <form onSubmit={onSearchSubmit} className="bg-white border border-gray-200 rounded-xl p-4 mb-8 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input name="q" defaultValue={q} placeholder="Search posts…" className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          <input name="tag" defaultValue={tag} placeholder="Filter by tag (e.g. kyc)" className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Apply</button>
        </form> */}

        {isLoading && <div className="text-center text-gray-600 py-16">Loading posts…</div>}
        {isError && <div className="text-center text-red-600 py-16">Failed to load blog posts.</div>}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.items?.map((post) => (
              <motion.article key={post._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {post.coverImage && (
                  <Link to={`/blog/${post.slug}`}>
                    <img src={post.coverImage} alt={post.title} className="w-full h-40 object-cover" />
                  </Link>
                )}
                <div className="p-5">
                  <div className="text-xs text-blue-600 font-medium mb-2">
                    {post.tags?.slice(0, 3).map((t) => (
                      <span key={t} className="mr-2">#{t}</span>
                    ))}
                  </div>
                  <Link to={`/blog/${post.slug}`} className="block">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h2>
                  </Link>
                  {post.excerpt && <p className="text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>}
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <Link to={`/blog/${post.slug}`} className="text-blue-600 hover:underline">Read more →</Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default BlogListPage
