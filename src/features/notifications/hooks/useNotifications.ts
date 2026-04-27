import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  discardNotification,
  listNotifications,
  markNotificationAsRead
} from "@/features/notifications/api/notificationsApi";
import type { NotificationListParams } from "@/features/notifications/types/notificationTypes";

export const notificationQueryKeys = {
  root: ["notifications"] as const,
  lists: () => [...notificationQueryKeys.root, "list"] as const,
  list: (params: NotificationListParams) =>
    [...notificationQueryKeys.lists(), params] as const
};

export function useNotificationsList(params: NotificationListParams) {
  return useQuery({
    queryKey: notificationQueryKeys.list(params),
    queryFn: () => listNotifications(params)
  });
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) => markNotificationAsRead(notificationId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.lists()
      });
    }
  });
}

export function useDiscardNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) => discardNotification(notificationId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.lists()
      });
    }
  });
}