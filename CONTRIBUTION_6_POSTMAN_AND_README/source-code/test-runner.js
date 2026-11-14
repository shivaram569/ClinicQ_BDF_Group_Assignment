const http = require('http');
const app = require('./app');
const { dbAsync } = require('./config/db');

// Start test server on ephemeral port
const testPort = 3001;
let server;

function makeRequest(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const payload = body ? JSON.stringify(body) : null;
        const options = {
            hostname: 'localhost',
            port: testPort,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                let parsed = null;
                try {
                    parsed = JSON.parse(data);
                } catch (e) {
                    parsed = data;
                }
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    body: parsed
                });
            });
        });

        req.on('error', (err) => reject(err));
        if (payload) req.write(payload);
        req.end();
    });
}

const testResults = [];

function assertTest(name, passed, details = '') {
    const symbol = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${symbol} | ${name}`);
    if (details) console.log(`       Details: ${details}`);
    testResults.push({ name, passed, details });
}

async function runAllTests() {
    console.log('================================================================');
    console.log('🏥 CLINICQ HEALTH CENTRE - BACKEND API AUTOMATED TEST SUITE');
    console.log('Course: Backend Development Fundamentals (BDF)');
    console.log('Group: YG-AIDE2B-G08');
    console.log('================================================================\n');

    server = app.listen(testPort);

    try {
        // --- TEST SUITE 1: SERVER & HEALTH CHECK ---
        console.log('\n--- 1. SERVER & SYSTEM HEALTH CHECKS ---');
        const resRoot = await makeRequest('GET', '/');
        assertTest('GET / (API Root & Health Check)', resRoot.status === 200 && resRoot.body.success === true, `Status ${resRoot.status}`);

        // --- TEST SUITE 2: DOCTORS CRUD ---
        console.log('\n--- 2. DOCTORS CRUD ENDPOINTS ---');
        const resDoctors = await makeRequest('GET', '/doctors');
        assertTest('GET /doctors (List all doctors)', resDoctors.status === 200 && Array.isArray(resDoctors.body.data), `Found ${resDoctors.body.count} doctors`);

        const resDocPost = await makeRequest('POST', '/doctors', {
            name: 'Dr. Gregory House',
            specialization: 'Diagnostic Medicine',
            phone: '+1-555-0999'
        });
        const createdDocId = resDocPost.body.data ? resDocPost.body.data.id : null;
        assertTest('POST /doctors (Create doctor)', resDocPost.status === 201 && createdDocId !== null, `Created Doctor ID: ${createdDocId}`);

        const resDocGet = await makeRequest('GET', `/doctors/${createdDocId}`);
        assertTest('GET /doctors/:id (Get single doctor)', resDocGet.status === 200 && resDocGet.body.data.name === 'Dr. Gregory House', `Retrieved ${resDocGet.body.data.name}`);

        const resDocPut = await makeRequest('PUT', `/doctors/${createdDocId}`, {
            name: 'Dr. Gregory House, M.D.',
            specialization: 'Infectious Diseases',
            phone: '+1-555-0998'
        });
        assertTest('PUT /doctors/:id (Update doctor)', resDocPut.status === 200 && resDocPut.body.data.specialization === 'Infectious Diseases', `Updated specialization to Infectious Diseases`);

        const resDocDel = await makeRequest('DELETE', `/doctors/${createdDocId}`);
        assertTest('DELETE /doctors/:id (Delete doctor)', resDocDel.status === 200 && resDocDel.body.success === true, `Deleted Doctor ID: ${createdDocId}`);

        // --- TEST SUITE 3: ROOMS CRUD & SEARCH ---
        console.log('\n--- 3. ROOMS CRUD & SEARCH BY QUERY PARAMETER ---');
        const resRooms = await makeRequest('GET', '/rooms');
        assertTest('GET /rooms (List all rooms)', resRooms.status === 200 && Array.isArray(resRooms.body.data), `Found ${resRooms.body.count} rooms`);

        // Search by query parameter: GET /rooms?floor=2
        const resFloorSearch = await makeRequest('GET', '/rooms?floor=2');
        const allFloor2 = resFloorSearch.body.data && resFloorSearch.body.data.every(r => r.floor === 2);
        assertTest('GET /rooms?floor=2 (Search query filter by floor)', resFloorSearch.status === 200 && allFloor2 && resFloorSearch.body.count >= 1, `Found ${resFloorSearch.body.count} rooms on floor 2`);

        const resRoomPost = await makeRequest('POST', '/rooms', {
            room_number: 'Room 401',
            floor: 4,
            capacity: 8,
            status: 'available'
        });
        const createdRoomId = resRoomPost.body.data ? resRoomPost.body.data.id : null;
        assertTest('POST /rooms (Create room)', resRoomPost.status === 201 && createdRoomId !== null, `Created Room ID: ${createdRoomId}`);

        const resRoomGet = await makeRequest('GET', `/rooms/${createdRoomId}`);
        assertTest('GET /rooms/:id (Get single room)', resRoomGet.status === 200 && resRoomGet.body.data.room_number === 'Room 401', `Retrieved room ${resRoomGet.body.data.room_number}`);

        const resRoomPut = await makeRequest('PUT', `/rooms/${createdRoomId}`, {
            room_number: 'Room 401-A',
            floor: 4,
            capacity: 10,
            status: 'available'
        });
        assertTest('PUT /rooms/:id (Update room)', resRoomPut.status === 200 && resRoomPut.body.data.capacity === 10, `Updated room capacity to 10`);

        const resRoomDel = await makeRequest('DELETE', `/rooms/${createdRoomId}`);
        assertTest('DELETE /rooms/:id (Delete room)', resRoomDel.status === 200 && resRoomDel.body.success === true, `Deleted Room ID: ${createdRoomId}`);

        // --- TEST SUITE 4: BOOKINGS CRUD & SQL JOIN ---
        console.log('\n--- 4. BOOKINGS CRUD & SQL JOIN DETAILS ---');
        const resBookings = await makeRequest('GET', '/bookings');
        assertTest('GET /bookings (List all bookings)', resBookings.status === 200 && Array.isArray(resBookings.body.data), `Found ${resBookings.body.count} bookings`);

        // SQL JOIN Endpoint: GET /bookings/details
        const resJoinDetails = await makeRequest('GET', '/bookings/details');
        const hasJoinFields = resJoinDetails.body.data && resJoinDetails.body.data.length > 0 &&
            'doctor_name' in resJoinDetails.body.data[0] &&
            'room_number' in resJoinDetails.body.data[0];
        assertTest('GET /bookings/details (SQL JOIN: Doctor name & Room number)', resJoinDetails.status === 200 && hasJoinFields, `Joined records returned with doctor_name: "${resJoinDetails.body.data[0].doctor_name}", room_number: "${resJoinDetails.body.data[0].room_number}"`);

        // Create temporary booking for test
        const resBookPost = await makeRequest('POST', '/bookings', {
            doctor_id: 1,
            room_id: 1,
            start_date: '2026-12-01',
            end_date: '2026-12-02',
            start_time: '10:00',
            end_time: '12:00',
            status: 'active'
        });
        const createdBookingId = resBookPost.body.data ? resBookPost.body.data.id : null;
        assertTest('POST /bookings (Create booking)', resBookPost.status === 201 && createdBookingId !== null, `Created Booking ID: ${createdBookingId}`);

        const resBookPut = await makeRequest('PUT', `/bookings/${createdBookingId}`, {
            doctor_id: 1,
            room_id: 1,
            start_date: '2026-12-01',
            end_date: '2026-12-02',
            start_time: '11:00',
            end_time: '13:00',
            status: 'active'
        });
        assertTest('PUT /bookings/:id (Update booking time)', resBookPut.status === 200 && resBookPut.body.data.start_time === '11:00', `Updated start_time to 11:00`);

        const resBookDel = await makeRequest('DELETE', `/bookings/${createdBookingId}`);
        assertTest('DELETE /bookings/:id (Delete booking)', resBookDel.status === 200 && resBookDel.body.success === true, `Deleted Booking ID: ${createdBookingId}`);

        // --- TEST SUITE 5: ASSIGNMENT TWIST COMPULSORY TEST CASES ---
        console.log('\n--- 5. ASSIGNMENT TWIST - COMPULSORY 3 TEST CASES ---');

        // COMPULSORY TEST 1:
        // Try to create booking with End date before Start date:
        // Start date: 2026-11-15, End date: 2026-11-14
        // Expected: HTTP 400 Bad Request with error: "End date cannot be earlier than start date."
        const resTwistTest1 = await makeRequest('POST', '/bookings', {
            doctor_id: 1,
            room_id: 3,
            start_date: '2026-11-15',
            end_date: '2026-11-14',
            start_time: '09:00',
            end_time: '12:00'
        });
        const test1Passed = resTwistTest1.status === 400 &&
            resTwistTest1.body.error === 'End date cannot be earlier than start date.';
        assertTest(
            'TEST 1 (COMPULSORY): End before start -> HTTP 400 Bad Request',
            test1Passed,
            `Status: ${resTwistTest1.status}, Error Message: "${resTwistTest1.body.error}"`
        );

        // COMPULSORY TEST 2:
        // Existing booking: Room 3, 2026-11-10 to 2026-11-12.
        // Request: GET /rooms/available?date=2026-11-11
        // Expected: HTTP 200, Room 3 must NOT appear in response!
        const resTwistTest2 = await makeRequest('GET', '/rooms/available?date=2026-11-11');
        const room3InTest2 = resTwistTest2.body.data && resTwistTest2.body.data.some(r => r.id === 3 || r.room_number === 'Room 3');
        const test2Passed = resTwistTest2.status === 200 && !room3InTest2;
        assertTest(
            'TEST 2 (COMPULSORY): Booking 10-12 Nov; available?date=11 Nov -> Room 3 MISSING',
            test2Passed,
            `Status: ${resTwistTest2.status}, Room 3 present? ${room3InTest2} (Available count: ${resTwistTest2.body.available_count})`
        );

        // COMPULSORY TEST 3:
        // Request: GET /rooms/available?date=2026-11-13
        // Expected: HTTP 200, Room 3 MUST appear in response because booking ended Nov 12.
        const resTwistTest3 = await makeRequest('GET', '/rooms/available?date=2026-11-13');
        const room3InTest3 = resTwistTest3.body.data && resTwistTest3.body.data.some(r => r.id === 3 || r.room_number === 'Room 3');
        const test3Passed = resTwistTest3.status === 200 && room3InTest3;
        assertTest(
            'TEST 3 (COMPULSORY): available?date=13 Nov -> Room 3 LISTED',
            test3Passed,
            `Status: ${resTwistTest3.status}, Room 3 present? ${room3InTest3} (Available count: ${resTwistTest3.body.available_count})`
        );

        // --- TEST SUITE 6: OVERLAPPING CONFLICT PREVENTION ---
        console.log('\n--- 6. OVERLAPPING BOOKING CONFLICT PREVENTION ---');
        // Try booking Room 3 on 2026-11-11 from 10:00 to 12:00 (overlaps with existing booking 09:00 to 13:00)
        const resOverlap = await makeRequest('POST', '/bookings', {
            doctor_id: 3,
            room_id: 3,
            start_date: '2026-11-11',
            end_date: '2026-11-11',
            start_time: '10:00',
            end_time: '12:00'
        });
        const overlapPassed = resOverlap.status === 409 &&
            resOverlap.body.error === 'Room is already booked for the selected date and time interval.';
        assertTest(
            'CONFLICT RULE: Overlapping booking in Room 3 -> HTTP 409 Conflict',
            overlapPassed,
            `Status: ${resOverlap.status}, Error Message: "${resOverlap.body.error}"`
        );

        // --- TEST SUITE 7: INPUT VALIDATION CHECKS ---
        console.log('\n--- 7. INPUT VALIDATION & ERROR HANDLING ---');
        const resInvalidDoc = await makeRequest('POST', '/doctors', { name: '' });
        assertTest('Validation: Missing fields in POST /doctors -> HTTP 400', resInvalidDoc.status === 400, resInvalidDoc.body.error);

        const resInvalidRoom = await makeRequest('POST', '/rooms', { room_number: '', floor: 'abc' });
        assertTest('Validation: Invalid floor in POST /rooms -> HTTP 400', resInvalidRoom.status === 400, resInvalidRoom.body.error);

        const resMissingDate = await makeRequest('GET', '/rooms/available');
        assertTest('Validation: Missing date in GET /rooms/available -> HTTP 400', resMissingDate.status === 400, resMissingDate.body.error);

        const resNonExistent = await makeRequest('GET', '/doctors/9999');
        assertTest('Not Found: Non-existent doctor ID -> HTTP 404', resNonExistent.status === 404, resNonExistent.body.error);

        console.log('\n================================================================');
        const total = testResults.length;
        const passedCount = testResults.filter(t => t.passed).length;
        console.log(`SUMMARY: ${passedCount}/${total} TESTS PASSED (${((passedCount/total)*100).toFixed(1)}%)`);
        console.log('================================================================\n');

        return passedCount === total;
    } catch (err) {
        console.error('Test Suite encountered an error:', err);
        return false;
    } finally {
        server.close();
    }
}

if (require.main === module) {
    runAllTests().then((allPassed) => {
        process.exit(allPassed ? 0 : 1);
    });
}

module.exports = { runAllTests, makeRequest };
