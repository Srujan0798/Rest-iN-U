'use client';

import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const WalletConnectButton = () => {
  return (
    <ConnectButton
      label="Connect Wallet"
      accountStatus="address"
      chainStatus="icon"
      showBalance={false}
    />
  );
};
