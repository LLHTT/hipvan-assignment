import { useState, useEffect } from 'react';

interface UseFetchOptions {
  initialData?: any;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

function useFetch<T>(url: string, options: UseFetchOptions = {}): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(options.initialData || null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchIndex, setRefetchIndex] = useState<number>(0);

  const refetch = () => {
    setLoading(true);
    setRefetchIndex(prev => prev + 1);
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url, { signal });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        options.onSuccess?.(result);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError(err as Error);
          options.onError?.(err as Error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url, refetchIndex]);

  return { data, loading, error, refetch };
}

export default useFetch;
