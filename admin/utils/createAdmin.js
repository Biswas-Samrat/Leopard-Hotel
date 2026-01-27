const path = require('path');
const { pool } = require(path.join(__dirname, '../../backend/config/mysql'));
const bcrypt = require('bcryptjs');
require('colors');

const createAdmin = async () => {
    try {
        const name = 'Admin';
        const email = 'admin@leopardhotel.com';
        const password = 'admin123'; // Change this password after first login!

        console.log('Creating admin user...'.yellow.bold);

        // Check if admin already exists
        const [existing] = await pool.query(
            'SELECT id FROM admins WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            console.log('⚠️  Admin user already exists!'.yellow);
            console.log(`Email: ${email}`.cyan);
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create admin
        await pool.query(
            'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        console.log('\n✓ Admin user created successfully!'.green.bold);
        console.log('\nLogin credentials:'.cyan.bold);
        console.log(`Email: ${email}`.cyan);
        console.log(`Password: ${password}`.cyan);
        console.log('\n⚠️  IMPORTANT: Change this password after first login!'.yellow.bold);

        process.exit(0);

    } catch (error) {
        console.error('✗ Error creating admin:'.red.bold, error.message);
        process.exit(1);
    }
};

createAdmin();
