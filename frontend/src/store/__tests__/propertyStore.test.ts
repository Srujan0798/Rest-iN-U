import { renderHook, act } from '@testing-library/react';
import {
  usePropertyStore,
  useFavorites,
  useCompareList,
  useCurrentFilters,
} from '@/store/property-store';

describe('Property Store', () => {
  // Reset store before each test
  beforeEach(() => {
    usePropertyStore.setState({
      favorites: [],
      compareList: [],
      maxCompareItems: 4,
      recentlyViewed: [],
      maxRecentItems: 20,
      currentFilters: { sortBy: 'createdAt', sortOrder: 'desc' },
      recentSearches: [],
      savedSearches: [],
      maxRecentSearches: 10,
      viewMode: 'grid',
      mapCenter: null,
      mapZoom: 12,
    });
  });

  describe('Favorites', () => {
    it('should add property to favorites', () => {
      const { result } = renderHook(() => usePropertyStore());
      
      act(() => {
        result.current.addFavorite('prop-1');
      });
      
      expect(result.current.favorites).toContain('prop-1');
      expect(result.current.isFavorite('prop-1')).toBe(true);
    });

    it('should not add duplicate favorites', () => {
      const { result } = renderHook(() => usePropertyStore());
      
      act(() => {
        result.current.addFavorite('prop-1');
        result.current.addFavorite('prop-1');
      });
      
      expect(result.current.favorites).toHaveLength(1);
    });

    it('should remove property from favorites', () => {
      const { result } = renderHook(() => usePropertyStore());
      
      act(() => {
        result.current.addFavorite('prop-1');
        result.current.removeFavorite('prop-1');
      });
      
      expect(result.current.favorites).not.toContain('prop-1');
      expect(result.current.isFavorite('prop-1')).toBe(false);
    });

    it('should toggle favorite status', () => {
      const { result } = renderHook(() => usePropertyStore());
      
      act(() => {
        result.current.toggleFavorite('prop-1');
      });
      expect(result.current.isFavorite('prop-1')).toBe(true);
      
      act(() => {
        result.current.toggleFavorite('prop-1');
      });
      expect(result.current.isFavorite('prop-1')).toBe(false);
    });

    it('should clear all favorites', () => {
      const { result } = renderHook(() => usePropertyStore());
      
      act(() => {
        result.current.addFavorite('prop-1');
        result.current.addFavorite('prop-2');
        result.current.clearFavorites();
      });
      
      expect(result.current.favorites).toHaveLength(0);
    });
  });

  describe('Compare List', () => {
    it('should add property to compare list', () => {
      const { result } = renderHook(() => usePropertyStore());
      
      act(() => {
        const added = result.current.addToCompare('prop-1');
        expect(added).toBe(true);
      });
      
      expect(result.current.compareList).toContain('prop-1');
      expect(result.current.isInCompare('prop-1')).toBe(true);
    });

    it('should not exceed max compare items', () => {
      const { result } = renderHook(() => usePropertyStore());
      
      act(() => {
        result.current.addToCompare('prop-1');
        result.current.addToCompare('prop-2');
        result.current.addToCompare('prop-3');
        result.current.addToCompare('prop-4');
      });
      
      expect(result.current.compareList).toHaveLength(4);
      expect(result.current.canAddToCompare()).toBe(false);
      
      act(() => {
        const added = result.current.addToCompare('prop-5');
        expect(added).toBe(false);
      });
      
      expect(result.current.compareList).toHaveLength(4);
    });

    it('should remove property from compare list', () => {
      const { result } = renderHook(() => usePropertyStore());
      
      act(() => {
        result.current.addToCompare('prop-1');
        result.current.removeFromCompare('prop-1');
      });
      
      expect(result.current.compareList).not.toContain('prop-1');
    });

    it('should clear compare list', () => {
      const { result } = renderHook(() => usePropertyStore());
      
      act(() => {
        result.current.addToCompare('prop-1');
        result.current.addToCompare('prop-2');
        result.current.clearCompare();
      });
      
      expect(result.current.compareList).toHaveLength(0);
    });
  });

  describe('Recently Viewed', () => {
    it('should add to recently viewed', () => {
      const { result } = renderHook(() => usePropertyStore());
      
      act(() => {
        result.current.addToRecentlyViewed('prop-1');
      });
      
      expect(result.current.recentlyViewed[0]).toBe('prop-1');
    });

    it('should move existing item to front', () => {
      const { result } = renderHook(() => usePropertyStore());
      
      act(() => {
        result.current.addToRecentlyViewed('prop-1');
        result.current.addToRecentlyViewed('prop-2');
        result.current.addToRecentlyViewed('prop-1');
      });
      
      expect(result.current.recentlyViewed[0]).toBe('prop-1');
      expect(result.current.recentlyViewed).toHaveLength(2);
    });

    it('should limit recently viewed items', () => {
      const { result } = renderHook(() => usePropertyStore());
      
      // Set a smaller max for testing
      act(() => {
        usePropertyStore.setState({ maxRecentItems: 3 });
      });
      
      act(() => {
        result.current.addToRecentlyViewed('prop-1');
        result.current.addToRecentlyViewed('prop-2');
        result.current.addToRecentlyViewed('prop-3');
        result.current.addToRecentlyViewed('prop-4');
      });
      
      expect(result.current.recentlyViewed).toHaveLength(3);
      expect(result.current.recentlyViewed[0]).toBe('prop-4');
      expect(result.current.recentlyViewed).not.toContain('prop-1');
    });
  });

  describe('Filters', () => {
    it('should set filters', () => {
      const { result } = renderHook(() => usePropertyStore());
      
      const newFilters = {
        type: ['apartment'],
        priceMin: 5000000,
        priceMax: 10000000,
      };
      
      act(() => {
        result.current.setFilters(newFilters);
      });
      
      expect(result.current.currentFilters.type).toEqual(['apartment']);
      expect(result.current.currentFilters.priceMin).toBe(5000000);
      expect(result.current.currentFilters.priceMax).toBe(10000000);
    });

    it('should update single filter', () => {
      const { result } = renderHook(() => usePropertyStore());
      
      act(() => {
        result.current.updateFilter('bedrooms', [2, 3]);
      });
      
      expect(result.current.currentFilters.bedrooms).toEqual([2, 3]);
    });

    it('should clear filters', () => {
      const { result } = renderHook(() => usePropertyStore());
      
      act(() => {
        result.current.setFilters({ type: ['apartment'], priceMin: 5000000 });
        result.current.clearFilters();
      });
      
      expect(result.current.currentFilters.type).toBeUndefined();
      expect(result.current.currentFilters.priceMin).toBeUndefined();
      expect(result.current.currentFilters.sortBy).toBe('createdAt');
    });

    it('should detect active filters', () => {
      const { result } = renderHook(() => usePropertyStore());
      
      expect(result.current.hasActiveFilters()).toBe(false);
      
      act(() => {
        result.current.updateFilter('type', ['apartment']);
      });
      
      expect(result.current.hasActiveFilters()).toBe(true);
    });

    it('should count active filters', () => {
      const { result } = renderHook(() => usePropertyStore());
      
      act(() => {
        result.current.setFilters({
          type: ['apartment'],
          priceMin: 5000000,
          bedrooms: [2, 3],
        });
      });
      
      expect(result.current.getActiveFilterCount()).toBe(3);
    });
  });

  describe('Saved Searches', () => {
    it('should save current search', () => {
      const { result } = renderHook(() => usePropertyStore());
      
      act(() => {
        result.current.setFilters({
          type: ['apartment'],
          priceMax: 10000000,
        });
      });
      
      let searchId: string;
      
      act(() => {
        searchId = result.current.saveSearch('My Search', true);
      });
      
      expect(result.current.savedSearches).toHaveLength(1);
      expect(result.current.savedSearches[0].name).toBe('My Search');
      expect(result.current.savedSearches[0].alertEnabled).toBe(true);
      expect(result.current.savedSearches[0].filters.type).toEqual(['apartment']);
    });

    it('should load saved search', () => {
      const { result } = renderHook(() => usePropertyStore());
      
      let searchId: string;
      
      act(() => {
        result.current.setFilters({ type: ['villa'] });
        searchId = result.current.saveSearch('Villa Search');
        result.current.clearFilters();
      });
      
      expect(result.current.currentFilters.type).toBeUndefined();
      
      act(() => {
        result.current.loadSavedSearch(searchId!);
      });
      
      expect(result.current.currentFilters.type).toEqual(['villa']);
    });

    it('should delete saved search', () => {
      const { result } = renderHook(() => usePropertyStore());
      
      let searchId: string;
      
      act(() => {
        searchId = result.current.saveSearch('Test Search');
      });
      
      expect(result.current.savedSearches).toHaveLength(1);
      
      act(() => {
        result.current.deleteSavedSearch(searchId!);
      });
      
      expect(result.current.savedSearches).toHaveLength(0);
    });
  });

  describe('View Mode', () => {
    it('should set view mode', () => {
      const { result } = renderHook(() => usePropertyStore());
      
      expect(result.current.viewMode).toBe('grid');
      
      act(() => {
        result.current.setViewMode('list');
      });
      
      expect(result.current.viewMode).toBe('list');
      
      act(() => {
        result.current.setViewMode('map');
      });
      
      expect(result.current.viewMode).toBe('map');
    });
  });

  describe('Map State', () => {
    it('should set map center', () => {
      const { result } = renderHook(() => usePropertyStore());
      
      const center = { lat: 19.076, lng: 72.877 };
      
      act(() => {
        result.current.setMapCenter(center);
      });
      
      expect(result.current.mapCenter).toEqual(center);
    });

    it('should set map zoom', () => {
      const { result } = renderHook(() => usePropertyStore());
      
      act(() => {
        result.current.setMapZoom(15);
      });
      
      expect(result.current.mapZoom).toBe(15);
    });
  });

  describe('Selector Hooks', () => {
    it('useFavorites should return favorites', () => {
      const { result: storeResult } = renderHook(() => usePropertyStore());
      
      act(() => {
        storeResult.current.addFavorite('prop-1');
      });
      
      const { result: favResult } = renderHook(() => useFavorites());
      expect(favResult.current).toContain('prop-1');
    });

    it('useCompareList should return compare list', () => {
      const { result: storeResult } = renderHook(() => usePropertyStore());
      
      act(() => {
        storeResult.current.addToCompare('prop-1');
      });
      
      const { result: compareResult } = renderHook(() => useCompareList());
      expect(compareResult.current).toContain('prop-1');
    });

    it('useCurrentFilters should return filters', () => {
      const { result: storeResult } = renderHook(() => usePropertyStore());
      
      act(() => {
        storeResult.current.updateFilter('type', ['apartment']);
      });
      
      const { result: filterResult } = renderHook(() => useCurrentFilters());
      expect(filterResult.current.type).toEqual(['apartment']);
    });
  });
});
