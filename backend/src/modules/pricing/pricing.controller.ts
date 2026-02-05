import { Request, Response } from "express"
import { VerificationPricing, HomepagePlan } from "./pricing.model"

// ==================== VERIFICATION PRICING CONTROLLERS ====================

// Get all verification pricing
export const getAllVerificationPricing = async (req: Request, res: Response) => {
  try {
    const pricing = await VerificationPricing.find()
    res.json(pricing)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch verification pricing" })
  }
}

// Get verification pricing by type
export const getVerificationPricingByType = async (req: Request, res: Response) => {
  try {
    const { verificationType } = req.params
    // console.log('Backend: Looking for verification type:', verificationType)

    const pricing = await VerificationPricing.findOne({ verificationType })
    // console.log('Backend: Found pricing data:', pricing)

    if (!pricing) {
      // console.log('Backend: No pricing found for type:', verificationType)
      return res.status(404).json({ message: "Verification pricing not found" })
    }

    // console.log('Backend: Sending pricing data:', pricing)
    res.json(pricing)
  } catch (err) {
    console.error('Backend: Error fetching verification pricing:', err)
    res.status(500).json({ message: "Failed to fetch verification pricing" })
  }
}

// Add verification pricing
export const addVerificationPricing = async (req: Request, res: Response) => {
  try {
    const pricing = new VerificationPricing(req.body)
    await pricing.save()
    res.status(201).json(pricing)
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Failed to add verification pricing" })
  }
}

// Edit verification pricing
export const editVerificationPricing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const pricing = await VerificationPricing.findByIdAndUpdate(id, req.body, { new: true })
    if (!pricing) return res.status(404).json({ message: "Verification pricing not found" })
    res.json(pricing)
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Failed to update verification pricing" })
  }
}

// Delete verification pricing
export const deleteVerificationPricing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const pricing = await VerificationPricing.findByIdAndDelete(id)
    if (!pricing) return res.status(404).json({ message: "Verification pricing not found" })
    res.json({ message: "Verification pricing deleted successfully" })
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Failed to delete verification pricing" })
  }
}

// ==================== HOMEPAGE PLANS CONTROLLERS ====================

// Get all homepage plans
export const getAllHomepagePlans = async (req: Request, res: Response) => {
  try {
    const plans = await HomepagePlan.find()
    res.json(plans)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch homepage plans" })
  }
}

// Get homepage plan by type
export const getHomepagePlanByType = async (req: Request, res: Response) => {
  try {
    const { planType } = req.params
    const plan = await HomepagePlan.findOne({ planType })
    if (!plan) return res.status(404).json({ message: "Homepage plan not found" })
    res.json(plan)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch homepage plan" })
  }
}

// Add homepage plan
export const addHomepagePlan = async (req: Request, res: Response) => {
  try {
    const plan = new HomepagePlan(req.body)
    await plan.save()
    res.status(201).json(plan)
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Failed to add homepage plan" })
  }
}

// Edit homepage plan
export const editHomepagePlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const plan = await HomepagePlan.findByIdAndUpdate(id, req.body, { new: true })
    if (!plan) return res.status(404).json({ message: "Homepage plan not found" })
    res.json(plan)
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Failed to update homepage plan" })
  }
}

// Delete homepage plan
export const deleteHomepagePlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const plan = await HomepagePlan.findByIdAndDelete(id)
    if (!plan) return res.status(404).json({ message: "Homepage plan not found" })
    res.json({ message: "Homepage plan deleted successfully" })
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Failed to delete homepage plan" })
  }
}

// ==================== COMBINED PRICING CONTROLLERS ====================

// Get all pricing data (both verification and homepage plans)
export const getAllPricing = async (req: Request, res: Response) => {
  try {
    const [verificationPricing, homepagePlans] = await Promise.all([
      VerificationPricing.find(),
      HomepagePlan.find()
    ])

    res.json({
      verificationPricing,
      homepagePlans
    })
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pricing data" })
  }
}

// Get pricing for homepage (monthly and yearly plans)
export const getHomepagePricing = async (req: Request, res: Response) => {
  try {
    const plans = await HomepagePlan.find().sort({ planType: 1, planName: 1 })
    res.json(plans)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch homepage pricing" })
  }
}

// Get homepage plans by billing period
export const getHomepagePlansByPeriod = async (req: Request, res: Response) => {
  try {
    const { period } = req.params // 'monthly' or 'yearly'

    if (!['monthly', 'yearly'].includes(period)) {
      return res.status(400).json({ message: "Invalid period. Must be 'monthly' or 'yearly'" })
    }

    const plans = await HomepagePlan.find({ planType: period }).sort({ planName: 1 })
    res.json(plans)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch homepage plans" })
  }
}

// Get all available verification types for custom selection
export const getAvailableVerifications = async (req: Request, res: Response) => {
  try {
    const verifications = await VerificationPricing.find({}, 'verificationType title description oneTimePrice')
    res.json(verifications)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch available verifications" })
  }
} 