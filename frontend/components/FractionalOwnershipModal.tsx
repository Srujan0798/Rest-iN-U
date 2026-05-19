import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FractionalOwnershipModalProps {
  propertyId: string;
  tokenPrice: number;
  availableShares: number;
  yieldRate: number; // e.g., 5.2%
  onBuy: (shares: number) => Promise<void>;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function FractionalOwnershipModal({
  propertyId,
  tokenPrice,
  availableShares,
  yieldRate,
  onBuy,
  isOpen,
  onOpenChange
}: FractionalOwnershipModalProps) {
  const [shares, setShares] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const totalCost = shares * tokenPrice;
  const estimatedYield = (totalCost * yieldRate) / 100;

  const handleBuy = async () => {
    setLoading(true);
    try {
      await onBuy(shares);
      onOpenChange?.(false);
    } catch (error) {
      console.error('Purchase failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invest in Fractional Ownership</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold">Investment Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Price per Share:</div>
                <div className="font-mono">${tokenPrice.toLocaleString()}</div>
                <div>Available Shares:</div>
                <div className="font-mono">{availableShares.toLocaleString()}</div>
                <div>Est. Annual Yield:</div>
                <div className="font-mono text-green-600">{yieldRate}%</div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="shares">Number of Shares</Label>
            <Input
              id="shares"
              type="number"
              min="1"
              max={availableShares}
              value={shares}
              onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 0))}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
             <div className="flex justify-between text-sm">
                 <span>Total Investment:</span>
                 <span className="font-bold">${totalCost.toLocaleString()}</span>
             </div>
             <div className="flex justify-between text-sm text-green-600">
                 <span>Est. Annual Return:</span>
                 <span>+${estimatedYield.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
             </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleBuy} disabled={loading || shares > availableShares}>
            {loading ? 'Processing...' : 'Confirm Investment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
