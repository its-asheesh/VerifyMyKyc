import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { Solution, Industry } from "../../types/solution"
import type { LoadingState } from "../../types/common"

interface SolutionState extends LoadingState {
  solutions: Solution[]
  industries: Industry[]
  selectedSolution: Solution | null
}

// Mock data (mirrors product slice pattern)
export const mockIndustries: Industry[] = [
  { id: "banking-finance", name: "Banking & Finance", slug: "banking-finance", description: "Financial services industry", icon: "credit-card" },
  { id: "government", name: "Government", slug: "government", description: "Government services", icon: "building" },
  { id: "healthcare", name: "Healthcare", slug: "healthcare", description: "Healthcare industry", icon: "shield" },
  { id: "ecommerce", name: "E-commerce", slug: "ecommerce", description: "E-commerce industry", icon: "zap" },
]

export const mockSolutions: Solution[] = [
  {
    id: "bank-account-verification",
    title: "Bank Account Verification",
    description: "KYC solutions for financial institutions including bank account verification.",
    industry: mockIndustries[0],
    useCases: [
      { title: "Bank Account Verification", description: "Verify account number and IFSC for payouts and onboarding.", benefits: ["Reduce returns", "Faster payouts"] },
    ],
    benefits: ["Instant verification", "High accuracy", "Secure"],
    implementation: [
      { step: 1, title: "Collect Inputs", description: "Account number, IFSC, consent.", duration: "< 1 min" },
      { step: 2, title: "Call API", description: "POST /api/bankaccount/verify.", duration: "< 1 sec" },
      { step: 3, title: "Display Result", description: "Show account holder details and status.", duration: "Instant" },
    ],
    caseStudies: [],
    isActive: true,
    image: "/pan.png",
    link: "/banking",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "government-id-verification",
    title: "Government ID Verification",
    description: "Verify government-issued IDs for identity verification.",
    industry: mockIndustries[1],
    useCases: [
      { title: "ID Verification", description: "Verify government-issued IDs for identity proof.", benefits: ["Reduce fraud", "Compliance"] },
    ],
    benefits: ["Secure", "Compliant", "Fast"],
    implementation: [
      { step: 1, title: "Upload ID", description: "User uploads government ID.", duration: "< 1 min" },
      { step: 2, title: "Verify", description: "System verifies ID details.", duration: "< 2 sec" },
      { step: 3, title: "Result", description: "Verification result returned.", duration: "Instant" },
    ],
    caseStudies: [],
    isActive: true,
    image: "/aadhaar.png",
    link: "/government",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const initialState: SolutionState = {
  solutions: mockSolutions,
  industries: mockIndustries,
  selectedSolution: null,
  isLoading: false,
  error: null,
}

export const fetchSolutions = createAsyncThunk("solutions/fetchSolutions", async (industry?: string) => {
  // Use mock data; replace with API when backend is ready
  let items = [...mockSolutions]
  if (industry) {
    const normalized = industry.toLowerCase()
    items = items.filter(
      (s) => s.industry.id === industry || s.industry.slug === normalized || s.industry.name.toLowerCase().includes(normalized),
    )
  }
  return items
})

export const fetchSolutionById = createAsyncThunk(
  "solutions/fetchSolutionById",
  async (id: string, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Find solution in mock data
      const solution = mockSolutions.find(s => s.id === id);
      
      if (!solution) {
        return rejectWithValue('Solution not found');
      }
      
      return solution;
    } catch (error) {
      return rejectWithValue('Failed to fetch solution');
    }
  }
)

export const fetchIndustries = createAsyncThunk("solutions/fetchIndustries", async () => {
  return mockIndustries
})

const solutionSlice = createSlice({
  name: "solutions",
  initialState,
  reducers: {
    clearSelectedSolution: (state) => {
      state.selectedSolution = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Solutions
      .addCase(fetchSolutions.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSolutions.fulfilled, (state, action) => {
        state.isLoading = false
        state.solutions = action.payload
      })
      .addCase(fetchSolutions.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch solutions"
      })
      
      // Fetch Solution By ID
      .addCase(fetchSolutionById.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.selectedSolution = null
      })
      .addCase(fetchSolutionById.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedSolution = action.payload
      })
      .addCase(fetchSolutionById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string || 'Failed to fetch solution'
      })
      
      // Fetch Industries
      .addCase(fetchIndustries.fulfilled, (state, action) => {
        state.industries = action.payload
      })
  },
})

export const { clearSelectedSolution } = solutionSlice.actions
export default solutionSlice.reducer
