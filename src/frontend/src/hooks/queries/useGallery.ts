import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Painting } from '../../backend';

export function useGetGallery() {
  const { actor, isFetching } = useActor();

  return useQuery<Painting[]>({
    queryKey: ['gallery'],
    queryFn: async () => {
      if (!actor) return [];
      const paintings = await actor.getGallery();
      return paintings;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPainting(paintingId: string) {
  const { data: gallery } = useGetGallery();
  
  const painting = gallery?.find(p => p.id === paintingId);
  
  return {
    data: painting,
    isLoading: !gallery,
  };
}
