'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  authService,
  propertyService,
  agentService,
  favoritesService,
  savedSearchesService,
  messagesService,
  notificationsService,
  subscriptionService,
  vastuService,
  blockchainService,
} from '@/services/api';

// ============================================================================
// AUTHENTICATION HOOKS
// ============================================================================

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'buyer' | 'seller' | 'agent' | 'admin';
  avatar?: string;
  phone?: string;
  isVerified: boolean;
  subscription?: {
    tier: string;
    status: string;
    expiresAt: string;
  };
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setState({ user: null, isLoading: false, isAuthenticated: false, error: null });
        return;
      }

      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        setState({
          user: response.data,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } else {
        localStorage.removeItem('auth_token');
        setState({ user: null, isLoading: false, isAuthenticated: false, error: null });
      }
    } catch (error) {
      localStorage.removeItem('auth_token');
      setState({ user: null, isLoading: false, isAuthenticated: false, error: 'Failed to fetch user' });
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authService.login(email, password);
      if (response.success && response.data) {
        setState({
          user: response.data.user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
        return { success: true };
      }
      throw new Error(response.error || 'Login failed');
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Login failed';
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      return { success: false, error: message };
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: string;
  }) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authService.register(data);
      if (response.success && response.data) {
        setState({
          user: response.data.user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
        return { success: true };
      }
      throw new Error(response.error || 'Registration failed');
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Registration failed';
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setState({ user: null, isLoading: false, isAuthenticated: false, error: null });
      router.push('/login');
    }
  };

  const updateUser = (updates: Partial<User>) => {
    setState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...updates } : null,
    }));
  };

  return {
    ...state,
    login,
    register,
    logout,
    updateUser,
    refetch: fetchUser,
  };
}

