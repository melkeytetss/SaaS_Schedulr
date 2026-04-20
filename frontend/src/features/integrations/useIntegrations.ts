import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  integrationsService,
  type IntegrationInsert,
} from "./integrationsService";
import { useAuth } from "@/features/auth/useAuth";

export function useIntegrations() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["integrations", user?.id],
    queryFn: () => integrationsService.listForOwner(user!.id),
    enabled: !!user,
  });
}

export function useUpsertIntegration() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (input: IntegrationInsert) => integrationsService.upsert(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["integrations", user?.id] }),
  });
}

export function useDisconnectIntegration() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (id: string) => integrationsService.disconnect(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["integrations", user?.id] }),
  });
}
