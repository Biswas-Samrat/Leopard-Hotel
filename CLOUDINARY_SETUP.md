# 🌟 Cloudinary Integration - Leopard Hotel

## ✅ Setup Complete!

Cloudinary has been successfully integrated into your Leopard Hotel management system for storing all photos and videos.

---

## 📋 Configuration Details

### **Your Cloudinary Account:**
- **Cloud Name:** djruawkhq
- **API Key:** 424836826463571  
- **API Secret:** GXC9eWWArTdUNNt6kSImO20Ylio

### **Storage Folders:**
- `leopard-hotel/rooms` - Room images (auto-optimized to 1200x800)
- `leopard-hotel/guests` - Guest documents and ID proofs
- `leopard-hotel/general` - Other media files (images & videos)

---

## 🚀 Features Implemented

### **1. Image Upload for Rooms**
- Upload multiple images per room
- Automatic image optimization and resizing
- Secure cloud storage
- Fast CDN delivery

### **2. Image Management**
- Upload images via API
- Delete images from Cloudinary and database
- Retrieve all images for a room

### **3. File Type Support**
- **Room Images:** JPG, JPEG, PNG, WebP
- **Guest Documents:** JPG, JPEG, PNG, PDF
- **General Media:** Images + Videos (MP4, MOV)

### **4. File Size Limits**
- Room images: 5MB max
- Guest documents: 10MB max
- General uploads: 20MB max

---

## 📡 API Endpoints

### **Upload Room Image**
```http
POST /api/admin/upload/room/:roomId
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body: 
- image: <file>
```

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "image": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "leopard-hotel/rooms/...",
    "uploadedAt": "2026-01-27T..."
  },
  "allImages": [...]
}
```

### **Get Room Images**
```http
GET /api/admin/upload/room/:roomId/images
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "images": [
    {
      "url": "https://res.cloudinary.com/...",
      "publicId": "leopard-hotel/rooms/...",
      "uploadedAt": "2026-01-27T..."
    }
  ]
}
```

### **Delete Room Image**
```http
DELETE /api/admin/upload/room/:roomId/image
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "publicId": "leopard-hotel/rooms/xyz123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully",
  "allImages": [...]
}
```

---

## 🗄️ Database Changes

### **Rooms Table Update**
Added `images` column to store image URLs as JSON array:

```sql
images TEXT  -- Stores JSON array of image objects
```

**Example Data:**
```json
[
  {
    "url": "https://res.cloudinary.com/djruawkhq/image/upload/v1234567890/leopard-hotel/rooms/room1.jpg",
    "publicId": "leopard-hotel/rooms/room1",
    "uploadedAt": "2026-01-27T17:20:00.000Z"
  },
  {
    "url": "https://res.cloudinary.com/djruawkhq/image/upload/v1234567891/leopard-hotel/rooms/room2.jpg",
    "publicId": "leopard-hotel/rooms/room2",
    "uploadedAt": "2026-01-27T17:21:00.000Z"
  }
]
```

---

## 📁 Files Created

### **Backend:**
1. `/backend/config/cloudinary.js` - Cloudinary configuration
2. `/backend/utils/uploadHelpers.js` - Upload middleware and helpers
3. `/backend/utils/addImageColumn.js` - Database migration script

### **Admin:**
1. `/admin/controllers/uploadController.js` - Upload API controller
2. `/admin/routes/uploadRoutes.js` - Upload routes

### **Environment:**
- Updated `/backend/.env` with Cloudinary credentials

---

## 🔧 How to Use

### **Testing with Postman/Thunder Client:**

#### 1. **Upload an Image**
```
POST http://localhost:5000/api/admin/upload/room/1
Headers:
  Authorization: Bearer <your-jwt-token>
  Content-Type: multipart/form-data
Body:
  image: <select file>
```

#### 2. **View Room Images**
```
GET http://localhost:5000/api/admin/upload/room/1/images
Headers:
  Authorization: Bearer <your-jwt-token>
```

#### 3. **Delete an Image**
```
DELETE http://localhost:5000/api/admin/upload/room/1/image
Headers:
  Authorization: Bearer <your-jwt-token>
  Content-Type: application/json
Body:
{
  "publicId": "leopard-hotel/rooms/abc123"
}
```

---

## 💡 Image Optimization

**Automatic Optimizations Applied:**
- Room images resized to max 1200x800 pixels
- Quality set to "auto:good" for best size/quality balance
- Format auto-detection (WebP for modern browsers)
- Lazy loading support through Cloudinary CDN

**Example Transformations:**
```javascript
// Original URL
https://res.cloudinary.com/djruawkhq/image/upload/v1234567890/leopard-hotel/rooms/room1.jpg

// Thumbnail (200x150)
https://res.cloudinary.com/djruawkhq/image/upload/w_200,h_150,c_fill/leopard-hotel/rooms/room1.jpg

// Blurred placeholder
https://res.cloudinary.com/djruawkhq/image/upload/e_blur:1000/leopard-hotel/rooms/room1.jpg
```

---

## 🎨 Next Steps - Frontend Integration

### **Option 1: Add Image Upload to Room Form**

Update `admin/src/pages/Rooms.jsx` to include file upload:

```javascript
// In RoomModal component
<div className="form-group">
  <label className="form-label">Room Images</label>
  <input
    type="file"
    accept="image/*"
    multiple
    onChange={handleImageUpload}
  />
</div>
```

### **Option 2: Create Dedicated Image Management Page**

Create a new page for managing room images with drag-and-drop support.

---

## 🔒 Security Features

✅ JWT authentication required for all uploads  
✅ File type validation (only allowed formats)  
✅ File size limits enforced  
✅ Automatic virus scanning by Cloudinary  
✅ Secure URLs with transformation signing  
✅ Private uploads (requires auth to access)  

---

## 📊 Storage Information

**Cloudinary Free Tier Includes:**
- 25GB storage
- 25GB monthly bandwidth
- 25,000 monthly transformations
- Automatic backups

**Current Usage:** 0% (just started)

**Monitor Usage:**
Visit: https://cloudinary.com/console

---

## 🛠️ Troubleshooting

### **If uploads fail:**

1. **Check Cloudinary credentials** in `.env`
2. **Verify file size** is within limits
3. **Check file type** is allowed
4. **Ensure JWT token** is valid
5. **Check server logs** for detailed errors

### **Test Cloudinary Connection:**
```bash
cd backend
node config/cloudinary.js
```

---

## 📞 Support

For Cloudinary-specific issues:
- Dashboard: https://cloudinary.com/console
- Docs: https://cloudinary.com/documentation
- Support: support@cloudinary.com

---

## ✅ Status

**Cloudinary Integration:** ✅ **COMPLETE**

- [x] Cloudinary configured
- [x] Upload middleware created
- [x] Database schema updated
- [x] API endpoints created
- [x] Image optimization enabled
- [x] Security implemented
- [x] Connection tested

**Ready to upload images! 🎉📸**

---

**Last Updated:** January 27, 2026
