const mysql = require('mysql2/promise');
require('dotenv').config();
const colors = require('colors');

const setupNewTables = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306
        });

        console.log('Connected to database. Creating new tables...'.yellow);

        const createRestaurantBookings = `
            CREATE TABLE IF NOT EXISTS restaurant_bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                date DATE NOT NULL,
                time TIME NOT NULL,
                guests INT NOT NULL,
                special_requests TEXT,
                status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        const createPubBookings = `
            CREATE TABLE IF NOT EXISTS pub_bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                date DATE NOT NULL,
                time TIME NOT NULL,
                guests INT NOT NULL,
                special_requests TEXT,
                status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        const createFunctionBookings = `
            CREATE TABLE IF NOT EXISTS function_bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                event_type VARCHAR(100) NOT NULL,
                date DATE NOT NULL,
                guests INT NOT NULL,
                details TEXT,
                status ENUM('pending', 'reviewed', 'confirmed', 'cancelled') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await connection.query(createRestaurantBookings).catch(e => { console.error("Error creating restaurant_bookings:", e); throw e; });
        console.log('restaurant_bookings table created'.green);

        await connection.query(createPubBookings).catch(e => { console.error("Error creating pub_bookings:", e); throw e; });
        console.log('pub_bookings table created'.green);

        await connection.query(createFunctionBookings).catch(e => { console.error("Error creating function_bookings:", e); throw e; });
        console.log('function_bookings table created'.green);

        await connection.end();
        console.log('All tables created successfully'.cyan.bold);
    } catch (err) {
        console.error('FINAL ERROR:', err);
        // process.exit(1); 
    }
};

setupNewTables();
