"use client";

import { useState, useCallback } from "react";
import api from "../../lib/api";
import { SearchFilters } from "./SearchForm";

export interface PropertyResult {
  id: string;
  title?: string;
  streetAddress?: string;
  city: string;
  state: string;
  zipCode?: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  propertyType: string;
  status?: string;
  photos?: { url: string; isPrimary?: boolean }[];
  vastuAnalysis?: { overallScore: number; grade?: string }[];
  climateAnalysis?: { overallRiskScore: number; riskGrade?: string };
}

export interface SearchResponse {
  properties: PropertyResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UseEstateSearchResult {
  results: SearchResponse | null;
  loading: boolean;
  error: string | null;
  search: (filters: SearchFilters, page?: number) => Promise<void>;
  clearResults: () => void;
}

export function useEstateSearch(): UseEstateSearchResult {
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (filters: SearchFilters, page: number = 1) => {
      setLoading(true);
      setError(null);

      try {
        // Build query params for B1's API
        const params: Record<string, string> = {
          page: String(page),
          limit: "12",
          includeAnalysis: "true",
        };

        if (filters.city) {
          params.city = filters.city;
        }
        if (filters.propertyType) {
          params.propertyType = filters.propertyType;
        }
        if (filters.minPrice !== undefined) {
          params.minPrice = String(filters.minPrice);
        }
        if (filters.maxPrice !== undefined) {
          params.maxPrice = String(filters.maxPrice);
        }
        if (filters.bedrooms !== undefined) {
          params.minBedrooms = String(filters.bedrooms);
        }
        if (filters.bathrooms !== undefined) {
          params.minBathrooms = String(filters.bathrooms);
        }
        if (filters.minVastuScore !== undefined) {
          params.minVastuScore = String(filters.minVastuScore);
        }

        // Call B1's properties API
        const API_BASE = "http://localhost:8000/api/v1";
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE}/properties?${query}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();

        // Transform response to match our interface
        // Backend returns: { success: true, data: { properties: [...], pagination: {...} }
        const data = responseData.data || responseData;

        setResults({
          properties: data.properties || data.items || [],
          pagination: data.pagination || {
            page: 1,
            limit: 12,
            total: (data.properties || data.items || []).length,
            totalPages: 1,
          },
        });

        console.log("Final results set:", {
          properties: data.properties || data.items || [],
          count: (data.properties || data.items || []).length,
        });
      } catch (err: any) {
        console.error("Estate search error:", err);
        console.error("Error details:", err.response?.data || err);
        setError(
          err.message || "Failed to search properties. Please try again.",
        );
        setResults(null);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return { results, loading, error, search, clearResults };
}

// Hook for managing favorites
export function useEstateFavorites() {
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const toggleFavorite = useCallback(async (propertyId: string) => {
    setLoading(true);
    try {
      const response = await api.favoriteProperty(propertyId);
      setFavoritedIds((prev) => {
        const next = new Set(prev);
        if (response.favorited || response.data?.favorited) {
          next.add(propertyId);
        } else {
          next.delete(propertyId);
        }
        return next;
      });
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { favoritedIds, toggleFavorite, loading };
}
