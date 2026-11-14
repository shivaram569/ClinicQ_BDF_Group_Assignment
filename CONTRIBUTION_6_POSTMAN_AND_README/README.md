# Contribution 6: Postman Testing, Automation & Project Documentation
**Course:** Backend Development Fundamentals (BDF)  
**Project:** ClinicQ Health Centre - Consultation Room Booking System  
**Assigned Member:** Member 6 [Student Name Placeholder]  
**Group:** YG-AIDE2B-G08 | **Section:** AIDE2B  

---

## 1. Scope & Objective
As the **QA, Postman & Documentation Specialist**, my responsibility was establishing the complete end-to-end testing suite for the ClinicQ API. This included building the Postman v2.1 collection with automated assertion scripts, configuring dynamic environment variables, creating an automated command-line test runner (`test-runner.js`), authoring comprehensive developer documentation, and packaging individual submission deliverables.

---

## 2. Files Belonging to This Contribution
- `source-code/postman/ClinicQ_Health_Centre.postman_collection.json`: Complete Postman v2.1 collection containing 16 test requests organized into 4 distinct folders with test scripts and JSON schema assertions.
- `source-code/postman/ClinicQ_Environment.postman_environment.json`: Postman environment configuration file containing `base_url` (`http://localhost:3000`) and dynamic entity IDs.
- `source-code/test-runner.js`: Automated CLI test harness executing all 25 integration assertions.
- `README.md`: This comprehensive testing and deployment documentation.

---

## 3. Postman Collection Architecture

### 3.1 Folder Structure
1. `00 - Health & Documentation`: Root health check and API descriptor validation.
2. `01 - Doctors Endpoints`: Full CRUD testing for Doctor records (`GET`, `POST`, `PUT`, `DELETE`).
3. `02 - Rooms Endpoints`: Full CRUD testing for Rooms, plus query search (`GET /rooms?floor=2`).
4. `03 - Bookings & SQL JOIN Endpoints`: Booking lifecycle and relational JOIN (`GET /bookings/details`).
5. `04 - Assignment Twist & Conflict Tests`:
   - Compulsory Test 1: End before start -> `400 Bad Request`.
   - Compulsory Test 2: Date 2026-11-11 -> Room 3 absent (`200 OK`).
   - Compulsory Test 3: Date 2026-11-13 -> Room 3 present (`200 OK`).
   - Conflict Test: Double booking attempt -> `409 Conflict`.

### 3.2 Sample Postman Test Script
Each request in the collection incorporates automated JavaScript assertions:
```javascript
pm.test("Status code is 200 OK", function () {
    pm.response.to.have.status(200);
});

pm.test("Room 3 is NOT in available rooms list", function () {
    var jsonData = pm.response.json();
    var hasRoom3 = jsonData.data.some(function(r) { 
        return r.id === 3 || r.room_number === 'Room 3'; 
    });
    pm.expect(hasRoom3).to.be.false;
});
```

---

## 4. How to Import and Run in Postman
1. Open the Postman desktop application.
2. Click the **Import** button in the top left corner.
3. Select `ClinicQ_Health_Centre.postman_collection.json` and `ClinicQ_Environment.postman_environment.json`.
4. Ensure the active environment is set to `ClinicQ Health Centre - Local Environment`.
5. Ensure the ClinicQ Express server is running on `http://localhost:3000`.
6. Open the Collection Runner, click **Run ClinicQ Health Centre**, and verify that all tests pass.

---

## 5. Automated CLI Testing (`npm test`)
To run the automated suite directly from the terminal without Postman:
```bash
cd main-project
npm test
```
Result: **25/25 Tests Passing (100% Success Rate)**.

---

## 6. Viva Preparation & Likely Questions
1. **Q: How does the Postman collection handle dynamic variables between requests?**
   - *A:* In Postman test scripts, `pm.environment.set('created_doctor_id', jsonData.data.id)` extracts the ID returned by `POST /doctors` and stores it into the active environment. Subsequent `PUT` and `DELETE` requests reference this variable via `{{created_doctor_id}}`.
2. **Q: Why is automated API testing essential for backend engineering?**
   - *A:* Automated API testing catches regressions instantly whenever database schemas or route controllers change, ensures adherence to HTTP standards, and provides verifiable proof that business rules and edge cases are enforced.
