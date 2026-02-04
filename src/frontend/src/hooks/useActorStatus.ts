import { useQuery } from '@tanstack/react-query';
import { useInternetIdentity } from './useInternetIdentity';
import { type backendInterface } from '../backend';

const ACTOR_QUERY_KEY = 'actor';

/**
 * Hook to check the status of the backend actor initialization.
 * Returns loading, error, and ready states without modifying the actor query.
 */
export function useActorStatus() {
  const { identity } = useInternetIdentity();
  
  // Read the existing actor query state using the same queryKey
  const queryKey = [ACTOR_QUERY_KEY, identity?.getPrincipal().toString()];
  
  const actorQuery = useQuery<backendInterface>({
    queryKey,
    // This query is just reading the cache, not fetching
    enabled: false,
    staleTime: Infinity,
  });

  return {
    isLoading: actorQuery.isFetching || actorQuery.isLoading,
    isError: actorQuery.isError,
    error: actorQuery.error,
    isReady: !!actorQuery.data && !actorQuery.isFetching && !actorQuery.isError,
  };
}
