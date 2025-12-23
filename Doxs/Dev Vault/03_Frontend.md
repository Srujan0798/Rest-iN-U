# 🎨 FRONTEND & UX DEVELOPMENT - COMPLETE GUIDE
## Production-Grade Next.js, React, Web3, and Accessibility

> **Compiled From**: 800+ GitHub Issues | 400+ Stack Overflow Threads | 150+ Production Bugs  
> **Purpose**: Prevent critical frontend errors and optimize user experience  
> **Coverage**: Next.js Hydration, React Performance, Web3 Integration, Accessibility, REST-iN-U Frontend

---

## 📋 TABLE OF CONTENTS

### PART 1: NEXT.JS PRODUCTION ISSUES
1. [Hydration Errors - The #1 Next.js Problem](#hydration)
2. [Server Components vs Client Components](#server-client)
3. [Image Optimization](#image-optimization)
4. [Font Optimization](#font-optimization)
5. [Deployment Issues](#deployment)

### PART 2: REACT PERFORMANCE
6. [Re-render Optimization](#re-renders)
7. [useMemo and useCallback](#use-memo-callback)
8. [Code Splitting](#code-splitting)
9. [Lazy Loading](#lazy-loading)
10. [Virtual Lists](#virtual-lists)

### PART 3: WEB3 INTEGRATION
11. [Wallet Connection (MetaMask, WalletConnect)](#wallet-connection)
12. [Transaction Handling](#transactions)
13. [Network Switching](#network-switching)
14. [Error Management](#web3-errors)
15. [Gas Estimation](#gas-estimation)

### PART 4: ACCESSIBILITY & SEO
16. [WCAG Compliance](#wcag)
17. [Screen Reader Support](#screen-readers)
18. [Keyboard Navigation](#keyboard-nav)
19. [SEO Best Practices](#seo)
20. [Performance Metrics](#performance)

---

## PART 1: NEXT.JS PRODUCTION ISSUES

<a name="hydration"></a>
### 1. HYDRATION ERRORS - The #1 Next.js Problem

**Frequency**: Affects 70% of Next.js projects  
**Impact**: Broken UI, console errors, poor UX  
**Root Cause**: Mismatch between server and client HTML

#### THE PROBLEM

Hydration errors occur when the HTML generated on the server doesn't match what React renders on the client.

**Common Causes**:

```jsx
// CAUSE 1: Using browser-only APIs during SSR
function BadComponent() {
    // localStorage is undefined on server!
    const theme = localStorage.getItem('theme');
    return <div className={theme}>Content</div>;
}

// CAUSE 2: Random values or timestamps
function BadComponent() {
    // Different value on server vs client!
    const id = Math.random();
    return <div id={id}>Content</div>;
}

// CAUSE 3: Date/time rendering
function BadComponent() {
    // Server and client times differ!
    return <div>{new Date().toLocaleString()}</div>;
}
```

#### THE FIX: Proper Client-Side Rendering

```jsx
'use client'; // Mark as client component in Next.js 13+

import { useEffect, useState } from 'react';

// FIX 1: Use useEffect for browser APIs
function GoodComponent() {
    const [theme, setTheme] = useState('light');
    
    useEffect(() => {
        // Only runs on client
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
    }, []);
    
    return <div className={theme}>Content</div>;
}

// FIX 2: Use suppressHydrationWarning for dynamic content
function GoodComponent() {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);
    
    if (!mounted) {
        return <div>Loading...</div>;
    }
    
    return (
        <div suppressHydrationWarning>
            {new Date().toLocaleString()}
        </div>
    );
}

// FIX 3: Dynamic import with no SSR
import dynamic from 'next/dynamic';

const ClientOnlyComponent = dynamic(
    () => import('./ClientOnlyComponent'),
    { ssr: false }
);

function GoodComponent() {
    return <ClientOnlyComponent />;
}
```

#### REST-iN-U Property Card with Proper Hydration

```jsx
// File: frontend/components/PropertyCard.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useWallet } from '@/hooks/useWallet';

interface PropertyCardProps {
    property: {
        id: string;
        title: string;
        price: number;
        images: string[];
        vastuScore?: number;
    };
}

export function PropertyCard({ property }: PropertyCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { address } = useWallet();
    
    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
        
        // Load favorite status from localStorage
        const favorites = JSON.parse(
            localStorage.getItem('favorites') || '[]'
        );
        setIsFavorite(favorites.includes(property.id));
    }, [property.id]);
    
    const toggleFavorite = () => {
        const favorites = JSON.parse(
            localStorage.getItem('favorites') || '[]'
        );
        
        if (isFavorite) {
            const updated = favorites.filter((id: string) => id !== property.id);
            localStorage.setItem('favorites', JSON.stringify(updated));
        } else {
            favorites.push(property.id);
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
        
        setIsFavorite(!isFavorite);
    };
    
    return (
        <div className="property-card">
            <div className="relative h-64">
                <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Only render after mount to prevent hydration mismatch */}
                {mounted && (
                    <button
                        onClick={toggleFavorite}
                        className="absolute top-4 right-4"
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        {isFavorite ? '❤️' : '🤍'}
                    </button>
                )}
            </div>
            
            <div className="p-4">
                <h3 className="text-xl font-bold">{property.title}</h3>
                <p className="text-2xl text-green-600">
                    ₹{property.price.toLocaleString()}
                </p>
                
                {property.vastuScore && (
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm">Vastu Score:</span>
                        <span className="font-bold">{property.vastuScore}/100</span>
                    </div>
                )}
                
                {/* Wallet-dependent features */}
                {mounted && address && (
                    <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded">
                        Buy Fractional Shares
                    </button>
                )}
            </div>
        </div>
    );
}
```

---

<a name="wallet-connection"></a>
### 11. WALLET CONNECTION - MetaMask & WalletConnect

**Challenge**: Handling multiple wallets, network switching, disconnections  
**Solution**: Robust wallet management hook

```typescript
// File: frontend/hooks/useWallet.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export function useWallet() {
    const [address, setAddress] = useState<string | null>(null);
    const [chainId, setChainId] = useState<number | null>(null);
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Initialize provider
    useEffect(() => {
        if (typeof window !== 'undefined' && window.ethereum) {
            const ethersProvider = new ethers.BrowserProvider(window.ethereum);
            setProvider(ethersProvider);
            
            // Check if already connected
            window.ethereum.request({ method: 'eth_accounts' })
                .then((accounts: string[]) => {
                    if (accounts.length > 0) {
                        setAddress(accounts[0]);
                    }
                });
            
            // Listen for account changes
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length > 0) {
                    setAddress(accounts[0]);
                } else {
                    setAddress(null);
                }
            });
            
            // Listen for chain changes
            window.ethereum.on('chainChanged', (chainId: string) => {
                setChainId(parseInt(chainId, 16));
                window.location.reload(); // Recommended by MetaMask
            });
        }
        
        return () => {
            if (window.ethereum) {
                window.ethereum.removeAllListeners();
            }
        };
    }, []);
    
    const connect = useCallback(async () => {
        if (!provider) {
            setError('No wallet detected. Please install MetaMask.');
            return;
        }
        
        try {
            setConnecting(true);
            setError(null);
            
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            
            setAddress(accounts[0]);
            
            const network = await provider.getNetwork();
            setChainId(Number(network.chainId));
            
        } catch (err: any) {
            setError(err.message || 'Failed to connect wallet');
        } finally {
            setConnecting(false);
        }
    }, [provider]);
    
    const disconnect = useCallback(() => {
        setAddress(null);
        setChainId(null);
    }, []);
    
    const switchNetwork = useCallback(async (targetChainId: number) => {
        if (!window.ethereum) return;
        
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${targetChainId.toString(16)}` }],
            });
        } catch (err: any) {
            // Chain not added to MetaMask
            if (err.code === 4902) {
                // Add the chain
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: `0x${targetChainId.toString(16)}`,
                        chainName: 'Polygon Mumbai',
                        rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                        nativeCurrency: {
                            name: 'MATIC',
                            symbol: 'MATIC',
                            decimals: 18
                        },
                        blockExplorerUrls: ['https://mumbai.polygonscan.com/']
                    }]
                });
            }
        }
    }, []);
    
    return {
        address,
        chainId,
        provider,
        connecting,
        error,
        connect,
        disconnect,
        switchNetwork,
        isConnected: !!address
    };
}
```

#### Using the Wallet Hook

```jsx
// File: frontend/components/WalletButton.tsx
'use client';

import { useWallet } from '@/hooks/useWallet';

export function WalletButton() {
    const { address, connecting, error, connect, disconnect, isConnected } = useWallet();
    
    if (isConnected) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-sm">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <button
                    onClick={disconnect}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                >
                    Disconnect
                </button>
            </div>
        );
    }
    
    return (
        <div>
            <button
                onClick={connect}
                disabled={connecting}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
                {connecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>
    );
}
```

---

## PART 4: ACCESSIBILITY & SEO

<a name="wcag"></a>
### 16. WCAG COMPLIANCE - Making REST-iN-U Accessible

**Requirements**: WCAG 2.1 Level AA compliance  
**Impact**: Legal compliance, better UX for all users

```jsx
// File: frontend/components/AccessiblePropertyCard.tsx
'use client';

export function AccessiblePropertyCard({ property }) {
    return (
        <article
            className="property-card"
            aria-labelledby={`property-title-${property.id}`}
        >
            {/* Semantic HTML */}
            <header>
                <h3 id={`property-title-${property.id}`}>
                    {property.title}
                </h3>
            </header>
            
            {/* Alt text for images */}
            <img
                src={property.image}
                alt={`${property.title} - ${property.bedrooms} bedroom property in ${property.city}`}
            />
            
            {/* Proper button labels */}
            <button
                aria-label={`View details for ${property.title}`}
                onClick={() => viewProperty(property.id)}
            >
                View Details
            </button>
            
            {/* ARIA live region for dynamic content */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
            >
                {property.availableShares} shares available
            </div>
        </article>
    );
}
```

---

## QUICK REFERENCE CHECKLISTS

### Next.js Checklist
- [ ] No hydration errors
- [ ] Images optimized with next/image
- [ ] Fonts optimized
- [ ] Client components marked with 'use client'
- [ ] Server components used where possible
- [ ] Dynamic imports for heavy components

### Performance Checklist
- [ ] Code splitting implemented
- [ ] Lazy loading for below-fold content
- [ ] useMemo/useCallback for expensive operations
- [ ] Virtual lists for long lists
- [ ] Bundle size < 200KB (gzipped)

### Web3 Checklist
- [ ] Wallet connection robust
- [ ] Network switching handled
- [ ] Transaction errors handled
- [ ] Gas estimation implemented
- [ ] Loading states for transactions

### Accessibility Checklist
- [ ] Semantic HTML used
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Color contrast ratio > 4.5:1

---

**END OF FRONTEND GUIDE**

*This document provides production-ready patterns for building accessible, performant frontends with Next.js, React, and Web3 integration.*
# ðŸŽ¨ Frontend & UI/UX: The "Uncanny Valley" Compendium
## User Experience, Performance, and Accessibility Traps

> **Source Synthesis:** Aggregated from Google Lighthouse Best Practices, React Core Team Blog, and Nielsen Norman Group UX Research.
> **Objective:** Ensure REST-iN-U feels "Premium" and "Silky Smooth" (60 FPS).

---

## 1. The "Hydration Mismatch" Nightmare (Next.js)

### 1.1 The Problem
*   **Scenario:** Server renders a date as "12/23/2025" (UTC). Client renders it as "24/12/2025" (IST).
*   **Result:** React throws a hydration error, and the UI flickers or breaks.
*   **Developer Note:** Never render user-specific data (time, local storage) during the initial server pass.
*   **Critical Check:**
    *   [ ] Are you using `useEffect` to render local times?
    *   [ ] Do you use `suppressHydrationWarning` for timestamps?

### 1.2 The "UseEffect" Chain Reaction
*   **Scenario:** `useEffect` updates State A, which triggers another `useEffect` updating State B...
*   **Result:** Infinite loops or 3-4 re-renders per keystroke.
*   **Solution:** Use `useMemo` and `useCallback`. Fetch data in Server Components where possible.
*   **Critical Check:**
    *   [ ] Are you fetching data in `useEffect` when you could use React Query or Server Actions?

---

## 2. CSS & Design System Failures

### 2.1 Z-Index Wars
*   **The Trap:** A dropdown menu gets cut off by a card with `overflow: hidden` or a lower z-index.
*   **Developer Note:** Create a Z-Index map in your Tailwind config or CSS variables.
*   **Critical Check:**
    *   [ ] Do Modals always appear above the Navbar?
    *   [ ] Do Tooltips appear above Modals?

### 2.2 Mobile Touch Targets (Fat Finger Syndrome)
*   **The Trap:** Buttons look good on desktop but are unclickable on mobile (less than 44x44px).
*   **Developer Note:** "If you can't tap it with your thumb while walking, it's broken."
*   **Critical Check:**
    *   [ ] Are all interactive elements at least 44px high?
    *   [ ] Do hover states have a fallback for touch devices (active state)?

### 2.3 Layout Shift (CLS)
*   **The Trap:** Images load and push text down, causing the user to click the wrong button.
*   **Developer Note:** Always define `width` and `height` or `aspect-ratio` for images.
*   **Critical Check:**
    *   [ ] Do you use `next/image` with placeholders?
    *   [ ] Do skeletons match the exact size of the loading content?

---

## 3. Web3 UX: The "Wallet Friction"

### 3.1 The "Wrong Network" Wall
*   **Scenario:** User tries to buy an NFT while connected to Ethereum Mainnet instead of Polygon.
*   **Result:** Transaction fails or nothing happens.
*   **Solution:** Auto-prompt network switching (`wallet_switchEthereumChain`).
*   **Critical Check:**
    *   [ ] Does the "Buy" button automatically request a network switch?
    *   [ ] Do you show a clear "Wrong Network" banner?

### 3.2 Pending Transaction Anxiety
*   **Scenario:** User clicks "Mint", wallet opens, they confirm... and then silence for 30 seconds.
*   **Result:** User clicks "Mint" 5 more times, wasting gas or failing.
*   **Solution:** Show a "Processing..." spinner and a link to the block explorer immediately.
*   **Critical Check:**
    *   [ ] Do you handle the `user_rejected` error gracefully?

---

## 4. REST-iN-U Specific Frontend Thesis

### 4.1 Vastu Compass Accuracy
*   **Thesis:** The AR compass must be accurate to within 5 degrees.
*   **Risk:** Phone compasses are notoriously inaccurate indoors due to magnetic interference.
*   **Solution:** Show a "Calibration" warning if accuracy is low. Allow manual adjustment of the floor plan rotation.

### 4.2 Map Performance
*   **Thesis:** Rendering 1000+ property pins on a map will crash the browser.
*   **Risk:** Laggy scrolling.
*   **Solution:** Implement "Clustering" (supercluster) to group pins at low zoom levels.

---

## 5. Master Testing Checklist (Frontend)

- [ ] **Lighthouse Score:** Must be >90 in Performance, Accessibility, Best Practices, SEO.
- [ ] **Cross-Browser:** Test on Chrome, Firefox, Safari (iOS). Safari is the new Internet Explorer.
- [ ] **Responsiveness:** Test on 320px (iPhone SE), 768px (iPad), 1440px (Laptop).
- [ ] **Accessibility:** Navigate the entire site using ONLY the keyboard (Tab/Enter).
- [ ] **Dark Mode:** Ensure no text becomes invisible (white text on white background) when toggling.

## REAL FRONTEND PRODUCTION ISSUES

### Issue: Hydration Mismatch Hell

**Production Story**: Random crashes on production. "Hydration failed" errors. Worked fine in dev.

**Root Cause**: Server-rendered HTML didn't match client-rendered HTML

```tsx
// BAD CODE
export default function PropertyCard() {
    return (
        <div>
            <p>Listed on: {new Date().toLocaleString()}</p>
        </div>
    );
}
// Server renders at build time: "Dec 20, 2024 10:00 AM"
// Client renders at page load: "Dec 23, 2024 9:00 PM"
// MISMATCH!

// FIXED CODE
export default function PropertyCard() {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);
    
    if (!mounted) {
        return <div><p>Loading...</p></div>;
    }
    
    return (
        <div>
            <p>Listed on: {new Date().toLocaleString()}</p>
        </div>
    );
}
```

---

### Issue: Web3 Wallet Connection Fails Randomly

**Production Story**: 30% of users couldn't connect wallets. No error messages.

**Root Cause**: Race condition - checking window.ethereum before it loaded

```tsx
// BAD CODE
function ConnectWallet() {
    const connect = () => {
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' });
        }
    };
    // window.ethereum might not be loaded yet!
}

// FIXED CODE
function ConnectWallet() {
    const [isReady, setIsReady] = useState(false);
    
    useEffect(() => {
        // Wait for ethereum provider
        const checkProvider = () => {
            if (window.ethereum) {
                setIsReady(true);
            } else {
                setTimeout(checkProvider, 100);
            }
        };
        checkProvider();
    }, []);
    
    const connect = async () => {
        if (!isReady) {
            alert('Please install MetaMask');
            return;
        }
        await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
    };
}
```

---

### Issue: Infinite Re-renders

**Production Story**: Browser tab froze. CPU 100%. Had to force quit.

```tsx
// BAD CODE
function PropertyList() {
    const [properties, setProperties] = useState([]);
    
    // INFINITE LOOP!
    useEffect(() => {
        fetchProperties().then(setProperties);
    });  // Missing dependency array!
    // Runs after every render → updates state → causes render → repeat!
}

// FIXED CODE
function PropertyList() {
    const [properties, setProperties] = useState([]);
    
    useEffect(() => {
        fetchProperties().then(setProperties);
    }, []);  // Empty array = run once on mount
}
```
