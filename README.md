# ClinicQ Health Centre - Consultation Room Booking System
### Backend Development Fundamentals (BDF) - Group Assignment
**Group ID:** `YG-AIDE2B-G08` | **Section:** `AIDE2B` | **Theme:** Theme 23 of 30 · Consultation rooms  
**Card:** Card 83 of 375 | **Course:** Backend Development Fundamentals (Modules 1 to 3)

---

## 1. Problem Statement & Client Brief
> *"Consultation rooms are assigned by the receptionist. Two doctors were given the same room at the same hour. Please build us a system that fixes this."*

ClinicQ Health Centre required a robust backend reservation system to manage doctors, consultation rooms, and schedule appointments without double-booking rooms. Additionally, the clinic required real-time room availability intelligence via the **"Free on this date"** assignment twist.

---

## 2. LG Group Members & Contribution Allocation

| S.No. | Group Member | Contribution Folder | Assigned Responsibility |
|:---:|:---|:---|:---|
| **1** | Member 1 [Student Name Placeholder] | `CONTRIBUTION_1_SERVER_AND_ROUTES` | **Server & Routes:** Express setup, routing architecture, status codes, logger & error handlers. |
| **2** | Member 2 [Student Name Placeholder] | `CONTRIBUTION_2_DATABASE` | **Database Architecture:** SQLite connection, `PRAGMA foreign_keys = ON`, schema, seed data & queries. |
| **3** | Member 3 [Student Name Placeholder] | `CONTRIBUTION_3_REST_ENDPOINTS` | **REST Endpoints:** CRUD operations for doctors, rooms, bookings; SQL JOIN details endpoint. |
| **4** | Member 4 [Student Name Placeholder] | `CONTRIBUTION_4_VALIDATION_AND_SEARCH` | **Validation & Search:** Input validation middleware, error messages, query search (`GET /rooms?floor=2`). |
| **5** | Member 5 [Student Name Placeholder] | `CONTRIBUTION_5_TWIST_RULE` | **Assignment Twist:** `GET /rooms/available?date=YYYY-MM-DD` via `NOT EXISTS`, overlap conflict prevention. |
| **6** | Member 6 [Student Name Placeholder] | `CONTRIBUTION_6_POSTMAN_AND_README` | **Postman & Documentation:** Postman v2.1 collection with assertions, test runner, full documentation. |

---

## 3. Project Directory Structure

```
ClinicQ_BDF_Group_Assignment/
│
├── main-project/                        # Fully integrated working application
│   ├── config/db.js                     # SQLite connection & promise wrappers
│   ├── controllers/                     # Route controllers (doctors, rooms, bookings)
│   ├── database/                        # Schema, seed SQL & init script
│   ├── middleware/                      # Request logger, input validator, error handlers
│   ├── routes/                          # Express routers (doctors, rooms, bookings)
│   ├── postman/                         # Postman collection & environment JSON
│   ├── app.js                           # Express application setup
│   ├── server.js                        # Server entry point
│   ├── test-runner.js                   # Automated 25-step test suite
│   └── package.json                     # Main dependencies
│
├── CONTRIBUTION_1_SERVER_AND_ROUTES/    # Independent pack for Member 1
│   ├── source-code/                     # Member 1 code files
│   ├── screenshots/                     # Real terminal & editor screenshots
│   ├── assessment-document/             # DOCX and PDF academic reports
│   └── README.md                        # Explanations & viva prep
│
├── CONTRIBUTION_2_DATABASE/             # Independent pack for Member 2
├── CONTRIBUTION_3_REST_ENDPOINTS/       # Independent pack for Member 3
├── CONTRIBUTION_4_VALIDATION_AND_SEARCH/# Independent pack for Member 4
├── CONTRIBUTION_5_TWIST_RULE/           # Independent pack for Member 5
├── CONTRIBUTION_6_POSTMAN_AND_README/   # Independent pack for Member 6
│
├── shared/                              # Shared resources across team
│   ├── database/                        # Central database files
│   ├── postman-collection/              # Central Postman exports
│   ├── screenshots/                     # High-res screenshots archive
│   └── group-information/               # Group manifest & original brief image
│
├── package.json                         # Root project manifest
└── README.md                            # Comprehensive project guide
```

