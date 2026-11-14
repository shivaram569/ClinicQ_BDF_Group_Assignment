# ClinicQ Health Centre - Contribution Allocation Manifest
**Course:** Backend Development Fundamentals (BDF) · Modules 1 to 3  
**Class & Section:** 313 AI DE 2B | **Study Level:** UG | **Year & Term:** 2 & 2  
**Faculty In-Charge:** Mr Yugandhar Gurjalwar  
**Group ID:** YG-AIDE2B-G08 | **Assessment:** GROUP ASSIGNMENT | **Theme:** Theme 23 of 30 · Consultation rooms

---

## 1. Executive Summary
This manifest details the division of responsibilities, assigned source files, implemented functions, and integration boundaries across the six group members for the **ClinicQ Health Centre Consultation Room Booking System**.

---

## 2. LG Group Members Allocation Table

| S.No. | Group Member Name | Registration No. | Contribution | Role & Responsibility | Key Files Assigned | Key Functions & Features |
|:---:|:---|:---:|:---:|:---|:---|:---|
| **1** | **m.chatish kuldeep** | `252U1R5102` | **Contribution 1** | Server & Routes Specialist | `server.js`, `app.js`, `routes/*.js`, `middleware/logger.js`, `middleware/errorHandler.js` | Express app initialization, router mounting, HTTP status codes, request logging, 404 & 500 handlers |
| **2** | **o.sai kiran** | `252U1R5116` | **Contribution 2** | Database Architect | `config/db.js`, `database/schema.sql`, `database/seed.sql`, `database/init.js` | SQLite connection, `PRAGMA foreign_keys = ON`, 3 relational tables (doctors, rooms, bookings), constraints, seed records |
| **3** | **M.SHIVARAM** | `252U1R5104` | **Contribution 3** | REST Endpoints Developer | `controllers/doctorsController.js`, `controllers/roomsController.js`, `controllers/bookingsController.js` | Complete CRUD endpoints for doctors, rooms, bookings; SQL `JOIN` endpoint (`GET /bookings/details`) |
| **4** | **k.harshith** | `252U1R5083` | **Contribution 4** | Validation & Search Engineer | `middleware/validate.js`, `controllers/roomsController.js` | Input validation (types, required fields), HTTP 400 responses, query parameter search (`GET /rooms?floor=2`) |
| **5** | **n.bhupal reddy** | `252U1R5114` | **Contribution 5** | Twist Rule Specialist | `controllers/roomsController.js` (`getAvailableRooms`), `controllers/bookingsController.js` (conflict logic), `middleware/validate.js` | `GET /rooms/available?date=YYYY-MM-DD` via `NOT EXISTS`, end before start check -> 400, overlap conflict -> 409, Compulsory Tests 1, 2, 3 |
| **6** | **k.lava kumar** | `252U1R5086` | **Contribution 6** | Postman & DevOps Specialist | `postman/*.json`, `test-runner.js`, `README.md` | Postman v2.1 collection with assertions, environment variables, automated test runner, instructions & viva prep |

---

## 3. Integration Architecture
Each individual contribution builds on top of shared core contracts:
- **Contribution 1 (m.chatish kuldeep):** Provides the Express runtime container and mounts all routers.
- **Contribution 2 (o.sai kiran):** Supplies the relational database engine and promise query helpers (`dbAsync`).
- **Contribution 3 (M.SHIVARAM):** Leverages the database to execute complete CRUD and relational JOIN queries (`GET /bookings/details`).
- **Contribution 4 (k.harshith):** Intercepts incoming requests with validation middleware and filters search queries.
- **Contribution 5 (n.bhupal reddy):** Implements the specialized availability and non-overlapping business rules.
- **Contribution 6 (k.lava kumar):** Validates the entire system end-to-end using automated assertions and Postman scripts.
