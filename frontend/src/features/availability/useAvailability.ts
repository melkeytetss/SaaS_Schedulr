import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { availabilityService, type AvailabilityRule } from "./availabilityService";
import { useAuth } from "@/features/auth/useAuth";

export function useAvailabilityRules() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["availability_rules", user?.id],
    queryFn: () => availabilityService.listRules(user!.id),
    enabled: !!user,
  });
}

export function useReplaceAvailabilityRules() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (rules: Omit<AvailabilityRule, "id">[]) =>
      availabilityService.replaceRules(user!.id, rules),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["availability_rules", user?.id] }),
  });
}
