const path = require('path');
const { pool } = require(path.join(__dirname, '../config/mysql'));
require('colors');

const demoRooms = [
    {
        room_number: '101',
        room_type: 'Deluxe',
        capacity: 2,
        price_per_night: 150.00,
        status: 'available',
        description: 'Spacious deluxe room with ocean view and modern amenities',
        amenities: 'WiFi, AC, TV, Mini Bar, Ocean View, Room Service'
    },
    {
        room_number: '102',
        room_type: 'Standard',
        capacity: 2,
        price_per_night: 100.00,
        status: 'available',
        description: 'Comfortable standard room perfect for couples',
        amenities: 'WiFi, AC, TV, Private Bathroom'
    },
    {
        room_number: '201',
        room_type: 'Suite',
        capacity: 4,
        price_per_night: 300.00,
        status: 'occupied',
        description: 'Luxurious suite with separate living area and panoramic views',
        amenities: 'WiFi, AC, Smart TV, Mini Bar, Jacuzzi, Balcony, Room Service, Kitchen'
    },
    {
        room_number: '202',
        room_type: 'Deluxe',
        capacity: 2,
        price_per_night: 160.00,
        status: 'available',
        description: 'Premium deluxe room with city view',
        amenities: 'WiFi, AC, TV, Mini Bar, City View, Safe'
    },
    {
        room_number: '203',
        room_type: 'Standard',
        capacity: 1,
        price_per_night: 80.00,
        status: 'maintenance',
        description: 'Cozy single room ideal for solo travelers',
        amenities: 'WiFi, AC, TV, Work Desk'
    },
    {
        room_number: '301',
        room_type: 'Presidential Suite',
        capacity: 6,
        price_per_night: 500.00,
        status: 'available',
        description: 'Top-floor presidential suite with breathtaking views and premium services',
        amenities: 'WiFi, AC, Smart TV, Mini Bar, Jacuzzi, Private Terrace, Butler Service, Kitchen, Dining Room'
    },
    {
        room_number: '302',
        room_type: 'Deluxe',
        capacity: 3,
        price_per_night: 180.00,
        status: 'available',
        description: 'Family deluxe room with extra bed',
        amenities: 'WiFi, AC, TV, Mini Bar, Extra Bed, Safe'
    },
    {
        room_number: '303',
        room_type: 'Suite',
        capacity: 4,
        price_per_night: 280.00,
        status: 'occupied',
        description: 'Elegant suite with modern design and luxury amenities',
        amenities: 'WiFi, AC, Smart TV, Mini Bar, Balcony, Room Service'
    },
    {
        room_number: '401',
        room_type: 'Standard',
        capacity: 2,
        price_per_night: 110.00,
        status: 'available',
        description: 'Well-appointed standard room with garden view',
        amenities: 'WiFi, AC, TV, Garden View, Private Bathroom'
    },
    {
        room_number: '402',
        room_type: 'Deluxe',
        capacity: 2,
        price_per_night: 170.00,
        status: 'available',
        description: 'Deluxe room featuring contemporary decor and premium bedding',
        amenities: 'WiFi, AC, TV, Mini Bar, Premium Bedding, Safe, Balcony'
    }
];

const addDemoRooms = async () => {
    try {
        console.log('Adding demo room data...'.yellow.bold);

        for (const room of demoRooms) {
            // Check if room already exists
            const [existing] = await pool.query(
                'SELECT id FROM rooms WHERE room_number = ?',
                [room.room_number]
            );

            if (existing.length > 0) {
                console.log(`⚠️  Room ${room.room_number} already exists, skipping...`.yellow);
                continue;
            }

            // Insert room
            await pool.query(
                `INSERT INTO rooms (room_number, room_type, capacity, price_per_night, status, description, amenities, images)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    room.room_number,
                    room.room_type,
                    room.capacity,
                    room.price_per_night,
                    room.status,
                    room.description,
                    room.amenities,
                    '[]'
                ]
            );

            console.log(`✓ Added room ${room.room_number} - ${room.room_type}`.green);
        }

        console.log('\n✓ All demo rooms added successfully!'.green.bold);
        console.log(`\nTotal rooms created: ${demoRooms.length}`.cyan);

        // Display summary
        const summary = demoRooms.reduce((acc, room) => {
            acc[room.room_type] = (acc[room.room_type] || 0) + 1;
            return acc;
        }, {});

        console.log('\nRooms by type:'.cyan.bold);
        Object.entries(summary).forEach(([type, count]) => {
            console.log(`  - ${type}: ${count}`.cyan);
        });

        process.exit(0);

    } catch (error) {
        console.error('✗ Error adding demo rooms:'.red.bold, error.message);
        process.exit(1);
    }
};

addDemoRooms();
