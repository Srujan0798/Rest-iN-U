"use client";

import { useState } from "react";
import {
  Wallet,
  Connect,
  Copy,
  ExternalLink,
  ChevronDown,
  Check,
  AlertCircle,
} from "lucide-react";

interface WalletInfo {
  address: string;
  balance: string;
  network: string;
  chainId: number;
  connected: boolean;
}

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
  showBalance?: boolean;
  compact?: boolean;
}

export default function WalletConnect({
  onConnect,
  onDisconnect,
  showBalance = true,
  compact = false,
}: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("0.00");
  const [network, setNetwork] = useState("Ethereum");
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mock wallet connection - in real app this would use wagmi/rainbowkit
  const mockWallets = [
    { name: "MetaMask", icon: "🦊" },
    { name: "WalletConnect", icon: "🔗" },
    { name: "Coinbase Wallet", icon: "🔵" },
  ];

  const handleConnect = async (walletName: string) => {
    // Mock connection logic
    const mockAddress = "0x1234567890abcdef1234567890abcdef12345678";
    const mockBalance = "2.345";

    setWalletAddress(mockAddress);
    setBalance(mockBalance);
    setIsConnected(true);
    setShowDropdown(false);
    onConnect?.(mockAddress);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress("");
    setBalance("0.00");
    setShowDropdown(false);
    onDisconnect?.();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: string) => {
    return parseFloat(balance).toFixed(4);
  };

  const copyAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy address:", err);
      }
    }
  };

  const switchNetwork = () => {
    const networks = ["Ethereum", "Polygon", "BSC", "Arbitrum"];
    const currentIndex = networks.indexOf(network);
    const nextIndex = (currentIndex + 1) % networks.length;
    setNetwork(networks[nextIndex]);
  };

  if (compact && isConnected) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
        >
          <Wallet className="w-4 h-4" />
          <span className="font-medium">{formatAddress(walletAddress)}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`}
          />
        </button>

        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-2 mb-2">
                  <Wallet className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-gray-900">Wallet</span>
                </div>
                <p className="text-sm text-gray-600">{walletAddress}</p>
              </div>

              <div className="p-4 space-y-3">
                <button
                  onClick={copyAddress}
                  className="w-full flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>{copied ? "Copied!" : "Copy Address"}</span>
                </button>

                <button className="w-full flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900">
                  <ExternalLink className="w-4 h-4" />
                  <span>View on Explorer</span>
                </button>

                <button
                  onClick={handleDisconnect}
                  className="w-full flex items-center space-x-2 text-sm text-red-600 hover:text-red-700"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Connected</div>
              <div className="text-sm text-gray-500">{network}</div>
            </div>
          </div>

          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform ${showDropdown ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {showBalance && (
          <div className="mb-4">
            <div className="text-2xl font-bold text-gray-900">
              {formatBalance(balance)} ETH
            </div>
            <div className="text-sm text-gray-500">
              ≈ ${formatBalance((parseFloat(balance) * 2280).toString())} USD
            </div>
          </div>
        )}

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600 font-mono">
            {formatAddress(walletAddress)}
          </span>
          <button
            onClick={copyAddress}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        {showDropdown && (
          <div className="mt-4 space-y-2">
            <button
              onClick={switchNetwork}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span>Switch Network</span>
              <span className="text-sm font-medium">({network})</span>
            </button>

            <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <ExternalLink className="w-4 h-4" />
              <span>View on Explorer</span>
            </button>

            <button
              onClick={handleDisconnect}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Disconnect</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wallet className="w-8 h-8 text-gray-500" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Connect Wallet
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Connect your wallet to access Web3 features, manage assets, and
          interact with DeFi protocols
        </p>

        <div className="space-y-3">
          {mockWallets.map((wallet) => (
            <button
              key={wallet.name}
              onClick={() => handleConnect(wallet.name)}
              className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
            >
              <div className="text-2xl">{wallet.icon}</div>
              <span className="font-medium text-gray-900">{wallet.name}</span>
              <Connect className="w-4 h-4 text-gray-400 ml-auto" />
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-left">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                New to Web3?
              </h4>
              <p className="text-sm text-blue-700">
                Wallets are used to send, receive, and store digital assets. Get
                started by installing a wallet extension.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
