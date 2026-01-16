'use client';

import { useTheme } from '../src/contexts/ThemeContext';
import { Sun, Moon, Zap } from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-full border border-gray-200">
      <button
        onClick={() => setTheme('estate')}
        className={`p-1.5 rounded-full transition-all ${
          theme === 'estate'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        title="ESTATE Mode"
      >
        <HomeIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('indu')}
        className={`p-1.5 rounded-full transition-all ${
          theme === 'indu'
            ? 'bg-orange-100 text-orange-600 shadow-sm ring-1 ring-orange-200'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        title="INDU Mode"
      >
        <OmIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('web3')}
        className={`p-1.5 rounded-full transition-all ${
          theme === 'web3'
            ? 'bg-emerald-100 text-emerald-600 shadow-sm ring-1 ring-emerald-200'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        title="WEB3 Mode"
      >
        <Zap className="w-4 h-4" />
      </button>
    </div>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

function OmIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
      <path d="M12 8a3 3 0 1 0 3 3" />
      <path d="M15 8a3 3 0 1 1-3 3" />
      <path d="M12 2v4" />
    </svg>
  );
}
