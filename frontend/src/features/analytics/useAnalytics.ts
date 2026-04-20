import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "./analyticsService";
import { useAuth } from "@/features/auth/useAuth";

export function useAnalyticsSummary() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["analytics_summary", user?.id],
    queryFn: () => analyticsService.summary(user!.id),
    enabled: !!user,
  });
}
