import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eventBlockedDatesService } from "./eventBlockedDatesService";

export function useEventBlockedDates(eventTypeId: string | undefined) {
  return useQuery({
    queryKey: ["event_blocked_dates", eventTypeId],
    queryFn: () => eventBlockedDatesService.listForEvent(eventTypeId!),
    enabled: !!eventTypeId,
  });
}

export function useReplaceEventBlockedDates() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventTypeId,
      ownerId,
      dates,
    }: {
      eventTypeId: string;
      ownerId: string;
      dates: string[];
    }) => eventBlockedDatesService.replaceForEvent(eventTypeId, ownerId, dates),
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ["event_blocked_dates", vars.eventTypeId] }),
  });
}
