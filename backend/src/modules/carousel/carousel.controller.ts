import { Request, Response } from 'express'
import { CarouselSlide } from './carousel.model'
import asyncHandler from '../../common/middleware/asyncHandler'

// Get all carousel slides (public - for client)
export const getCarouselSlides = asyncHandler(async (req: Request, res: Response) => {
  const slides = await CarouselSlide.find({ isActive: true })
    .sort({ order: 1, createdAt: -1 })

  res.json({
    success: true,
    data: { slides }
  })
})

// Admin: Get all carousel slides (including inactive)
export const getAllCarouselSlides = asyncHandler(async (req: Request, res: Response) => {
  const slides = await CarouselSlide.find()
    .sort({ order: 1, createdAt: -1 })

  res.json({
    success: true,
    data: { slides }
  })
})

// Admin: Get carousel slide by ID
export const getCarouselSlideById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params

  const slide = await CarouselSlide.findById(id)
  
  if (!slide) {
    return res.status(404).json({ message: 'Carousel slide not found' })
  }

  res.json({
    success: true,
    data: { slide }
  })
})

// Admin: Create new carousel slide
export const createCarouselSlide = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    subtitle,
    description,
    imageUrl,
    buttonText,
    buttonLink,
    isActive,
    order
  } = req.body

  const slide = await CarouselSlide.create({
    title,
    subtitle,
    description,
    imageUrl,
    buttonText,
    buttonLink,
    isActive: isActive !== undefined ? isActive : true,
    order: order || 0
  })

  res.status(201).json({
    success: true,
    message: 'Carousel slide created successfully',
    data: { slide }
  })
})

// Admin: Update carousel slide
export const updateCarouselSlide = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const updateData = req.body

  const slide = await CarouselSlide.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  )

  if (!slide) {
    return res.status(404).json({ message: 'Carousel slide not found' })
  }

  res.json({
    success: true,
    message: 'Carousel slide updated successfully',
    data: { slide }
  })
})

// Admin: Delete carousel slide
export const deleteCarouselSlide = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params

  const slide = await CarouselSlide.findByIdAndDelete(id)

  if (!slide) {
    return res.status(404).json({ message: 'Carousel slide not found' })
  }

  res.json({
    success: true,
    message: 'Carousel slide deleted successfully'
  })
})

// Admin: Toggle carousel slide status
export const toggleCarouselSlideStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params

  const slide = await CarouselSlide.findById(id)

  if (!slide) {
    return res.status(404).json({ message: 'Carousel slide not found' })
  }

  slide.isActive = !slide.isActive
  await slide.save()

  res.json({
    success: true,
    message: `Carousel slide ${slide.isActive ? 'activated' : 'deactivated'} successfully`,
    data: { slide }
  })
})

// Admin: Reorder carousel slides
export const reorderCarouselSlides = asyncHandler(async (req: Request, res: Response) => {
  const { slides } = req.body // Array of { id, order }

  if (!Array.isArray(slides)) {
    return res.status(400).json({ message: 'Invalid slides data' })
  }

  // Update each slide's order
  for (const slideData of slides) {
    await CarouselSlide.findByIdAndUpdate(slideData.id, { order: slideData.order })
  }

  res.json({
    success: true,
    message: 'Carousel slides reordered successfully'
  })
}) 