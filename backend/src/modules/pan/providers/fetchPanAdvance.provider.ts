import apiClient from "../../../common/http/apiClient";
import { HTTPError } from "../../../common/http/error";
import {
  FetchPanAdvanceRequest,
  FetchPanAdvanceResponse,
} from "../../../common/types/pan";

export async function fetchPanAdvanceProvider(
  payload: FetchPanAdvanceRequest
): Promise<FetchPanAdvanceResponse> {
  try {
    console.log("Fetch PAN Advance API Request:", {
      url: "/pan-api/fetch-advanced",
      payload,
      baseURL: process.env.GRIDLINES_BASE_URL,
    });

    const response = await apiClient.post("/pan-api/fetch-advanced", payload);

    console.log("Fetch PAN Advance API Response:", {
      status: response.status,
      data: response.data,
    });

    return response.data;
  } catch (error: any) {
    console.error("Fetch PAN Advance API Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers,
      },
    });

    throw new HTTPError(
      error.response?.data?.message || "Fetch PAN Advance failed",
      error.response?.status || 500,
      error.response?.data
    );
  }
}