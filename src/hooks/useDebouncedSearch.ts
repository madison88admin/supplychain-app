import { useState, useEffect, useCallback, useMemo } from 'react';

interface UseDebouncedSearchOptions {
  delay?: number;
  minLength?: number;
  maxResults?: number;
}

export const useDebouncedSearch = <T>(
  searchFunction: (query: string) => T[] | Promise<T[]>,
  options: UseDebouncedSearchOptions = {}
) => {
  const { delay = 300, minLength = 1, maxResults } = options;
  
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce the search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [query, delay]);

  // Perform search when debounced query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery || debouncedQuery.length < minLength) {
        setResults([]);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const searchResults = await searchFunction(debouncedQuery);
        const limitedResults = maxResults ? searchResults.slice(0, maxResults) : searchResults;
        setResults(limitedResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery, searchFunction, minLength, maxResults]);

  // Memoized search stats
  const searchStats = useMemo(() => ({
    queryLength: query.length,
    debouncedQueryLength: debouncedQuery.length,
    resultCount: results.length,
    hasResults: results.length > 0,
    isSearching: query !== debouncedQuery,
    isValidQuery: query.length >= minLength
  }), [query, debouncedQuery, results.length, minLength]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setResults([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    query,
    setQuery,
    debouncedQuery,
    results,
    isLoading,
    error,
    searchStats,
    clearSearch
  };
}; 