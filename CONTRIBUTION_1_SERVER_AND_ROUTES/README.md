# Contribution 1: Server and Routes
**Course:** Backend Development Fundamentals (BDF) · Modules 1 to 3  
**Project:** ClinicQ Health Centre - Consultation Room Booking System  
**Student Name:** m.chatish kuldeep  
**Registration Number:** 252U1R5102  
**Class & Section:** 313 AI DE 2B | **Study Level:** UG | **Year & Term:** 2 & 2  
**Faculty In-Charge:** Mr Yugandhar Gurjalwar  
**Group ID:** YG-AIDE2B-G08  

---

## 1. Scope & Objective
As the **Server and Routes Specialist**, my primary responsibility was architecting the foundational Node.js and Express.js application container, configuring standard middleware, establishing modular route controllers, enforcing standardized HTTP status codes, and guaranteeing centralized error handling.

---

## 2. Files Belonging to This Contribution
- `source-code/server.js`: Server lifecycle entry point, environment port configuration, graceful termination listeners (`SIGTERM`/`SIGINT`).
- `source-code/app.js`: Express application initialization, CORS, JSON body-parser, route mounting, 404 handler, and global error middleware.
- `source-code/routes/doctorRoutes.js`: Routing definitions for Doctor CRUD (`/doctors`).
- `source-code/routes/roomRoutes.js`: Routing definitions for Room CRUD and availability (`/rooms`).
- `source-code/routes/bookingRoutes.js`: Routing definitions for Booking CRUD and details (`/bookings`).
- `source-code/middleware/logger.js`: Custom terminal logger capturing HTTP method, path, response status codes, and execution duration in milliseconds.
- `source-code/middleware/errorHandler.js`: Centralized error dispatcher catching 404 Not Found, 400 Bad Request, 409 Conflict, and 500 Internal Server errors.

---

## 3. Implementation Details & Architecture

### 3.1 Route Separation & Ordering
To prevent route collision, dynamic parameter routes (`/:id`) are positioned strictly after static endpoint identifiers:
```javascript
// Room Routes Ordering:
router.get('/', getAllRooms);
router.get('/available', validateAvailableRoomsQuery, getAvailableRooms); // Placed before /:id
router.get('/:id', getRoomById);

// Booking Routes Ordering:
router.get('/', getAllBookings);
router.get('/details', getBookingDetails); // Placed before /:id
router.get('/:id', getBookingById);
```
If `/available` or `/details` were defined below `/:id`, Express would erroneously match `"available"` as the `req.params.id`.

### 3.2 Standardized HTTP Status Codes
- `200 OK`: Successful retrieval (`GET`) and modification (`PUT`, `DELETE`).
- `201 Created`: Successful resource creation (`POST /doctors`, `POST /rooms`, `POST /bookings`).
- `400 Bad Request`: Input validation failures and client syntax errors.
- `404 Not Found`: Target resource identifier absent in the database.
- `409 Conflict`: Business logic conflicts (duplicate room number or overlapping booking times).
- `500 Internal Server Error`: Unhandled server runtime exceptions.

---

## 4. How This Contribution Integrates with the Project
This contribution serves as the backbone of ClinicQ. All database operations (Contribution 2), business logic and controllers (Contribution 3 & 5), and input validators (Contribution 4) are registered into this Express pipeline.

---

## 5. Viva Preparation & Likely Questions
1. **Q: Why did you separate `server.js` and `app.js`?**
   - *A:* Separation of concerns. `app.js` encapsulates the Express application logic, routes, and middleware without binding to a network port, making it straightforward to import into automated unit test runners (`test-runner.js`) without port conflicts. `server.js` strictly handles network binding and process lifecycle.
2. **Q: How does Express middleware execution work?**
   - *A:* Middleware functions execute sequentially in the order defined by `app.use()`. Each function receives `(req, res, next)` and either terminates the request-response cycle or calls `next()` to pass control to the subsequent middleware.
