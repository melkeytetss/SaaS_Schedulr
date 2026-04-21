import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  availabilityService,
  type AvailabilityRule,
  type AvailabilityOverride,
} from "./availabilityService";
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

export function useAvailabilityOverrides() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["availability_overrides", user?.id],
    queryFn: () => availabilityService.listOverrides(user!.id),
    enabled: !!user,
  });
}

export function useReplaceAvailabilityOverrides() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (overrides: Omit<AvailabilityOverride, "id">[]) =>
      availabilityService.replaceOverrides(user!.id, overrides),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["availability_overrides", user?.id] }),
  });
}

// Anon-safe variants: read another owner's availability by id (for the public
// booking page). Relies on the public-read RLS policies on availability_rules
// and availability_overrides.
export function useAvailabilityRulesFor(ownerId: string | undefined) {
  return useQuery({
    queryKey: ["availability_rules", ownerId],
    queryFn: () => availabilityService.listRules(ownerId!),
    enabled: !!ownerId,
  });
}

export function useAvailabilityOverridesFor(ownerId: string | undefined) {
  return useQuery({
    queryKey: ["availability_overrides", ownerId],
    queryFn: () => availabilityService.listOverrides(ownerId!),
    enabled: !!ownerId,
  });
}
