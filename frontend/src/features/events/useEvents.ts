import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  eventsService,
  type EventTypeInsert,
  type EventTypeUpdate,
} from "./eventsService";
import { useAuth } from "@/features/auth/useAuth";

export function useEvents() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["event_types", user?.id],
    queryFn: () => eventsService.listForOwner(user!.id),
    enabled: !!user,
  });
}

export function usePublicEvent(username: string, slug: string) {
  return useQuery({
    queryKey: ["public_event", username, slug],
    queryFn: () => eventsService.getPublic(username, slug),
    enabled: !!username && !!slug,
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (input: EventTypeInsert) => eventsService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["event_types", user?.id] }),
  });
}

export function useUpdateEvent() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: EventTypeUpdate }) =>
      eventsService.update(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["event_types", user?.id] }),
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (id: string) => eventsService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["event_types", user?.id] }),
  });
}
