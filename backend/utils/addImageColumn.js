const path = require('path');
const { pool } = require(path.join(__dirname, '../config/mysql'));
require('colors');

const addImageColumn = async () => {
    try {
        console.log('Adding image columns to rooms table...'.yellow.bold);

        // Add images column to rooms table (will store JSON array of image URLs)
        await pool.query(`
            ALTER TABLE rooms 
            ADD COLUMN IF NOT EXISTS images TEXT AFTER amenities
        `);

        console.log('✓ Image column added to rooms table'.green);

        // Update existing rooms with empty array
        await pool.query(`
            UPDATE rooms 
            SET images = '[]' 
            WHERE images IS NULL
        `);

        console.log('✓ Existing rooms updated with empty image arrays'.green);
        console.log('\n✓ All updates completed successfully!'.green.bold);
        process.exit(0);

    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('⚠️  Image column already exists'.yellow);
            process.exit(0);
        } else {
            console.error('✗ Error updating database:'.red.bold, error.message);
            process.exit(1);
        }
    }
};

addImageColumn();
