const fs = require('fs');
const path = require('path');

const collection = {
    info: {
        _postman_id: "7d9b49e1-c8ef-4123-b189-e58f27ab9c4c",
        name: "ClinicQ Health Centre - Consultation Room Booking System",
        description: "Official BDF Group Assignment API Collection for ClinicQ Health Centre (YG-AIDE2B-G08).\nIncludes CRUD operations for Doctors, Rooms, and Bookings, SQL JOIN details endpoint, Query search by floor, Overlapping booking conflict prevention, and the 3 compulsory Assignment Twist test cases.",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: [
        {
            name: "00 - Health & Documentation",
            item: [
                {
                    name: "GET API Root / Health Check",
                    request: {
                        method: "GET",
                        header: [],
                        url: {
                            raw: "{{base_url}}/",
                            host: ["{{base_url}}"],
                            path: [""]
                        },
                        description: "Check if the ClinicQ API server is online and view documentation."
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
                                    "pm.test('Response indicates success', function () {",
                                    "    var jsonData = pm.response.json();",
                                    "    pm.expect(jsonData.success).to.eql(true);",
                                    "    pm.expect(jsonData.group_id).to.eql('YG-AIDE2B-G08');",
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
            name: "01 - Doctors Endpoints",
            item: [
                {
                    name: "GET All Doctors",
                    request: {
                        method: "GET",
                        header: [],
                        url: {
                            raw: "{{base_url}}/doctors",
                            host: ["{{base_url}}"],
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
                                    "});",
                                    "pm.test('Doctors array returned', function () {",
                                    "    var jsonData = pm.response.json();",
                                    "    pm.expect(jsonData.success).to.eql(true);",
                                    "    pm.expect(jsonData.data).to.be.an('array');",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "GET Doctor by ID",
                    request: {
                        method: "GET",
                        header: [],
                        url: {
                            raw: "{{base_url}}/doctors/1",
                            host: ["{{base_url}}"],
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
                                    "});",
                                    "pm.test('Doctor details matched', function () {",
                                    "    var jsonData = pm.response.json();",
                                    "    pm.expect(jsonData.data.id).to.eql(1);",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "POST Create Doctor",
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
                            }, null, 2)
                        },
                        url: {
                            raw: "{{base_url}}/doctors",
                            host: ["{{base_url}}"],
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
                                    "});",
                                    "var jsonData = pm.response.json();",
                                    "if (jsonData.data && jsonData.data.id) {",
                                    "    pm.environment.set('created_doctor_id', jsonData.data.id);",
                                    "}"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "PUT Update Doctor",
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
                                name: "Dr. Gregory House, M.D.",
                                specialization: "Infectious Diseases",
                                phone: "+1-555-0998"
                            }, null, 2)
                        },
                        url: {
                            raw: "{{base_url}}/doctors/{{created_doctor_id}}",
                            host: ["{{base_url}}"],
                            path: ["doctors", "{{created_doctor_id}}"]
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
                    name: "DELETE Doctor",
                    request: {
                        method: "DELETE",
                        header: [],
                        url: {
                            raw: "{{base_url}}/doctors/{{created_doctor_id}}",
                            host: ["{{base_url}}"],
                            path: ["doctors", "{{created_doctor_id}}"]
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
            name: "02 - Rooms Endpoints",
            item: [
                {
                    name: "GET All Rooms",
                    request: {
                        method: "GET",
                        header: [],
                        url: {
                            raw: "{{base_url}}/rooms",
                            host: ["{{base_url}}"],
                            path: ["rooms"]
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
                    name: "GET Search Rooms by Floor (Query Param ?floor=2)",
                    request: {
                        method: "GET",
                        header: [],
                        url: {
                            raw: "{{base_url}}/rooms?floor=2",
                            host: ["{{base_url}}"],
                            path: ["rooms"],
                            query: [
                                {
                                    key: "floor",
                                    value: "2"
                                }
                            ]
                        },
                        description: "Search requirement: search by query parameter (e.g. rooms by floor)."
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
                                    "pm.test('All returned rooms belong to Floor 2', function () {",
                                    "    var jsonData = pm.response.json();",
                                    "    pm.expect(jsonData.data.every(r => r.floor === 2)).to.be.true;",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "GET Room by ID",
                    request: {
                        method: "GET",
                        header: [],
                        url: {
                            raw: "{{base_url}}/rooms/3",
                            host: ["{{base_url}}"],
                            path: ["rooms", "3"]
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
                    name: "POST Create Room",
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
                                room_number: "Room 501",
                                floor: 5,
                                capacity: 6,
                                status: "available"
                            }, null, 2)
                        },
                        url: {
                            raw: "{{base_url}}/rooms",
                            host: ["{{base_url}}"],
                            path: ["rooms"]
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
                                    "});",
                                    "var jsonData = pm.response.json();",
                                    "if (jsonData.data && jsonData.data.id) {",
                                    "    pm.environment.set('created_room_id', jsonData.data.id);",
                                    "}"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "PUT Update Room",
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
                                room_number: "Room 501-A",
                                floor: 5,
                                capacity: 8,
                                status: "available"
                            }, null, 2)
                        },
                        url: {
                            raw: "{{base_url}}/rooms/{{created_room_id}}",
                            host: ["{{base_url}}"],
                            path: ["rooms", "{{created_room_id}}"]
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
                    name: "DELETE Room",
                    request: {
                        method: "DELETE",
                        header: [],
                        url: {
                            raw: "{{base_url}}/rooms/{{created_room_id}}",
                            host: ["{{base_url}}"],
                            path: ["rooms", "{{created_room_id}}"]
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
            name: "03 - Bookings & SQL JOIN Endpoints",
            item: [
                {
                    name: "GET All Bookings",
                    request: {
                        method: "GET",
                        header: [],
                        url: {
                            raw: "{{base_url}}/bookings",
                            host: ["{{base_url}}"],
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
                    name: "GET Booking Details (SQL JOIN)",
                    request: {
                        method: "GET",
                        header: [],
                        url: {
                            raw: "{{base_url}}/bookings/details",
                            host: ["{{base_url}}"],
                            path: ["bookings", "details"]
                        },
                        description: "Mandatory JOIN endpoint returning booking info with doctor name and room number."
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
                                    "    pm.expect(jsonData.data.length).to.be.above(0);",
                                    "    pm.expect(jsonData.data[0]).to.have.property('doctor_name');",
                                    "    pm.expect(jsonData.data[0]).to.have.property('room_number');",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "GET Booking by ID",
                    request: {
                        method: "GET",
                        header: [],
                        url: {
                            raw: "{{base_url}}/bookings/1",
                            host: ["{{base_url}}"],
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
                    name: "POST Create Booking",
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
                                end_time: "12:00",
                                status: "active"
                            }, null, 2)
                        },
                        url: {
                            raw: "{{base_url}}/bookings",
                            host: ["{{base_url}}"],
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
                                    "});",
                                    "var jsonData = pm.response.json();",
                                    "if (jsonData.data && jsonData.data.id) {",
                                    "    pm.environment.set('created_booking_id', jsonData.data.id);",
                                    "}"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "PUT Update Booking",
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
                                end_time: "13:00",
                                status: "active"
                            }, null, 2)
                        },
                        url: {
                            raw: "{{base_url}}/bookings/{{created_booking_id}}",
                            host: ["{{base_url}}"],
                            path: ["bookings", "{{created_booking_id}}"]
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
                    name: "DELETE Booking",
                    request: {
                        method: "DELETE",
                        header: [],
                        url: {
                            raw: "{{base_url}}/bookings/{{created_booking_id}}",
                            host: ["{{base_url}}"],
                            path: ["bookings", "{{created_booking_id}}"]
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
            name: "04 - Assignment Twist & Conflict Tests",
            item: [
                {
                    name: "COMPULSORY TEST 1 - Invalid Date Range (End before Start -> 400)",
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
                            }, null, 2)
                        },
                        url: {
                            raw: "{{base_url}}/bookings",
                            host: ["{{base_url}}"],
                            path: ["bookings"]
                        },
                        description: "Compulsory Test 1: Start 2026-11-15, End 2026-11-14 -> Expected HTTP 400 Bad Request with message 'End date cannot be earlier than start date.'"
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
                                    "pm.test('Error message matches specification', function () {",
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
                    name: "COMPULSORY TEST 2 - Room 3 Unavailable on 2026-11-11 (During Booking 10-12 Nov)",
                    request: {
                        method: "GET",
                        header: [],
                        url: {
                            raw: "{{base_url}}/rooms/available?date=2026-11-11",
                            host: ["{{base_url}}"],
                            path: ["rooms", "available"],
                            query: [
                                {
                                    key: "date",
                                    value: "2026-11-11"
                                }
                            ]
                        },
                        description: "Compulsory Test 2: Existing booking for Room 3 from 2026-11-10 to 2026-11-12. On 2026-11-11, Room 3 must NOT appear in the response."
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
                                    "pm.test('Room 3 is NOT in available rooms list', function () {",
                                    "    var jsonData = pm.response.json();",
                                    "    var hasRoom3 = jsonData.data.some(function(r) { return r.id === 3 || r.room_number === 'Room 3'; });",
                                    "    pm.expect(hasRoom3).to.be.false;",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "COMPULSORY TEST 3 - Room 3 Available on 2026-11-13 (After Booking Ends Nov 12)",
                    request: {
                        method: "GET",
                        header: [],
                        url: {
                            raw: "{{base_url}}/rooms/available?date=2026-11-13",
                            host: ["{{base_url}}"],
                            path: ["rooms", "available"],
                            query: [
                                {
                                    key: "date",
                                    value: "2026-11-13"
                                }
                            ]
                        },
                        description: "Compulsory Test 3: On 2026-11-13, Room 3 MUST appear in the response because its booking ended on November 12."
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
                                    "pm.test('Room 3 IS in available rooms list', function () {",
                                    "    var jsonData = pm.response.json();",
                                    "    var hasRoom3 = jsonData.data.some(function(r) { return r.id === 3 || r.room_number === 'Room 3'; });",
                                    "    pm.expect(hasRoom3).to.be.true;",
                                    "});"
                                ],
                                type: "text/javascript"
                            }
                        }
                    ]
                },
                {
                    name: "CONFLICT TEST - Overlapping Booking for Same Room at Same Time -> 409 Conflict",
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
                            }, null, 2)
                        },
                        url: {
                            raw: "{{base_url}}/bookings",
                            host: ["{{base_url}}"],
                            path: ["bookings"]
                        },
                        description: "Prevents two doctors being assigned the same room at the same time."
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
    ],
    variable: [
        {
            key: "base_url",
            value: "http://localhost:3000",
            type: "string"
        }
    ]
};

const environment = {
    id: "9c8b7a6d-5e4f-3a2b-1c0d-e5f6a7b8c9d0",
    name: "ClinicQ Health Centre - Local Environment",
    values: [
        {
            key: "base_url",
            value: "http://localhost:3000",
            type: "default",
            enabled: true
        },
        {
            key: "created_doctor_id",
            value: "6",
            type: "default",
            enabled: true
        },
        {
            key: "created_room_id",
            value: "7",
            type: "default",
            enabled: true
        },
        {
            key: "created_booking_id",
            value: "4",
            type: "default",
            enabled: true
        }
    ],
    _postman_variable_scope: "environment"
};

const outDir = path.join(__dirname, 'postman');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'ClinicQ_Health_Centre.postman_collection.json'), JSON.stringify(collection, null, 2));
fs.writeFileSync(path.join(outDir, 'ClinicQ_Environment.postman_environment.json'), JSON.stringify(environment, null, 2));

console.log('Postman Collection and Environment generated successfully in:', outDir);
