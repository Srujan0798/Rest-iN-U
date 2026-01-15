"use client";

import { useState } from "react";
import {
  Grid3X3,
  Search,
  Filter,
  Heart,
  ExternalLink,
  Clock,
  TrendingUp,
  Star,
  DollarSign,
  Eye,
  ShoppingCart,
  Image as ImageIcon,
} from "lucide-react";

interface NFT {
  id: string;
  name: string;
  collection: string;
  creator: string;
  owner: string;
  price: number;
  currency: string;
  image: string;
  description: string;
  attributes: { trait_type: string; value: string }[];
  rarity: "common" | "rare" | "epic" | "legendary";
  views: number;
  likes: number;
  mintDate: string;
  verified: boolean;
}

interface Collection {
  id: string;
  name: string;
  creator: string;
  floorPrice: number;
  volume24h: number;
  totalVolume: number;
  items: number;
  owners: number;
  description: string;
  bannerImage?: string;
  verified: boolean;
}

const mockNFTs: NFT[] = [
  {
    id: "1",
    name: "Digital Villa #0142",
    collection: "Virtual Real Estate",
    creator: "0xcreator1",
    owner: "0xowner1",
    price: 2.5,
    currency: "ETH",
    image: "",
    description:
      "A stunning digital villa with ocean views and modern architecture",
    attributes: [
      { trait_type: "Type", value: "Villa" },
      { trait_type: "Location", value: "Beachfront" },
      { trait_type: "Size", value: "2000 sqft" },
    ],
    rarity: "rare",
    views: 1234,
    likes: 89,
    mintDate: "2024-01-10T00:00:00Z",
    verified: true,
  },
  {
    id: "2",
    name: "Crypto Apartment #0089",
    collection: "Urban Properties",
    creator: "0xcreator2",
    owner: "0xowner2",
    price: 0.8,
    currency: "ETH",
    image: "",
    description: "Modern city apartment with city skyline views",
    attributes: [
      { trait_type: "Type", value: "Apartment" },
      { trait_type: "Floor", value: "15" },
      { trait_type: "Bedrooms", value: "2" },
    ],
    rarity: "common",
    views: 567,
    likes: 34,
    mintDate: "2024-01-12T00:00:00Z",
    verified: false,
  },
];

const mockCollections: Collection[] = [
  {
    id: "1",
    name: "Virtual Real Estate",
    creator: "0xcreator1",
    floorPrice: 0.5,
    volume24h: 12.3,
    totalVolume: 2340.5,
    items: 10000,
    owners: 2341,
    description: "Premium digital properties in the metaverse",
    verified: true,
  },
  {
    id: "2",
    name: "Urban Properties",
    creator: "0xcreator2",
    floorPrice: 0.25,
    volume24h: 5.6,
    totalVolume: 890.2,
    items: 5000,
    owners: 1234,
    description: "Modern apartments and condos in virtual cities",
    verified: false,
  },
];

