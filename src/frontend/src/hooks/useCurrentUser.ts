import { useInternetIdentity } from './useInternetIdentity';
import { useMemo } from 'react';

export function useCurrentUser() {
  const { identity } = useInternetIdentity();

  const principalString = useMemo(() => {
    return identity?.getPrincipal().toString() || null;
  }, [identity]);

  const isAuthenticated = !!identity;

  const isOwner = (authorPrincipal: string) => {
    if (!principalString) return false;
    return principalString === authorPrincipal;
  };

  return {
    isAuthenticated,
    principalString,
    isOwner,
    identity,
  };
}
