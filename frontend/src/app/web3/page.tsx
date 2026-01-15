// @F1-Web: WEB3 Mode Blockchain Properties Page
"use client";

import { useState } from "react";
import { SearchBar } from "@/components/estate/SearchBar";
import { PropertyGrid } from "@/components/estate/PropertyGrid";
import { usePropertySearch } from "@/hooks/usePropertySearch";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { Globe, Bitcoin, TrendingUp, Shield, Wallet } from "lucide-react";

export default function Web3Page() {
  const [filters, setFilters] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
    propertyType: "BLOCKCHAIN", // Default to blockchain properties
    minBedrooms: "",
  });

  const { properties, isLoading, error, pagination } = usePropertySearch({
    ...filters,
    category: "web3", // Add web3 category filter
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* WEB3 Mode Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-3 mb-2">
            <Globe className="w-8 h-8" />
            <h1 className="text-4xl font-bold">🌐 WEB3 Mode</h1>
          </div>
          <p className="text-emerald-100">
            Blockchain-Verified Properties & Smart Contracts
          </p>

          {/* Web3 Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur rounded-lg p-3 text-center">
              <Bitcoin className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm">NFT Properties</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-3 text-center">
              <Shield className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm">Smart Contracts</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-3 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm">Tokenization</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-3 text-center">
              <Wallet className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm">DeFi Integration</div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="container mx-auto px-4 py-8">
        <SearchBar filters={filters} onFiltersChange={setFilters} />

        {/* Results */}
        <div className="mt-8">
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              <p className="mt-4 text-gray-600">
                Searching blockchain properties...
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600">
                Error loading properties. Please try again.
              </p>
            </div>
          )}

          {!isLoading && !error && properties.length === 0 && (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No blockchain properties found. Try different filters.
              </p>
            </div>
          )}

          {!isLoading && !error && properties.length > 0 && (
            <>
              {/* Web3 Property Type Filter */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {[
                    "BLOCKCHAIN",
                    "NFT_PROPERTY",
                    "TOKENIZED",
                    "SMART_CONTRACT",
                    "DAO_MANAGED",
                  ].map((type) => (
                    <button
                      key={type}
                      onClick={() =>
                        setFilters({ ...filters, propertyType: type })
                      }
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        filters.propertyType === type
                          ? "bg-emerald-600 text-white"
                          : "bg-white text-gray-700 hover:bg-emerald-50 border border-gray-300"
                      }`}
                    >
                      {type.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              <PropertyGrid properties={properties} />

              {/* Web3 Features Info */}
              <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Web3 Property Features
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-emerald-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Blockchain Verification
                        </h4>
                        <p className="text-sm text-gray-600">
                          All properties are verified on blockchain with
                          immutable records.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Bitcoin className="w-5 h-5 text-emerald-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          NFT Ownership
                        </h4>
                        <p className="text-sm text-gray-600">
                          Properties represented as unique NFTs with clear
                          ownership.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="w-5 h-5 text-emerald-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Fractional Ownership
                        </h4>
                        <p className="text-sm text-gray-600">
                          Own shares of premium properties through tokenization.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Wallet className="w-5 h-5 text-emerald-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Smart Contract Transactions
                        </h4>
                        <p className="text-sm text-gray-600">
                          Automated, secure, and transparent property
                          transactions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => setFilters({ ...filters, page })}
                      className={`px-4 py-2 rounded-lg ${
                        page === pagination.page
                          ? "bg-emerald-600 text-white"
                          : "bg-white text-gray-700 hover:bg-emerald-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Theme Switcher */}
      <ThemeSwitcher />
    </div>
  );
}
