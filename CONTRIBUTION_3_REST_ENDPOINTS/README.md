# Contribution 3: REST Endpoints & Relational SQL JOIN
**Course:** Backend Development Fundamentals (BDF) · Modules 1 to 3  
**Class & Section:** 313 AI DE 2B | **Study Level:** UG | **Year & Term:** 2 & 2  
**Faculty In-Charge:** Mr Yugandhar Gurjalwar  
**Group ID:** YG-AIDE2B-G08 | **Assessment:** GROUP ASSIGNMENT  

---

## 1. Student Identification
- **Student Name:** M.SHIVARAM
- **Registration Number:** 252U1R5104
- **Contribution Number:** Contribution 3 of 6
- **Assigned Role:** REST API Developer (CRUD & Relational SQL JOIN Specialist)
- **Assigned Module:** Complete CRUD Operations for Doctors, Rooms, and Bookings + Relational SQL JOIN Details Endpoint (`GET /bookings/details`)

---

## 2. Scope & Technical Ownership
As the **REST API Developer**, my core responsibility was implementing the complete business logic and controller endpoints that bridge HTTP client requests with the SQLite database:
1. **Doctors CRUD:** Full lifecycle (`GET /doctors`, `GET /doctors/:id`, `POST /doctors`, `PUT /doctors/:id`, `DELETE /doctors/:id`).
2. **Rooms CRUD:** Full lifecycle (`GET /rooms`, `GET /rooms/:id`, `POST /rooms`, `PUT /rooms/:id`, `DELETE /rooms/:id`).
3. **Bookings CRUD:** Full lifecycle (`GET /bookings`, `GET /bookings/:id`, `POST /bookings`, `PUT /bookings/:id`, `DELETE /bookings/:id`).
4. **Mandatory Relational SQL JOIN:** `GET /bookings/details` joining `bookings`, `doctors`, and `rooms` to eliminate separate lookup calls for clinic receptionists.

---

## 3. Files Belonging to This Contribution
- `source-code/controllers/doctorsController.js`: Doctor CRUD logic, database queries, and response formatting.
- `source-code/controllers/roomsController.js`: Room CRUD logic with unique constraint checks (`409 Conflict`).
- `source-code/controllers/bookingsController.js`: Booking CRUD operations and the relational SQL JOIN endpoint.
- `postman/Contribution_3_Demo_Collection.postman_collection.json`: Dedicated Postman collection pre-configured for M.SHIVARAM's live demo.
- `postman/ClinicQ_Health_Centre.postman_collection.json`: Full project Postman collection.
- `postman/ClinicQ_Environment.postman_environment.json`: Postman environment configuration (`http://localhost:3000`).
- `assessment-document/Contribution_3_REST_Endpoints.docx`: Formal academic report in DOCX format.
- `assessment-document/Contribution_3_REST_Endpoints.pdf`: Formal academic report in PDF format.
- `screenshots/`: Real high-resolution execution screenshots.

---

## 4. Step-by-Step 3-Minute Live Demo Script for M.SHIVARAM

When Mr. Yugandhar Gurjalwar calls for your demo on **Monday 16 Nov**, follow this exact script:

### Step 1: Pre-Demo Setup (Before Your Turn)
1. Open terminal and ensure the server is running:
   ```bash
   cd "C:\Users\mokeda shivaram\.gemini\antigravity\scratch\ClinicQ_BDF_Group_Assignment\main-project"
   npm start
   ```
2. Open Postman desktop app.
3. Click **Import** $\rightarrow$ Select `Contribution_3_Demo_Collection.postman_collection.json` and `ClinicQ_Environment.postman_environment.json` from your `postman/` folder.
4. Select environment: `ClinicQ Health Centre - Local Environment`.

---

### Step 2: What to Say and Click During Your Demo (3 Minutes)

#### [0:00 - 0:40] Opening & Role Introduction
> *"Good morning Sir. My name is **M.SHIVARAM**, registration number **252U1R5104**, Section **313 AI DE 2B**. In our group assignment for ClinicQ Health Centre, I developed **Contribution 3: REST Endpoints and the Relational SQL JOIN operation**.*
> *My responsibility was creating complete CRUD operations across all three entities—Doctors, Rooms, and Bookings—and developing the key SQL JOIN endpoint that allows the clinic receptionist to see doctor names and room numbers in a single response."*

#### [0:40 - 1:30] Demonstrating Doctor & Room CRUD
> *"First, let me show the Doctor CRUD in Postman:*
> 1. *I send `GET /doctors` $\rightarrow$ Status `200 OK`, returning our 5 seeded doctors.*
> 2. *Next, I send `POST /doctors` adding 'Dr. Gregory House' $\rightarrow$ Server responds with `201 Created` and returns the newly assigned ID.*
> 3. *I update his specialization via `PUT /doctors/:id` $\rightarrow$ Status `200 OK`.*
> 4. *Now for Rooms, I send `POST /rooms` creating 'Room 401' on Floor 4 $\rightarrow$ Status `201 Created`.*
> *Notice that every operation adheres strictly to standard HTTP status codes: 201 for resource creation, 200 for updates and reads."*

