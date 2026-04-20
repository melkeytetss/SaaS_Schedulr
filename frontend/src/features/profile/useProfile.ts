import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileService, type ProfileUpdate } from "./profileService";
import { useAuth } from "@/features/auth/useAuth";

export function useMyProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => profileService.getById(user!.id),
    enabled: !!user,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (patch: ProfileUpdate) => profileService.update(user!.id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile", user?.id] }),
  });
}
