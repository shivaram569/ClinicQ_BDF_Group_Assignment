# Contribution 4: Validation and Query Search
**Course:** Backend Development Fundamentals (BDF)  
**Project:** ClinicQ Health Centre - Consultation Room Booking System  
**Assigned Member:** Member 4 [Student Name Placeholder]  
**Group:** YG-AIDE2B-G08 | **Section:** AIDE2B  

---

## 1. Scope & Objective
As the **Validation and Search Engineer**, my primary responsibility was safeguarding data integrity through robust request validation middleware, providing descriptive client feedback with appropriate HTTP 400 Bad Request status codes, and implementing dynamic query parameter searching (such as filtering rooms by floor).

---

## 2. Files Belonging to This Contribution
- `source-code/middleware/validate.js`: Validation middleware interceptors (`validateDoctor`, `validateRoom`, `validateBooking`, `validateAvailableRoomsQuery`).
- `source-code/controllers/roomsController.js`: Implementation of dynamic query parameter filtering (`?floor=2` and `?status=available`).

---

## 3. Implementation Details

### 3.1 Validation Matrix

| Endpoint | Fields Validated | Rule / Constraint | Error Response | Status |
|:---|:---|:---|:---|:---:|
| `POST /doctors` | `name`, `specialization`, `phone` | Non-empty strings | `"Doctor name is required and must be a non-empty string."` | 400 |
| `POST /rooms` | `room_number`, `floor`, `capacity` | Non-empty string; integers; capacity > 0 | `"Floor must be a valid integer."` | 400 |
| `POST /bookings` | `doctor_id`, `room_id` | Positive integers | `"Doctor ID is required and must be a valid integer."` | 400 |
| `POST /bookings` | `start_date`, `end_date` | `YYYY-MM-DD` calendar format | `"Start date is required and must follow the format YYYY-MM-DD."` | 400 |
| `POST /bookings` | `end_date < start_date` | Logical chronological order | `"End date cannot be earlier than start date."` | 400 |
| `POST /bookings` | `start_time`, `end_time` | 24h `HH:MM` format; end > start if same day | `"End time must be later than start time for same-day bookings."` | 400 |
| `GET /rooms/available`| `date` query param | Mandatory `YYYY-MM-DD` | `"Query parameter 'date' is required."` | 400 |

### 3.2 Dynamic Query Parameter Searching (`GET /rooms?floor=2`)
In `roomsController.js`, queries dynamically construct SQL parameters to prevent SQL injection:
```javascript
const { floor, status } = req.query;
let sql = 'SELECT * FROM rooms WHERE 1=1';
const params = [];

if (floor !== undefined) {
    const parsedFloor = parseInt(floor, 10);
    if (isNaN(parsedFloor)) {
        return res.status(400).json({ success: false, error: 'Query parameter "floor" must be an integer.' });
    }
    sql += ' AND floor = ?';
    params.push(parsedFloor);
}

if (status) {
    sql += ' AND status = ?';
    params.push(status.trim().toLowerCase());
}

sql += ' ORDER BY floor ASC, room_number ASC';
```
When a client requests `GET /rooms?floor=2`, only consultation rooms situated on the second floor are retrieved.

---

## 4. How This Contribution Integrates with the Project
Validation middleware acts as the primary gatekeeper for the application. Any invalid or malformed request payload is intercepted immediately before hitting the database or business controllers, preventing invalid database records and unhandled exceptions.

---

## 5. Viva Preparation & Likely Questions
1. **Q: Why use middleware for validation rather than putting it inside the controller?**
   - *A:* Separation of concerns. Extracting validation into reusable Express middleware keeps controllers focused strictly on business logic and database interactions. It also allows multiple routes (e.g. `POST /rooms` and `PUT /rooms/:id`) to share the identical validation pipeline without duplicating code.
2. **Q: How does parameterized SQL protect against SQL Injection?**
   - *A:* In parameterized queries (`WHERE floor = ?`), user input is sent separately from the SQL statement structure. The database engine treats the parameters strictly as literal values rather than executable SQL commands, completely neutralizing SQL injection attacks.
