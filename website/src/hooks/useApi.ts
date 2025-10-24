// src/hooks/useApi.ts
// Advanced API hook for data fetching with caching and error handling

import { useEffect, useState, useCallback, useRef } from 'react';
import { apiClient } from '../lib/api';
import { logger } from '../lib/logger';

interface UseApiOptions {
  autoFetch?: boolean;
  cacheTime?: number;
  retries?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  isCached: boolean;
}

class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any, ttl = this.defaultTTL) {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + ttl,
    });
  }

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.timestamp) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(pattern?: string) {
    if (!pattern) {
      this.cache.clear();
    } else {
      Array.from(this.cache.keys()).forEach((key) => {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      });
    }
  }
}

export const apiCache = new ApiCache();

export const useApi = <T,>(
  endpoint: string,
  options: UseApiOptions = {}
): UseApiState<T> & { refetch: () => Promise<void> } => {
  const {
    autoFetch = true,
    cacheTime = 5 * 60 * 1000,
    retries = 3,
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: autoFetch,
    error: null,
    isCached: false,
  });

  const cacheKey = `api:${endpoint}`;
  const abortControllerRef = useRef<AbortController | null>(null);

  const refetch = useCallback(async () => {
    abortControllerRef.current = new AbortController();

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const response = await apiClient.get<T>(endpoint, {
        retries,
      });

      apiCache.set(cacheKey, response.data, cacheTime);

      setState({
        data: response.data,
        loading: false,
        error: null,
        isCached: false,
      });

      onSuccess?.(response.data);
      logger.debug(`API fetch successful: ${endpoint}`);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      setState({
        data: null,
        loading: false,
        error: err,
        isCached: false,
      });

      onError?.(err);
      logger.error(`API fetch failed: ${endpoint}`, err);
    }
  }, [endpoint, cacheTime, retries, onSuccess, onError]);

  useEffect(() => {
    if (!autoFetch) return;

    // Try to use cached data first
    const cached = apiCache.get(cacheKey);
    if (cached) {
      setState({
        data: cached,
        loading: false,
        error: null,
        isCached: true,
      });
      return;
    }

    refetch();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [endpoint, autoFetch, refetch]);

  return { ...state, refetch };
};

// Advanced mutation hook
export const useMutation = <T, P = any>(
  method: 'post' | 'put' | 'patch' | 'delete',
  endpoint: string,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  } = {}
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (payload?: P) => {
      try {
        setLoading(true);
        setError(null);

        let response;
        if (method === 'delete') {
          response = await apiClient.delete<T>(endpoint);
        } else {
          response = await apiClient[method]<T>(endpoint, payload);
        }

        options.onSuccess?.(response.data);
        logger.debug(`Mutation successful: ${method.toUpperCase()} ${endpoint}`);
        return response.data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        options.onError?.(error);
        logger.error(`Mutation failed: ${method.toUpperCase()} ${endpoint}`, error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [method, endpoint, options]
  );

  return { loading, error, mutate };
};

// Pagination hook
export const usePagination = <T,>(
  fetchFn: (page: number, pageSize: number) => Promise<{ data: T[]; total: number }>,
  pageSize = 10
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const result = await fetchFn(page, pageSize);
      setData(result.data);
      setTotal(result.total);
      setCurrentPage(page);
    } catch (error) {
      logger.error('Pagination fetch failed', error);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, pageSize]);

  const nextPage = () => {
    if (currentPage * pageSize < total) {
      fetchData(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      fetchData(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page > 0 && page * pageSize <= total + pageSize) {
      fetchData(page);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  return {
    data,
    currentPage,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
    loading,
    nextPage,
    prevPage,
    goToPage,
  };
};

// Infinite scroll hook
export const useInfiniteScroll = <T,>(
  fetchFn: (page: number, pageSize: number) => Promise<T[]>,
  pageSize = 20
) => {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newData = await fetchFn(page, pageSize);
      if (newData.length < pageSize) {
        setHasMore(false);
      }
      setData((prev) => [...prev, ...newData]);
      setPage((prev) => prev + 1);
    } catch (error) {
      logger.error('Infinite scroll fetch failed', error);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, page, pageSize, loading, hasMore]);

  useEffect(() => {
    loadMore();
  }, []);

  return { data, loading, hasMore, loadMore };
};
