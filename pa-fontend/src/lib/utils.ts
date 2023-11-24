import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function buildApiUrl(baseUrl: string, endpoint: string, params?: Record<string, string>): string {
  // Ensure there is no duplicated slash between the base URL and the endpoint

  baseUrl = baseUrl.replace(/\/$/, ""); // Remove the trailing slash from the base URL if it exists)
  endpoint = endpoint.replace(/^\//, ""); // Remove the leading slash from the endpoint if it exists
  endpoint = endpoint ? '/' + endpoint : '';
  // Construct the full URL
  let fullUrl = `${baseUrl}${endpoint}`;

  // Add optional parameters if provided
  if (params) {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    fullUrl += `?${queryString}`;
  }

  return fullUrl;
}