const mysql = require('mysql2/promise');
require('dotenv').config();
const colors = require('colors');

const setupGalleryTable = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306
        });

        console.log('Connected to database. Creating gallery_photos table...'.yellow);

        const createGalleryPhotos = `
            CREATE TABLE IF NOT EXISTS gallery_photos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category ENUM('restaurant', 'pub', 'function') NOT NULL,
                image_url TEXT NOT NULL,
                public_id VARCHAR(255) NOT NULL,
                display_order INT NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await connection.query(createGalleryPhotos);
        console.log('gallery_photos table created successfully'.green);

        await connection.end();
    } catch (err) {
        console.error('Error setting up gallery table:', err);
    }
};

setupGalleryTable();
