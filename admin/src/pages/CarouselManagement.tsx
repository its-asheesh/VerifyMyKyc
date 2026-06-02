import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus, Edit, Trash2, Eye, EyeOff, Image,
  Loader2, AlertCircle
} from 'lucide-react'  // Removed unused 'GripVertical'
import { useToast } from '../context/ToastContext'
import { Button, FormModal } from '../components/common'
import {
  useCarouselSlides,
  useCreateCarouselSlide,
  useUpdateCarouselSlide,
  useDeleteCarouselSlide,
  useToggleCarouselSlideStatus
  // Removed: useReorderCarouselSlides (not used)
} from '../hooks/useCarousel'
import type { CarouselSlide, CreateCarouselSlideData } from '../services/api/carouselApi'

interface CarouselFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateCarouselSlideData) => void
  isLoading: boolean
  editData?: CarouselSlide | null
}

const CarouselForm: React.FC<CarouselFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  editData
}) => {
  const [formData, setFormData] = useState<CreateCarouselSlideData>({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    buttonText: '',
    buttonLink: '',
    isActive: true,
    order: 0
  })

  React.useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title,
        subtitle: editData.subtitle,
        description: editData.description,
        imageUrl: editData.imageUrl,
        buttonText: editData.buttonText,
        buttonLink: editData.buttonLink,
        isActive: editData.isActive,
        order: editData.order
      })
    } else {
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        imageUrl: '',
        buttonText: '',
        buttonLink: '',
        isActive: true,
        order: 0
      })
    }
  }, [editData])

  const handleSubmit = () => {
    // Prevent default already handled by FormModal if logic matches, but FormModal calls onSubmit(e).
    // The current onSubmit expects (data: CreateCarouselSlideData).
    // So we need to wrap it.
    onSubmit(formData)
  }

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${editData ? 'Edit' : 'Add'} Carousel Slide`}
      onSubmit={() => handleSubmit()} // Passing dummy event or fixing types
      isLoading={isLoading}
      size="md"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter slide title"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subtitle *
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter slide subtitle"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter slide description"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image URL *
        </label>
        <input
          type="url"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Button Text *
          </label>
          <input
            type="text"
            value={formData.buttonText}
            onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Get Started"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Button Link *
          </label>
          <input
            type="text"
            value={formData.buttonLink}
            onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="/custom-pricing"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
            Active
          </label>
        </div>
      </div>
    </FormModal>
  )
}

const CarouselManagement: React.FC = () => {
  const { data: slides, isLoading, error } = useCarouselSlides()
  const createSlide = useCreateCarouselSlide()
  const updateSlide = useUpdateCarouselSlide()
  const deleteSlide = useDeleteCarouselSlide()
  const toggleStatus = useToggleCarouselSlideStatus()
  const { showSuccess, showError } = useToast() // ✅ Use actual functions from context

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null)

  const handleSubmit = async (data: CreateCarouselSlideData) => {
    try {
      if (editingSlide) {
        await updateSlide.mutateAsync({ id: editingSlide._id, data })
        showSuccess('Carousel slide updated successfully.') // ✅ Use showSuccess
      } else {
        await createSlide.mutateAsync(data)
        showSuccess('Carousel slide added successfully.') // ✅ Use showSuccess
      }
      setIsFormOpen(false)
      setEditingSlide(null)
    } catch (error) {
      console.error('Failed to save slide:', error)
      showError('Failed to save carousel slide.') // ✅ Use showError
    }
  }

  const handleEdit = (slide: CarouselSlide) => {
    setEditingSlide(slide)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      try {
        await deleteSlide.mutateAsync(id)
        showSuccess('Carousel slide deleted successfully.') // ✅
      } catch (error) {
        console.error('Failed to delete slide:', error)
        showError('Failed to delete carousel slide.') // ✅
      }
    }
  }

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus.mutateAsync(id)
      showSuccess('Carousel slide status updated successfully.') // ✅
    } catch (error) {
      console.error('Failed to toggle status:', error)
      showError('Failed to update carousel slide status.') // ✅
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Failed to load carousel slides</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Carousel Management</h1>
          <p className="text-gray-600 mt-1">Manage hero carousel slides for the homepage</p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Slide
        </Button>
      </div>

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides?.map((slide) => (
          <motion.div
            key={slide._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Image Preview */}
            <div className="relative h-48 bg-gray-100">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found'
                }}
              />
              <div className="absolute top-2 right-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${slide.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                  {slide.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {slide.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{slide.title}</h3>
                  <p className="text-sm text-gray-600">{slide.subtitle}</p>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  #{slide.order}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{slide.description}</p>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {slide.buttonText}
                </span>
                <span>→</span>
                <span className="text-gray-600">{slide.buttonLink}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(slide)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => handleToggleStatus(slide._id)}
                  className="flex items-center justify-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  {slide.isActive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => handleDelete(slide._id)}
                  className="flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {slides?.length === 0 && (
        <div className="text-center py-12">
          <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Carousel Slides</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first carousel slide.</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add First Slide
          </button>
        </div>
      )}

      {/* Form Modal */}
      <CarouselForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingSlide(null)
        }}
        onSubmit={handleSubmit}
        isLoading={createSlide.isPending || updateSlide.isPending}
        editData={editingSlide}
      />
    </div>
  )
}

export default CarouselManagement