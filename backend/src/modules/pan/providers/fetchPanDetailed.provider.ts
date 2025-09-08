import apiClient from "../../../common/http/apiClient";
import { HTTPError } from "../../../common/http/error";
import {
  FetchPanDetailsRequest,
  FetchPanDetailResponse,
} from "../../../common/types/pan";

export async function fetchPanDetailedProvider(
  payload: FetchPanDetailsRequest
): Promise<FetchPanDetailResponse> {
  try {
    console.log("Fetch PAN Detailed API Request:", {
      url: "/pan-api/fetch-detailed",
      payload,
      baseURL: process.env.GRIDLINES_BASE_URL,
    });

    const response = await apiClient.post("/pan-api/fetch-detailed", payload);

    console.log("Fetch PAN Detailed API Response:", {
      status: response.status,
      data: response.data,
    });

    return response.data;
  } catch (error: any) {
    console.error("Fetch PAN Detailed API Error:", {
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
      error.response?.data?.message || "Fetch PAN Detailed failed",
      error.response?.status || 500,
      error.response?.data
    );
  }
}