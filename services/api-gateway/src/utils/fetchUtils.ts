import { NetworkError, createErrorFromResponse, isNetworkRelatedError } from './errors.js';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * Enhanced fetch with timeout and better error handling
 */
export const fetchWithTimeout = async (
  url: string, 
  options: FetchOptions = {}
): Promise<Response> => {
  const { timeout = 10000, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'api-gateway/1.0.0',
        ...fetchOptions.headers,
      },
      ...fetchOptions,
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new NetworkError(`Request timeout after ${timeout}ms`, error);
      }
      
      if (isNetworkRelatedError(error)) {
        throw new NetworkError(`Network error: ${error.message}`, error);
      }
    }
    
    throw error;
  }
};

/**
 * Fetch with automatic error conversion
 */
export const fetchWithErrorHandling = async (
  url: string,
  service: string,
  options: FetchOptions = {}
): Promise<Response> => {
  const response = await fetchWithTimeout(url, options);
  
  if (!response.ok) {
    throw createErrorFromResponse(response, service);
  }
  
  return response;
};