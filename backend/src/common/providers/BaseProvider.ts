import apiClient from '../http/apiClient';
import { HTTPError } from '../http/error';

export interface ApiCallOptions {
  endpoint: string;
  payload: any;
  operationName: string;
  baseURL?: string;
  logRequest?: boolean;
  logResponse?: boolean;
  customErrorMapper?: (error: any) => ErrorMappingResult;
}

export interface ErrorMappingResult {
  message: string;
  statusCode: number;
}

export interface FunctionalApiCallOptions {
  endpoint: string;
  payload: any;
  operationName: string;
  logRequest?: boolean;
  logResponse?: boolean;
  customErrorMapper?: (error: any) => ErrorMappingResult;
  headers?: Record<string, string>;
  method?: 'POST' | 'GET';
}

/**
 * Base provider class that handles common API patterns
 * Maintains all existing functionality while reducing duplication
 */
export abstract class BaseProvider {
  /**
   * Makes API call with consistent logging and error handling
   * Preserves exact same behavior as existing providers
   */
  protected async makeApiCall<T>(options: ApiCallOptions): Promise<T> {
    const { endpoint, payload, operationName, baseURL, logRequest, logResponse, customErrorMapper } = options;
    
    try {
      // Optional: Log request (default: true)
      if (logRequest !== false) {
        console.log(`${operationName} API Request:`, {
          url: endpoint,
          payload,
          baseURL: baseURL || process.env.GRIDLINES_BASE_URL
        });
      }
      
      const response = await apiClient.post(endpoint, payload);
      
      // Optional: Log response (default: true)
      if (logResponse !== false) {
        console.log(`${operationName} API Response:`, {
          status: response.status,
          data: response.data
        });
      }
      
      return response.data;
    } catch (error: any) {
      this.handleApiError(error, operationName, customErrorMapper);
    }
  }


  /**
   * Maps errors to consistent format
   * Maintains exact same error mapping logic as existing providers
   */
  private mapError(error: any, operationName: string, customMapper?: (error: any) => ErrorMappingResult): ErrorMappingResult {
    // Use custom mapper if provided
    if (customMapper) {
      return customMapper(error);
    }

    let errorMessage = `${operationName} failed`;
    let statusCode = 500;

    if (error.code === 'ECONNABORTED' || (typeof error.message === 'string' && error.message.includes('timeout'))) {
      errorMessage = 'Request to Gridlines API timed out. Please try again.';
      statusCode = 408;
    } else if (error.response?.status === 401) {
      errorMessage = 'Invalid API key or authentication failed';
      statusCode = 401;
    } else if (error.response?.status === 403) {
      // Handle 403 Forbidden Access (product access denied)
      const errorData = error.response?.data?.error;
      if (errorData?.code === 'FORBIDDEN_ACCESS' || errorData?.message) {
        errorMessage = errorData.message || 'Access denied. This product is not available with your current credentials.';
      } else {
        errorMessage = error.response?.data?.message || 'Access denied. This product is not available with your current credentials.';
      }
      statusCode = 403;
    } else if (error.response?.status === 404) {
      errorMessage = `${operationName} endpoint not found`;
      statusCode = 404;
    } else if (error.response?.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
      statusCode = 429;
    } else if (error.response?.status === 500) {
      // External API 500 - distinguish upstream errors when available
      if (error.response?.data?.error?.code === 'UPSTREAM_INTERNAL_SERVER_ERROR') {
        errorMessage = 'Government source temporarily unavailable. Please try again in a few minutes.';
        statusCode = 503;
      } else {
        errorMessage = 'External API server error. Please try again.';
        statusCode = 502;
      }
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
      statusCode = error.response.status || 500;
    }

    return { message: errorMessage, statusCode };
  }

