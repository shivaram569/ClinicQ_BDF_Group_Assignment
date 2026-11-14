-- ==========================================================
-- ClinicQ Health Centre - Seed Data
-- Realistic sample records for doctors, rooms, and bookings
-- ==========================================================

-- Insert Doctors
INSERT INTO doctors (id, name, specialization, phone) VALUES
(1, 'Dr. Sarah Jenkins', 'Cardiology', '+1-555-0101'),
(2, 'Dr. Michael Chang', 'Pediatrics', '+1-555-0102'),
(3, 'Dr. Priya Sharma', 'Neurology', '+1-555-0103'),
(4, 'Dr. Robert Davis', 'General Medicine', '+1-555-0104'),
(5, 'Dr. Emily Carter', 'Orthopedics', '+1-555-0105');

-- Insert Rooms
-- Note: Room 3 is explicitly defined on Floor 2 as required for the compulsory assignment tests
INSERT INTO rooms (id, room_number, floor, capacity, status) VALUES
(1, 'Room 101', 1, 4, 'available'),
(2, 'Room 102', 1, 2, 'available'),
(3, 'Room 3', 2, 4, 'available'),
(4, 'Room 201', 2, 6, 'available'),
(5, 'Room 301', 3, 5, 'available'),
(6, 'Room 302', 3, 3, 'maintenance');

-- Insert Initial Bookings
-- Booking for Room 3 from 2026-11-10 to 2026-11-12 (Required for compulsory twist tests)
INSERT INTO bookings (id, doctor_id, room_id, start_date, end_date, start_time, end_time, status) VALUES
(1, 2, 3, '2026-11-10', '2026-11-12', '09:00', '13:00', 'active'),
(2, 1, 1, '2026-11-01', '2026-11-03', '08:00', '12:00', 'completed'),
(3, 3, 4, '2026-11-05', '2026-11-07', '14:00', '17:00', 'completed');
