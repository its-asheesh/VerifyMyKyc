import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  MenuItem,
  TablePagination,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Rating,
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { getReviews, updateReview, deleteReview, setVerified, type ReviewItem, type ReviewStatus } from '../services/api/reviewsApi'

const ReviewsManagement: React.FC = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [statusFilter, setStatusFilter] = useState<'' | ReviewStatus>('')
  const [verifiedFilter, setVerifiedFilter] = useState<'' | boolean>('')
  const [productFilter, setProductFilter] = useState('')

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<ReviewItem | null>(null)
  const [editDraft, setEditDraft] = useState<{ rating?: number; title?: string; comment?: string; status?: ReviewStatus; verified?: boolean }>({})

  const queryClient = useQueryClient()

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['reviews', page, rowsPerPage, statusFilter, verifiedFilter, productFilter],
    queryFn: () => getReviews({ page: page + 1, limit: rowsPerPage, status: statusFilter, verified: verifiedFilter, productId: productFilter || undefined }),
    placeholderData: keepPreviousData,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Pick<ReviewItem, 'rating' | 'title' | 'comment' | 'status' | 'verified'>> }) => updateReview(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      setSnackbar({ open: true, message: 'Review updated successfully', severity: 'success' })
      setEditOpen(false)
    },
    onError: () => setSnackbar({ open: true, message: 'Failed to update review', severity: 'error' }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      setSnackbar({ open: true, message: 'Review deleted successfully', severity: 'success' })
    },
    onError: () => setSnackbar({ open: true, message: 'Failed to delete review', severity: 'error' }),
  })

  const verifyMutation = useMutation({
    mutationFn: ({ id, verified }: { id: string; verified: boolean }) => setVerified(id, verified),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      setSnackbar({ open: true, message: 'Verified status updated', severity: 'success' })
    },
    onError: () => setSnackbar({ open: true, message: 'Failed to update verified status', severity: 'error' }),
  })

  const rows = data?.items || []
  const total = data?.pagination?.total || 0

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage)
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }

  const openEdit = (item: ReviewItem) => {
    setEditing(item)
    setEditDraft({ rating: item.rating, title: item.title || '', comment: item.comment, status: item.status, verified: !!item.verified })
    setEditOpen(true)
  }

  const saveEdit = async () => {
    if (!editing) return
    await updateMutation.mutateAsync({ id: editing._id, payload: editDraft })
  }

  const handleStatusChange = async (row: ReviewItem, status: ReviewStatus) => {
    await updateMutation.mutateAsync({ id: row._id, payload: { status } })
  }

  const handleVerifiedToggle = async (row: ReviewItem, checked: boolean) => {
    await verifyMutation.mutateAsync({ id: row._id, verified: checked })
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this review?')) deleteMutation.mutate(id)
  }

  const reviewer = (row: ReviewItem) => {
    const u: any = typeof row.userId === 'object' ? row.userId : null
    return u ? `${u.name || 'User'} (${u.email || ''})` : 'Unknown'
  }

  const formatDate = (iso: string) => new Date(iso).toLocaleString()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reviews</h1>
        <div className="text-sm text-gray-500">{isFetching ? 'Refreshing…' : ''}</div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 flex flex-col md:flex-row gap-4">
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="status-select">Status</InputLabel>
          <Select labelId="status-select" label="Status" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as any); setPage(0) }}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value={'pending'}>Pending</MenuItem>
            <MenuItem value={'approved'}>Approved</MenuItem>
            <MenuItem value={'rejected'}>Rejected</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="verified-select">Verified</InputLabel>
          <Select labelId="verified-select" label="Verified" value={verifiedFilter === '' ? '' : (verifiedFilter ? 'true' : 'false')} onChange={(e) => { const v = e.target.value as '' | 'true' | 'false'; setVerifiedFilter(v === '' ? '' : v === 'true'); setPage(0) }}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value={'true'}>Verified</MenuItem>
            <MenuItem value={'false'}>Unverified</MenuItem>
          </Select>
        </FormControl>
        <TextField size="small" label="Product Id" value={productFilter} onChange={(e) => setProductFilter(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') setPage(0) }} />
        <Button variant="outlined" onClick={() => queryClient.invalidateQueries({ queryKey: ['reviews'] })}>Apply</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64"><CircularProgress /></div>
      ) : error ? (
        <div className="p-4 text-red-600">Error loading reviews: {(error as any)?.message || 'Unknown error'}</div>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reviewer</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Comment</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Verified</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row._id} hover>
                    <TableCell>{reviewer(row)}</TableCell>
                    <TableCell>{row.productId}</TableCell>
                    <TableCell>
                      <Rating name={`rating-${row._id}`} value={row.rating} readOnly size="small" />
                    </TableCell>
                    <TableCell>{row.title || '-'}</TableCell>
                    <TableCell title={row.comment}>
                      {row.comment.length > 60 ? row.comment.slice(0, 60) + '…' : row.comment}
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 130 }}>
                        <Select value={row.status} onChange={(e) => handleStatusChange(row, e.target.value as ReviewStatus)}>
                          <MenuItem value={'pending'}>Pending</MenuItem>
                          <MenuItem value={'approved'}>Approved</MenuItem>
                          <MenuItem value={'rejected'}>Rejected</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <FormControlLabel control={<Switch checked={!!row.verified} onChange={(e) => handleVerifiedToggle(row, e.target.checked)} />} label={row.verified ? 'Yes' : 'No'} />
                    </TableCell>
                    <TableCell>{formatDate(row.createdAt)}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => openEdit(row)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleDelete(row._id)} disabled={deleteMutation.isPending}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Review</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Rating</div>
              <Rating value={editDraft.rating || 0} onChange={(_, v) => setEditDraft((d) => ({ ...d, rating: v || 0 }))} />
            </div>
            <TextField label="Title" value={editDraft.title || ''} onChange={(e) => setEditDraft((d) => ({ ...d, title: e.target.value }))} fullWidth />
            <TextField label="Comment" value={editDraft.comment || ''} onChange={(e) => setEditDraft((d) => ({ ...d, comment: e.target.value }))} fullWidth multiline minRows={3} />
            <FormControl fullWidth>
              <InputLabel id="edit-status">Status</InputLabel>
              <Select labelId="edit-status" label="Status" value={editDraft.status || 'approved'} onChange={(e) => setEditDraft((d) => ({ ...d, status: e.target.value as ReviewStatus }))}>
                <MenuItem value={'pending'}>Pending</MenuItem>
                <MenuItem value={'approved'}>Approved</MenuItem>
                <MenuItem value={'rejected'}>Rejected</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel control={<Switch checked={!!editDraft.verified} onChange={(e) => setEditDraft((d) => ({ ...d, verified: e.target.checked }))} />} label="Verified" />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveEdit} disabled={updateMutation.isPending}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </div>
  )
}

export default ReviewsManagement
