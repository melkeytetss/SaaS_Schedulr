import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { remindersService, type ReminderInsert } from "./remindersService";
import { useAuth } from "@/features/auth/useAuth";

export function useReminders() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["reminders", user?.id],
    queryFn: () => remindersService.listForOwner(user!.id),
    enabled: !!user,
  });
}

export function useCreateReminder() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (input: ReminderInsert) => remindersService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders", user?.id] }),
  });
}

export function useDeleteReminder() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (id: string) => remindersService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders", user?.id] }),
  });
}
