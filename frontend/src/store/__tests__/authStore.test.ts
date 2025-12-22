import { renderHook, act } from '@testing-library/react';
import { useAuthStore, useUser, useIsAuthenticated } from '@/store/auth-store';

// Mock user data
const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user' as const,
  avatar: null,
  phone: '+91 98765 43210',
  isVerified: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockTokens = {
  accessToken: 'access-token-123',
  refreshToken: 'refresh-token-456',
};

describe('Auth Store', () => {
  // Reset store before each test
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      error: null,
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useAuthStore.getState();
      
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.isInitialized).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('Login', () => {
    it('should set user and tokens on login', () => {
      const { result } = renderHook(() => useAuthStore());
      
      act(() => {
        result.current.login(
          mockUser,
          mockTokens.accessToken,
          mockTokens.refreshToken
        );
      });
      
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.accessToken).toBe(mockTokens.accessToken);
      expect(result.current.refreshToken).toBe(mockTokens.refreshToken);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Logout', () => {
    it('should clear user and tokens on logout', () => {
      const { result } = renderHook(() => useAuthStore());
      
      // First login
      act(() => {
        result.current.login(
          mockUser,
          mockTokens.accessToken,
          mockTokens.refreshToken
        );
      });
      
      expect(result.current.isAuthenticated).toBe(true);
      
      // Then logout
      act(() => {
        result.current.logout();
      });
      
      expect(result.current.user).toBeNull();
      expect(result.current.accessToken).toBeNull();
      expect(result.current.refreshToken).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Update User', () => {
    it('should update user properties', () => {
      const { result } = renderHook(() => useAuthStore());
      
      act(() => {
        result.current.login(
          mockUser,
          mockTokens.accessToken,
          mockTokens.refreshToken
        );
      });
      
      act(() => {
        result.current.updateUser({ name: 'Updated Name' });
      });
      
      expect(result.current.user?.name).toBe('Updated Name');
      expect(result.current.user?.email).toBe(mockUser.email);
    });

    it('should not update if no user is logged in', () => {
      const { result } = renderHook(() => useAuthStore());
      
      act(() => {
        result.current.updateUser({ name: 'Updated Name' });
      });
      
      expect(result.current.user).toBeNull();
    });
  });

  describe('Refresh Session', () => {
    it('should update access token', () => {
      const { result } = renderHook(() => useAuthStore());
      
      act(() => {
        result.current.login(
          mockUser,
          mockTokens.accessToken,
          mockTokens.refreshToken
        );
      });
      
      const newAccessToken = 'new-access-token';
      
      act(() => {
        result.current.refreshSession(newAccessToken);
      });
      
      expect(result.current.accessToken).toBe(newAccessToken);
      expect(result.current.refreshToken).toBe(mockTokens.refreshToken);
    });

    it('should update both tokens if refresh token is provided', () => {
      const { result } = renderHook(() => useAuthStore());
      
      act(() => {
        result.current.login(
          mockUser,
          mockTokens.accessToken,
          mockTokens.refreshToken
        );
      });
      
      const newAccessToken = 'new-access-token';
      const newRefreshToken = 'new-refresh-token';
      
      act(() => {
        result.current.refreshSession(newAccessToken, newRefreshToken);
      });
      
      expect(result.current.accessToken).toBe(newAccessToken);
      expect(result.current.refreshToken).toBe(newRefreshToken);
    });
  });

  describe('Role Checks', () => {
    it('should correctly check user role', () => {
      const { result } = renderHook(() => useAuthStore());
      
      act(() => {
        result.current.login(
          mockUser,
          mockTokens.accessToken,
          mockTokens.refreshToken
        );
      });
      
      expect(result.current.hasRole('user')).toBe(true);
      expect(result.current.hasRole('admin')).toBe(false);
      expect(result.current.hasRole('agent')).toBe(false);
    });

    it('should return false when not logged in', () => {
      const { result } = renderHook(() => useAuthStore());
      
      expect(result.current.hasRole('user')).toBe(false);
    });
  });

  describe('isAgent and isAdmin', () => {
    it('should correctly identify agent', () => {
      const { result } = renderHook(() => useAuthStore());
      
      const agentUser = { ...mockUser, role: 'agent' as const };
      
      act(() => {
        result.current.login(
          agentUser,
          mockTokens.accessToken,
          mockTokens.refreshToken
        );
      });
      
      expect(result.current.isAgent()).toBe(true);
      expect(result.current.isAdmin()).toBe(false);
    });

    it('should correctly identify admin', () => {
      const { result } = renderHook(() => useAuthStore());
      
      const adminUser = { ...mockUser, role: 'admin' as const };
      
      act(() => {
        result.current.login(
          adminUser,
          mockTokens.accessToken,
          mockTokens.refreshToken
        );
      });
      
      expect(result.current.isAgent()).toBe(false);
      expect(result.current.isAdmin()).toBe(true);
    });
  });

  describe('Loading and Error States', () => {
    it('should set loading state', () => {
      const { result } = renderHook(() => useAuthStore());
      
      act(() => {
        result.current.setLoading(true);
      });
      
      expect(result.current.isLoading).toBe(true);
      
      act(() => {
        result.current.setLoading(false);
      });
      
      expect(result.current.isLoading).toBe(false);
    });

    it('should set error state', () => {
      const { result } = renderHook(() => useAuthStore());
      
      act(() => {
        result.current.setError('Invalid credentials');
      });
      
      expect(result.current.error).toBe('Invalid credentials');
      
      act(() => {
        result.current.setError(null);
      });
      
      expect(result.current.error).toBeNull();
    });
  });

  describe('Selector Hooks', () => {
    it('useUser should return current user', () => {
      const { result: authResult } = renderHook(() => useAuthStore());
      const { result: userResult } = renderHook(() => useUser());
      
      expect(userResult.current).toBeNull();
      
      act(() => {
        authResult.current.login(
          mockUser,
          mockTokens.accessToken,
          mockTokens.refreshToken
        );
      });
      
      // Re-render to get updated value
      const { result: userResult2 } = renderHook(() => useUser());
      expect(userResult2.current).toEqual(mockUser);
    });

    it('useIsAuthenticated should return auth status', () => {
      const { result: authResult } = renderHook(() => useAuthStore());
      const { result: isAuthResult } = renderHook(() => useIsAuthenticated());
      
      expect(isAuthResult.current).toBe(false);
      
      act(() => {
        authResult.current.login(
          mockUser,
          mockTokens.accessToken,
          mockTokens.refreshToken
        );
      });
      
      const { result: isAuthResult2 } = renderHook(() => useIsAuthenticated());
      expect(isAuthResult2.current).toBe(true);
    });
  });
});
