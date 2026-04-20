import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingsService, type BookingStatus } from "./bookingsService";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/features/auth/useAuth";

const KEY = (ownerId: string | undefined, upcomingOnly = false) =>
  ["bookings", ownerId, { upcomingOnly }] as const;

export function useBookings(opts: { upcomingOnly?: boolean } = {}) {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: KEY(user?.id, opts.upcomingOnly),
    queryFn: () => bookingsService.listForOwner(user!.id, opts),
    enabled: !!user,
  });

  // Realtime: refetch on any change to this owner's bookings.
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`bookings:${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings", filter: `owner_id=eq.${user.id}` },
        () => qc.invalidateQueries({ queryKey: ["bookings", user.id] })
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, qc]);

  return query;
}

export function useUpdateBookingStatus() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      bookingsService.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings", user?.id] }),
  });
}

export function useDeleteBooking() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (id: string) => bookingsService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings", user?.id] }),
  });
}