---

## 4. Quickstart Guide

### 4.1 Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on Node.js v26.13.0)
- **npm**: v9.0.0 or higher
- **Postman**: (Optional, for manual GUI API testing)

### 4.2 Installation
Navigate to the `main-project` directory and install dependencies:
```bash
cd main-project
npm install
```

### 4.3 Database Initialization
Initialize the SQLite database with the three relational tables and verified sample seed data:
```bash
npm run init-db
```
*Output:*
```
Schema applied successfully.
Seed data inserted successfully.
Database Summary:
  - Table: doctors    | Records: 5
  - Table: rooms      | Records: 6
  - Table: bookings   | Records: 3
```

### 4.4 Start Express Server
```bash
npm start
```
The server will start listening at `http://localhost:3000`.

### 4.5 Run Automated Test Suite
To execute all 25 integration tests (including the 3 compulsory twist tests and conflict checks):
```bash
npm test
```
*Expected Result:*
```
SUMMARY: 25/25 TESTS PASSED (100.0%)
```

---

## 5. REST API Endpoints Specification

### 5.1 Doctors CRUD
- `GET /doctors`: List all doctors.
- `GET /doctors/:id`: Retrieve doctor by ID.
- `POST /doctors`: Create new doctor (`201 Created`).
- `PUT /doctors/:id`: Update doctor (`200 OK`).
- `DELETE /doctors/:id`: Delete doctor (`200 OK`).

### 5.2 Rooms CRUD & Search
- `GET /rooms`: List all consultation rooms.
- `GET /rooms?floor=2`: Filter rooms by floor (Search requirement).
- `GET /rooms/available?date=YYYY-MM-DD`: **Compulsory Twist Endpoint** listing rooms free on the date.
- `GET /rooms/:id`: Retrieve room by ID.
- `POST /rooms`: Create room (`201 Created`).
- `PUT /rooms/:id`: Update room (`200 OK`).
- `DELETE /rooms/:id`: Delete room (`200 OK`).

### 5.3 Bookings CRUD & SQL JOIN
- `GET /bookings`: List all bookings.
- `GET /bookings/details`: **Relational SQL JOIN** returning booking details with Doctor Name and Room Number.
- `GET /bookings/:id`: Retrieve booking by ID.
- `POST /bookings`: Create booking (`201 Created`, with validation & conflict prevention).
- `PUT /bookings/:id`: Update booking (`200 OK`).
- `DELETE /bookings/:id`: Delete booking (`200 OK`).

---

## 6. Verification of the 3 Compulsory Twist Test Cases

| Test Case | Scenario / Request | Expected Result | Verified Result | Status |
|:---|:---|:---|:---|:---:|
| **Test 1** | `POST /bookings`<br>Start: `2026-11-15`<br>End: `2026-11-14` | `HTTP 400 Bad Request`<br>`"End date cannot be earlier than start date."` | Status: `400`<br>Error: `"End date cannot be earlier than start date."` | **PASS** |
| **Test 2** | `GET /rooms/available?date=2026-11-11`<br>(Room 3 has active booking 10-12 Nov) | `HTTP 200 OK`<br>Room 3 must **NOT** appear in the response | Status: `200`<br>Room 3 present: `false` | **PASS** |
| **Test 3** | `GET /rooms/available?date=2026-11-13`<br>(Booking ended on 12 Nov) | `HTTP 200 OK`<br>Room 3 **MUST** appear in the response | Status: `200`<br>Room 3 present: `true` | **PASS** |

---

## 7. Submission Archives
For independent distribution to each group member and academic submission, the following archives are generated:
- `Complete_Assignment.zip`: Full repository archive.
- `Contribution_1.zip`: Member 1 submission pack.
- `Contribution_2.zip`: Member 2 submission pack.
- `Contribution_3.zip`: Member 3 submission pack.
- `Contribution_4.zip`: Member 4 submission pack.
- `Contribution_5.zip`: Member 5 submission pack.
- `Contribution_6.zip`: Member 6 submission pack.
