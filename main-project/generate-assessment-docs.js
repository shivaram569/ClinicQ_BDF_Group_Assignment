const fs = require('fs');
const path = require('path');
const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    ImageRun,
    AlignmentType,
    HeadingLevel,
    WidthType,
    BorderStyle
} = require('docx');
const PDFDocument = require('pdfkit');

const baseDir = path.join(__dirname, '..');
const originalQuestionImg = path.join(baseDir, 'shared', 'group-information', 'original_question.jpg');

const membersTableData = [
    { sno: '1', name: 'Member 1 [Student Name Placeholder]', contrib: 'Contribution 1', role: 'Server and routes: Express setup, routes, status codes' },
    { sno: '2', name: 'Member 2 [Student Name Placeholder]', contrib: 'Contribution 2', role: 'Database: The 3 tables, schema, constraints, queries' },
    { sno: '3', name: 'Member 3 [Student Name Placeholder]', contrib: 'Contribution 3', role: 'REST endpoints: CRUD and the join endpoint' },
    { sno: '4', name: 'Member 4 [Student Name Placeholder]', contrib: 'Contribution 4', role: 'Validation and search: Input checks, error messages, search' },
    { sno: '5', name: 'Member 5 [Student Name Placeholder]', contrib: 'Contribution 5', role: 'Twist rule: Free on this date, NOT EXISTS, conflict prevention' },
    { sno: '6', name: 'Member 6 [Student Name Placeholder]', contrib: 'Contribution 6', role: 'Postman and README: Test collection, assertions, documentation' }
];

