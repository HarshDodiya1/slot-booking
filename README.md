# 🏟️ Slot Booking System

A modern, full-stack slot booking application built with Next.js and Node.js that allows users to book sports venue slots with real-time updates and an intuitive user interface.

![Slot Booking System](https://img.shields.io/badge/Status-Active-success)
![Next.js](https://img.shields.io/badge/Next.js-13.5.1-black)
![Node.js](https://img.shields.io/badge/Node.js-Latest-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-indigo)

## 📋 Table of Contents

1. [🎯 Project Overview](#-project-overview)
2. [✨ Key Features](#-key-features)
3. [🛠️ Tech Stack](#️-tech-stack)
4. [📦 Installation Guide](#-installation-guide)
5. [🗂️ Folder Structure](#️-folder-structure)
6. [🔧 Environment Configuration](#-environment-configuration)
7. [🗄️ Database Setup](#️-database-setup)
8. [🚀 Running the Application](#-running-the-application)
9. [📱 Usage Guide](#-usage-guide)
10. [🌐 API Endpoints](#-api-endpoints)
11. [🎨 UI Components](#-ui-components)
12. [🔄 Real-time Features](#-real-time-features)
13. [🤝 Contributing](#-contributing)
14. [📄 License](#-license)

## 🎯 Project Overview

The Slot Booking System is a comprehensive web application designed to streamline the process of booking sports venue slots. It provides a seamless experience for users to view available time slots, make bookings, and manage reservations with real-time updates.

### 🎪 Live Demo
> [*See Now*](https://slot-booking-xi.vercel.app/)

## ✨ Key Features

- ⏰ **Real-time Slot Updates** - Live updates every 10 seconds
- 🎯 **Sport-specific Booking** - Choose from various sports categories
- 🔄 **Auto-refresh** - Automatic slot status updates
- 🌙 **Dark/Light Theme** - Toggle between themes
- 📱 **Responsive Design** - Works on all device sizes
- ⚡ **Fast Performance** - Optimized with Next.js 13
- 🔒 **Data Validation** - Form validation with Zod
- 🎨 **Modern UI** - Built with Tailwind CSS and Radix UI

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 13.5.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion (via Radix)
- **Icons**: Lucide React
- **Notifications**: Sonner

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **API**: RESTful APIs

### Development Tools
- **Package Manager**: npm
- **Database Client**: Prisma Studio
- **Version Control**: Git

## 📦 Installation Guide

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **PostgreSQL** (v13 or higher)
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/HarshDodiya1/slot-booking.git
cd slot-booking
```

### Step 2: Install Dependencies

#### Install Client Dependencies
```bash
cd client
npm install
```

#### Install Server Dependencies
```bash
cd ../server
npm install
```

## 🗂️ Folder Structure

```
slot-booking/
├── client/                     # Frontend Next.js application
│   ├── app/                    # Next.js 13 app directory
│   │   ├── favicon.ico         # Application favicon
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout component
│   │   └── page.tsx            # Home page component
│   ├── components/             # Reusable React components
│   │   ├── ui/                 # UI component library
│   │   ├── booking-form.tsx    # Booking form component
│   │   ├── confetti.tsx        # Confetti animation
│   │   ├── slot-viewer.tsx     # Slot display component
│   │   ├── theme-provider.tsx  # Theme context provider
│   │   ├── theme-toggle.tsx    # Theme switcher
│   │   └── venue-selector.tsx  # Venue selection component
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions and API calls
│   │   ├── api.ts              # API integration functions
│   │   └── utils.ts            # Utility functions
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts            # Main type definitions
│   ├── .env                    # Environment variables
│   ├── package.json            # Dependencies and scripts
│   └── tailwind.config.js      # Tailwind CSS configuration
├── server/                     # Backend Node.js application
│   ├── controllers/            # Request handlers
│   │   └── bookingController.js # Booking logic
│   ├── database/               # Database configuration
│   │   └── db.js               # Prisma client setup
│   ├── prisma/                 # Database schema and migrations
│   │   ├── schema.prisma       # Database schema
│   │   └── verifySetup.js      # Database verification
│   ├── routes/                 # API route definitions
│   │   └── bookingRoutes.js    # Booking routes
│   ├── .env                    # Server environment variables
│   ├── package.json            # Server dependencies
│   └── server.js               # Express server setup
└── README.md                   # Project documentation
```

## 🔧 Environment Configuration

### Client Environment Variables

Create a `.env` file in the `client` directory:

```env:client/.env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000

# Optional: Add other environment variables as needed
# NEXT_PUBLIC_APP_NAME=Slot Booking System
# NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Server Environment Variables

Create a `.env` file in the `server` directory:

```env:server/.env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/slot_booking_db"

# Server Configuration
PORT=4000
NODE_ENV=development

# Optional: Add JWT secret for authentication (future feature)
# JWT_SECRET=your_jwt_secret_here

# Optional: Add CORS origins
# CORS_ORIGIN=http://localhost:3000
```

**Important Notes:**
- Replace `username`, `password`, and `slot_booking_db` with your actual PostgreSQL credentials
- Ensure PostgreSQL is running on your system
- Create the database before running migrations

## 🗄️ Database Setup

### Step 1: Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE slot_booking_db;

# Exit PostgreSQL
\q
```

### Step 2: Configure Prisma

```bash
cd server

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Optional: Seed the database with sample data
npx prisma db seed
```

### Step 3: Verify Database Setup

```bash
# Open Prisma Studio to view your database
npx prisma studio
```

### Step 4: Verify Database Connection

```bash
# Run the verification script
node prisma/verifySetup.js
```

## 🚀 Running the Application

### Development Mode

#### Terminal 1: Start the Backend Server
```bash
cd server
npm run dev
# Server will run on http://localhost:4000
```

#### Terminal 2: Start the Frontend Application
````bash
cd client
npm run dev
# Client will run on http://localhost:3000
````

### Production Mode

#### Build and Start Backend
```bash
cd server
npm start
```

#### Build and Start Frontend
```bash
cd client
npm run build
npm start
```

## 📱 Usage Guide

### 1. **Select a Venue**
- Choose from available sports venues in the dropdown
- Each venue has different available time slots

### 2. **Pick a Date**
- Select from the next 7 days
- Dates are automatically generated from the database

### 3. **View Available Slots**
- Green slots are available for booking
- Gray slots are already booked
- Slots show the time and booking status

### 4. **Book a Slot**
- Click on an available slot
- Fill in your name and select a sport
- Confirm your booking
- Enjoy the confetti celebration! 🎉

### 5. **Real-time Updates**
- Slots refresh automatically every 10 seconds
- Manual refresh button available
- Booking status updates in real-time

## 🌐 API Endpoints

### Base URL: `http://localhost:4000/api`

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `GET` | `/getVenues` | Get all venues | None |
| `GET` | `/sports` | Get all sports | None |
| `GET` | `/dates` | Get available dates | None |
| `GET` | `/slots` | Get slots for venue/date | `venue`, `date` |
| `POST` | `/book` | Book a slot | `user_name`, `sport`, `slot_id` |

### API Response Examples

#### Get Venues
```json
{
  "success": true,
  "data": [
    {
      "id": "venue-1",
      "name": "Tennis Court A",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Slots
```json
{
  "success": true,
  "data": {
    "venue": {
      "id": "venue-1",
      "name": "Tennis Court A"
    },
    "date": "2024-01-15",
    "slots": [
      {
        "id": "slot-1",
        "time": "09:00",
        "booked": false,
        "date": "2024-01-15T00:00:00.000Z",
        "venue": {
          "id": "venue-1",
          "name": "Tennis Court A"
        },
        "booking": null
      }
    ],
    "totalSlots": 10,
    "availableSlots": 7,
    "bookedSlots": 3
  }
}
```

#### Book Slot
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "booking": {
      "id": "booking-1",
      "userName": "John Doe",
      "sport": "Tennis",
      "slotId": "slot-1",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

## 🎨 UI Components

### Core Components

- **VenueSelector**: Dropdown for venue selection with date picker
- **SlotViewer**: Grid display of available and booked slots
- **BookingForm**: Modal form for slot booking
- **ThemeToggle**: Dark/light mode switcher
- **Confetti**: Celebration animation component

### UI Library Components

Built with **Radix UI** and **Tailwind CSS**:
- Button, Input, Select, Dialog
- Card, Badge, Form components
- Toast notifications with Sonner
- Loading skeletons and animations

## 🔄 Real-time Features

### Auto-refresh Mechanism
- **Polling Interval**: 10 seconds
- **Smart Polling**: Pauses when booking modal is open
- **Manual Refresh**: Button to force immediate update
- **Loading States**: Visual feedback during data fetching

### State Management
- Real-time slot status updates
- Optimistic UI updates
- Error handling and retry logic
- Seamless user experience

## 🔧 Customization

### Adding New Sports
Update the sports array in `server/controllers/bookingController.js`:

```javascript
const sports = [
  { id: "sport-1", name: "Tennis" },
  { id: "sport-2", name: "Badminton" },
  { id: "sport-3", name: "Basketball" },
  { id: "sport-4", name: "Football" },
  { id: "sport-5", name: "Your New Sport" }, // Add here
];
```

### Modifying Time Slots
Update the slot generation logic or manually add slots via Prisma Studio.

### Styling Customization
- Modify `tailwind.config.js` for theme customization
- Update component styles in respective component files
- Add custom CSS in `globals.css`

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Error
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Restart PostgreSQL
sudo service postgresql restart

# Verify database exists
psql -U postgres -l
```

#### Port Already in Use
```bash
# Kill process on port 3000 (client)
npx kill-port 3000

# Kill process on port 4000 (server)
npx kill-port 4000
```

#### Prisma Client Issues
```bash
# Regenerate Prisma client
cd server
npx prisma generate

# Reset database if needed
npx prisma migrate reset
```

#### Environment Variables Not Loading
- Ensure `.env` files are in correct directories
- Restart development servers after changing `.env`
- Check for typos in variable names

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
cd client
npm run build
# Deploy to Vercel or your preferred platform
```

### Backend Deployment (Railway/Heroku)
```bash
cd server
# Set environment variables in your deployment platform
# Deploy using platform-specific commands
```

### Database Deployment
- Use services like **Supabase**, **PlanetScale**, or **Railway**
- Update `DATABASE_URL` in production environment

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📞 Support

If you encounter any issues or have questions:

1. **Check the troubleshooting section**
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Contact the maintainer**: [Your Email]

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **Prisma** for the excellent ORM
- **Radix UI** for accessible components
- **Tailwind CSS** for utility-first styling
- **Vercel** for deployment platform

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/HarshDodiya1/slot-booking)
![GitHub forks](https://img.shields.io/github/forks/HarshDodiya1/slot-booking)
![GitHub issues](https://img.shields.io/github/issues/HarshDodiya1/slot-booking)
![GitHub license](https://img.shields.io/github/license/HarshDodiya1/slot-booking)

**Made with ❤️ by [Harsh Dodiya](https://github.com/HarshDodiya1)**

---

*Happy Booking! 🏟️*Client will run on http://localhost
```
