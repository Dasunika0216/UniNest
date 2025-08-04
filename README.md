# UniNest 🏠

A modern web application that connects university students with safe, affordable, and comfortable boarding accommodations across Sri Lanka.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

UniNest is a comprehensive platform designed to solve the accommodation challenges faced by university students in Sri Lanka. The platform provides a seamless connection between students seeking accommodation and property owners offering boarding facilities.

### Key Benefits

**For Students:**
- Wide variety of verified boarding options
- Advanced search and filtering capabilities
- Secure and transparent booking process
- Real-time availability updates

**For Hosts:**
- Simple property listing process
- Reach thousands of potential tenants
- Comprehensive property management tools

## ✨ Features

### Student Features
- 🔍 **Advanced Search & Filter** - Find accommodations by location, price, type, and amenities
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🗺️ **Interactive Maps** - View property locations with Google Maps integration
- 📸 **Property Gallery** - High-quality images with lightbox viewer
- ⭐ **Verified Listings** - All properties are verified for authenticity

### Host Features
- 🏠 **Property Management** - Add, edit, and manage multiple properties
- 🖼️ **Image Upload** - Cloudinary integration for optimized image storage
- 📍 **Location Picker** - Interactive map for precise location setting
- ✅ **Real-time Updates** - Instant availability and pricing updates

### Admin Features
- 👥 **User Management** - Approve/reject host applications
- 📈 **Analytics Dashboard** - Comprehensive platform statistics
- 🔒 **Content Moderation** - Review and approve property listings
- 🛡️ **Security Controls** - Monitor platform activity and user behavior

## 🛠️ Tech Stack

### Frontend
- **React** - UI library for building user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **React Toastify** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload middleware

### Third-party Services
- **Cloudinary** - Image storage and optimization
- **Google Maps API** - Location services and mapping
- **Twilio** - SMS notifications (configured)

## 📁 Project Structure

```
UniNest/
├── backend/
│   ├── config/
│   │   ├── cloudinary.config.js    # Cloudinary configuration
│   │   ├── env.js                  # Environment variables
│   │   ├── mongodb.js              # Database connection
│   │   └── twilio.js               # Twilio SMS configuration
│   ├── controllers/
│   │   ├── auth.controller.js      # Authentication logic
│   │   ├── boarding.controller.js  # Property management
│   │   └── host.controller.js      # Host-specific operations
│   ├── middleware/
│   │   ├── admin.middleware.js     # Admin authentication
│   │   ├── auth.middleware.js      # User authentication
│   │   └── upload.middleware.js    # File upload handling
│   ├── models/
│   │   ├── boarding.model.js       # Property data model
│   │   └── host.model.js           # User data model
│   ├── routes/
│   │   ├── auth.routes.js          # Authentication routes
│   │   ├── boarding.routes.js      # Property routes
│   │   └── host.routes.js          # Host routes
│   ├── package.json
│   └── server.js                   # Application entry point
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── addBoarding.jsx      # Property listing form
    │   │   ├── listBoarding.jsx     # Property management
    │   │   ├── sign-up.jsx          # User registration
    │   │   ├── sign-in.jsx          # User login
    │   │   ├── Navbar.jsx           # Navigation component
    │   │   └── Footer.jsx           # Footer component
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx   # Admin panel
    │   │   ├── HostProfile.jsx      # Host dashboard
    │   │   ├── FindBoarding.jsx     # Property search
    │   │   ├── ViewBoarding.jsx     # Property details
    │   │   ├── About.jsx            # About page
    │   │   └── Contact.jsx          # Contact page
    │   ├── App.jsx                  # Main app component
    │   ├── main.jsx                 # Application entry point
    │   └── index.css                # Global styles
    ├── package.json
    └── vite.config.js               # Vite configuration
```

## 📸 Screenshots

### User Authentication

#### Sign In
![Sign In Page](screenshots/signin.png)
*User login interface with email/username and password fields*

#### Sign Up
![Sign Up Page](screenshots/signup.png)
*Host registration form with property details for approval*

### Host Features

#### Add Boarding

**Step 1: Basic Information Form**
![Add Boarding - Basic Form](screenshots/add-boarding-form.png)
*Property listing form with address, cost, and basic details*

**Step 2: Location Selection**
![Add Boarding - Location Picker](screenshots/add-boarding-location.png)
*Interactive Google Maps location picker for precise property placement*

**Step 3: Image Upload**
![Add Boarding - Image Upload](screenshots/add-boarding-images.png)
*Multiple image upload interface with drag-and-drop functionality*

**Step 4: Facilities Selection**
![Add Boarding - Facilities](screenshots/add-boarding-facilities.png)
*Facility selection with predefined options and custom additions*

**Step 5: Preview & Submit**
![Add Boarding - Preview](screenshots/add-boarding-preview.png)
*Final preview of the property listing before submission*

#### Host Profile
![Host Profile Dashboard](screenshots/host-profile.png)
*Host dashboard showing property management and profile information*

### Student Features

#### Filter Boarding
![Filter Boarding Results](screenshots/filter-boarding.png)
*Property search and filtering interface with map view and detailed listings*

### Admin Features

#### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)
*Administrative panel with user management, statistics, and content moderation*

---

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Clone Repository
```bash
git clone https://github.com/yourusername/uninest.git
cd uninest
```

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd frontend
npm install
```

## 🔧 Environment Setup

### Backend Environment (.env)
Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5500
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/uninest
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/uninest

# JWT Secret
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Twilio Configuration (Optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Email Configuration (if implemented)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend Environment (.env)
Create a `.env` file in the frontend directory:

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:5500/api/v1

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Cloudinary Configuration (for frontend uploads)
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start MongoDB** (if running locally):
```bash
mongod
```

2. **Start Backend Server**:
```bash
cd backend
npm run dev
# Server will run on http://localhost:5500
```

3. **Start Frontend Development Server**:
```bash
cd frontend
npm run dev
# Application will run on http://localhost:5173
```

### Production Mode

1. **Build Frontend**:
```bash
cd frontend
npm run build
```

2. **Start Backend**:
```bash
cd backend
npm start
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint                           | Description        |
|--------|------------------------------------|--------------------|
| POST   | `/api/v1/auth/sign-up`             | User registration  |
| POST   | `/api/v1/auth/sign-in`             | User login         |
| POST   | `/api/v1/auth/host-profile`        | Get host profile   |
| POST   | `/api/v1/auth/update-host-profile` | Update host profile|
| GET    | `/api/v1/auth/admin/statistics`    | Admin statistics   |

### Boarding Endpoints

| Method | Endpoint                            | Description              |
|--------|-------------------------------------|--------------------------|
| POST   | `/api/v1/boardings/add-boarding`    | Create new property      |
| GET    | `/api/v1/boardings/list-boarding`   | Get all properties       |
| GET    | `/api/v1/boardings/filter-boarding` | Search/filter properties |
| PUT    | `/api/v1/boardings/:id`             | Update property          |
| DELETE | `/api/v1/boardings/:id`             | Delete property          |


## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for secure password storage
- **Input Validation** - Comprehensive form validation
- **File Upload Security** - Multer middleware with file type restrictions
- **CORS Configuration** - Controlled cross-origin requests
- **Admin Role Protection** - Separate admin authentication middleware

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Made by Team Runtime_Terror with ❤️ for the university community in Sri Lanka**

