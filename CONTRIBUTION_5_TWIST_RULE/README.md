# Contribution 5: Assignment Twist Rule & Conflict Prevention
**Course:** Backend Development Fundamentals (BDF)  
**Project:** ClinicQ Health Centre - Consultation Room Booking System  
**Assigned Member:** Member 5 [Student Name Placeholder]  
**Group:** YG-AIDE2B-G08 | **Section:** AIDE2B  

---

## 1. Scope & Objective
As the **Twist Rule & Availability Specialist**, my primary responsibility was solving the core problem statement:
> *"Consultation rooms are assigned by the receptionist. Two doctors were given the same room at the same hour. Please build us a system that fixes this."*

This required implementing the **"Free on this date"** assignment twist:
1. Validating that booking end dates cannot precede start dates (`400 Bad Request`).
2. Implementing the exact endpoint `GET /rooms/available?date=YYYY-MM-DD` using SQL `NOT EXISTS` logic to return rooms free on a given date.
3. Guaranteeing that the **Three Compulsory Twist Test Cases** pass with 100% precision.
4. Implementing overlapping booking conflict prevention using date and time range intervals (`409 Conflict`).

---

## 2. Files Belonging to This Contribution
- `source-code/controllers/roomsController.js`: `getAvailableRooms` controller function executing the SQL `NOT EXISTS` query.
- `source-code/controllers/bookingsController.js`: `checkBookingOverlap` function preventing duplicate doctor assignments for the same room.
- `source-code/middleware/validate.js`: Chronological date validation returning `"End date cannot be earlier than start date."` with HTTP 400.

---

## 3. Implementation Details

### 3.1 Availability Logic & SQL NOT EXISTS Query
A room is defined as **unavailable** on a requested date if an active booking exists where:
$$\text{booking.start\_date} \le \text{requested\_date} \quad \text{AND} \quad \text{booking.end\_date} \ge \text{requested\_date}$$
Only active bookings are considered (`status = 'active'`).

To find all available rooms, we query the database for rooms where **no such active booking exists**:
```sql
SELECT r.*
FROM rooms r
WHERE r.status = 'available'
AND NOT EXISTS (
    SELECT 1 
    FROM bookings b
    WHERE b.room_id = r.id
      AND b.status = 'active'
      AND b.start_date <= ?
      AND b.end_date >= ?
)
ORDER BY r.floor ASC, r.room_number ASC;
```
*Crucial Architecture Note:* We do not merely check if a booking starts on the requested date; we check if the requested date falls anywhere inside the closed interval $[\text{start\_date}, \text{end\_date}]$.

### 3.2 Overlapping Booking Conflict Prevention (`HTTP 409`)
When booking a room, the system checks whether another active booking already occupies that room across both overlapping date ranges and overlapping time intervals:
- Date Overlap Condition:
  $$\text{existing.start\_date} \le \text{new.end\_date} \quad \text{AND} \quad \text{existing.end\_date} \ge \text{new.start\_date}$$
- Time Overlap Condition:
  $$\text{existing.start\_time} < \text{new.end\_time} \quad \text{AND} \quad \text{existing.end\_time} > \text{new.start\_time}$$

If both conditions hold, the system rejects the booking with `HTTP 409 Conflict` and returns:
```json
{
  "success": false,
  "error": "Room is already booked for the selected date and time interval.",
  "conflict_details": {
    "room_number": "Room 3",
    "booked_by": "Dr. Michael Chang",
    "date_range": "2026-11-10 to 2026-11-12",
    "time_interval": "09:00 - 13:00"
  }
}
```

---

## 4. Verification of the 3 Compulsory Test Cases

### Test 1: End Date Before Start Date
- **Action:** Attempt to create a booking for Room 3 with `start_date: "2026-11-15"` and `end_date: "2026-11-14"`.
- **Observed Result:** Server returns `HTTP 400 Bad Request`.
- **Response Payload:** `{"success": false, "error": "End date cannot be earlier than start date."}`
- **Status:** **PASS**

### Test 2: Room 3 Unavailable During Active Booking
- **Initial State:** Room 3 has an active booking from `2026-11-10` to `2026-11-12`.
- **Action:** Client sends `GET /rooms/available?date=2026-11-11`.
- **Observed Result:** Server returns `HTTP 200 OK`. Room 3 is **NOT** present in the `data` array.
- **Status:** **PASS**

### Test 3: Room 3 Available After Booking Ends
- **Action:** Client sends `GET /rooms/available?date=2026-11-13`.
- **Observed Result:** Server returns `HTTP 200 OK`. Room 3 **IS** present in the `data` array because its booking concluded on November 12.
- **Status:** **PASS**

---

## 5. Viva Preparation & Likely Questions
1. **Q: Why use `NOT EXISTS` rather than `NOT IN`?**
   - *A:* `NOT EXISTS` executes as a correlated subquery that terminates immediately upon finding the first matching record (short-circuit evaluation). Furthermore, `NOT IN` can produce unexpected empty results if the subquery returns any `NULL` values, whereas `NOT EXISTS` operates safely and efficiently.
2. **Q: How does the system prevent two doctors booking the same room at the same time?**
   - *A:* By evaluating the mathematical intersection of the date intervals and time intervals simultaneously. If two bookings have intersecting date ranges AND intersecting time intervals for the same `room_id`, a conflict is raised with HTTP 409, preventing double assignment.
