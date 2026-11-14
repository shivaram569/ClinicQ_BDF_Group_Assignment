const fs = require('fs');
const path = require('path');

const collection = {
    info: {
        _postman_id: "clinicq-health-centre-api-yugandhar",
        name: "ClinicQ Health Centre API",
        description: "Official Postman Collection matching live demo requirements for ClinicQ Health Centre.\nDeveloper: M.SHIVARAM (252U1R5104) - Contribution 3\nClass & Section: 313 AI DE 2B | Faculty: Mr Yugandhar Gurjalwar\nWorks directly with 'No Environment' or any selected environment on http://localhost:3000.",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: [
        {
            name: "Rooms",
            item: [
                {
                    name: "1. Add New Room",
                    request: {
                        method: "POST",
                        header: [
                            {
                                key: "Content-Type",
                                value: "application/json"
                            }
                        ],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({
                                name: "Room A",
                                floor: 1
                            }, null, 2),
                            options: {
                                raw: {
                                    language: "json"
                                }
                            }
                        },
                        url: {
                            raw: "http://localhost:3000/rooms",
                            protocol: "http",
                            host: ["localhost"],
                            port: "3000",
                            path: ["rooms"]
                        },
                        description: "Adds a new room with name and floor as required by the client brief."
                    },
                    response: [],
                    event: [
                        {
                            listen: "test",
                            script: {
                                exec: [
                                    "pm.test('Status code is 201 Created', function () {",
                                    "    pm.response.to.have.status(201);",
                                    "});",
                                    "pm.test('Room created successfully', function () {",
                                    "    var jsonData = pm.response.json();",
                                    "    pm.expect(jsonData.success).to.eql(true);",
                                    "    pm.expect(jsonData.data.floor).to.eql(1);",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "2. Get All Rooms",
                    request: {
                        method: "GET",
                        header: [],
                        url: {
                            raw: "http://localhost:3000/rooms",
                            protocol: "http",
                            host: ["localhost"],
                            port: "3000",
                            path: ["rooms"]
                        },
                        description: "Retrieves all consultation rooms."
                    },
                    response: [],
                    event: [
                        {
                            listen: "test",
                            script: {
                                exec: [
                                    "pm.test('Status code is 200 OK', function () {",
                                    "    pm.response.to.have.status(200);",
                                    "});",
                                    "pm.test('Returns list of rooms', function () {",
                                    "    var jsonData = pm.response.json();",
                                    "    pm.expect(jsonData.success).to.be.true;",
                                    "    pm.expect(jsonData.data).to.be.an('array');",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "3. Get Room by ID",
                    request: {
                        method: "GET",
                        header: [],
                        url: {
                            raw: "http://localhost:3000/rooms/1",
                            protocol: "http",
                            host: ["localhost"],
                            port: "3000",
                            path: ["rooms", "1"]
                        },
                        description: "Retrieves single consultation room details by ID."
                    },
                    response: [],
                    event: [
                        {
                            listen: "test",
                            script: {
                                exec: [
                                    "pm.test('Status code is 200 OK', function () {",
                                    "    pm.response.to.have.status(200);",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "4. Update Room",
                    request: {
                        method: "PUT",
                        header: [
                            {
                                key: "Content-Type",
                                value: "application/json"
                            }
                        ],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({
                                name: "Room A - Renovated",
                                floor: 1
                            }, null, 2),
                            options: {
                                raw: {
                                    language: "json"
                                }
                            }
                        },
                        url: {
                            raw: "http://localhost:3000/rooms/1",
                            protocol: "http",
                            host: ["localhost"],
                            port: "3000",
                            path: ["rooms", "1"]
                        },
                        description: "Updates existing consultation room."
                    },
                    response: [],
                    event: [
                        {
                            listen: "test",
                            script: {
                                exec: [
                                    "pm.test('Status code is 200 OK', function () {",
                                    "    pm.response.to.have.status(200);",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "5. Delete Room",
                    request: {
                        method: "DELETE",
                        header: [],
                        url: {
                            raw: "http://localhost:3000/rooms/2",
                            protocol: "http",
                            host: ["localhost"],
                            port: "3000",
                            path: ["rooms", "2"]
                        },
                        description: "Deletes a consultation room."
                    },
                    response: [],
                    event: [
                        {
                            listen: "test",
                            script: {
                                exec: [
                                    "pm.test('Status code is 200 OK', function () {",
                                    "    pm.response.to.have.status(200);",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "6. Search Rooms by Floor (?floor=2)",
                    request: {
                        method: "GET",
                        header: [],
                        url: {
                            raw: "http://localhost:3000/rooms?floor=2",
                            protocol: "http",
                            host: ["localhost"],
                            port: "3000",
                            path: ["rooms"],
                            query: [
                                {
                                    key: "floor",
                                    value: "2"
                                }
                            ]
                        },
                        description: "Filters rooms by query parameter (e.g. rooms on Floor 2)."
                    },
                    response: [],
                    event: [
                        {
                            listen: "test",
                            script: {
                                exec: [
                                    "pm.test('Status code is 200 OK', function () {",
                                    "    pm.response.to.have.status(200);",
                                    "});",
                                    "pm.test('All returned rooms on Floor 2', function () {",
                                    "    var jsonData = pm.response.json();",
                                    "    pm.expect(jsonData.data.every(function(r) { return r.floor === 2; })).to.be.true;",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                }
            ]
        },
        {
            name: "Doctors",
            item: [
                {
                    name: "1. Add New Doctor",
                    request: {
                        method: "POST",
                        header: [
                            {
                                key: "Content-Type",
                                value: "application/json"
                            }
                        ],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({
                                name: "Dr. Gregory House",
                                specialization: "Diagnostic Medicine",
                                phone: "+1-555-0999"
                            }, null, 2),
                            options: {
                                raw: {
                                    language: "json"
                                }
                            }
                        },
                        url: {
                            raw: "http://localhost:3000/doctors",
                            protocol: "http",
                            host: ["localhost"],
                            port: "3000",
                            path: ["doctors"]
                        }
                    },
                    response: [],
                    event: [
                        {
                            listen: "test",
                            script: {
                                exec: [
                                    "pm.test('Status code is 201 Created', function () {",
                                    "    pm.response.to.have.status(201);",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "2. Get All Doctors",
                    request: {
                        method: "GET",
                        header: [],
                        url: {
                            raw: "http://localhost:3000/doctors",
                            protocol: "http",
                            host: ["localhost"],
                            port: "3000",
                            path: ["doctors"]
                        }
                    },
                    response: [],
                    event: [
                        {
                            listen: "test",
                            script: {
                                exec: [
                                    "pm.test('Status code is 200 OK', function () {",
                                    "    pm.response.to.have.status(200);",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "3. Get Doctor by ID",
                    request: {
                        method: "GET",
                        header: [],
                        url: {
                            raw: "http://localhost:3000/doctors/1",
                            protocol: "http",
                            host: ["localhost"],
                            port: "3000",
                            path: ["doctors", "1"]
                        }
                    },
                    response: [],
                    event: [
                        {
                            listen: "test",
                            script: {
                                exec: [
                                    "pm.test('Status code is 200 OK', function () {",
                                    "    pm.response.to.have.status(200);",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "4. Update Doctor",
                    request: {
                        method: "PUT",
                        header: [
                            {
                                key: "Content-Type",
                                value: "application/json"
                            }
                        ],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({
                                name: "Dr. Sarah Jenkins",
                                specialization: "Interventional Cardiology",
                                phone: "+1-555-0101"
                            }, null, 2),
                            options: {
                                raw: {
                                    language: "json"
                                }
                            }
                        },
                        url: {
                            raw: "http://localhost:3000/doctors/1",
                            protocol: "http",
                            host: ["localhost"],
                            port: "3000",
                            path: ["doctors", "1"]
                        }
                    },
                    response: [],
                    event: [
                        {
                            listen: "test",
                            script: {
                                exec: [
                                    "pm.test('Status code is 200 OK', function () {",
                                    "    pm.response.to.have.status(200);",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "5. Delete Doctor",
                    request: {
                        method: "DELETE",
                        header: [],
                        url: {
                            raw: "http://localhost:3000/doctors/5",
                            protocol: "http",
                            host: ["localhost"],
                            port: "3000",
                            path: ["doctors", "5"]
                        }
                    },
                    response: [],
                    event: [
                        {
                            listen: "test",
                            script: {
                                exec: [
                                    "pm.test('Status code is 200 OK', function () {",
                                    "    pm.response.to.have.status(200);",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                }
            ]
        },
        {
            name: "Bookings & Relational JOIN",
            item: [
                {
                    name: "1. Add New Booking",
                    request: {
                        method: "POST",
                        header: [
                            {
                                key: "Content-Type",
                                value: "application/json"
                            }
                        ],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({
                                doctor_id: 1,
                                room_id: 1,
                                start_date: "2026-12-05",
                                end_date: "2026-12-06",
                                start_time: "09:00",
                                end_time: "12:00"
                            }, null, 2),
                            options: {
                                raw: {
                                    language: "json"
                                }
                            }
                        },
                        url: {
                            raw: "http://localhost:3000/bookings",
                            protocol: "http",
                            host: ["localhost"],
                            port: "3000",
                            path: ["bookings"]
                        }
                    },
                    response: [],
                    event: [
                        {
                            listen: "test",
                            script: {
                                exec: [
                                    "pm.test('Status code is 201 Created', function () {",
                                    "    pm.response.to.have.status(201);",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "2. Get All Bookings",
                    request: {
                        method: "GET",
                        header: [],
                        url: {
                            raw: "http://localhost:3000/bookings",
                            protocol: "http",
                            host: ["localhost"],
                            port: "3000",
                            path: ["bookings"]
                        }
                    },
                    response: [],
                    event: [
                        {
                            listen: "test",
                            script: {
                                exec: [
                                    "pm.test('Status code is 200 OK', function () {",
                                    "    pm.response.to.have.status(200);",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "3. Get Booking by ID",
                    request: {
                        method: "GET",
                        header: [],
                        url: {
                            raw: "http://localhost:3000/bookings/1",
                            protocol: "http",
                            host: ["localhost"],
                            port: "3000",
                            path: ["bookings", "1"]
                        }
                    },
                    response: [],
                    event: [
                        {
                            listen: "test",
                            script: {
                                exec: [
                                    "pm.test('Status code is 200 OK', function () {",
                                    "    pm.response.to.have.status(200);",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "4. Update Booking",
                    request: {
                        method: "PUT",
                        header: [
                            {
                                key: "Content-Type",
                                value: "application/json"
                            }
                        ],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({
                                doctor_id: 1,
                                room_id: 1,
                                start_date: "2026-12-05",
                                end_date: "2026-12-06",
                                start_time: "10:00",
                                end_time: "13:00"
                            }, null, 2),
                            options: {
                                raw: {
                                    language: "json"
                                }
                            }
                        },
                        url: {
                            raw: "http://localhost:3000/bookings/1",
                            protocol: "http",
                            host: ["localhost"],
                            port: "3000",
                            path: ["bookings", "1"]
                        }
                    },
                    response: [],
                    event: [
                        {
                            listen: "test",
                            script: {
                                exec: [
                                    "pm.test('Status code is 200 OK', function () {",
                                    "    pm.response.to.have.status(200);",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "5. Delete Booking",
                    request: {
                        method: "DELETE",
                        header: [],
                        url: {
                            raw: "http://localhost:3000/bookings/2",
                            protocol: "http",
                            host: ["localhost"],
                            port: "3000",
                            path: ["bookings", "2"]
                        }
                    },
                    response: [],
                    event: [
                        {
                            listen: "test",
                            script: {
                                exec: [
                                    "pm.test('Status code is 200 OK', function () {",
                                    "    pm.response.to.have.status(200);",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "6. Get Booking Details (MANDATORY SQL JOIN)",
                    request: {
                        method: "GET",
                        header: [],
                        url: {
                            raw: "http://localhost:3000/bookings/details",
                            protocol: "http",
                            host: ["localhost"],
                            port: "3000",
                            path: ["bookings", "details"]
                        },
                        description: "Mandatory Relational JOIN endpoint: joins bookings with doctors and rooms.\nReturns doctor_name, doctor_specialization, room_number, room_name, room_floor, start_date, end_date, start_time, end_time, booking_status."
                    },
                    response: [],
                    event: [
                        {
                            listen: "test",
                            script: {
                                exec: [
                                    "pm.test('Status code is 200 OK', function () {",
                                    "    pm.response.to.have.status(200);",
                                    "});",
                                    "pm.test('Contains doctor_name and room_number via SQL JOIN', function () {",
                                    "    var jsonData = pm.response.json();",
                                    "    pm.expect(jsonData.success).to.be.true;",
                                    "    pm.expect(jsonData.data.length).to.be.above(0);",
                                    "    pm.expect(jsonData.data[0]).to.have.property('doctor_name');",
                                    "    pm.expect(jsonData.data[0]).to.have.property('room_number');",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                }
            ]
        },
        {
            name: "Twist & Compulsory Tests",
            item: [
                {
                    name: "1. Twist Test 1 - End Before Start Date (400 Bad Request)",
                    request: {
                        method: "POST",
                        header: [
                            {
                                key: "Content-Type",
                                value: "application/json"
                            }
                        ],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({
                                doctor_id: 1,
                                room_id: 3,
                                start_date: "2026-11-15",
                                end_date: "2026-11-14",
                                start_time: "09:00",
                                end_time: "12:00"
                            }, null, 2),
                            options: {
                                raw: {
                                    language: "json"
                                }
                            }
                        },
                        url: {
                            raw: "http://localhost:3000/bookings",
                            protocol: "http",
                            host: ["localhost"],
                            port: "3000",
                            path: ["bookings"]
                        },
                        description: "Compulsory Test 1: Start 2026-11-15, End 2026-11-14 -> 400 Bad Request 'End date cannot be earlier than start date.'"
                    },
                    response: [],
                    event: [
                        {
                            listen: "test",
                            script: {
                                exec: [
                                    "pm.test('Status code is 400 Bad Request', function () {",
                                    "    pm.response.to.have.status(400);",
                                    "});",
                                    "pm.test('Error message matches requirement', function () {",
                                    "    var jsonData = pm.response.json();",
                                    "    pm.expect(jsonData.error).to.eql('End date cannot be earlier than start date.');",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "2. Twist Test 2 - Available Rooms on 2026-11-11 (Room 3 Missing)",
                    request: {
                        method: "GET",
                        header: [],
                        url: {
                            raw: "http://localhost:3000/rooms/available?date=2026-11-11",
                            protocol: "http",
                            host: ["localhost"],
                            port: "3000",
                            path: ["rooms", "available"],
                            query: [
                                {
                                    key: "date",
                                    value: "2026-11-11"
                                }
                            ]
                        },
                        description: "Compulsory Test 2: Active booking on Room 3 from Nov 10 to 12. On Nov 11, Room 3 must NOT appear."
                    },
                    response: [],
                    event: [
                        {
                            listen: "test",
                            script: {
                                exec: [
                                    "pm.test('Status code is 200 OK', function () {",
                                    "    pm.response.to.have.status(200);",
                                    "});",
                                    "pm.test('Room 3 is missing on 2026-11-11', function () {",
                                    "    var jsonData = pm.response.json();",
                                    "    var hasRoom3 = jsonData.data.some(function(r) { return r.id === 3 || r.name === 'Room 3' || r.room_number === 'Room 3'; });",
                                    "    pm.expect(hasRoom3).to.be.false;",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "3. Twist Test 3 - Available Rooms on 2026-11-13 (Room 3 Listed)",
                    request: {
                        method: "GET",
                        header: [],
                        url: {
                            raw: "http://localhost:3000/rooms/available?date=2026-11-13",
                            protocol: "http",
                            host: ["localhost"],
                            port: "3000",
                            path: ["rooms", "available"],
                            query: [
                                {
                                    key: "date",
                                    value: "2026-11-13"
                                }
                            ]
                        },
                        description: "Compulsory Test 3: Booking on Room 3 ended on Nov 12. On Nov 13, Room 3 MUST appear."
                    },
                    response: [],
                    event: [
                        {
                            listen: "test",
                            script: {
                                exec: [
                                    "pm.test('Status code is 200 OK', function () {",
                                    "    pm.response.to.have.status(200);",
                                    "});",
                                    "pm.test('Room 3 is listed on 2026-11-13', function () {",
                                    "    var jsonData = pm.response.json();",
                                    "    var hasRoom3 = jsonData.data.some(function(r) { return r.id === 3 || r.name === 'Room 3' || r.room_number === 'Room 3'; });",
                                    "    pm.expect(hasRoom3).to.be.true;",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "4. Overlapping Conflict Check (409 Conflict)",
                    request: {
                        method: "POST",
                        header: [
                            {
                                key: "Content-Type",
                                value: "application/json"
                            }
                        ],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({
                                doctor_id: 3,
                                room_id: 3,
                                start_date: "2026-11-11",
                                end_date: "2026-11-11",
                                start_time: "10:00",
                                end_time: "12:00"
                            }, null, 2),
                            options: {
                                raw: {
                                    language: "json"
                                }
                            }
                        },
                        url: {
                            raw: "http://localhost:3000/bookings",
                            protocol: "http",
                            host: ["localhost"],
                            port: "3000",
                            path: ["bookings"]
                        },
                        description: "Attempts double-booking of Room 3 during active consultation hours. Returns 409 Conflict."
                    },
                    response: [],
                    event: [
                        {
                            listen: "test",
                            script: {
                                exec: [
                                    "pm.test('Status code is 409 Conflict', function () {",
                                    "    pm.response.to.have.status(409);",
                                    "});",
                                    "pm.test('Conflict error message returned', function () {",
                                    "    var jsonData = pm.response.json();",
                                    "    pm.expect(jsonData.error).to.eql('Room is already booked for the selected date and time interval.');",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                }
            ]
        }
    ]
};

const c3PostmanDir = path.join(__dirname, '..', 'CONTRIBUTION_3_REST_ENDPOINTS', 'postman');
const sharedPostmanDir = path.join(__dirname, '..', 'shared', 'postman-collection');
const mainPostmanDir = path.join(__dirname, 'postman');

[c3PostmanDir, sharedPostmanDir, mainPostmanDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const targetPath = path.join(dir, 'ClinicQ_Health_Centre_API.postman_collection.json');
    fs.writeFileSync(targetPath, JSON.stringify(collection, null, 2));
    console.log(`Saved Postman Collection: ${targetPath}`);
});
