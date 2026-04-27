import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
  type QueryKey
} from "@tanstack/react-query";

import {
  discardNotification,
  listNotifications,
  markNotificationAsRead
} from "@/features/notifications/api/notificationsApi";
import type {
  NotificationActionResponse,
  NotificationItem,
  NotificationListParams,
  PaginatedNotificationsResult
} from "@/features/notifications/types/notificationTypes";

export const notificationQueryKeys = {
  root: ["notifications"] as const,
  lists: () => [...notificationQueryKeys.root, "list"] as const,
  list: (params: NotificationListParams) =>
    [...notificationQueryKeys.lists(), params] as const
};

type NotificationMutationContext = {
  previousLists: Array<[QueryKey, PaginatedNotificationsResult | undefined]>;
};

type NotificationPatch = Partial<
  Pick<NotificationItem, "status" | "read_at" | "discarded_at">
>;

function patchNotificationItem(
  item: NotificationItem,
  notificationId: number,
  patch: NotificationPatch
): NotificationItem {
  if (item.id !== notificationId) {
    return item;
  }

  return {
    ...item,
    ...patch
  };
}

function patchNotificationLists(
  queryClient: QueryClient,
  notificationId: number,
  patch: NotificationPatch
): void {
  const cachedLists = queryClient.getQueriesData<PaginatedNotificationsResult>({
    queryKey: notificationQueryKeys.lists()
  });

  cachedLists.forEach(([queryKey, cachedList]) => {
    if (!cachedList) {
      return;
    }

    queryClient.setQueryData<PaginatedNotificationsResult>(queryKey, {
      ...cachedList,
      items: cachedList.items.map((item) =>
        patchNotificationItem(item, notificationId, patch)
      )
    });
  });
}

function restoreNotificationLists(
  queryClient: QueryClient,
  previousLists?: NotificationMutationContext["previousLists"]
): void {
  previousLists?.forEach(([queryKey, cachedList]) => {
    queryClient.setQueryData(queryKey, cachedList);
  });
}

function patchFromActionResponse(
  response: NotificationActionResponse
): NotificationPatch {
  const patch: NotificationPatch = {
    status: response.status
  };

  if ("read_at" in response) {
    patch.read_at = response.read_at ?? null;
  }

  if ("discarded_at" in response) {
    patch.discarded_at = response.discarded_at ?? null;
  }

  return patch;
}

export function useNotificationsList(params: NotificationListParams) {
  return useQuery({
    queryKey: notificationQueryKeys.list(params),
    queryFn: () => listNotifications(params),
    placeholderData: (previousData) => previousData
  });
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    NotificationActionResponse,
    unknown,
    number,
    NotificationMutationContext
  >({
    mutationFn: (notificationId: number) => markNotificationAsRead(notificationId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({
        queryKey: notificationQueryKeys.lists()
      });

      const previousLists =
        queryClient.getQueriesData<PaginatedNotificationsResult>({
          queryKey: notificationQueryKeys.lists()
        });

      patchNotificationLists(queryClient, notificationId, {
        status: "read",
        read_at: new Date().toISOString()
      });

      return { previousLists };
    },
    onError: (_error, _notificationId, context) => {
      restoreNotificationLists(queryClient, context?.previousLists);
    },
    onSuccess: (response) => {
      patchNotificationLists(queryClient, response.id, patchFromActionResponse(response));
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.lists()
      });
    }
  });
}

export function useDiscardNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    NotificationActionResponse,
    unknown,
    number,
    NotificationMutationContext
  >({
    mutationFn: (notificationId: number) => discardNotification(notificationId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({
        queryKey: notificationQueryKeys.lists()
      });

      const previousLists =
        queryClient.getQueriesData<PaginatedNotificationsResult>({
          queryKey: notificationQueryKeys.lists()
        });

      patchNotificationLists(queryClient, notificationId, {
        status: "discarded",
        discarded_at: new Date().toISOString()
      });

      return { previousLists };
    },
    onError: (_error, _notificationId, context) => {
      restoreNotificationLists(queryClient, context?.previousLists);
    },
    onSuccess: (response) => {
      patchNotificationLists(queryClient, response.id, patchFromActionResponse(response));
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.lists()
      });
    }
  });
}
