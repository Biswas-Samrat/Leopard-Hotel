const mysql = require('mysql2/promise');
require('dotenv').config();
require('colors');

const testMySQLConnection = async () => {
    console.log('Testing MySQL Connection...'.yellow.bold);
    console.log(`Host: ${process.env.DB_HOST}`.cyan);
    console.log(`User: ${process.env.DB_USER}`.cyan);
    console.log(`Database: ${process.env.DB_NAME}`.cyan);
    console.log(`Port: ${process.env.DB_PORT || 3306}`.cyan);
    console.log('\nAttempting to connect...'.yellow);

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306,
            connectTimeout: 10000 // 10 seconds timeout
        });

        console.log('\n✓ Successfully connected to MySQL database!'.green.bold);

        // Test a simple query
        const [rows] = await connection.execute('SELECT 1 + 1 AS solution');
        console.log(`Test query result: ${rows[0].solution}`.green);

        // Get database info
        const [dbInfo] = await connection.execute('SELECT DATABASE() as db');
        console.log(`Current database: ${dbInfo[0].db}`.green);

        // List all tables
        const [tables] = await connection.execute(
            `SELECT table_name FROM information_schema.tables WHERE table_schema = ?`,
            [process.env.DB_NAME]
        );

        console.log(`\nTables in database (${tables.length}):`.cyan.bold);
        if (tables.length > 0) {
            tables.forEach(table => {
                console.log(`  - ${table.table_name || table.TABLE_NAME}`.white);
            });
        } else {
            console.log('  No tables found'.yellow);
        }

        await connection.end();
        console.log('\n✓ Connection closed successfully'.green);
        process.exit(0);

    } catch (err) {
        console.error('\n✗ Connection failed!'.red.bold);
        console.error(`Error: ${err.message}`.red);
        console.error(`Error code: ${err.code}`.red);

        if (err.code === 'ETIMEDOUT') {
            console.log('\n⚠️  Troubleshooting tips:'.yellow.bold);
            console.log('  1. Check if your IP address is whitelisted in Hostinger'.yellow);
            console.log('  2. Verify the database host allows remote connections'.yellow);
            console.log('  3. Check firewall settings'.yellow);
        } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\n⚠️  Access denied - check your credentials'.yellow.bold);
        }

        process.exit(1);
    }
};

testMySQLConnection();
