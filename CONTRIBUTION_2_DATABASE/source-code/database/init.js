const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbDir = path.join(__dirname);
const dbPath = path.join(dbDir, 'clinicq.db');
const schemaPath = path.join(dbDir, 'schema.sql');
const seedPath = path.join(dbDir, 'seed.sql');

console.log('--- Initializing ClinicQ SQLite Database ---');

// If database exists, remove it for fresh setup
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('Removed existing database file.');
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Failed to create database file:', err.message);
        process.exit(1);
    }
    console.log('Created fresh SQLite database at:', dbPath);
});

const schemaSql = fs.readFileSync(schemaPath, 'utf8');
const seedSql = fs.readFileSync(seedPath, 'utf8');

db.serialize(() => {
    db.run('PRAGMA foreign_keys = ON;', (err) => {
        if (err) console.error('Error enabling foreign keys:', err);
    });

    db.exec(schemaSql, (err) => {
        if (err) {
            console.error('Error applying schema:', err.message);
            process.exit(1);
        }
        console.log('Schema applied successfully.');

        db.exec(seedSql, (seedErr) => {
            if (seedErr) {
                console.error('Error seeding data:', seedErr.message);
                process.exit(1);
            }
            console.log('Seed data inserted successfully.');

            // Verify row counts
            db.all("SELECT 'doctors' as tbl, count(*) as count FROM doctors UNION ALL SELECT 'rooms', count(*) FROM rooms UNION ALL SELECT 'bookings', count(*) FROM bookings;", (countErr, rows) => {
                if (countErr) {
                    console.error('Error verifying counts:', countErr);
                } else {
                    console.log('Database Summary:');
                    rows.forEach(r => console.log(`  - Table: ${r.tbl.padEnd(10)} | Records: ${r.count}`));
                }
                db.close((closeErr) => {
                    if (closeErr) console.error('Error closing db:', closeErr);
                    else console.log('Database initialization complete.\n');
                });
            });
        });
    });
});