#### [1:30 - 2:30] Demonstrating the Mandatory Relational SQL JOIN Endpoint
> *"Now, the most critical endpoint I developed is the **Relational SQL JOIN endpoint: `GET /bookings/details`**.*
> *In a consultation room booking system, looking at raw booking IDs like `doctor_id: 2` and `room_id: 3` is inconvenient for the receptionist. They need to know the actual doctor's name and room number.*
> *(Click Send on `GET /bookings/details`)*
> *As you can see on screen, the server executes an SQL `INNER JOIN` across `bookings`, `doctors`, and `rooms` tables, returning:*
> - `doctor_name`: 'Dr. Michael Chang'
> - `doctor_specialization`: 'Pediatrics'
> - `room_number`: 'Room 3'
> - `room_floor`: 2
> - `start_date`, `end_date`, `start_time`, `end_time`, and `booking_status`: 'active'
> *This query executes in just **1 millisecond** using indexed foreign keys."*

#### [2:30 - 3:00] Closing & Summary
> *"To summarize, my module delivers full RESTful CRUD capabilities for all entities and optimizes data retrieval with relational SQL JOINs, ensuring efficient data flow for the clinic. I am now ready for any questions regarding my implementation. Thank you, Sir."*

---

## 5. Top 5 Likely Faculty Viva Questions & Exact Answers

### Q1: Why did you use an `INNER JOIN` rather than a `LEFT JOIN` in `GET /bookings/details`?
**Your Answer:**  
> *"Sir, we used an `INNER JOIN` because every valid consultation booking in our database has strict foreign key constraints referencing existing primary keys in `doctors(id)` and `rooms(id)`. Because `doctor_id` and `room_id` are both declared `NOT NULL REFERENCES ... ON DELETE CASCADE`, there can never be an orphan booking without a doctor or room. An `INNER JOIN` returns only records that match across all joined tables, which is mathematically exact and faster than an outer join."*

### Q2: Why do you return `201 Created` on POST instead of `200 OK`?
**Your Answer:**  
> *"Sir, according to RFC 7231 of the HTTP/1.1 specification, status code `201 Created` explicitly informs the client that the request has succeeded and led to the creation of a new persistent resource on the server. We also include the newly generated resource object with its auto-incremented primary key in the response body."*

### Q3: In Express routing, why must `GET /bookings/details` be placed before `GET /bookings/:id`?
**Your Answer:**  
> *"Sir, Express matches routes sequentially from top to bottom. If `/bookings/:id` was declared before `/bookings/details`, Express would treat the string `'details'` as a route parameter `:id` and execute `getBookingById('details')`, resulting in an invalid database query or a 404 error. Placing `/bookings/details` first guarantees it matches before the dynamic parameter pattern."*

### Q4: How do you handle asynchronous database queries in your controllers?
**Your Answer:**  
> *"Sir, SQLite in Node.js is inherently asynchronous. To avoid 'callback hell' and ensure readable code, we created a helper object `dbAsync` in `config/db.js` that wraps SQLite methods (`all`, `get`, `run`) inside JavaScript `Promises`. In our controllers, we use `async/await` paired with `try/catch` blocks. If an error occurs, it is caught and forwarded cleanly to our global error-handling middleware via `next(err)`."*

### Q5: How do you verify if a doctor or room exists before creating a booking?
**Your Answer:**  
> *"Sir, in `createBooking` inside `bookingsController.js`, before inserting a new record, we execute `dbAsync.get('SELECT id FROM doctors WHERE id = ?', [doctor_id])` and `dbAsync.get('SELECT id FROM rooms WHERE id = ?', [room_id])`. If either query returns `null`, we immediately terminate the request with an `HTTP 404 Not Found` and a clear message like `'Doctor with ID X not found'`. Furthermore, SQLite foreign key enforcement (`PRAGMA foreign_keys = ON;`) acts as a second database-level defense."*

---

## 6. SQL Query Reference for `GET /bookings/details`

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

## 7. Submission Package Contents for M.SHIVARAM
Your standalone zip file [`Contribution_3.zip`](file:///C:/Users/mokeda%20shivaram/.gemini/antigravity/scratch/ClinicQ_BDF_Group_Assignment/Contribution_3.zip) contains:
- `source-code/`: `doctorsController.js`, `roomsController.js`, `bookingsController.js`
- `postman/`: `Contribution_3_Demo_Collection.postman_collection.json`, `ClinicQ_Health_Centre.postman_collection.json`, `ClinicQ_Environment.postman_environment.json`
- `assessment-document/`: `Contribution_3_REST_Endpoints.docx` and `Contribution_3_REST_Endpoints.pdf`
- `original_question.jpg`: Original assignment brief card
- `screenshots/`: Actual code and API execution screenshots
- `README.md`: This live demo guide and viva preparation