  /**
   * Handles API errors with support for custom error mapper
   */
  private handleApiError(error: any, operationName: string, customMapper?: (error: any) => ErrorMappingResult): never {
    // Structured error logging for faster diagnostics (maintains existing pattern)
    console.error(`${operationName} API Error:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers
      }
    });

    const { message, statusCode } = this.mapError(error, operationName, customMapper);
    throw new HTTPError(message, statusCode, error.response?.data);
  }

  /**
   * Transforms payload to match external API format
   * Can be overridden by subclasses for specific transformations
   */
  protected transformPayload(payload: any): any {
    return payload;
  }

  /**
   * Validates payload before making API call
   * Can be overridden by subclasses for specific validations
   */
  protected validatePayload(payload: any): void {
    // Default validation - can be extended by subclasses
    if (!payload) {
      throw new Error('Payload is required');
    }
  }

  /**
   * Makes API call with payload transformation and validation
   * Convenience method that combines common operations
   */
  protected async makeTransformedApiCall<T>(
    endpoint: string,
    payload: any,
    operationName: string
  ): Promise<T> {
    this.validatePayload(payload);
    const transformedPayload = this.transformPayload(payload);
    
    return this.makeApiCall<T>({
      endpoint,
      payload: transformedPayload,
      operationName
    });
  }
}

/**
 * Functional version of makeApiCall - can be used without extending BaseProvider
 * Provides the same functionality with a simpler functional interface
 */
export async function makeProviderApiCall<T>(
  options: FunctionalApiCallOptions
): Promise<T> {
  const { endpoint, payload, operationName, logRequest, logResponse, customErrorMapper, headers, method = 'POST' } = options;
  
  try {
    // Optional: Log request (default: true)
    if (logRequest !== false) {
      console.log(`${operationName} Request:`, {
        url: endpoint,
        payload,
        method,
        headers: headers ? Object.keys(headers).reduce((acc, key) => {
          acc[key] = key.includes('Key') || key.includes('Auth') ? '***' : headers[key];
          return acc;
        }, {} as Record<string, string>) : undefined,
        baseURL: process.env.GRIDLINES_BASE_URL
      });
    }
    
    let response;
    if (method === 'GET') {
      response = await apiClient.get(endpoint, headers ? { headers, params: payload } : { params: payload });
    } else {
      response = await apiClient.post(endpoint, payload, headers ? { headers } : undefined);
    }
    
    // Optional: Log response (default: true)
    if (logResponse !== false) {
      console.log(`${operationName} Response:`, {
        status: response.status,
        data: response.data
      });
    }
    
    return response.data as T;
  } catch (error: any) {
    // Structured error logging
    console.error(`${operationName} Error:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });

    // Use custom error mapper if provided, otherwise use standard mapper
    const { message, statusCode } = customErrorMapper 
      ? customErrorMapper(error)
      : createStandardErrorMapper(`${operationName} failed`)(error);
    
    throw new HTTPError(message, statusCode, error.response?.data);
  }
}

/**
 * Creates a standardized error mapper with custom default message
 * Returns an error mapping function with consistent behavior
 */
export function createStandardErrorMapper(defaultMessage: string): (error: any) => ErrorMappingResult {
  return (error: any) => {
    let errorMessage = defaultMessage;
    let statusCode = 500;

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      errorMessage = 'Request timed out. Please try again.';
      statusCode = 408;
    } else if (error.response?.status === 401) {
      errorMessage = 'Invalid API key or authentication failed';
      statusCode = 401;
    } else if (error.response?.status === 403) {
      // Handle 403 Forbidden Access (product access denied)
      const errorData = error.response?.data?.error;
      if (errorData?.code === 'FORBIDDEN_ACCESS' || errorData?.message) {
        errorMessage = errorData.message || 'Access denied. This product is not available with your current credentials.';
      } else {
        errorMessage = error.response?.data?.message || 'Access denied. This product is not available with your current credentials.';
      }
      statusCode = 403;
    } else if (error.response?.status === 404) {
      errorMessage = 'API endpoint not found';
      statusCode = 404;
    } else if (error.response?.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
      statusCode = 429;
    } else if (error.response?.status === 500) {
      if (error.response?.data?.error?.code === 'UPSTREAM_INTERNAL_SERVER_ERROR') {
        errorMessage = 'Government source temporarily unavailable. Please try again in a few minutes.';
        statusCode = 503;
      } else {
        errorMessage = 'External API server error. Please try again.';
        statusCode = 502;
      }
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
      statusCode = error.response.status || 500;
    }

    return { message: errorMessage, statusCode };
  };
}

