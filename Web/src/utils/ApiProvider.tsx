import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity, // v5 uses gcTime instead of cacheTime
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

interface APIProviderProps {
  children: React.ReactNode;
}

export default function APIProvider({ children }: APIProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}