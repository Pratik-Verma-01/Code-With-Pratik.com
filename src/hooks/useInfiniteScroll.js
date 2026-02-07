/**
 * 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 useInfiniteScroll Hook
 * 
 * Infinite scroll functionality using Intersection Observer.
 */

import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Custom hook for infinite scroll
 * @param {Object} options - Options
 * @returns {Object} Scroll state and ref
 */
export function useInfiniteScroll(options = {}) {
  const {
    onLoadMore,
    hasMore = true,
    isLoading = false,
    threshold = 0.1,
    rootMargin = '100px',
    enabled = true,
  } = options;

  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);
  const callbackRef = useRef(onLoadMore);

  // Update callback ref
  useEffect(() => {
    callbackRef.current = onLoadMore;
  }, [onLoadMore]);

  // Setup intersection observer
  useEffect(() => {
    if (!enabled || !hasMore || isLoading) return;

    const node = loadMoreRef.current;
    if (!node) return;

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          callbackRef.current?.();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observerRef.current.observe(node);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enabled, hasMore, isLoading, threshold, rootMargin]);

  return {
    loadMoreRef,
    isLoading,
    hasMore,
  };
}

/**
 * Hook for scroll-based infinite loading
 * @param {Object} options - Options
 * @returns {Object} Scroll state
 */
export function useScrollInfinite(options = {}) {
  const {
    onLoadMore,
    hasMore = true,
    isLoading = false,
    scrollThreshold = 200,
    enabled = true,
  } = options;

  const callbackRef = useRef(onLoadMore);

  useEffect(() => {
    callbackRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    if (!enabled || !hasMore || isLoading) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollHeight - scrollTop - clientHeight < scrollThreshold) {
        callbackRef.current?.();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enabled, hasMore, isLoading, scrollThreshold]);

  return {
    isLoading,
    hasMore,
  };
}

/**
 * Hook for container-based infinite scroll
 * @param {Object} options - Options
 * @returns {Object} Container ref and state
 */
export function useContainerInfiniteScroll(options = {}) {
  const {
    onLoadMore,
    hasMore = true,
    isLoading = false,
    scrollThreshold = 100,
    enabled = true,
  } = options;

  const containerRef = useRef(null);
  const callbackRef = useRef(onLoadMore);

  useEffect(() => {
    callbackRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    if (!enabled || !hasMore || isLoading) return;

    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;

      if (scrollHeight - scrollTop - clientHeight < scrollThreshold) {
        callbackRef.current?.();
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [enabled, hasMore, isLoading, scrollThreshold]);

  return {
    containerRef,
    isLoading,
    hasMore,
  };
}

/**
 * Hook for pagination with infinite scroll
 * @param {Function} fetchFn - Function to fetch data
 * @param {Object} options - Options
 * @returns {Object} Pagination state and methods
 */
export function useInfinitePagination(fetchFn, options = {}) {
  const { pageSize = 20, enabled = true } = options;

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFn({ page, pageSize });
      
      setItems((prev) => [...prev, ...(result.data || [])]);
      setHasMore(result.hasMore ?? result.data?.length === pageSize);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, page, pageSize, isLoading, hasMore]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  const refresh = useCallback(async () => {
    reset();
    await loadMore();
  }, [reset, loadMore]);

  const { loadMoreRef } = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    isLoading,
    enabled,
  });

  return {
    items,
    isLoading,
    hasMore,
    error,
    loadMore,
    reset,
    refresh,
    loadMoreRef,
    page,
  };
}

export default useInfiniteScroll;