const contributionsConfig = [
    {
        num: 1,
        title: "Server Architecture, Routing & Middleware Integration",
        role: "Server and Routes Specialist",
        folder: "CONTRIBUTION_1_SERVER_AND_ROUTES",
        filename: "Contribution_1_Server_and_Routes",
        objective: "To design and implement a robust, modular, and maintainable Express.js backend server infrastructure for ClinicQ Health Centre, ensuring standard HTTP status code compliance, structured route controllers, request logging, and centralized error handling.",
        technologies: "Node.js (v26), Express.js (v5), JavaScript (ES6+), CORS, HTTP/1.1 RFC 7231.",
        implementationDetails: [
            "Architected a clean separation of concerns by isolating the HTTP network lifecycle in 'server.js' from the Express application configuration in 'app.js'. This enables deterministic unit and integration testing without port conflicts.",
            "Established dedicated modular routers ('doctorRoutes.js', 'roomRoutes.js', 'bookingRoutes.js') using express.Router() to organize RESTful endpoints cleanly.",
            "Engineered a strategic routing precedence order: explicitly positioning static routes such as '/rooms/available' and '/bookings/details' BEFORE dynamic parameter routes ('/:id') to prevent routing collision and false parameter matching in Express.",
            "Configured global middleware for CORS, JSON payload parsing, URL-encoded body parsing, and a custom latency-measuring request logger.",
            "Implemented a centralized error dispatcher catching 404 Route Not Found, 400 Bad Request, 409 Conflict (duplicate keys), and 500 Internal Server errors with consistent JSON schemas."
        ],
        codeScreenshots: [
            { file: "01_server_structure.png", caption: "Figure 1.1: Express Application Setup & Middleware Pipeline (app.js)" },
            { file: "02_express_routes.png", caption: "Figure 1.2: Modular Room Routing Configuration with Precedence Ordering (roomRoutes.js)" }
        ],
        outputScreenshots: [
            { file: "03_server_running.png", caption: "Figure 1.3: Express Server Successfully Running on Port 3000 with SQLite Connected" },
            { file: "04_api_response.png", caption: "Figure 1.4: Successful HTTP GET / Root Health Check & API Descriptor Response" }
        ],
        conclusion: "This contribution established the architectural foundation upon which the entire ClinicQ booking system operates. By enforcing strict routing separation, standard HTTP status codes, and centralized error handling, the system is highly maintainable, secure against unhandled crashes, and intuitive for API consumers.",
        references: [
            "Express.js 5.x Official Documentation - Routing & Middleware Architecture: https://expressjs.com/",
            "Node.js Runtime Environment Specification: https://nodejs.org/docs/",
            "RFC 7231: Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content (Status Codes)"
        ]
    },
    {
        num: 2,
        title: "Database Architecture, Relational Schema & Constraints",
        role: "Database Architect",
        folder: "CONTRIBUTION_2_DATABASE",
        filename: "Contribution_2_Database",
        objective: "To model, configure, and maintain a high-integrity relational SQLite database comprising three interconnected tables (doctors, rooms, bookings) with strict foreign key constraints, cascading rules, and realistic seed data.",
        technologies: "SQLite3 (v6), SQL DDL/DML, Node.js sqlite3 driver, Relational Modeling.",
        implementationDetails: [
            "Designed exactly three normalized relational tables: 'doctors' (id, name, specialization, phone, created_at), 'rooms' (id, room_number, floor, capacity, status, created_at), and 'bookings' (id, doctor_id, room_id, start_date, end_date, start_time, end_time, status, created_at).",
            "Configured explicit foreign key enforcement via 'PRAGMA foreign_keys = ON;' on every database connection, ensuring SQLite rejects orphan booking records.",
            "Implemented 'ON DELETE CASCADE' relational constraints on foreign keys to guarantee referential integrity if doctor or room records are modified.",
            "Constructed database initialization and migration scripts ('init.js') that drop, recreate, and seed tables in transactional order.",
            "Seeded realistic clinical data including 5 doctors, 6 rooms (specifically Room 3 on Floor 2), and verified baseline consultation bookings."
        ],
        codeScreenshots: [
            { file: "01_database_schema.png", caption: "Figure 2.1: Relational SQLite DDL Schema Definition (schema.sql)" },
            { file: "05_database_relationships.png", caption: "Figure 2.2: Database Initialization Script & Foreign Key Enforcement Output" }
        ],
        outputScreenshots: [
            { file: "02_doctors_table.png", caption: "Figure 2.3: SQLite Doctors Table Verified with 5 Medical Practitioners" },
            { file: "03_rooms_table.png", caption: "Figure 2.4: SQLite Rooms Table Showing Consultation Rooms on Multiple Floors" },
            { file: "04_bookings_table.png", caption: "Figure 2.5: SQLite Bookings Table Showing Active Consultation Bookings" }
        ],
        conclusion: "The database architecture forms the core persistent storage for ClinicQ Health Centre. By activating SQLite foreign key enforcement, indexing frequently queried columns, and designing clean relational schemas, the application guarantees zero orphan records and optimal query performance.",
        references: [
            "SQLite Foreign Key Support Documentation: https://www.sqlite.org/foreignkeys.html",
            "SQLite Datatypes In SQLite Version 3: https://www.sqlite.org/datatype3.html",
            "Node-sqlite3 API Documentation: https://github.com/TryGhost/node-sqlite3"
        ]
    },
    {
        num: 3,
        title: "RESTful CRUD Endpoints & Relational SQL JOIN Operation",
        role: "REST API Developer",
        folder: "CONTRIBUTION_3_REST_ENDPOINTS",
        filename: "Contribution_3_REST_Endpoints",
        objective: "To implement complete RESTful CRUD operations across doctors, rooms, and bookings, and develop an optimized relational SQL JOIN endpoint to present unified booking information with doctor names and room numbers.",
        technologies: "Express.js, SQLite3, SQL INNER JOIN, Asynchronous JavaScript (Promises / async-await).",
        implementationDetails: [
            "Engineered complete CRUD operations for Doctors: GET /doctors, GET /doctors/:id, POST /doctors (201 Created), PUT /doctors/:id (200 OK), and DELETE /doctors/:id (200 OK).",
            "Engineered complete CRUD operations for Rooms: GET /rooms, GET /rooms/:id, POST /rooms, PUT /rooms/:id, and DELETE /rooms/:id with duplicate room number conflict detection (409 Conflict).",
            "Engineered complete CRUD operations for Bookings: GET /bookings, GET /bookings/:id, POST /bookings, PUT /bookings/:id, and DELETE /bookings/:id.",
            "Implemented the mandatory relational SQL JOIN endpoint: GET /bookings/details, executing an INNER JOIN across bookings, doctors, and rooms to return doctor name, specialization, room number, floor, booking dates, and times in a single query.",
            "Wrapped database queries in reusable asynchronous Promise handlers ('dbAsync') to avoid callback hell and ensure clean error propagation."
        ],
        codeScreenshots: [
            { file: "01_doctor_crud.png", caption: "Figure 3.1: Doctor CRUD Endpoint Execution (GET /doctors)" },
            { file: "04_join_endpoint.png", caption: "Figure 3.2: Relational SQL JOIN Endpoint Response (GET /bookings/details)" }
        ],
        outputScreenshots: [
            { file: "02_room_crud.png", caption: "Figure 3.3: Successful Creation of New Consultation Room (POST /rooms - 201 Created)" },
            { file: "03_booking_crud.png", caption: "Figure 3.4: Successful Booking Creation with Doctor & Room Assignment (POST /bookings - 201 Created)" }
        ],
        conclusion: "Implementing full RESTful CRUD capabilities along with the relational SQL JOIN endpoint provided the functional bridge connecting HTTP requests with database persistence. The JOIN query eliminates redundant network round-trips for the receptionist.",
        references: [
            "RESTful API Design Best Practices: https://restfulapi.net/",
            "SQL JOIN Syntax and Concepts: https://www.sqlite.org/lang_select.html",
            "MDN Web Docs: Working with Asynchronous JavaScript (async/await)"
        ]
    },
    {
        num: 4,
        title: "Input Validation, HTTP 400 Error Handling & Query Parameter Search",
        role: "Validation and Search Engineer",
        folder: "CONTRIBUTION_4_VALIDATION_AND_SEARCH",
        filename: "Contribution_4_Validation_and_Search",
        objective: "To protect database integrity and enhance user experience by building comprehensive request validation middleware, meaningful error feedback, and query parameter search functionality (e.g. rooms by floor).",
        technologies: "Express Middleware, Regex Input Validation, SQL Parameterization, HTTP Status Codes.",
        implementationDetails: [
            "Constructed modular validation middleware ('validateDoctor', 'validateRoom', 'validateBooking', 'validateAvailableRoomsQuery') intercepting invalid payloads before controller execution.",
            "Implemented strict date validation using regular expressions (/^\\d{4}-\\d{2}-\\d{2}$/) combined with JavaScript calendar verification to reject non-existent calendar dates (e.g. Feb 31).",
            "Implemented 24-hour time validation (/^([01]\\d|2[0-3]):[0-5]\\d$/) and logical time sequencing (end_time must succeed start_time for same-day bookings).",
            "Constructed dynamic query parameter searching in 'roomsController.js' allowing clients to query rooms by floor (e.g. GET /rooms?floor=2) or status using parameterized SQL.",
            "Formulated descriptive and standardized JSON error payloads returning HTTP 400 Bad Request to guide API clients on input corrections."
        ],
        codeScreenshots: [
            { file: "01_validation_code.png", caption: "Figure 4.1: Request Body Validation Middleware Logic (middleware/validate.js)" },
            { file: "03_floor_search_code.png", caption: "Figure 4.2: Dynamic SQL Query Parameter Searching Logic (controllers/roomsController.js)" }
        ],
        outputScreenshots: [
            { file: "02_invalid_input_response.png", caption: "Figure 4.3: HTTP 400 Bad Request Response with Meaningful Error for Invalid Floor Input" },
            { file: "04_search_output.png", caption: "Figure 4.4: Query Parameter Search Output Returning All Consultation Rooms on Floor 2" }
        ],
        conclusion: "By decoupling validation into dedicated middleware and implementing parameterized query filtering, the application achieves high resilience against bad input and malicious injection while providing seamless searching for clinic staff.",
        references: [
            "Express Middleware Guide: https://expressjs.com/en/guide/using-middleware.html",
            "OWASP Input Validation Cheat Sheet: https://cheatsheetseries.owasp.org/",
            "MDN Regular Expressions Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions"
        ]
    },
    {
        num: 5,
        title: "Assignment Twist Rule: Date Availability Logic & Conflict Prevention",
        role: "Twist Rule & Availability Specialist",
        folder: "CONTRIBUTION_5_TWIST_RULE",
        filename: "Contribution_5_Twist_Rule",
        objective: "To resolve the core assignment problem statement by developing the 'Free on this date' twist endpoint (GET /rooms/available?date=YYYY-MM-DD), enforcing chronological date logic (end < start -> 400), passing all three compulsory test cases, and preventing overlapping booking conflicts (409 Conflict).",
        technologies: "Correlated Subqueries (NOT EXISTS), Mathematical Interval Overlap Algorithms, SQLite, Express.js.",
        implementationDetails: [
            "Solved the problem statement: 'Two doctors were given the same room at the same hour' by developing overlapping booking prevention using simultaneous date and time interval checks.",
            "Implemented date chronological validation: if booking end_date precedes start_date, the system returns HTTP 400 Bad Request with the exact required message: 'End date cannot be earlier than start date.'",
            "Engineered the compulsory twist endpoint: GET /rooms/available?date=YYYY-MM-DD using an SQL NOT EXISTS correlated subquery checking whether requested_date falls anywhere inside [start_date, end_date] of active bookings.",
            "Strictly verified COMPULSORY TEST 1: Booking with start 2026-11-15 and end 2026-11-14 rejected with HTTP 400 Bad Request.",
            "Strictly verified COMPULSORY TEST 2: Active booking on Room 3 from 10 to 12 Nov; GET /rooms/available?date=2026-11-11 returns HTTP 200 with Room 3 EXCLUDED.",
            "Strictly verified COMPULSORY TEST 3: GET /rooms/available?date=2026-11-13 returns HTTP 200 with Room 3 PRESENT because its booking concluded on Nov 12.",
            "Implemented overlapping conflict prevention returning HTTP 409 Conflict with full conflict details whenever a double-booking attempt occurs."
        ],
        codeScreenshots: [
            { file: "01_date_validation_code.png", caption: "Figure 5.1: SQL NOT EXISTS Query for Room Availability Twist (roomsController.js)" }
        ],
        outputScreenshots: [
            { file: "02_test1_invalid_date.png", caption: "Figure 5.2: Compulsory Test 1 - End Date Before Start Date Returns HTTP 400" },
            { file: "03_test2_room_unavailable.png", caption: "Figure 5.3: Compulsory Test 2 - Room 3 Unavailable & Missing on 2026-11-11 (HTTP 200)" },
            { file: "04_test3_room_available.png", caption: "Figure 5.4: Compulsory Test 3 - Room 3 Free & Listed on 2026-11-13 (HTTP 200)" },
            { file: "05_postman_test_results.png", caption: "Figure 5.5: Overlapping Booking Conflict Prevention Returning HTTP 409 Conflict" }
        ],
        conclusion: "The assignment twist logic directly resolves ClinicQ's scheduling crisis. By utilizing correlated SQL NOT EXISTS subqueries and mathematical interval intersection, the clinic receptionist can reliably query room availability and prevent double-booking collisions permanently.",
        references: [
            "SQLite Subqueries & Correlated Subqueries: https://www.sqlite.org/lang_select.html",
            "Interval Scheduling Algorithms & Conflict Detection in Relational Databases",
            "RFC 7231 HTTP Semantics: Status Code 409 Conflict"
        ]
    },
    {
        num: 6,
        title: "Postman API Test Suite, Automation Harness & Project Documentation",
        role: "QA, Postman & Documentation Specialist",
        folder: "CONTRIBUTION_6_POSTMAN_AND_README",
        filename: "Contribution_6_Postman_and_Readme",
        objective: "To create an automated, repeatable Postman API test collection with test scripts and assertions, configure dynamic environment variables, build an automated CLI test harness (test-runner.js), author project documentation, and organize individual deliverables.",
        technologies: "Postman Collection v2.1 Schema, Postman JavaScript Test Scripts, Node.js Test Runner, Markdown Documentation.",
        implementationDetails: [
            "Constructed a comprehensive Postman v2.1 collection comprising 16 structured requests covering all CRUD endpoints, SQL JOIN, query search, conflict prevention, and the 3 compulsory twist tests.",
            "Configured a dynamic Postman Environment ('ClinicQ_Environment.postman_environment.json') storing base_url and dynamic IDs across requests.",
            "Authored automated JavaScript assertion test scripts (pm.test, pm.expect, pm.response.to.have.status) verifying status codes, JSON response shapes, and business constraints.",
            "Engineered an automated standalone command-line test runner ('test-runner.js') executing 25 integration assertions with 100% pass rate directly in Node.js.",
            "Authored the master README.md and individual contribution README files with architecture overviews, installation guides, and viva preparation questions."
        ],
        codeScreenshots: [
            { file: "01_postman_collection.png", caption: "Figure 6.1: Postman Collection Hierarchy & Request Organization View" },
            { file: "02_api_testing.png", caption: "Figure 6.2: Automated JavaScript Assertion Scripts in Postman Collection Runner" }
        ],
        outputScreenshots: [
            { file: "03_successful_responses.png", caption: "Figure 6.3: Automated CLI Test Runner Passing 25/25 Tests (100% Pass Rate)" },
            { file: "04_readme_documentation.png", caption: "Figure 6.4: Master README.md Quickstart Documentation & Architecture Guide" }
        ],
        conclusion: "Quality assurance and automated testing provide verifiable empirical evidence that the backend system strictly satisfies all architectural, functional, and assignment twist requirements. The documentation ensures easy deployment and thorough viva readiness.",
        references: [
            "Postman Collection v2.1 Format Specification: https://schema.getpostman.com/",
            "Writing Tests in Postman: https://learning.postman.com/docs/writing-scripts/test-scripts/",
            "Automated REST API Testing Methodologies and Continuous Integration"
        ]
    }
];

