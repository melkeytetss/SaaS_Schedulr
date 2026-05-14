CREATE OR REPLACE FUNCTION get_public_bookings(p_owner_id uuid)
RETURNS TABLE (starts_at timestamptz, ends_at timestamptz) AS $$
BEGIN
  RETURN QUERY
  SELECT b.starts_at, b.ends_at
  FROM bookings b
  WHERE b.owner_id = p_owner_id AND b.status != 'cancelled';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
