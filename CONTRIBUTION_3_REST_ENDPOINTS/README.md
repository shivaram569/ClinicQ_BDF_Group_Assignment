# Contribution 3: REST Endpoints & Relational JOIN
**Course:** Backend Development Fundamentals (BDF)  
**Project:** ClinicQ Health Centre - Consultation Room Booking System  
**Assigned Member:** Member 3 [Student Name Placeholder]  
**Group:** YG-AIDE2B-G08 | **Section:** AIDE2B  

---

## 1. Scope & Objective
As the **REST API Developer**, my responsibility was implementing full CRUD (Create, Read, Update, Delete) business logic for the three entities (`doctors`, `rooms`, `bookings`), as well as developing the comprehensive SQL `JOIN` endpoint (`GET /bookings/details`) to resolve doctor names and room numbers for consultation bookings.

---

## 2. Files Belonging to This Contribution
- `source-code/controllers/doctorsController.js`: Full CRUD operations for doctors (`getAllDoctors`, `getDoctorById`, `createDoctor`, `updateDoctor`, `deleteDoctor`).
- `source-code/controllers/roomsController.js`: Full CRUD operations for consultation rooms (`getAllRooms`, `getRoomById`, `createRoom`, `updateRoom`, `deleteRoom`).
- `source-code/controllers/bookingsController.js`: Booking CRUD operations and the relational SQL JOIN endpoint (`getBookingDetails`).

---

## 3. Implementation Details & Endpoints

### 3.1 Doctor CRUD Operations
- `GET /doctors`: Returns JSON array of all registered doctors with `200 OK`.
- `GET /doctors/:id`: Retrieves doctor by primary key; returns `404 Not Found` if missing.
- `POST /doctors`: Inserts doctor record and returns `201 Created` with the newly assigned ID.
- `PUT /doctors/:id`: Updates fields; returns `200 OK` or `404 Not Found`.
- `DELETE /doctors/:id`: Removes doctor; returns `200 OK` with confirmation message.

### 3.2 Room CRUD Operations
- `GET /rooms`: Returns all consultation rooms.
- `GET /rooms/:id`: Returns room by ID or `404 Not Found`.
- `POST /rooms`: Creates room; validates unique `room_number` (`409 Conflict` on duplicate), returns `201 Created`.
- `PUT /rooms/:id`: Updates room capacity, floor, or status; returns `200 OK`.
- `DELETE /rooms/:id`: Removes room; returns `200 OK`.

### 3.3 Relational SQL JOIN Endpoint (`GET /bookings/details`)
To provide the receptionist with complete context without requiring multiple round-trip requests, `GET /bookings/details` executes an inner join:
```sql
SELECT 
    b.id AS booking_id,
    b.doctor_id,
    d.name AS doctor_name,
    d.specialization AS doctor_specialization,
    b.room_id,
    r.room_number,
    r.floor AS room_floor,
    b.start_date,
    b.end_date,
    b.start_time,
    b.end_time,
    b.status AS booking_status,
    b.created_at
FROM bookings b
INNER JOIN doctors d ON b.doctor_id = d.id
INNER JOIN rooms r ON b.room_id = r.id
ORDER BY b.start_date DESC, b.start_time ASC;
```

---

## 4. How This Contribution Integrates with the Project
This contribution connects the HTTP routing layer (Contribution 1) with the database layer (Contribution 2). It consumes validation middleware (Contribution 4) and integrates with the availability logic (Contribution 5).

---

## 5. Viva Preparation & Likely Questions
1. **Q: What is the difference between an `INNER JOIN` and a `LEFT JOIN`?**
   - *A:* An `INNER JOIN` returns only records that have matching keys across all joined tables. Since every booking in our system requires valid foreign keys referencing both `doctors` and `rooms`, `INNER JOIN` is both optimal and mathematically precise. A `LEFT JOIN` would retain bookings even if the associated doctor or room had been deleted.
2. **Q: Why return `201 Created` for `POST` instead of `200 OK`?**
   - *A:* Under the HTTP/1.1 specification (RFC 7231), status code `201 Created` explicitly signals to the client that a new resource has been persisted on the server, typically returning the newly generated identifier and resource payload.
