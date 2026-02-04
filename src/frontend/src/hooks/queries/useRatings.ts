import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { useCurrentUser } from '../useCurrentUser';
import type { RatingEntry } from '../../backend';

export function useGetRatings(paintingId: string) {
  const { actor, isFetching } = useActor();
  const { principalString } = useCurrentUser();

  const query = useQuery<RatingEntry[]>({
    queryKey: ['ratings', paintingId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRatings(paintingId);
    },
    enabled: !!actor && !isFetching,
  });

  const userRating = query.data?.find(r => r.user.toString() === principalString);
  const averageRating = query.data && query.data.length > 0
    ? query.data.reduce((sum, r) => sum + Number(r.points), 0) / query.data.length
    : null;

  return {
    ...query,
    userRating: userRating ? Number(userRating.points) : null,
    averageRating,
    totalRatings: query.data?.length || 0,
  };
}

export function useRatePainting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ paintingId, points }: { paintingId: string; points: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rate(paintingId, BigInt(points));
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ratings', variables.paintingId] });
    },
  });
}
