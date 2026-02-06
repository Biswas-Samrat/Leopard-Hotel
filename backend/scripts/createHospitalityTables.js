const path = require('path');
const { pool } = require(path.join(__dirname, '../config/mysql'));
const colors = require('colors');

const createTables = async () => {
    try {
        console.log('Creating hospitality tables...'.yellow);

        // Restaurant Bookings Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS restaurant_bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                date DATE NOT NULL,
                time VARCHAR(50) NOT NULL,
                guests INT NOT NULL DEFAULT 1,
                special_requests TEXT,
                status VARCHAR(50) DEFAULT 'confirmed',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Restaurant bookings table created/verified'.green);

        // Pub Bookings Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS pub_bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                date DATE NOT NULL,
                time VARCHAR(50) NOT NULL,
                guests INT NOT NULL DEFAULT 1,
                special_requests TEXT,
                status VARCHAR(50) DEFAULT 'confirmed',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Pub bookings table created/verified'.green);

        // Function Bookings Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS function_bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                event_type VARCHAR(100),
                date DATE NOT NULL,
                guests INT NOT NULL DEFAULT 1,
                details TEXT,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Function bookings table created/verified'.green);

        console.log('All tables setup successfully'.cyan.bold);
        process.exit(0);

    } catch (err) {
        console.error(`Error creating tables: ${err.message}`.red);
        process.exit(1);
    }
};

createTables();
