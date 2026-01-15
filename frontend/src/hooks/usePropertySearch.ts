"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface PropertyFilters {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  page?: number;
  limit?: number;
}

interface Property {
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
  climateRisk?: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PropertySearchResponse {
  properties: Property[];
  pagination: Pagination;
}

interface UsePropertySearchReturn {
  properties: Property[];
  isLoading: boolean;
  error: Error | null;
  pagination: Pagination | null;
}

export function usePropertySearch(
  filters: PropertyFilters = {},
): UsePropertySearchReturn {
  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    return params.toString();
  }, [filters]);

  const { data, isLoading, error } = useQuery<PropertySearchResponse>({
    queryKey: ["properties", queryString],
    queryFn: async () => {
      const url = `/api/properties${queryString ? `?${queryString}` : ""}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.statusText}`);
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    properties: data?.properties || [],
    isLoading,
    error: error || null,
    pagination: data?.pagination || null,
  };
}
