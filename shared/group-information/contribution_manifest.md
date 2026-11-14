# ClinicQ Health Centre - Contribution Allocation Manifest
**Course:** Backend Development Fundamentals (BDF)  
**Group ID:** YG-AIDE2B-G08 | **Section:** AIDE2B | **Theme:** Theme 23 of 30 · Consultation rooms

---

## 1. Executive Summary
This manifest details the division of responsibilities, assigned source files, implemented functions, and integration boundaries across the six group members for the **ClinicQ Health Centre Consultation Room Booking System**.

---

## 2. Allocation Table

| S.No. | Group Member | Contribution | Role | Key Files Assigned | Key Functions & Features |
|:---:|:---|:---:|:---|:---|:---|
| **1** | Member 1 [Student Name] | **Contribution 1** | Server & Routes Specialist | `server.js`, `app.js`, `routes/*.js`, `middleware/logger.js`, `middleware/errorHandler.js` | Express app initialization, router mounting, HTTP status codes, request logging, 404 & 500 handlers |
| **2** | Member 2 [Student Name] | **Contribution 2** | Database Architect | `config/db.js`, `database/schema.sql`, `database/seed.sql`, `database/init.js` | SQLite connection, `PRAGMA foreign_keys = ON`, 3 relational tables (doctors, rooms, bookings), constraints, seed records |
| **3** | Member 3 [Student Name] | **Contribution 3** | REST Endpoints Developer | `controllers/doctorsController.js`, `controllers/roomsController.js`, `controllers/bookingsController.js` | CRUD endpoints for doctors, rooms, bookings; SQL `JOIN` endpoint (`GET /bookings/details`) |
| **4** | Member 4 [Student Name] | **Contribution 4** | Validation & Search Engineer | `middleware/validate.js`, `controllers/roomsController.js` | Input validation (types, required fields), HTTP 400 responses, query parameter search (`GET /rooms?floor=2`) |
| **5** | Member 5 [Student Name] | **Contribution 5** | Twist Rule Specialist | `controllers/roomsController.js` (`getAvailableRooms`), `controllers/bookingsController.js` (conflict logic), `middleware/validate.js` | `GET /rooms/available?date=YYYY-MM-DD` via `NOT EXISTS`, end before start check -> 400, overlap conflict -> 409, Compulsory Tests 1, 2, 3 |
| **6** | Member 6 [Student Name] | **Contribution 6** | Postman & DevOps Specialist | `postman/*.json`, `test-runner.js`, `README.md` | Postman v2.1 collection with assertions, environment variables, automated test runner, instructions & viva prep |

---

## 3. Integration Architecture
Each individual contribution builds on top of shared core contracts:
- **Contribution 1** provides the Express runtime container and mounts all routers.
- **Contribution 2** supplies the relational database engine and promise query helpers (`dbAsync`).
- **Contribution 3** leverages the database to execute CRUD and relational JOIN queries.
- **Contribution 4** intercepts incoming requests with validation middleware and filters search queries.
- **Contribution 5** implements the specialized availability and non-overlapping business rules.
- **Contribution 6** validates the entire system end-to-end using automated assertions and Postman scripts.
