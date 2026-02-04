import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { ExternalBlob } from '../../backend';

export function useCompletePainting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ image, title }: { image: ExternalBlob; title: string }) => {
      if (!actor) {
        throw new Error('Unable to connect to the backend. Please refresh the page or try logging in again.');
      }
      return actor.completePainting(image, title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
  });
}
