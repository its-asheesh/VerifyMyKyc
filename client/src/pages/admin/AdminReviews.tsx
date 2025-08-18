"use client"

import React from "react"
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { reviewApi } from "../../services/api/reviewApi"
import type { Review, ReviewStatus } from "../../types/review"

const statusOptions: ReviewStatus[] = ["pending", "approved", "rejected"]

const AdminReviews: React.FC = () => {
  const queryClient = useQueryClient()

  const [filters, setFilters] = React.useState<{ status?: ReviewStatus; productId?: string; userId?: string; page: number }>(
    { status: undefined, productId: "", userId: "", page: 1 },
  )

  const { data, isLoading, error, refetch, isFetching } = useQuery<{ items: Review[]; pagination: { page: number; limit: number; total: number } }>({
    queryKey: ["admin-reviews", filters],
    queryFn: () => reviewApi.adminList({
      status: filters.status,
      productId: filters.productId || undefined,
      userId: filters.userId || undefined,
      page: filters.page,
      limit: 20,
    }),
    placeholderData: keepPreviousData,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Pick<Review, 'rating' | 'title' | 'comment' | 'status'>> }) =>
      reviewApi.adminUpdate(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-reviews"] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => reviewApi.adminDelete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-reviews"] }),
  })

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-6 flex items-end gap-3 flex-wrap">
        <div>
          <label className="block text-sm text-gray-700">Status</label>
          <select
            className="mt-1 border rounded-md p-2"
            value={filters.status || ""}
            onChange={(e) => setFilters((f) => ({ ...f, status: (e.target.value as ReviewStatus) || undefined, page: 1 }))}
          >
            <option value="">All</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700">Product ID</label>
          <input
            className="mt-1 border rounded-md p-2"
            value={filters.productId}
            onChange={(e) => setFilters((f) => ({ ...f, productId: e.target.value, page: 1 }))}
            placeholder="e.g. pan"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">User ID</label>
          <input
            className="mt-1 border rounded-md p-2"
            value={filters.userId}
            onChange={(e) => setFilters((f) => ({ ...f, userId: e.target.value, page: 1 }))}
            placeholder="optional"
          />
        </div>
        <button
          onClick={() => refetch()}
          className="h-10 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          {isFetching ? "Refreshing…" : "Apply"}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Manage Reviews</h2>
          {isLoading && <div className="text-sm text-gray-500">Loading…</div>}
          {error && <div className="text-sm text-red-600">Failed to load reviews</div>}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.items?.map((r: Review) => (
                <tr key={r._id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {typeof r.userId === 'string' ? r.userId : (r.userId.name || r.userId.email || r.userId._id)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{r.productId}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{r.rating}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate">{r.title || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 max-w-xl truncate">{r.comment}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        r.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : r.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                    <div className="inline-flex gap-2">
                      {r.status !== 'approved' && (
                        <button
                          onClick={() => updateMutation.mutate({ id: r._id, payload: { status: 'approved' } })}
                          className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                          disabled={updateMutation.isPending}
                        >
                          Approve
                        </button>
                      )}
                      {r.status !== 'rejected' && (
                        <button
                          onClick={() => updateMutation.mutate({ id: r._id, payload: { status: 'rejected' } })}
                          className="px-3 py-1 rounded bg-yellow-600 text-white hover:bg-yellow-700"
                          disabled={updateMutation.isPending}
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm('Delete this review?')) deleteMutation.mutate(r._id)
                        }}
                        className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Total: {data?.pagination?.total ?? 0}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 rounded border"
              disabled={(filters.page || 1) <= 1}
              onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, f.page - 1) }))}
            >
              Prev
            </button>
            <div className="text-sm">Page {filters.page}</div>
            <button
              className="px-3 py-1 rounded border"
              disabled={(data?.items?.length || 0) < 20}
              onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminReviews
