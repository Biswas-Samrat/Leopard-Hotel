const path = require('path');
const { pool } = require(path.join(__dirname, '../config/mysql'));
require('colors');

const clearDemoData = async () => {
    try {
        console.log('Cleaning up demo data...'.yellow.bold);

        // Turn off foreign key checks to allow truncation
        await pool.query('SET FOREIGN_KEY_CHECKS = 0');

        console.log('Truncating tables...'.cyan);

        await pool.query('TRUNCATE TABLE bookings');
        console.log('✓ Bookings table cleared'.green);

        await pool.query('TRUNCATE TABLE guests');
        console.log('✓ Guests table cleared'.green);

        await pool.query('TRUNCATE TABLE rooms');
        console.log('✓ Rooms table cleared'.green);

        // Turn foreign key checks back on
        await pool.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('\n✓ All demo data removed successfully!'.green.bold);
        process.exit(0);

    } catch (error) {
        console.error('✗ Error clearing demo data:'.red.bold, error.message);
        // Ensure FKEY checks are back on even if it fails
        await pool.query('SET FOREIGN_KEY_CHECKS = 1').catch(() => { });
        process.exit(1);
    }
};

clearDemoData();
