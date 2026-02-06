const { pool } = require('./config/mysql');

async function fixSchema() {
    try {
        console.log('--- MODIFYING COLUMNS TO VARCHAR(50) ---');

        // Restaurant
        console.log('Altering restaurant_bookings...');
        await pool.query("ALTER TABLE restaurant_bookings MODIFY COLUMN status VARCHAR(50) DEFAULT 'confirmed'");

        // Pub
        console.log('Altering pub_bookings...');
        await pool.query("ALTER TABLE pub_bookings MODIFY COLUMN status VARCHAR(50) DEFAULT 'confirmed'");

        // Function
        console.log('Altering function_bookings...');
        await pool.query("ALTER TABLE function_bookings MODIFY COLUMN status VARCHAR(50) DEFAULT 'received'");

        console.log('Schema update complete.');
        process.exit();
    } catch (e) {
        console.error('Migration failed:', e);
        process.exit(1);
    }
}
fixSchema();
