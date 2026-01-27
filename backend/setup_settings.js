const path = require('path');
const { pool } = require('./config/mysql');

async function setupSettings() {
    try {
        // Create settings table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                setting_key VARCHAR(50) UNIQUE NOT NULL,
                setting_value JSON NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_VALUE ON UPDATE CURRENT_VALUE
            )
        `).catch(err => {
            // In case MySQL version doesn't support JSON or has different syntax for CURRENT_VALUE
            return pool.query(`
                CREATE TABLE IF NOT EXISTS settings (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    setting_key VARCHAR(50) UNIQUE NOT NULL,
                    setting_value TEXT NOT NULL,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
             `);
        });

        const initialConfig = {
            hero_desktop: '/hero (2).png',
            hero_mobile: '/hero for mobail.png',
            elegance_top: '/luxury-suite.png',
            elegance_bottom: '/luxury-lobby.png',
            featured_rooms: [] // array of room IDs in order
        };

        await pool.query(
            'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
            ['home_page', JSON.stringify(initialConfig), JSON.stringify(initialConfig)]
        );

        console.log('Settings table and initial config setup successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

setupSettings();
