"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  Activity,
  Clock,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Shield,
  Zap,
  Globe,
} from "lucide-react";
import WalletConnect from "./WalletConnect";
import NFTMarketplace from "./NFTMarketplace";

interface CryptoAsset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  balance?: number;
  value?: number;
}

interface NFTCollection {
  id: string;
  name: string;
  floorPrice: number;
  volume24h: number;
  items: number;
  owners: number;
  image?: string;
}

interface DeFiProtocol {
  name: string;
  tvl: number;
  apy: number;
  category: string;
  risk: "low" | "medium" | "high";
}

interface Transaction {
  hash: string;
  type: "send" | "receive" | "swap" | "mint";
  amount: number;
  token: string;
  timestamp: string;
  status: "pending" | "completed" | "failed";
  from: string;
  to: string;
}

const mockCryptoAssets: CryptoAsset[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 43250.0,
    change24h: 2.5,
    change7d: -1.2,
    marketCap: 845000000000,
    volume24h: 23400000000,
    balance: 0.05,
    value: 2162.5,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 2280.5,
    change24h: -1.8,
    change7d: 3.4,
    marketCap: 274000000000,
    volume24h: 12300000000,
    balance: 2.3,
    value: 5245.15,
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: 98.75,
    change24h: 5.2,
    change7d: 8.9,
    marketCap: 42000000000,
    volume24h: 2100000000,
    balance: 25,
    value: 2468.75,
  },
];

const mockNFTCollections: NFTCollection[] = [
  {
    id: "1",
    name: "Digital Real Estate",
    floorPrice: 0.5,
    volume24h: 12.3,
    items: 10000,
    owners: 2341,
  },
  {
    id: "2",
    name: "Virtual Properties",
    floorPrice: 0.25,
    volume24h: 5.6,
    items: 5000,
    owners: 1234,
  },
];

const mockDeFiProtocols: DeFiProtocol[] = [
  {
    name: "Aave",
    tvl: 5600000000,
    apy: 4.2,
    category: "Lending",
    risk: "low",
  },
  {
    name: "Uniswap",
    tvl: 4300000000,
    apy: 8.7,
    category: "DEX",
    risk: "medium",
  },
];

const mockTransactions: Transaction[] = [
  {
    hash: "0x1234...5678",
    type: "receive",
    amount: 0.1,
    token: "ETH",
    timestamp: "2024-01-14T10:30:00Z",
    status: "completed",
    from: "0xabcd...efgh",
    to: "0x1234...5678",
  },
];

