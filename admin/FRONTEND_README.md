# Leopard Hotel - Admin Frontend

## 🎨 Modern Admin Dashboard

A beautiful, responsive admin panel for managing Leopard Hotel operations.

## ✨ Features

### 🔐 Authentication
- Secure login with JWT tokens
- Password change functionality
- Auto-redirect on authentication failure

### 📊 Dashboard
- Real-time statistics (rooms, bookings, guests, revenue)
- Occupancy rate visualization
- Recent bookings overview
- Quick action buttons

### 🏨 Room Management
- Create, update, and delete rooms
- Search and filter rooms
- Room status management (available/occupied/maintenance)
- Detailed room information (capacity, price, amenities)

### 📅 Booking Management
- View all bookings with filters
- Update booking status (pending/confirmed/checked-in/checked-out/cancelled)
- Search by guest name or room number
- Delete bookings
- Automatic room status synchronization

### 👥 Guest Management
- View all guests
- Advanced search functionality
- Guest details with booking history
- Delete guest profiles

### ⚙️ Settings
- View admin profile
- Change password
- Secure password validation

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Backend server running on port 5000

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Access the admin panel:**
   ```
   http://localhost:3001
   ```

### Default Login Credentials

```
Email: admin@leopardhotel.com
Password: admin123
```

⚠️ **Change this password after first login!**

## 📁 Project Structure

```
admin/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout.jsx       # Main layout wrapper
│   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   └── Header.jsx       # Top header bar
│   │
│   ├── pages/               # Main pages
│   │   ├── Login.jsx        # Login page
│   │   ├── Dashboard.jsx    # Dashboard with stats
│   │   ├── Rooms.jsx        # Room management
│   │   ├── Bookings.jsx     # Booking management
│   │   ├── Guests.jsx       # Guest management
│   │   └── Settings.jsx     # Admin settings
│   │
│   ├── context/             # React context
│   │   └── AuthContext.jsx  # Authentication state
│   │
│   ├── utils/               # Utilities
│   │   └── api.js           # API client & endpoints
│   │
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
│
├── controllers/             # Backend controllers
├── middleware/              # Auth middleware
├── routes/                  # API routes
└── utils/                   # Setup scripts

```

## 🎨 Design Features

- **Modern UI**: Clean, professional interface with golden accents
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Hover effects and transitions
- **Intuitive Navigation**: Easy-to-use sidebar navigation
- **Status Badges**: Color-coded status indicators
- **Modal Forms**: Clean overlay forms for CRUD operations
- **Search & Filter**: Quick data access
- **Loading States**: User feedback during operations

## 🔧 Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## 📡 API Integration

The frontend connects to the backend API at `http://localhost:5000/api/admin/`

### API Endpoints Used:
- `/admin/auth/login` - Login
- `/admin/auth/me` - Get profile
- `/admin/auth/password` - Update password
- `/admin/dashboard/stats` - Dashboard statistics
- `/admin/rooms` - Room CRUD operations
- `/admin/bookings` - Booking management
- `/admin/guests` - Guest management

## 🎯 Key Features

### Dashboard
- **Statistics Cards**: Total rooms, bookings, guests, revenue
- **Occupancy Chart**: Visual representation of room occupancy
- **Recent Bookings**: Latest booking activity
- **Quick Actions**: Fast access to main features

### Room Management
- **Full CRUD**: Create, read, update, delete rooms
- **Search**: Find rooms by number or type
- **Status Management**: Available, occupied, or maintenance
- **Validation**: Prevents duplicate room numbers

### Booking Management
- **Status Updates**: Change booking status inline
- **Filtering**: Filter by status (pending, confirmed, etc.)
- **Search**: Find bookings by guest or room
- **Room Sync**: Automatic room status updates

### Guest Management
- **Search**: Advanced guest search
- **Details View**: Complete guest profile with booking history
- **Protection**: Cannot delete guests with active bookings

## 🔒 Security

- JWT token authentication
- Automatic token expiration handling
- Protected routes
- Secure password hashing
- XSS protection

## 💡 Usage Tips

1. **Login**: Use the default credentials to access the admin panel
2. **Dashboard**: Overview of hotel operations at a glance
3. **Rooms**: Add and manage all hotel rooms
4. **Bookings**: Track and update guest reservations
5. **Guests**: View customer information and history
6. **Settings**: Update your admin password

## 🎨 Color Scheme

- **Primary**: Golden (#ca9c5e)
- **Secondary**: Dark Blue (#2c3e50)
- **Success**: Green (#10b981)
- **Danger**: Red (#ef4444)
- **Warning**: Orange (#f59e0b)
- **Info**: Blue (#3b82f6)

## 📱 Responsive Breakpoints

- **Desktop**: > 768px
- **Tablet**: 768px
- **Mobile**: < 768px

## 🚧 Future Enhancements

- [ ] Advanced analytics and reports
- [ ] Email notifications
- [ ] Revenue charts
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Export data to Excel/PDF
- [ ] Real-time updates with WebSocket

## 📞 Support

For issues or questions, refer to the main project README or contact the development team.

---

**Built with ❤️ for Leopard Hotel**
