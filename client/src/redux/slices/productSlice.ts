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
    demandLevel: "high",
    demand: "High In Demand",
    category: {
      id: "personal",
      name: "Personal Verification",
      slug: "personal",
      description: "Government ID verification",
    },
    features: ["Real-time verification", "Government database check", "99.9% accuracy"],
    services: [
      "Verify PAN Holder Name & Status",
      "Fetch Father's Name from PAN Database",
      "Check PAN-Aadhaar Linking Status",
      "Retrieve Associated GSTIN/DIN/CIN",
      "Pull PAN Card PDF from DigiLocker"
    ],
    pricing: {
      free: { price: 0, requests: 100, features: ["Basic verification", "Email support"], support: "Email" },
      basic: { price: 299, requests: 1000, features: ["Advanced verification", "Priority support"], support: "Chat" },
      premium: { price: 999, requests: 10000, features: ["Enterprise features", "24/7 support"], support: "Phone" },
    },
    documentation: "Complete API documentation for PAN verification",
    isActive: true,
    icon: "/pan.png",
    image: "/Pan_card.jpg",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "aadhaar",
    title: "Aadhaar Verification",
    description: "Secure Aadhaar card verification with OTP validation",
    demandLevel: "high",
    demand: "High In Demand",
    category: {
      id: "personal",
      name: "Personal Verification",
      slug: "personal",
      description: "Government ID verification",
    },
    features: ["OTP verification", "Biometric matching", "Secure processing", "Compliance ready"],
    services: [
      "Verify Aadhaar via OTP (eKYC)",
      "Extract Data via Aadhaar Card ",
      "Download Aadhaar Information PDF (Masked/Full)",
    ],
    pricing: {
      free: { price: 0, requests: 50, features: ["Basic verification", "Email support"], support: "Email" },
      basic: { price: 399, requests: 500, features: ["Advanced verification", "Priority support"], support: "Chat" },
      premium: { price: 1299, requests: 5000, features: ["Enterprise features", "24/7 support"], support: "Phone" },
    },
    documentation: "Complete API documentation for Aadhaar verification",
    isActive: true,
    icon: "/aadhaar.jpg",
    image: "/aadhaar.jpg",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "passport",
    title: "Passport Verification",
    description: "International passport verification and validation",
    demandLevel: "high",
    demand: "High In Demand",
    category: {
      id: "personal",
      name: "Personal Verification",
      slug: "personal",
      description: "Government ID verification",
    },
    features: ["International support", "Fraud detection", "Multi-language"],
    services: [
      "Verify Passport Holder & Validity",
      "Generate Machine Readable Zone (MRZ)",
      "Validate MRZ Checksum & Authenticity",
      "Retrieve Issue/Expiry Date & Authority"
    ],
    pricing: {
      free: { price: 0, requests: 25, features: ["Basic verification", "Email support"], support: "Email" },
      basic: { price: 599, requests: 250, features: ["Advanced verification", "Priority support"], support: "Chat" },
      premium: { price: 1999, requests: 2500, features: ["Enterprise features", "24/7 support"], support: "Phone" },
    },
    documentation: "Complete API documentation for Passport verification",
    isActive: true,
    icon: "/passport.jpg",
    image: "/passport.jpg",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "drivinglicense",
    title: "Driving License Verification",
    description: "Verify Driving License details from RTO records.",
    demandLevel: "high",
    demand: "High In Demand",
    category: {
      id: "personal",
      name: "Personal Verification",
      slug: "personal",
      description: "Government ID verification",
    },
    features: ["Real-time verification", "Official RTO data", "High accuracy"],
    services: [
      "Fetch DL Holder Name, DOB & Address",
      "Check DL Validity & Expiry Date",
      "Retrieve Issuing RTO & Vehicle Class",
      "Get DL Status (Active/Suspended)"
    ],
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
    demandLevel: "high",
    demand: "High In Demand",
    category: {
      id: "personal",
      name: "Personal Verification",
      slug: "personal",
      description: "Government ID verification",
    },
    features: [
      "Direct API fetch",
      "Quota-aware billing",
    ],
    services: [
      "Fetch Voter Name, Age & EPIC Number",
      "Voter Info Retrieval",
      "Retrieve Constituency, State & Booth Info",
      "Verify Voter ID Authenticity & Status"
    ],
    pricing: {
      free: { price: 0, requests: 20, features: ["Basic verification", "Email support"], support: "Email" },
      basic: { price: 299, requests: 500, features: ["Advanced verification", "Priority support"], support: "Chat" },
      premium: { price: 999, requests: 5000, features: ["Enterprise features", "24/7 support"], support: "Phone" },
    },
    documentation: "Complete API documentation for Voter ID verification",
    isActive: true,
    icon: "/voter.jpg",
    image: "/voter.jpg",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "gstin",
    title: "GSTIN Verification",
    description: "Verify business GSTIN details and contact information.",
    demandLevel: "high",
    demand: "High In Demand",
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
    services: [
      "Verify Business Name & Legal Status",
      "Fetch GST Registration Date & State Code",
      "Retrieve Proprietor/Partner/Director Info",
      "Get Business Address & Constitution Type",
      "Download GST Registration Certificate"
    ],
    pricing: {
      free: { price: 0, requests: 10, features: ["Basic verification", "Email support"], support: "Email" },
      basic: { price: 299, requests: 500, features: ["Advanced verification", "Priority support"], support: "Chat" },
      premium: { price: 999, requests: 5000, features: ["Enterprise features", "24/7 support"], support: "Phone" },
    },
    documentation: "Complete API documentation for GSTIN verification",
    isActive: true,
    icon: "/placeholder.svg",
    image: "/gst.jpg",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "company",
    title: "Company Verification",
    description: "MCA company verification with CIN and DIN lookups.",
    demandLevel: "high",
    demand: "High In Demand",
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
    services: [
      "Verify Company Name & Registration Status",
      "Fetch Incorporation Date & ROC Details",
      "Retrieve Director List via DIN",
      "Get Authorized Capital & Company Type",
      "Download MCA Master Data Report"
    ],
    pricing: {
      free: { price: 0, requests: 10, features: ["Basic verification", "Email support"], support: "Email" },
      basic: { price: 299, requests: 500, features: ["Advanced verification", "Priority support"], support: "Chat" },
      premium: { price: 999, requests: 5000, features: ["Enterprise features", "24/7 support"], support: "Phone" },
    },
    documentation: "Complete API documentation for Company (MCA) verification",
    isActive: true,
    icon: "/placeholder.svg",
    image: "/business.jpg",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "vehicle",
    title: "Vehicle Verification",
    description: "Verify vehicle Registration Certificate (RC) details including owner, insurance, PUC, and challans.",
    demandLevel: "high",
    demand: "High In Demand",
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
    services: [
      "Fetch Basic RC Details (Owner, Reg. No.)",
      "Get Detailed RC: Engine, Chassis, Fuel Type",
      "Retrieve Active E-Challans & Pending Fines",
      "Lookup Vehicle by Chassis Number",
      "Check FASTag Activation & Balance Status",
      "Verify PUC Certificate Validity"
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
    icon: "/rc.png",
    image: "/VehicleVerification.jpg",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "ccrv",
    title: "Criminal Case Record Verification",
    description: "Comprehensive criminal background check and case record verification",
    demandLevel: "high",
    demand: "Essential",
    category: {
      id: "criminal",
      name: "Criminal Record Verification",
      slug: "criminal",
      description: "Criminal and background checks"
    },
    features: [
      "Nationwide criminal record search",
      "Court case history verification",
      "Real-time status updates",
      "Detailed case information",
      "Report generation with PDF download"
    ],
    services: [
      "Search Criminal Records by Name & DOB",
      "Fetch FIR & Court Case Details",
      "Verify Case Status: Pending/Disposed",
      "Download Verifiable PDF Report",
      "Bulk Screening for HR/Recruitment"
    ],
    pricing: {
      free: {
        price: 0,
        requests: 10,
        features: [
          "Basic criminal record search",
          "Email support",
          "Limited case details"
        ],
        support: "Email"
      },
      basic: {
        price: 499,
        requests: 500,
        features: [
          "Comprehensive background check",
          "Detailed case info & court data",
          "Priority support",
          "PDF report with digital signature"
        ],
        support: "Chat"
      },
      premium: {
        price: 1499,
        requests: 5000,
        features: [
          "Enterprise background screening",
          "Multi-state & High Court coverage",
          "24/7 dedicated support",
          "Bulk API processing",
          "Custom analytics dashboard"
        ],
        support: "Phone"
      }
    },
    documentation: "Complete API documentation for CCRV verification",
    isActive: true,
    icon: "/ccrv.png",
    image: "/CCRV.jpg",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  // {
  //   id: "bank-account",
  //   title: "Bank Account Verification",
  //   description: "Verify bank account details and ownership for financial institutions",
  //   demandLevel: "high",
  //   demand: "High In Demand",
  //   category: {
  //     id: "banking",
  //     name: "Banking Service",
  //     slug: "banking",
  //     description: "Banking and financial verification services",
  //   },
  //   features: ["Real-time verification", "Bank database integration", "99.9% accuracy", "Instant results"],
  //   services: [
  //     "Verify Account Holder Name",
  //     "Check Account Status",
  //     "Validate IFSC Code",
  //     "Verify Account Number",
  //     "Check Account Type"
  //   ],
  //   pricing: {
  //     free: { price: 0, requests: 50, features: ["Basic verification", "Email support"], support: "Email" },
  //     basic: { price: 499, requests: 1000, features: ["Advanced verification", "Priority support"], support: "Chat" },
  //     premium: { price: 1999, requests: 10000, features: ["Enterprise features", "24/7 support"], support: "Phone" },
  //   },
  //   documentation: "Complete API documentation for bank account verification",
  //   isActive: true,
  //   icon: "/banking.jpg",
  //   image: "/banking.jpg",
  //   createdAt: "2024-01-01",
  //   updatedAt: "2024-01-01"
  // },
  {
    id: "epfo",
    title: "EPFO Verification",
    description: "Fetch UAN, employment history, passbook (OTP flow) and verify employer",
    demandLevel: "high",
    demand: "Trending",
    category: {
      id: "business",
      name: "Business Verification",
      slug: "business",
      description: "Business registry verification",
    },
    features: [
      "UAN discovery by mobile/PAN",
      "Employment history by UAN",
      "Passbook V1 (OTP-based) flow",
      "Employer verification",
    ],
    services: [
      "Fetch UAN by mobile and PAN",
      "Fetch employment history by UAN",
      "Generate & validate OTP; list employers; fetch passbook",
      "Verify employer establishment details",
    ],
    pricing: {
      free: { price: 0, requests: 5, features: ["Basic discovery", "Email support"], support: "Email" },
      basic: { price: 149, requests: 100, features: ["Employment & passbook (OTP)", "Priority support"], support: "Chat" },
      premium: { price: 1499, requests: 1000, features: ["Employer verify", "24/7 support"], support: "Phone" },
    },
    documentation: "EPFO APIs: UAN, employment history, passbook (OTP), employer verify",
    isActive: true,
    icon: "/verifymykyclogo.svg",
    image: "/business.jpg",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
];

const mockCategories: ProductCategory[] = [
  { id: "personal", name: "Personal Verification", slug: "personal", description: "Personal ID verification" },
  // { id: "document", name: "Document Verification", slug: "document", description: "Official document verification" },
  // {
  //   id: "biometric",
  //   name: "Biometric Verification",
  //   slug: "biometric",
  //   description: "Face and fingerprint verification",
  // },
  { id: "criminal", name: "Criminal Record Verification", slug: "criminal", description: "Criminal record verification" },
  { id: "business", name: "Business Verification", slug: "business", description: "Business registry verification" },
  { id: "vehicle", name: "Vehicle Verification", slug: "vehicle", description: "Vehicle and transport document verification" },
  // { id: "banking", name: "Banking Service", slug: "banking", description: "Banking and financial verification services" },

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

      // Sort by required priority order
      const priorityOrder = [
        'aadhaar',
        'pan',
        'voterid',
        'passport',
        'epfo',
        'drivinglicense',
        'vehicle',
        'bank-account',
        'company',
        'gstin',
      ]
      const priorityIndex: Record<string, number> = Object.fromEntries(priorityOrder.map((k, i) => [k, i]))
      filteredProducts.sort((a, b) => {
        const ai = priorityIndex[(a.id || '').toLowerCase()] ?? Number.MAX_SAFE_INTEGER
        const bi = priorityIndex[(b.id || '').toLowerCase()] ?? Number.MAX_SAFE_INTEGER
        if (ai !== bi) return ai - bi
        // fallback alphabetical by title
        return (a.title || '').localeCompare(b.title || '')
      })

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