export default function Web3Dashboard() {
  const [activeTab, setActiveTab] = useState<
    "portfolio" | "nft" | "defi" | "transactions"
  >("portfolio");
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);
  const [showMarketplace, setShowMarketplace] = useState(false);

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: amount < 1 ? 4 : 2,
      maximumFractionDigits: amount < 1 ? 4 : 2,
    }).format(amount);
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toString();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const totalPortfolioValue = mockCryptoAssets.reduce(
    (sum, asset) => sum + (asset.value || 0),
    0,
  );

  if (showMarketplace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => setShowMarketplace(false)}
            className="mb-6 text-green-600 hover:text-green-700 font-medium"
          >
            ← Back to Dashboard
          </button>
          <NFTMarketplace />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">Web3 & Crypto Hub</h1>
              <p className="text-xl text-green-100 max-w-3xl">
                Manage your digital assets, trade NFTs, and explore DeFi
                opportunities
              </p>
            </div>
            <WalletConnect />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Portfolio Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalPortfolioValue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">24h Change</p>
                <p className="text-2xl font-bold text-green-600">+5.2%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Assets</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockCryptoAssets.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Gas Price</p>
                <p className="text-2xl font-bold text-gray-900">25 Gwei</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            {[
              { key: "portfolio", label: "Portfolio", icon: Wallet },
              { key: "nft", label: "NFT Marketplace", icon: Globe },
              { key: "defi", label: "DeFi", icon: Activity },
              { key: "transactions", label: "Transactions", icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                    activeTab === tab.key
                      ? "text-green-600 border-b-2 border-green-600 bg-green-50"
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

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === "portfolio" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                      Your Assets
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {mockCryptoAssets.map((asset) => (
                      <div
                        key={asset.symbol}
                        className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => setSelectedAsset(asset)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                              {asset.symbol.slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {asset.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {asset.symbol}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-semibold text-gray-900">
                              {formatCurrency(asset.price)}
                            </div>
                            <div
                              className={`text-sm flex items-center justify-end ${
                                asset.change24h >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {asset.change24h >= 0 ? (
                                <ArrowUpRight className="w-3 h-3 mr-1" />
                              ) : (
                                <ArrowDownRight className="w-3 h-3 mr-1" />
                              )}
                              {Math.abs(asset.change24h)}%
                            </div>
                          </div>

                          {asset.balance && (
                            <div className="text-right">
                              <div className="text-sm text-gray-500">
                                {asset.balance} {asset.symbol}
                              </div>
                              <div className="font-semibold text-gray-900">
                                {formatCurrency(asset.value || 0)}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "nft" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">
                      Featured Collections
                    </h2>
                    <button
                      onClick={() => setShowMarketplace(true)}
                      className="text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockNFTCollections.map((collection) => (
                      <div
                        key={collection.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg"></div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {collection.name}
                            </h3>
                            <div className="text-sm text-gray-500">
                              Floor:{" "}
                              {formatCurrency(collection.floorPrice, "ETH")} ETH
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between text-sm text-gray-600">
                          <span>{collection.items} items</span>
                          <span>{collection.owners} owners</span>
                          <span>
                            {formatCurrency(collection.volume24h, "ETH")} ETH
                            vol
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "defi" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                      DeFi Protocols
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {mockDeFiProtocols.map((protocol) => (
                      <div key={protocol.name} className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {protocol.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {protocol.category}
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  protocol.risk === "low"
                                    ? "bg-green-100 text-green-800"
                                    : protocol.risk === "medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {protocol.risk.toUpperCase()} RISK
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">
                              {formatLargeNumber(protocol.tvl)}
                            </div>
                            <div className="text-sm text-green-600">
                              APY: {protocol.apy}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "transactions" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                      Recent Transactions
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {mockTransactions.map((tx) => (
                      <div key={tx.hash} className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                tx.type === "send"
                                  ? "bg-red-100"
                                  : tx.type === "receive"
                                    ? "bg-green-100"
                                    : tx.type === "swap"
                                      ? "bg-blue-100"
                                      : "bg-purple-100"
                              }`}
                            >
                              {tx.type === "send" && (
                                <ArrowUpRight className="w-5 h-5 text-red-600" />
                              )}
                              {tx.type === "receive" && (
                                <ArrowDownRight className="w-5 h-5 text-green-600" />
                              )}
                              {tx.type === "swap" && (
                                <Activity className="w-5 h-5 text-blue-600" />
                              )}
                              {tx.type === "mint" && (
                                <Zap className="w-5 h-5 text-purple-600" />
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 capitalize">
                                {tx.type}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatAddress(tx.hash)}
                              </div>
                              <div className="text-xs text-gray-400">
                                {formatDate(tx.timestamp)}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-semibold text-gray-900">
                              {tx.amount} {tx.token}
                            </div>
                            <div className="flex items-center space-x-1">
                              {tx.status === "completed" && (
                                <>
                                  <CheckCircle className="w-3 h-3 text-green-600" />
                                  <span className="text-xs text-green-600">
                                    Completed
                                  </span>
                                </>
                              )}
                              {tx.status === "pending" && (
                                <>
                                  <Clock className="w-3 h-3 text-yellow-600" />
                                  <span className="text-xs text-yellow-600">
                                    Pending
                                  </span>
                                </>
                              )}
                              {tx.status === "failed" && (
                                <>
                                  <AlertCircle className="w-3 h-3 text-red-600" />
                                  <span className="text-xs text-red-600">
                                    Failed
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all">
                  Buy Crypto
                </button>
                <button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 rounded-lg font-medium hover:from-emerald-700 hover:to-emerald-800 transition-all">
                  Send Crypto
                </button>
                <button
                  onClick={() => setShowMarketplace(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all"
                >
                  Browse NFTs
                </button>
              </div>
            </div>

            {/* Market Overview */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Market Overview
              </h3>
              <div className="space-y-3">
                {mockCryptoAssets.slice(0, 3).map((asset) => (
                  <div
                    key={asset.symbol}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {asset.symbol}
                      </span>
                    </div>
                    <div
                      className={`text-sm flex items-center ${
                        asset.change24h >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {asset.change24h >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(asset.change24h)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Alert */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-yellow-900 mb-1">
                    Security Reminder
                  </h3>
                  <p className="text-sm text-yellow-700">
                    Never share your private keys or seed phrase. Always verify
                    transaction details before confirming.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