export default function NFTMarketplace() {
  const [activeTab, setActiveTab] = useState<
    "explore" | "collections" | "create"
  >("explore");
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("price_low");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "bg-gradient-to-r from-yellow-400 to-orange-400";
      case "epic":
        return "bg-gradient-to-r from-purple-400 to-pink-400";
      case "rare":
        return "bg-gradient-to-r from-blue-400 to-cyan-400";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500";
    }
  };

  const formatPrice = (price: number, currency: string = "ETH") => {
    return `${price.toFixed(3)} ${currency}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredNFTs = mockNFTs.filter((nft) => {
    const matchesSearch =
      nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.collection.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCollection =
      selectedCollection === "all" || nft.collection === selectedCollection;
    const matchesPrice =
      (!priceRange.min || nft.price >= parseFloat(priceRange.min)) &&
      (!priceRange.max || nft.price <= parseFloat(priceRange.max));
    return matchesSearch && matchesCollection && matchesPrice;
  });

  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    switch (sortBy) {
      case "price_low":
        return a.price - b.price;
      case "price_high":
        return b.price - a.price;
      case "recent":
        return new Date(b.mintDate).getTime() - new Date(a.mintDate).getTime();
      case "popular":
        return b.views - a.views;
      default:
        return 0;
    }
  });

  if (selectedNFT) {
    return (
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => setSelectedNFT(null)}
          className="mb-6 text-purple-600 hover:text-purple-700 font-medium"
        >
          ← Back to Marketplace
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* NFT Image */}
            <div>
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                {selectedNFT.image ? (
                  <img
                    src={selectedNFT.image}
                    alt={selectedNFT.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <ImageIcon className="w-24 h-24 text-purple-300" />
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-purple-600">
                    <Heart className="w-5 h-5" />
                    <span>{selectedNFT.likes}</span>
                  </button>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Eye className="w-5 h-5" />
                    <span>{selectedNFT.views}</span>
                  </div>
                </div>

                <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-700">
                  <ExternalLink className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* NFT Details */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {selectedNFT.name}
                    </h1>
                    {selectedNFT.verified && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 mb-4">
                    {selectedNFT.description}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span>Collection: {selectedNFT.collection}</span>
                    <span>•</span>
                    <span>Minted {formatDate(selectedNFT.mintDate)}</span>
                  </div>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getRarityColor(selectedNFT.rarity)}`}
                >
                  {selectedNFT.rarity.toUpperCase()}
                </div>
              </div>

              {/* Current Price */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Current Price</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      selectedNFT.price > 2
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {selectedNFT.price > 2 ? "Premium" : "Standard"}
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {formatPrice(selectedNFT.price, selectedNFT.currency)}
                </div>
                <div className="text-sm text-gray-500">
                  ≈ {formatCurrency(selectedNFT.price * 2280)} USD
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Buy Now</span>
                </button>

                <button className="w-full border border-purple-600 text-purple-600 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                  Make Offer
                </button>
              </div>

              {/* Attributes */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Properties
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedNFT.attributes.map((attr, index) => (
                    <div
                      key={index}
                      className="bg-purple-50 border border-purple-200 rounded-lg p-3"
                    >
                      <div className="text-xs text-purple-600 font-medium">
                        {attr.trait_type}
                      </div>
                      <div className="text-sm text-gray-900 font-semibold">
                        {attr.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Details</h3>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Creator</span>
                  <span className="text-sm font-mono text-gray-900">
                    {selectedNFT.creator.slice(0, 6)}...
                    {selectedNFT.creator.slice(-4)}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Owner</span>
                  <span className="text-sm font-mono text-gray-900">
                    {selectedNFT.owner.slice(0, 6)}...
                    {selectedNFT.owner.slice(-4)}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Token ID</span>
                  <span className="text-sm font-mono text-gray-900">
                    #{selectedNFT.id}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Token Standard</span>
                  <span className="text-sm text-gray-900">ERC-721</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          NFT Marketplace
        </h1>
        <p className="text-gray-600">
          Discover, collect, and trade unique digital assets
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="flex border-b border-gray-200">
          {[
            { key: "explore", label: "Explore", icon: Grid3X3 },
            { key: "collections", label: "Collections", icon: Grid3X3 },
            { key: "create", label: "Create", icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                  activeTab === tab.key
                    ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Filters */}
      {activeTab !== "create" && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search NFTs, collections, or creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Collections</option>
                {mockCollections.map((collection) => (
                  <option key={collection.id} value={collection.name}>
                    {collection.name}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="recent">Recently Listed</option>
                <option value="popular">Most Viewed</option>
              </select>

              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 ${viewMode === "grid" ? "bg-purple-100 text-purple-600" : "text-gray-600"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 ${viewMode === "list" ? "bg-purple-100 text-purple-600" : "text-gray-600"}`}
                >
                  <div className="w-4 h-4 border-2 border-current"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === "explore" && (
        <div>
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {sortedNFTs.map((nft) => (
              <div
                key={nft.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
                  viewMode === "list" ? "flex" : ""
                }`}
                onClick={() => setSelectedNFT(nft)}
              >
                <div
                  className={
                    viewMode === "list"
                      ? "w-48 h-48 flex-shrink-0"
                      : "aspect-square"
                  }
                >
                  <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    {nft.image ? (
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-purple-300" />
                    )}
                  </div>
                </div>

                <div className="p-4 flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {nft.name}
                      </h3>
                      <p className="text-sm text-gray-600">{nft.collection}</p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full ${getRarityColor(nft.rarity)}`}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <div className="text-xs text-gray-500">Price</div>
                      <div className="font-semibold text-gray-900">
                        {formatPrice(nft.price, nft.currency)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        <span>{nft.views}</span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        <span>{nft.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {sortedNFTs.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No NFTs found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "collections" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCollections.map((collection) => (
            <div
              key={collection.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="h-32 bg-gradient-to-br from-purple-400 to-pink-400"></div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">
                      {collection.name}
                    </h3>
                    {collection.verified && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {collection.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Floor Price</div>
                    <div className="font-semibold text-gray-900">
                      {formatPrice(collection.floorPrice)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">24h Volume</div>
                    <div className="font-semibold text-gray-900">
                      {formatPrice(collection.volume24h)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Items</div>
                    <div className="font-semibold text-gray-900">
                      {collection.items.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Owners</div>
                    <div className="font-semibold text-gray-900">
                      {collection.owners.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "create" && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Create New NFT
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Item name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Provide a detailed description of your item"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.001"
                    className="w-full pl-16 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">ETH</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all">
                Create NFT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