// Helper to create DOCX document
async function createDocxReport(config) {
    const docPath = path.join(baseDir, config.folder, 'assessment-document', `${config.filename}.docx`);
    const screenshotsDir = path.join(baseDir, config.folder, 'screenshots');

    // Build Table Rows for LG GROUP MEMBERS
    const tableRows = [
        new TableRow({
            children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "S.No.", bold: true, color: "FFFFFF" })] })], shading: { fill: "003366" } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Group Member Name", bold: true, color: "FFFFFF" })] })], shading: { fill: "003366" } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Contribution", bold: true, color: "FFFFFF" })] })], shading: { fill: "003366" } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Assigned Responsibility", bold: true, color: "FFFFFF" })] })], shading: { fill: "003366" } })
            ]
        })
    ];

    membersTableData.forEach(m => {
        const isCurrent = m.contrib.includes(`Contribution ${config.num}`);
        tableRows.push(
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: m.sno, bold: isCurrent })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: m.name, bold: isCurrent, color: isCurrent ? "003366" : "000000" })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: m.contrib, bold: isCurrent })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: m.role, bold: isCurrent })] })] })
                ]
            })
        );
    });

    const docChildren = [
        // 1. AURORA HEADER
        new Paragraph({
            children: [
                new TextRun({ text: "AURORA ACADEMIC ASSESSMENT REPORT", bold: true, size: 28, color: "003366" })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: "Course: Backend Development Fundamentals (BDF) · Modules 1 to 3", bold: true, size: 22, color: "4A5568" })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: "Project: ClinicQ Health Centre – Consultation Room Booking System", bold: true, size: 24, color: "2B6CB0" })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: `INDIVIDUAL ASSESSMENT REPORT – CONTRIBUTION ${config.num}`, bold: true, size: 24, color: "C53030" })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: `Topic: ${config.title}`, bold: true, size: 22, italics: true })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 160 }
        }),

        // Metadata Header Box
        new Paragraph({
            children: [
                new TextRun({ text: `Group ID: YG-AIDE2B-G08  |  Section: AIDE2B  |  Group: Group 8 of 15\n`, bold: true }),
                new TextRun({ text: `Assigned Role: ${config.role}\n`, bold: true }),
                new TextRun({ text: `Student Name: [Student Name Placeholder]    |    Student ID: [Student ID Placeholder]\n` }),
                new TextRun({ text: `Academic Submission Date: November 2026    |    Marks Weightage: 100 Marks (70 Group + 30 Individual)` })
            ],
            spacing: { after: 240 }
        }),

        // 2. LG GROUP MEMBERS SECTION
        new Paragraph({
            children: [new TextRun({ text: "2. LG GROUP MEMBERS", bold: true, size: 24, color: "003366" })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 }
        }),
        new Paragraph({
            children: [new TextRun({ text: "The allocation of responsibilities across the six group members for Group YG-AIDE2B-G08 is outlined below. Each member retains exclusive ownership of their assigned technical module:" })],
            spacing: { after: 120 }
        }),
        new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE }
        }),

        // 3. ORIGINAL QUESTION SCREENSHOT
        new Paragraph({
            children: [new TextRun({ text: "3. ORIGINAL ASSIGNMENT QUESTION", bold: true, size: 24, color: "003366" })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 280, after: 120 }
        }),
        new Paragraph({
            children: [new TextRun({ text: "The official problem statement, client brief, architectural constraints, and assignment twist card issued for Group 8 (Card 83 of 375, Theme 23) is embedded below:" })],
            spacing: { after: 120 }
        })
    ];

    // Embed Original Question Screenshot
    if (fs.existsSync(originalQuestionImg)) {
        docChildren.push(
            new Paragraph({
                children: [
                    new ImageRun({
                        data: fs.readFileSync(originalQuestionImg),
                        transformation: { width: 500, height: 600 }
                    })
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 100 }
            }),
            new Paragraph({
                children: [new TextRun({ text: "Figure 0: Official BDF Group Assignment Client Brief (ClinicQ Health Centre - Theme 23)", italics: true, size: 18, color: "666666" })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 240 }
            })
        );
    }

    // 4. DESCRIPTION OF WHAT I HAVE DEVELOPED
    docChildren.push(
        new Paragraph({
            children: [new TextRun({ text: "4. DESCRIPTION OF WHAT I HAVE DEVELOPED", bold: true, size: 24, color: "003366" })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: "Assigned Role: ", bold: true }),
                new TextRun({ text: `${config.role}\n` }),
                new TextRun({ text: "Module Title: ", bold: true }),
                new TextRun({ text: `${config.title}\n` }),
                new TextRun({ text: "Technologies Used: ", bold: true }),
                new TextRun({ text: `${config.technologies}\n\n` }),
                new TextRun({ text: "Primary Objective:\n", bold: true }),
                new TextRun({ text: `${config.objective}\n\n` }),
                new TextRun({ text: "Technical Implementation Details:\n", bold: true })
            ],
            spacing: { after: 100 }
        })
    );

    config.implementationDetails.forEach(detail => {
        docChildren.push(
            new Paragraph({
                children: [new TextRun({ text: `• ${detail}` })],
                spacing: { after: 60 }
            })
        );
    });

    // 5. CODE SCREENSHOTS
    docChildren.push(
        new Paragraph({
            children: [new TextRun({ text: "5. CODE SCREENSHOTS (DEVELOPMENT ENVIRONMENT)", bold: true, size: 24, color: "003366" })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 }
        }),
        new Paragraph({
            children: [new TextRun({ text: "Genuine screenshots captured from the real project workspace displaying clean syntax, file paths, and function implementations:" })],
            spacing: { after: 120 }
        })
    );

    config.codeScreenshots.forEach(cs => {
        const imgPath = path.join(screenshotsDir, cs.file);
        if (fs.existsSync(imgPath)) {
            docChildren.push(
                new Paragraph({
                    children: [
                        new ImageRun({
                            data: fs.readFileSync(imgPath),
                            transformation: { width: 540, height: 300 }
                        })
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 60 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: cs.caption, italics: true, size: 18, color: "666666" })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 180 }
                })
            );
        }
    });

    // 6. OUTPUT SCREENSHOTS
    docChildren.push(
        new Paragraph({
            children: [new TextRun({ text: "6. OUTPUT SCREENSHOTS (EXECUTION & VERIFICATION)", bold: true, size: 24, color: "003366" })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 }
        }),
        new Paragraph({
            children: [new TextRun({ text: "Actual screenshots demonstrating successful runtime execution, HTTP status codes, and verified JSON responses:" })],
            spacing: { after: 120 }
        })
    );

    config.outputScreenshots.forEach(os => {
        const imgPath = path.join(screenshotsDir, os.file);
        if (fs.existsSync(imgPath)) {
            docChildren.push(
                new Paragraph({
                    children: [
                        new ImageRun({
                            data: fs.readFileSync(imgPath),
                            transformation: { width: 540, height: 300 }
                        })
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 60 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: os.caption, italics: true, size: 18, color: "666666" })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 180 }
                })
            );
        }
    });

    // 7. CONCLUSION
    docChildren.push(
        new Paragraph({
            children: [new TextRun({ text: "7. CONCLUSION", bold: true, size: 24, color: "003366" })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
            children: [new TextRun({ text: config.conclusion })],
            spacing: { after: 160 }
        })
    );

    // 8. REFERENCES
    docChildren.push(
        new Paragraph({
            children: [new TextRun({ text: "8. REFERENCES", bold: true, size: 24, color: "003366" })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
        })
    );

    config.references.forEach((ref, idx) => {
        docChildren.push(
            new Paragraph({
                children: [new TextRun({ text: `[${idx + 1}] ${ref}` })],
                spacing: { after: 60 }
            })
        );
    });

    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: { top: 720, bottom: 720, left: 720, right: 720 }
                }
            },
            children: docChildren
        }]
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(docPath, buffer);
    console.log(`Generated DOCX: ${docPath}`);
}

