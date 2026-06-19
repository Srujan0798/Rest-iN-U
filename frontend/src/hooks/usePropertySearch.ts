"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

// Backend API base URL - matches B1 backend server
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

interface PropertyFilters {
  city?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  propertyType?: string;
  category?: string;
  minBedrooms?: string | number;
  minBathrooms?: string | number;
  page?: number | string;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchQuery?: string;
}

// Backend property response structure
interface BackendProperty {
  id: string;
  title: string;
  price: number | string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number | null;
  propertyType: string;
  photos: Array<{ url: string; thumbnailUrl?: string }>;
  vastuAnalysis?: {
    overallScore: number;
    grade: string;
  } | null;
  climateAnalysis?: {
    overallRiskScore: number;
    riskGrade: string;
  } | null;
}

// Frontend property interface
export interface Property {
  id: string;
  title: string;
  price: number;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  propertyType?: string;
  image?: string;
  vastuScore?: number;
  climateRisk?: "low" | "medium" | "high";
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface BackendResponse {
  success: boolean;
  data: {
    properties: BackendProperty[];
    pagination: Pagination;
  };
}

interface UsePropertySearchReturn {
  properties: Property[];
  isLoading: boolean;
  error: Error | null;
  pagination: Pagination | null;
  refetch: () => void;
}

// Transform backend property to frontend format
function transformProperty(bp: BackendProperty): Property {
  // Convert climate risk score to category
  let climateRisk: "low" | "medium" | "high" | undefined;
  if (bp.climateAnalysis?.overallRiskScore !== undefined) {
    const score = bp.climateAnalysis.overallRiskScore;
    if (score <= 30) climateRisk = "low";
    else if (score <= 60) climateRisk = "medium";
    else climateRisk = "high";
  }

  return {
    id: bp.id,
    title: bp.title,
    price: typeof bp.price === "string" ? parseFloat(bp.price) : bp.price,
    city: bp.city,
    state: bp.state,
    bedrooms: bp.bedrooms,
    bathrooms: bp.bathrooms,
    sqft: bp.squareFeet || 0,
    propertyType: bp.propertyType,
    image: bp.photos?.[0]?.url || bp.photos?.[0]?.thumbnailUrl,
    vastuScore: bp.vastuAnalysis?.overallScore,
    climateRisk,
  };
}

export function usePropertySearch(
  filters: PropertyFilters = {},
): UsePropertySearchReturn {
  // Build query parameters for B1 backend API
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();

    // Map frontend filter names to backend parameter names
    if (filters.city) params.append("city", filters.city);
    if (filters.minPrice) params.append("minPrice", String(filters.minPrice));
    if (filters.maxPrice) params.append("maxPrice", String(filters.maxPrice));
    if (filters.propertyType) params.append("propertyType", filters.propertyType);
    if (filters.category) params.append("category", filters.category);
    if (filters.minBedrooms) params.append("minBedrooms", String(filters.minBedrooms));
    if (filters.minBathrooms) params.append("minBathrooms", String(filters.minBathrooms));
    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit || 24));
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    return params.toString();
  }, [filters]);

  const { data, isLoading, error, refetch } = useQuery<BackendResponse>({
    queryKey: ["properties", queryParams],
    queryFn: async () => {
      const url = `${API_BASE}/properties${queryParams ? `?${queryParams}` : ""}`;

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.statusText}`);
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Transform backend properties to frontend format
  const properties = useMemo(() => {
    if (!data?.data?.properties) return [];
    return data.data.properties.map(transformProperty);
  }, [data]);

  return {
    properties,
    isLoading,
    error: error || null,
    pagination: data?.data?.pagination || null,
    refetch,
  };
}
