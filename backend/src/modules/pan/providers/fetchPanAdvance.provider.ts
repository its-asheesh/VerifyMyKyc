import { makeProviderApiCall, createStandardErrorMapper } from "../../../common/providers/BaseProvider";
import {
  FetchPanAdvanceRequest,
  FetchPanAdvanceResponse,
} from "../../../common/types/pan";

export async function fetchPanAdvanceProvider(
  payload: FetchPanAdvanceRequest
): Promise<FetchPanAdvanceResponse> {
  return makeProviderApiCall<FetchPanAdvanceResponse>({
    endpoint: "/pan-api/fetch-advanced",
    payload,
    operationName: "PAN Advance",
    customErrorMapper: createStandardErrorMapper("Fetch PAN Advance failed")
  });
}