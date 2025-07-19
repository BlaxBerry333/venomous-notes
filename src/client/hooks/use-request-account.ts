import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/server/utils/trpc/trpc-client";

/**
 * get user
 */
export function useGetUserByEmail() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.account.getUserByEmail.queryOptions(),
  });
}

/**
 * create user
 */
export function useCreateUser(callback: { onSuccess: VoidFunction; onError: (message: string) => void }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.account.createUser.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.account.getUserByEmail.queryKey(),
        });
        callback?.onSuccess();
      },
      onError: (error) => {
        callback?.onError(error.message);
      },
    }),
  );
}
