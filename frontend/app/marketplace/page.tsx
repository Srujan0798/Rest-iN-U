'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, Button } from '@/components/ui';
import { useAccount } from 'wagmi';
import { WalletConnectButton } from '@/components/WalletConnectButton';

interface NFTListing {
  id: string;
  title: string;
  price: number;
  address: string;
  image: string;
  tokenId: string;
  contractAddress: string;
  ethPrice: string;
  maticPrice: string;
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<NFTListing[]>([]);
  const [loading, setLoading] = useState(true);
  const { isConnected } = useAccount();

  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await fetch('/api/v1/nft/listings');
        const data = await response.json();
        if (data.success) {
          setListings(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tokenized Properties Marketplace</h1>
        <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-500 hidden md:block">
                Connect wallet to purchase
            </span>
            <WalletConnectButton />
        </div>
      </div>

      {!isConnected && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 mb-8">
            Please connect your wallet to interact with the marketplace.
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700">No tokenized properties found</h3>
            <p className="text-gray-500 mt-2">Check back later for new listings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gray-200">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    Token ID: {listing.tokenId}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{listing.address}</p>

                <div className="grid grid-cols-2 gap-4 mb-4 bg-gray-50 p-3 rounded-md">
                    <div>
                        <p className="text-xs text-gray-500">Price (USD)</p>
                        <p className="font-bold">${listing.price.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Price (ETH)</p>
                        <p className="font-bold text-purple-600">Ξ {listing.ethPrice}</p>
                    </div>
                    <div className="col-span-2 border-t pt-2 mt-1">
                         <p className="text-xs text-gray-500">Price (MATIC)</p>
                        <p className="font-bold text-blue-600">⟠ {listing.maticPrice}</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Link href={`/property/${listing.id}`} className="w-full">
                        <Button className="w-full" variant="outline">
                            View Details
                        </Button>
                    </Link>
                    {isConnected && (
                        <Button className="w-full">
                            Buy Now
                        </Button>
                    )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
