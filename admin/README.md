# Leopard Hotel - Admin Panel System

## 📁 Folder Structure

```
Leopard Hotel/
├── admin/                          # 🎯 ADMIN SYSTEM (Main folder)
│   ├── controllers/
│   │   ├── authController.js      # Admin authentication
│   │   ├── dashboardController.js # Dashboard statistics
│   │   ├── roomController.js      # Room management
│   │   ├── bookingController.js   # Booking management
│   │   └── guestController.js     # Guest management
│   ├── middleware/
│   │   └── auth.js                # JWT authentication middleware
│   ├── routes/
│   │   ├── authRoutes.js          # Authentication routes
│   │   ├── dashboardRoutes.js     # Dashboard routes
│   │   ├── roomRoutes.js          # Room routes
│   │   ├── bookingRoutes.js       # Booking routes
│   │   └── guestRoutes.js         # Guest routes
│   ├── utils/
│   │   ├── setupDatabase.js       # Database table creation script
│   │   └── createAdmin.js         # Create default admin user
│   └── README.md                   # This file
│
└── backend/
    ├── config/
    │   └── mysql.js               # MySQL connection config
    ├── server.js                  # Main server file (references ../admin)
    └── ...
```

## 🚀 Setup Instructions

### 1. Create Database Tables

Run this command from the project root:

```bash
node admin/utils/setupDatabase.js
```

This will create:
- `admins` - Admin user accounts
- `guests` - Guest information
- `rooms` - Hotel room details
- `bookings` - Booking records

### 2. Create Default Admin User

Run this command from the project root:

```bash
node admin/utils/createAdmin.js
```

**Default Login Credentials:**
- Email: `admin@leopardhotel.com`
- Password: `admin123`

⚠️ **IMPORTANT:** Change this password after first login!

## 📡 API Endpoints

### Authentication Routes

#### Login
```http
POST /api/admin/auth/login
Content-Type: application/json

{
  "email": "admin@leopardhotel.com",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "name": "Admin",
    "email": "admin@leopardhotel.com"
  }
}
```

#### Get Admin Profile
```http
GET /api/admin/auth/me
Authorization: Bearer <token>
```

#### Update Password
```http
PUT /api/admin/auth/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "admin123",
  "newPassword": "newSecurePassword"
}
```

### Dashboard Routes

#### Get Dashboard Statistics
```http
GET /api/admin/dashboard/stats
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "stats": {
    "totalBookings": 25,
    "totalRooms": 50,
    "totalGuests": 100,
    "totalRevenue": 50000,
    "occupancyRate": 75.5
  },
  "recentBookings": [...]
}
```

#### Get Revenue Data
```http
GET /api/admin/dashboard/revenue
Authorization: Bearer <token>
```

### Room Management Routes

#### Get All Rooms
```http
GET /api/admin/rooms
Authorization: Bearer <token>
```

#### Get Single Room
```http
GET /api/admin/rooms/:id
Authorization: Bearer <token>
```

#### Create New Room
```http
POST /api/admin/rooms
Authorization: Bearer <token>
Content-Type: application/json

{
  "room_number": "101",
  "room_type": "Deluxe",
  "capacity": 2,
  "price_per_night": 150.00,
  "status": "available",
  "description": "Spacious room with ocean view",
  "amenities": "WiFi, AC, TV, Mini Bar"
}
```

#### Update Room
```http
PUT /api/admin/rooms/:id
Authorization: Bearer <token>
Content-Type: application/json
```

#### Delete Room
```http
DELETE /api/admin/rooms/:id
Authorization: Bearer <token>
```

### Booking Management Routes

#### Get All Bookings
```http
GET /api/admin/bookings?status=confirmed&startDate=2026-01-01&endDate=2026-12-31
Authorization: Bearer <token>
```

Query Parameters:
- `status` - Filter by booking status (pending, confirmed, checked-in, checked-out, cancelled)
- `startDate` - Filter by check-in date (YYYY-MM-DD)
- `endDate` - Filter by check-out date (YYYY-MM-DD)

#### Get Single Booking
```http
GET /api/admin/bookings/:id
Authorization: Bearer <token>
```

#### Update Booking Status
```http
PUT /api/admin/bookings/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

Valid status values: `pending`, `confirmed`, `checked-in`, `checked-out`, `cancelled`

#### Delete Booking
```http
DELETE /api/admin/bookings/:id
Authorization: Bearer <token>
```

### Guest Management Routes

#### Get All Guests
```http
GET /api/admin/guests?search=john
Authorization: Bearer <token>
```

#### Get Single Guest (with booking history)
```http
GET /api/admin/guests/:id
Authorization: Bearer <token>
```

#### Update Guest
```http
PUT /api/admin/guests/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main St, City, Country",
  "id_proof": "Passport: AB123456"
}
```

#### Delete Guest
```http
DELETE /api/admin/guests/:id
Authorization: Bearer <token>
```

## 🔐 Authentication

All admin routes (except login) require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

The token is valid for 7 days and must have the `role: 'admin'` claim.

## 🗄️ Database Schema

### admins
- `id` - INT (Primary Key)
- `name` - VARCHAR(255)
- `email` - VARCHAR(255) (Unique)
- `password` - VARCHAR(255) (Hashed)
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

### guests
- `id` - INT (Primary Key)
- `name` - VARCHAR(255)
- `email` - VARCHAR(255) (Unique)
- `phone` - VARCHAR(50)
- `address` - TEXT
- `id_proof` - VARCHAR(255)
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

### rooms
- `id` - INT (Primary Key)
- `room_number` - VARCHAR(50) (Unique)
- `room_type` - VARCHAR(100)
- `capacity` - INT
- `price_per_night` - DECIMAL(10, 2)
- `status` - ENUM('available', 'occupied', 'maintenance')
- `description` - TEXT
- `amenities` - TEXT
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

### bookings
- `id` - INT (Primary Key)
- `guest_id` - INT (Foreign Key to guests)
- `room_id` - INT (Foreign Key to rooms)
- `check_in` - DATE
- `check_out` - DATE
- `num_guests` - INT
- `total_amount` - DECIMAL(10, 2)
- `status` - ENUM('pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled')
- `special_requests` - TEXT
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

## 🛡️ Security Features

1. **Password Hashing**: All passwords are hashed using bcryptjs (10 salt rounds)
2. **JWT Authentication**: Secure token-based authentication
3. **Role-Based Access**: Only users with 'admin' role can access admin routes
4. **Token Expiration**: Tokens expire after 7 days
5. **Input Validation**: All inputs are validated before processing

## 🚀 Quick Start

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Test the login:**
   ```bash
   curl -X POST http://localhost:5000/api/admin/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@leopardhotel.com","password":"admin123"}'
   ```

3. **Use the token for authenticated requests**

## 📝 Notes

- All responses follow the format: `{ success: boolean, message?: string, data?: any }`
- Error responses include appropriate HTTP status codes
- FK constraints prevent orphaned records
- Room status automatically updates based on booking status
- Cannot delete resources with active dependencies

---

**Happy Managing! 🏨✨**