// Protected route hook
export function useRequireAuth(redirectTo = '/login') {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`${redirectTo}?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, router, redirectTo, pathname]);

  return { isLoading, user, isAuthenticated };
}

// Role-based access hook
export function useRequireRole(allowedRoles: string[], redirectTo = '/dashboard') {
  const { user, isLoading, isAuthenticated } = useRequireAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user && !allowedRoles.includes(user.role)) {
      router.push(redirectTo);
    }
  }, [user, isLoading, isAuthenticated, allowedRoles, router, redirectTo]);

  const hasAccess = user && allowedRoles.includes(user.role);
  return { isLoading, user, hasAccess };
}

// ============================================================================
// DATA FETCHING HOOKS
// ============================================================================

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface UseFetchOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useFetch<T>(
  fetcher: () => Promise<{ success: boolean; data?: T; error?: string }>,
  deps: any[] = [],
  options: UseFetchOptions = {}
) {
  const { immediate = true, onSuccess, onError } = options;
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await fetcher();
      if (response.success && response.data !== undefined) {
        setState({ data: response.data, isLoading: false, error: null });
        onSuccess?.(response.data);
        return response.data;
      }
      throw new Error(response.error || 'Request failed');
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Request failed';
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      onError?.(message);
      return null;
    }
  }, [fetcher, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [...deps, immediate]);

  const mutate = useCallback((data: T | ((prev: T | null) => T)) => {
    setState((prev) => ({
      ...prev,
      data: typeof data === 'function' ? (data as Function)(prev.data) : data,
    }));
  }, []);

  return { ...state, execute, mutate };
}

// Property hooks
export function useProperty(id: string) {
  return useFetch(() => propertyService.getById(id), [id]);
}

export function usePropertySearch(filters: Record<string, any>) {
  const serializedFilters = JSON.stringify(filters);
  return useFetch(() => propertyService.search(filters), [serializedFilters]);
}

export function useFeaturedProperties(limit = 6) {
  return useFetch(() => propertyService.getFeatured(limit), [limit]);
}

export function useSimilarProperties(id: string, limit = 4) {
  return useFetch(() => propertyService.getSimilar(id, limit), [id, limit], { immediate: !!id });
}

// Agent hooks
export function useAgent(id: string) {
  return useFetch(() => agentService.getById(id), [id], { immediate: !!id });
}

export function useAgents(params?: { page?: number; limit?: number; specialization?: string }) {
  const serializedParams = JSON.stringify(params);
  return useFetch(() => agentService.getAll(params), [serializedParams]);
}

export function useAgentListings(id: string, params?: { page?: number; limit?: number; status?: string }) {
  const serializedParams = JSON.stringify(params);
  return useFetch(() => agentService.getListings(id, params), [id, serializedParams], { immediate: !!id });
}

// Favorites hooks
export function useFavorites() {
  const { data, isLoading, error, execute, mutate } = useFetch<any[]>(() => favoritesService.getAll(), []);

  const addFavorite = async (propertyId: string) => {
    try {
      await favoritesService.add(propertyId);
      execute(); // Refetch
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const removeFavorite = async (propertyId: string) => {
    try {
      await favoritesService.remove(propertyId);
      mutate((prev) => prev?.filter((f) => f.propertyId !== propertyId) || null);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const isFavorite = useCallback(
    (propertyId: string) => data?.some((f) => f.propertyId === propertyId) || false,
    [data]
  );

  return { favorites: data, isLoading, error, addFavorite, removeFavorite, isFavorite, refetch: execute };
}

// Saved searches hooks
export function useSavedSearches() {
  const { data, isLoading, error, execute, mutate } = useFetch<any[]>(() => savedSearchesService.getAll(), []);

  const createSearch = async (searchData: { name: string; filters: any; alertFrequency: string }) => {
    try {
      const response = await savedSearchesService.create(searchData);
      if (response.success) {
        execute();
        return { success: true, data: response.data };
      }
      throw new Error(response.error);
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const deleteSearch = async (id: string) => {
    try {
      await savedSearchesService.delete(id);
      mutate((prev) => prev?.filter((s) => s.id !== id) || null);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return { searches: data, isLoading, error, createSearch, deleteSearch, refetch: execute };
}

// Messages hooks
export function useConversations() {
  return useFetch<any[]>(() => messagesService.getConversations(), []);
}

export function useMessages(conversationId: string) {
  const { data, isLoading, error, execute, mutate } = useFetch<any[]>(
    () => messagesService.getMessages(conversationId),
    [conversationId],
    { immediate: !!conversationId }
  );

  const sendMessage = async (content: string, type = 'text') => {
    try {
      const response = await messagesService.sendMessage(conversationId, { content, type });
      if (response.success) {
        mutate((prev) => [...(prev || []), response.data]);
        return { success: true, data: response.data };
      }
      throw new Error(response.error);
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return { messages: data, isLoading, error, sendMessage, refetch: execute };
}

// Notifications hooks
export function useNotifications() {
  const { data, isLoading, error, execute, mutate } = useFetch<{ notifications: any[]; unreadCount: number }>(
    () => notificationsService.getAll(),
    []
  );

  const markAsRead = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      mutate((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          notifications: prev.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
          unreadCount: Math.max(0, prev.unreadCount - 1),
        };
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      mutate((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          notifications: prev.notifications.map((n) => ({ ...n, isRead: true })),
          unreadCount: 0,
        };
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    notifications: data?.notifications || [],
    unreadCount: data?.unreadCount || 0,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refetch: execute,
  };
}

// Subscription hooks
export function useSubscription() {
  const { data, isLoading, error, execute } = useFetch(() => subscriptionService.getCurrentSubscription(), []);

  const createCheckoutSession = async (tier: string, interval: 'month' | 'year') => {
    try {
      const response = await subscriptionService.createCheckoutSession(tier, interval);
      if (response.success && response.data) {
        window.location.href = response.data.url;
        return { success: true };
      }
      throw new Error(response.error);
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const openPortal = async () => {
    try {
      const response = await subscriptionService.createPortalSession();
      if (response.success && response.data) {
        window.location.href = response.data.url;
        return { success: true };
      }
      throw new Error(response.error);
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return { subscription: data, isLoading, error, createCheckoutSession, openPortal, refetch: execute };
}

// Vastu hooks
export function useVastuAnalysis(propertyId: string) {
  return useFetch(() => vastuService.getAnalysis(propertyId), [propertyId], { immediate: !!propertyId });
}

export function useAuspiciousDates(purpose: string, startDate: string, endDate: string) {
  return useFetch(
    () => vastuService.getAuspiciousDates({ purpose, startDate, endDate }),
    [purpose, startDate, endDate],
    { immediate: !!(purpose && startDate && endDate) }
  );
}

// Blockchain hooks
export function useTokenizedProperties(params?: { page?: number; limit?: number }) {
  const serializedParams = JSON.stringify(params);
  return useFetch(() => blockchainService.getTokenizedProperties(params), [serializedParams]);
}

export function useUserHoldings(walletAddress: string) {
  return useFetch(() => blockchainService.getUserHoldings(walletAddress), [walletAddress], {
    immediate: !!walletAddress,
  });
}

// ============================================================================
// UI/UX HOOKS
// ============================================================================

// Debounce hook
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook
export function useThrottle<T>(value: T, limit = 300): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => clearTimeout(handler);
  }, [value, limit]);

  return throttledValue;
}

// Local storage hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error('Error setting localStorage:', error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing localStorage:', error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}

// Media query hook
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Breakpoint hooks
export function useBreakpoint() {
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isLargeDesktop = useMediaQuery('(min-width: 1280px)');

  return { isMobile, isTablet, isDesktop, isLargeDesktop };
}

// Scroll position hook
export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition({ x: window.scrollX, y: window.scrollY });
    };

    window.addEventListener('scroll', updatePosition, { passive: true });
    updatePosition();

    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  return scrollPosition;
}

// Intersection observer hook
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [React.RefCallback<Element>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [element, setElement] = useState<Element | null>(null);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [element, options.threshold, options.root, options.rootMargin]);

  return [setElement, isIntersecting];
}

// Click outside hook
export function useClickOutside<T extends HTMLElement>(handler: () => void) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler]);

  return ref;
}

// Copy to clipboard hook
export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), timeout);
        return true;
      } catch {
        return false;
      }
    },
    [timeout]
  );

  return { copied, copy };
}

// Window size hook
export function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}

// Keyboard shortcut hook
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: { ctrl?: boolean; shift?: boolean; alt?: boolean; preventDefault?: boolean } = {}
) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        (!options.ctrl || event.ctrlKey || event.metaKey) &&
        (!options.shift || event.shiftKey) &&
        (!options.alt || event.altKey)
      ) {
        if (options.preventDefault) event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback, options.ctrl, options.shift, options.alt, options.preventDefault]);
}

// Previous value hook
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// Toggle hook
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, toggle, setTrue, setFalse] as const;
}

// Async callback hook
export function useAsync<T, Args extends any[]>(
  callback: (...args: Args) => Promise<T>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (...args: Args) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await callback(...args);
        setData(result);
        return result;
      } catch (e: any) {
        const message = e.message || 'An error occurred';
        setError(message);
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [callback]
  );

  return { execute, isLoading, error, data };
}

// URL state hook (sync with URL params)
export function useUrlState<T extends Record<string, string>>(
  defaultState: T
): [T, (updates: Partial<T>) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const state = useMemo(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return { ...defaultState, ...params } as T;
  }, [searchParams, defaultState]);

  const setState = useCallback(
    (updates: Partial<T>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '' || value === defaultState[key]) {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });
      const queryString = newParams.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams, defaultState]
  );

  return [state, setState];
}

// Countdown timer hook
export function useCountdown(targetDate: Date | string | number) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

function calculateTimeLeft(targetDate: Date | string | number) {
  const difference = new Date(targetDate).getTime() - Date.now();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isExpired: false,
  };
}

// Geolocation hook
export function useGeolocation(options?: PositionOptions) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLoading(false);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      },
      options
    );
  }, [options]);

  return { position, error, isLoading, getPosition };
}

// Form state hook
export function useFormState<T extends Record<string, any>>(initialState: T) {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
      setValues((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
    },
    []
  );

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialState);
    setErrors({});
    setTouched({});
  }, [initialState]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleBlur,
    setValue,
    setError,
    setErrors,
    reset,
    setValues,
  };
}