// Helper to create PDF document
function createPdfReport(config) {
    return new Promise((resolve, reject) => {
        const pdfPath = path.join(baseDir, config.folder, 'assessment-document', `${config.filename}.pdf`);
        const screenshotsDir = path.join(baseDir, config.folder, 'screenshots');

        const doc = new PDFDocument({ margin: 40, size: 'A4' });
        const stream = fs.createWriteStream(pdfPath);
        doc.pipe(stream);

        // Header
        doc.fontSize(16).fillColor('#003366').text('AURORA ACADEMIC ASSESSMENT REPORT', { align: 'center' });
        doc.fontSize(10).fillColor('#4A5568').text('Backend Development Fundamentals (BDF) · Modules 1 to 3', { align: 'center' });
        doc.fontSize(12).fillColor('#2B6CB0').text('ClinicQ Health Centre – Consultation Room Booking System', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(12).fillColor('#C53030').text(`INDIVIDUAL ASSESSMENT REPORT – CONTRIBUTION ${config.num}`, { align: 'center' });
        doc.fontSize(11).fillColor('#2D3748').text(`Topic: ${config.title}`, { align: 'center' });
        doc.moveDown(1);

        // Metadata box
        doc.rect(40, doc.y, 515, 65).fillAndStroke('#F7FAFC', '#CBD5E0');
        const boxY = doc.y - 60;
        doc.fontSize(9).fillColor('#1A202C')
            .text(`Group ID: YG-AIDE2B-G08  |  Section: AIDE2B  |  Group: Group 8 of 15`, 50, boxY)
            .text(`Assigned Role: ${config.role}`, 50, boxY + 14)
            .text(`Student Name: [Student Name Placeholder]    |    Student ID: [Student ID Placeholder]`, 50, boxY + 28)
            .text(`Submission Date: November 2026    |    Weightage: 100 Marks (70 Group + 30 Individual)`, 50, boxY + 42);

        doc.moveDown(2);

        // 2. LG GROUP MEMBERS Table
        doc.fontSize(12).fillColor('#003366').text('2. LG GROUP MEMBERS', { underline: true });
        doc.moveDown(0.5);

        // Table headers
        let tableY = doc.y;
        doc.rect(40, tableY, 515, 20).fill('#003366');
        doc.fontSize(8).fillColor('#FFFFFF')
            .text('S.No.', 45, tableY + 6, { width: 30 })
            .text('Group Member Name', 80, tableY + 6, { width: 150 })
            .text('Contribution', 235, tableY + 6, { width: 90 })
            .text('Assigned Responsibility', 330, tableY + 6, { width: 220 });

        tableY += 20;
        membersTableData.forEach((m, idx) => {
            const isCurr = m.contrib.includes(`Contribution ${config.num}`);
            const rowBg = isCurr ? '#EBF8FF' : (idx % 2 === 0 ? '#FFFFFF' : '#F7FAFC');
            doc.rect(40, tableY, 515, 18).fillAndStroke(rowBg, '#E2E8F0');
            doc.fontSize(8).fillColor(isCurr ? '#003366' : '#2D3748')
                .text(m.sno, 45, tableY + 5, { width: 30 })
                .text(m.name, 80, tableY + 5, { width: 150 })
                .text(m.contrib, 235, tableY + 5, { width: 90 })
                .text(m.role, 330, tableY + 5, { width: 220 });
            tableY += 18;
        });

        doc.y = tableY + 15;

        // 3. ORIGINAL QUESTION SCREENSHOT
        doc.fontSize(12).fillColor('#003366').text('3. ORIGINAL ASSIGNMENT QUESTION', { underline: true });
        doc.fontSize(9).fillColor('#2D3748').text('The official client brief and assignment card for Group 8 (Card 83 of 375, Theme 23):');
        doc.moveDown(0.5);

        if (fs.existsSync(originalQuestionImg)) {
            doc.image(originalQuestionImg, { width: 360, align: 'center' });
            doc.fontSize(8).fillColor('#718096').text('Figure 0: Official BDF Group Assignment Client Brief (ClinicQ Health Centre)', { align: 'center' });
        }

        doc.addPage();

        // 4. DESCRIPTION OF WHAT I HAVE DEVELOPED
        doc.fontSize(12).fillColor('#003366').text('4. DESCRIPTION OF WHAT I HAVE DEVELOPED', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(9).fillColor('#1A202C')
            .text(`Assigned Role: ${config.role}`, { bold: true })
            .text(`Module Title: ${config.title}`)
            .text(`Technologies Used: ${config.technologies}`)
            .moveDown(0.5)
            .text('Primary Objective:', { underline: true })
            .text(config.objective)
            .moveDown(0.5)
            .text('Technical Implementation Details:', { underline: true });

        config.implementationDetails.forEach(d => {
            doc.fontSize(8.5).fillColor('#2D3748').text(`• ${d}`);
            doc.moveDown(0.2);
        });

        doc.moveDown(1);

        // 5. CODE SCREENSHOTS
        doc.fontSize(12).fillColor('#003366').text('5. CODE SCREENSHOTS (DEVELOPMENT ENVIRONMENT)', { underline: true });
        doc.moveDown(0.5);

        config.codeScreenshots.forEach(cs => {
            const imgPath = path.join(screenshotsDir, cs.file);
            if (fs.existsSync(imgPath)) {
                if (doc.y > 600) doc.addPage();
                doc.image(imgPath, { width: 480, align: 'center' });
                doc.fontSize(8).fillColor('#718096').text(cs.caption, { align: 'center' });
                doc.moveDown(0.8);
            }
        });

        doc.addPage();

        // 6. OUTPUT SCREENSHOTS
        doc.fontSize(12).fillColor('#003366').text('6. OUTPUT SCREENSHOTS (EXECUTION & VERIFICATION)', { underline: true });
        doc.moveDown(0.5);

        config.outputScreenshots.forEach(os => {
            const imgPath = path.join(screenshotsDir, os.file);
            if (fs.existsSync(imgPath)) {
                if (doc.y > 600) doc.addPage();
                doc.image(imgPath, { width: 480, align: 'center' });
                doc.fontSize(8).fillColor('#718096').text(os.caption, { align: 'center' });
                doc.moveDown(0.8);
            }
        });

        doc.moveDown(1);

        // 7. CONCLUSION
        if (doc.y > 650) doc.addPage();
        doc.fontSize(12).fillColor('#003366').text('7. CONCLUSION', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(9).fillColor('#2D3748').text(config.conclusion);
        doc.moveDown(1);

        // 8. REFERENCES
        doc.fontSize(12).fillColor('#003366').text('8. REFERENCES', { underline: true });
        doc.moveDown(0.5);
        config.references.forEach((ref, idx) => {
            doc.fontSize(8.5).fillColor('#4A5568').text(`[${idx + 1}] ${ref}`);
            doc.moveDown(0.2);
        });

        doc.end();
        stream.on('finish', () => {
            console.log(`Generated PDF: ${pdfPath}`);
            resolve();
        });
        stream.on('error', reject);
    });
}

async function run() {
    console.log('================================================================');
    console.log('Generating 6 Individual Assessment Documents (DOCX & PDF)');
    console.log('================================================================');

    for (const config of contributionsConfig) {
        console.log(`\nProcessing Contribution ${config.num}: ${config.title}`);
        await createDocxReport(config);
        await createPdfReport(config);
    }

    console.log('\nAll 12 Assessment Documents (6 DOCX + 6 PDF) generated successfully!');
}

run().catch(err => {
    console.error('Error generating assessment documents:', err);
    process.exit(1);
});
