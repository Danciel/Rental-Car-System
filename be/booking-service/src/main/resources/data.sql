INSERT INTO bookings (
  id,
  booking_code,
  user_id,
  car_id,
  start_time,
  end_time,
  status,
  total_price,
  deposit_amount,
  created_at
) VALUES
  (1, 'BKG-DEMO-001', 1, 101, '2026-03-15T08:00:00', '2026-03-18T08:00:00', 'CONFIRMED', 1500000, 500000, '2026-03-01T10:00:00'),
  (2, 'BKG-DEMO-002', 1, 102, '2026-02-20T09:00:00', '2026-02-23T09:00:00', 'CONFIRMED', 1800000, 500000, '2026-02-10T11:00:00'),
  (3, 'BKG-DEMO-003', 1, 103, '2026-02-10T09:00:00', '2026-02-12T09:00:00', 'CANCELLED', 1400000, 500000, '2026-02-01T12:00:00');

