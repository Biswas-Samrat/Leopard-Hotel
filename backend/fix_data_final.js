const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mysql = require('mysql2/promise');

async function fixDataFinal() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306,
    });

    try {
        console.log('Connecting to database...');

        // 1. Ensure 'booked' exists in ENUM (Double check)
        await pool.query("ALTER TABLE rooms MODIFY COLUMN status ENUM('available', 'booked', 'maintenance', 'occupied') DEFAULT 'available'");
        console.log('Enum verified/updated');

        // 2. Set 'occupied' or empty to 'booked' if they have bookings
        const [bookings] = await pool.query("SELECT DISTINCT room_id FROM bookings WHERE status != 'cancelled'");
        console.log('Found', bookings.length, 'unique rooms with bookings');

        for (const b of bookings) {
            await pool.query("UPDATE rooms SET status = 'booked' WHERE id = ?", [b.room_id]);
            console.log(`Room ID ${b.room_id} set to booked`);
        }

        // 3. Set remaining empty statuses to 'available'
        const [res3] = await pool.query("UPDATE rooms SET status = 'available' WHERE status = '' OR status IS NULL");
        console.log('Reset', res3.affectedRows, 'empty/invalid statuses to available');

        console.log('Final data fix complete');
    } catch (err) {
        console.error('Error fixing data:', err);
    } finally {
        await pool.end();
        process.exit();
    }
}

fixDataFinal();
