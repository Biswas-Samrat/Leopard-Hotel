const { pool } = require('./config/mysql');
require('dotenv').config();
require('colors');

const deleteAllData = async () => {
    try {
        console.log('Connecting to database...'.yellow);
        const connection = await pool.getConnection();

        console.log('Connected successfully!'.green);
        console.log('\nFetching all tables...'.yellow);

        // Get all tables in the database
        const [tables] = await connection.query(
            `SELECT table_name FROM information_schema.tables WHERE table_schema = ?`,
            [process.env.DB_NAME]
        );

        if (tables.length === 0) {
            console.log('No tables found in the database.'.yellow);
            connection.release();
            process.exit(0);
        }

        console.log(`Found ${tables.length} table(s):\n`.cyan);
        tables.forEach(table => {
            console.log(`  - ${table.table_name || table.TABLE_NAME}`.white);
        });

        console.log('\n⚠️  WARNING: This will DELETE ALL DATA from all tables!'.red.bold);
        console.log('Starting deletion in 3 seconds...'.yellow);

        // Wait 3 seconds before proceeding
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Disable foreign key checks
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        console.log('\nDisabled foreign key checks'.cyan);

        // Delete data from each table
        for (const table of tables) {
            const tableName = table.table_name || table.TABLE_NAME;
            try {
                await connection.query(`DELETE FROM ${tableName}`);
                console.log(`✓ Deleted all data from table: ${tableName}`.green);
            } catch (err) {
                console.error(`✗ Error deleting from ${tableName}: ${err.message}`.red);
            }
        }

        // Re-enable foreign key checks
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('\nRe-enabled foreign key checks'.cyan);

        console.log('\n✓ All data has been deleted successfully!'.green.bold);

        connection.release();
        process.exit(0);

    } catch (err) {
        console.error(`\n✗ Error: ${err.message}`.red.bold);
        process.exit(1);
    }
};

// Execute the deletion
deleteAllData();
