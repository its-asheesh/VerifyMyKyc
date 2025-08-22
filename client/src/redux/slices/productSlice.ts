import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Product, ProductCategory } from "../../types/product"
import type { LoadingState } from "../../types/common"

interface ProductState extends LoadingState {
  products: Product[]
  categories: ProductCategory[]
  selectedProduct: Product | null
  filters: {
    category: string
    search: string
  }
}

const initialState: ProductState = {
  products: [],
  categories: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  filters: {
    category: "",
    search: "",
  },
}

// Mock data for development - replace with actual API calls
export const mockProducts: Product[] = [
  {
    id: "pan",
    title: "PAN Card Verification",
    description: "Instantly verify PAN card details against government databases",
    category: {
      id: "identity",
      name: "Identity Verification",
      slug: "identity",
      description: "Government ID verification",
    },
    features: ["Real-time verification", "Government database check", "99.9% accuracy"],
    pricing: {
      free: { price: 0, requests: 100, features: ["Basic verification", "Email support"], support: "Email" },
      basic: { price: 299, requests: 1000, features: ["Advanced verification", "Priority support"], support: "Chat" },
      premium: { price: 999, requests: 10000, features: ["Enterprise features", "24/7 support"], support: "Phone" },
    },
    documentation: "Complete API documentation for PAN verification",
    isActive: true,
    icon: "/pan.png",
    image: "/pan.png",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "aadhaar",
    title: "Aadhaar Verification",
    description: "Secure Aadhaar card verification with OTP validation",
    category: {
      id: "identity",
      name: "Identity Verification",
      slug: "identity",
      description: "Government ID verification",
    },
    features: ["OTP verification", "Biometric matching", "Secure processing", "Compliance ready"],
    pricing: {
      free: { price: 0, requests: 50, features: ["Basic verification", "Email support"], support: "Email" },
      basic: { price: 399, requests: 500, features: ["Advanced verification", "Priority support"], support: "Chat" },
      premium: { price: 1299, requests: 5000, features: ["Enterprise features", "24/7 support"], support: "Phone" },
    },
    documentation: "Complete API documentation for Aadhaar verification",
    isActive: true,
    icon: "/aadhaar.png",
    image: "/aadhaar.png",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "passport",
    title: "Passport Verification",
    description: "International passport verification and validation",
    category: {
      id: "document",
      name: "Document Verification",
      slug: "document",
      description: "Official document verification",
    },
    features: ["International support", "OCR technology", "Fraud detection", "Multi-language"],
    pricing: {
      free: { price: 0, requests: 25, features: ["Basic verification", "Email support"], support: "Email" },
      basic: { price: 599, requests: 250, features: ["Advanced verification", "Priority support"], support: "Chat" },
      premium: { price: 1999, requests: 2500, features: ["Enterprise features", "24/7 support"], support: "Phone" },
    },
    documentation: "Complete API documentation for Passport verification",
    isActive: true,
    icon: "/passport.png",
    image: "/passport.png",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "drivinglicense",
    title: "Driving License Verification",
    description: "Verify Driving License details from RTO records.",
    category: {
      id: "identity",
      name: "Identity Verification",
      slug: "identity",
      description: "Government ID verification",
    },
    features: ["Real-time verification", "Official RTO data", "High accuracy"],
    pricing: {
      free: { price: 0, requests: 50, features: ["Basic verification", "Email support"], support: "Email" },
      basic: { price: 499, requests: 500, features: ["Advanced verification", "Priority support"], support: "Chat" },
      premium: { price: 1499, requests: 5000, features: ["Enterprise features", "24/7 support"], support: "Phone" },
    },
    documentation: "Complete API documentation for Driving License verification",
    isActive: true,
    icon: "/drivinglicense.png",
    image: "/drivinglicense.png",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "voterid",
    title: "Voter ID Verification",
    description: "Verify voter details via direct fetch, captcha flow, or OCR scan.",
    category: {
      id: "identity",
      name: "Identity Verification",
      slug: "identity",
      description: "Government ID verification",
    },
    features: [
      "Direct API fetch (Boson)",
      "Captcha-based fetch (Meson)",
      "OCR extraction from card images",
      "Quota-aware billing",
    ],
    pricing: {
      free: { price: 0, requests: 20, features: ["Basic verification", "Email support"], support: "Email" },
      basic: { price: 299, requests: 500, features: ["Advanced verification", "Priority support"], support: "Chat" },
      premium: { price: 999, requests: 5000, features: ["Enterprise features", "24/7 support"], support: "Phone" },
    },
    documentation: "Complete API documentation for Voter ID verification",
    isActive: true,
    icon: "/voter.png",
    image: "/voter.png",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "gstin",
    title: "GSTIN Verification",
    description: "Verify business GSTIN details and contact information.",
    category: {
      id: "business",
      name: "Business Verification",
      slug: "business",
      description: "Business registry verification",
    },
    features: [
      "Contact details via GSTIN",
      "Lite GSTIN fetch",
      "High accuracy",
    ],
    pricing: {
      free: { price: 0, requests: 10, features: ["Basic verification", "Email support"], support: "Email" },
      basic: { price: 299, requests: 500, features: ["Advanced verification", "Priority support"], support: "Chat" },
      premium: { price: 999, requests: 5000, features: ["Enterprise features", "24/7 support"], support: "Phone" },
    },
    documentation: "Complete API documentation for GSTIN verification",
    isActive: true,
    icon: "/placeholder.svg",
    image: "/placeholder.svg",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "company",
    title: "Company Verification",
    description: "MCA company verification with CIN and DIN lookups.",
    category: {
      id: "business",
      name: "Business Verification",
      slug: "business",
      description: "Business registry verification",
    },
    features: [
      "Fetch company details by CIN/FCRN/LLPIN",
      "Clean, structured UI results",
      "Quota-aware billing",
    ],
    pricing: {
      free: { price: 0, requests: 10, features: ["Basic verification", "Email support"], support: "Email" },
      basic: { price: 299, requests: 500, features: ["Advanced verification", "Priority support"], support: "Chat" },
      premium: { price: 999, requests: 5000, features: ["Enterprise features", "24/7 support"], support: "Phone" },
    },
    documentation: "Complete API documentation for Company (MCA) verification",
    isActive: true,
    icon: "/placeholder.svg",
    image: "/placeholder.svg",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "vehicle",
    title: "RC Verification",
    description: "Verify vehicle Registration Certificate (RC) details including owner, insurance, PUC, and challans.",
    category: {
      id: "vehicle",
      name: "Vehicle Verification",
      slug: "vehicle",
      description: "Vehicle and transport document verification",
    },
    features: [
      "Fetch RC Lite & Detailed",
      "Chassis-to-RC lookup",
      "E-Challan integration",
      "FASTag details",
      "Real-time RTO data",
      "Quota-aware billing",
    ],
    pricing: {
      free: { 
        price: 0, 
        requests: 10, 
        features: ["Basic RC fetch", "Email support"], 
        support: "Email" 
      },
      basic: { 
        price: 399, 
        requests: 500, 
        features: ["Detailed RC + challan", "Priority support"], 
        support: "Chat" 
      },
      premium: { 
        price: 1299, 
        requests: 5000, 
        features: ["Enterprise access", "24/7 support", "FASTag & eChallan"], 
        support: "Phone" 
      },
    },
    documentation: "Complete API documentation for RC verification",
    isActive: true,
    icon: "/rc.png", // Add your icon
    image: "/rc.png", // Add your image
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
]

const mockCategories: ProductCategory[] = [
  { id: "identity", name: "Identity Verification", slug: "identity", description: "Government ID verification" },
  { id: "document", name: "Document Verification", slug: "document", description: "Official document verification" },
  // {
  //   id: "biometric",
  //   name: "Biometric Verification",
  //   slug: "biometric",
  //   description: "Face and fingerprint verification",
  // },
  { id: "address", name: "Address Verification", slug: "address", description: "Residential address verification" },
  { id: "business", name: "Business Verification", slug: "business", description: "Business registry verification" },
  { id: "vehicle", name: "Vehicle Verification", slug: "vehicle", description: "Vehicle and transport document verification" },

]

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params?: { category?: string; search?: string }) => {
    try {
      // For now, return mock data. Replace with actual API call:
      // const response = await productApi.getProducts(params)
      // return response.data

      let filteredProducts = [...mockProducts]

      if (params?.category) {
        filteredProducts = filteredProducts.filter((p) => p.category.id === params.category)
      }

      if (params?.search) {
        const searchLower = params.search.toLowerCase()
        filteredProducts = filteredProducts.filter(
          (p) => p.title.toLowerCase().includes(searchLower) || p.description.toLowerCase().includes(searchLower),
        )
      }

      return filteredProducts
    } catch (error) {
      throw new Error("Failed to fetch products")
    }
  },
)

export const fetchProductById = createAsyncThunk("products/fetchProductById", async (id: string) => {
  try {
    // For now, return mock data. Replace with actual API call:
    // const response = await productApi.getProductById(id)
    // return response.data

    const product = mockProducts.find((p) => p.id === id)
    if (!product) {
      throw new Error("Product not found")
    }
    return product
  } catch (error) {
    throw new Error("Failed to fetch product")
  }
})

export const fetchCategories = createAsyncThunk("products/fetchCategories", async () => {
  try {
    // For now, return mock data. Replace with actual API call:
    // const response = await productApi.getCategories()
    // return response.data

    return mockCategories
  } catch (error) {
    throw new Error("Failed to fetch categories")
  }
})

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProductState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.products = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch products"
      })
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedProduct = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch product"
      })
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch categories"
      })
  },
})

export const { setFilters, clearSelectedProduct, clearError } = productSlice.actions
export default productSlice.reducer
