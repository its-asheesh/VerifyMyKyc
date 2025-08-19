import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { Solution, Industry } from "../../types/solution"
import type { LoadingState } from "../../types/common"
import { solutionApi } from "../../services/api/solutionApi"

interface SolutionState extends LoadingState {
  solutions: Solution[]
  industries: Industry[]
  selectedSolution: Solution | null
}

const initialState: SolutionState = {
  solutions: [],
  industries: [],
  selectedSolution: null,
  isLoading: false,
  error: null,
}

export const fetchSolutions = createAsyncThunk("solutions/fetchSolutions", async (industry?: string) => {
  const response = await solutionApi.getSolutions(industry)
  return response.data
})

export const fetchSolutionById = createAsyncThunk("solutions/fetchSolutionById", async (id: string) => {
  const response = await solutionApi.getSolutionById(id)
  return response.data
})

export const fetchIndustries = createAsyncThunk("solutions/fetchIndustries", async () => {
  const response = await solutionApi.getIndustries()
  return response.data
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
        state.error = action.error.message || "Failed to fetch solution"
        state.selectedSolution = null
      })
      .addCase(fetchIndustries.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchIndustries.fulfilled, (state, action) => {
        state.isLoading = false
        state.industries = action.payload
      })
      .addCase(fetchIndustries.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch industries"
      })
  },
})

export const { clearSelectedSolution } = solutionSlice.actions
export default solutionSlice.reducer
