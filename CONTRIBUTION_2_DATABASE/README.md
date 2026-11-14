# Contribution 2: Database Architecture & Relational Integrity
**Course:** Backend Development Fundamentals (BDF)  
**Project:** ClinicQ Health Centre - Consultation Room Booking System  
**Assigned Member:** Member 2 [Student Name Placeholder]  
**Group:** YG-AIDE2B-G08 | **Section:** AIDE2B  

---

## 1. Scope & Objective
As the **Database Architect**, my primary responsibility was designing, implementing, and enforcing relational integrity for the SQLite database across the three core tables: `doctors`, `rooms`, and `bookings`. This included schema design, primary and foreign key constraints, cascading rules, database initialization routines, and realistic sample data generation.

---

## 2. Files Belonging to This Contribution
- `source-code/config/db.js`: SQLite connection pool configuration, automatic `PRAGMA foreign_keys = ON` execution, and asynchronous promise query wrappers (`dbAsync.all`, `dbAsync.get`, `dbAsync.run`).
- `source-code/database/schema.sql`: DDL script defining tables, data types, primary keys, foreign key constraints, and indexing.
- `source-code/database/seed.sql`: DML script inserting realistic seed data for doctors, rooms (including Room 3), and verified bookings.
- `source-code/database/init.js`: Standalone automated execution script for resetting and verifying database state.

---

## 3. Relational Schema Design

```
+-----------------------------------+        +-----------------------------------+
|              doctors              |        |               rooms               |
+-----------------------------------+        +-----------------------------------+
| id (PK, AUTOINCREMENT)            |        | id (PK, AUTOINCREMENT)            |
| name TEXT NOT NULL                |        | room_number TEXT NOT NULL UNIQUE  |
| specialization TEXT NOT NULL      |        | floor INTEGER NOT NULL            |
| phone TEXT NOT NULL               |        | capacity INTEGER NOT NULL         |
| created_at DATETIME DEFAULT NOW   |        | status TEXT DEFAULT 'available'   |
+-----------------+-----------------+        | created_at DATETIME DEFAULT NOW   |
                  |                          +-----------------+-----------------+
                  | 1                                          | 1
                  |                                            |
                  |            +-------------------+           |
                  +----------> |     bookings      | <---------+
                             N +-------------------+ N
                               | id (PK, AUTO)     |
                               | doctor_id (FK)    |
                               | room_id (FK)      |
                               | start_date TEXT   |
                               | end_date TEXT     |
                               | start_time TEXT   |
                               | end_time TEXT     |
                               | status TEXT       |
                               | created_at DATETIME
                               +-------------------+
```

### 3.1 Foreign Key Enforcement
By default, SQLite does not enforce foreign keys unless explicitly activated. In `config/db.js`, the connection immediately runs:
```javascript
db.run('PRAGMA foreign_keys = ON;', (pragmaErr) => { ... });
```
This guarantees that an insertion into `bookings` referencing a non-existent `doctor_id` or `room_id` will fail with an SQLite constraint error.

### 3.2 Cascading Actions
Foreign keys in `bookings` declare `ON DELETE CASCADE`:
```sql
FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
```
If a doctor or room record is deleted, orphan booking rows are automatically eliminated.

---

## 4. How This Contribution Integrates with the Project
The database layer serves as the single source of truth for the entire application. All controller functions across Contributions 3, 4, and 5 query the database through the standardized `dbAsync` helper methods.

---

## 5. Viva Preparation & Likely Questions
1. **Q: Why is `PRAGMA foreign_keys = ON;` required in SQLite?**
   - *A:* For historical backward compatibility, SQLite ships with foreign key enforcement disabled by default. It must be explicitly enabled per database connection so that relational constraints (`FOREIGN KEY`) prevent orphan records.
2. **Q: Why are dates stored as `TEXT` in SQLite?**
   - *A:* SQLite does not have a dedicated `DATETIME` storage class. It provides built-in date and time functions that operate on ISO-8601 strings formatted as `YYYY-MM-DD`. Storing dates in `YYYY-MM-DD` allows lexicographical string comparisons (`start_date <= ? AND end_date >= ?`) which are fast and accurate.
