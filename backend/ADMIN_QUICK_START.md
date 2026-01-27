# Leopard Hotel Admin System - Quick Start Guide

## ✅ Setup Complete!

Your admin system has been successfully set up with the following:

### 📦 What Was Created:

1. **Admin Folder Structure**
   - Controllers (5 files) - Handle business logic
   - Routes (5 files) - Define API endpoints
   - Middleware (1 file) - JWT authentication
   - Utils (2 files) - Database setup & admin creation

2. **Database Tables**
   - ✓ admins - Admin user accounts
   - ✓ guests - Guest information
   - ✓ rooms - Hotel room details
   - ✓ bookings - Booking records

3. **Admin User**
   - ✓ Default admin created

### 🔑 Admin Login Credentials

```
Email: admin@leopardhotel.com
Password: admin123
```

⚠️ **IMPORTANT:** Change this password after first login!

## 🚀 Quick Start

### 1. Start the Server

```bash
npm run dev
```

### 2. Test Admin Login

Use Postman, Thunder Client, or cURL:

```bash
curl -X POST http://localhost:5000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@leopardhotel.com",
    "password": "admin123"
  }'
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

### 3. Use the Token

Copy the token and use it in subsequent requests:

```bash
curl -X GET http://localhost:5000/api/admin/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📚 API Endpoints Overview

### Authentication
- `POST /api/admin/auth/login` - Login
- `GET /api/admin/auth/me` - Get profile
- `PUT /api/admin/auth/password` - Update password

### Dashboard
- `GET /api/admin/dashboard/stats` - Get statistics
- `GET /api/admin/dashboard/revenue` - Get revenue data

### Rooms Management
- `GET /api/admin/rooms` - List all rooms
- `POST /api/admin/rooms` - Create room
- `GET /api/admin/rooms/:id` - Get room details
- `PUT /api/admin/rooms/:id` - Update room
- `DELETE /api/admin/rooms/:id` - Delete room

### Bookings Management
- `GET /api/admin/bookings` - List all bookings
- `GET /api/admin/bookings/:id` - Get booking details
- `PUT /api/admin/bookings/:id/status` - Update status
- `DELETE /api/admin/bookings/:id` - Delete booking

### Guests Management
- `GET /api/admin/guests` - List all guests
- `GET /api/admin/guests/:id` - Get guest details
- `PUT /api/admin/guests/:id` - Update guest
- `DELETE /api/admin/guests/:id` - Delete guest

## 🧪 Testing Example

### Create a Room

```bash
curl -X POST http://localhost:5000/api/admin/rooms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "room_number": "101",
    "room_type": "Deluxe",
    "capacity": 2,
    "price_per_night": 150.00,
    "status": "available",
    "description": "Spacious room with ocean view",
    "amenities": "WiFi, AC, TV, Mini Bar"
  }'
```

## 📖 Full Documentation

For complete API documentation, see:
- `admin/README.md` - Full admin system documentation
- `DATABASE_SETUP.md` - Database configuration guide

## 🛠️ Useful Commands

```bash
# Start development server
npm run dev

# Create database tables (if needed)
node admin/utils/setupDatabase.js

# Create admin user (if needed)
node admin/utils/createAdmin.js

# Test database connection
node testConnection.js

# Delete all data (⚠️ USE WITH CAUTION)
node deleteAllData.js
```

## 🎯 Next Steps

1. **Test the API** - Use Postman or Thunder Client to test endpoints
2. **Create Frontend** - Build admin dashboard UI
3. **Add More Features** - Extend functionality as needed
4. **Deploy** - Deploy to production server

## 🔒 Security Notes

- JWT tokens expire after 7 days
- Passwords are hashed with bcryptjs
- All admin routes require authentication
- Environment variables stored in `.env` (not in git)

## 📞 Need Help?

Check the full documentation in `admin/README.md` for detailed information about:
- All API endpoints
- Request/response formats
- Database schema
- Error handling
- Security features

---

**Happy Coding! 🚀**
