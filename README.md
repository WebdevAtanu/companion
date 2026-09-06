# Mental Companion

Mental Companion is a full-stack wellness application designed to support reflection, emotional awareness, and daily structure. The app combines a React-based client with an Express/TypeScript backend to provide authentication, journaling, mood tracking, reminders, and a companion-style chat experience.

## Features

- User registration and login
- Private companion chat experience
- Mood tracking and simple analytics
- Journal entry creation and history
- Reminder management
- Emergency contact management
- Secure API layer with rate limiting and authentication

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express
- TypeScript
- MySQL
- JWT authentication
- Helmet, CORS, compression, and rate limiting

## Project Structure

- client/: React frontend application
- server/: Express backend and API routes
- server/src/DB/table.sql: SQL schema for the database

## Prerequisites

Before running the project, make sure you have:

- Node.js 18 or later
- npm
- MySQL database

## Backend Setup

1. Navigate to the server folder:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a MySQL database and import the schema from [server/src/DB/table.sql](server/src/DB/table.sql).

4. Create a .env file in the server folder with values similar to:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=companion
   ```

5. Start the backend:
   ```bash
   npm run dev
   ```

The API will run on http://localhost:5000.

## Frontend Setup

1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

The client will open on the Vite local URL shown in the terminal.

## Environment Notes

The frontend uses the VITE_API_BASE_URL environment variable if you want to point it at a different API host. If it is not set, it defaults to:

```env
http://localhost:5000/api
```

## Build Commands

### Build the client
```bash
cd client
npm run build
```

### Build the server
```bash
cd server
npm run build
```

## Notes

- The backend expects a MySQL-compatible database and uses environment variables for database access.
- Authentication is handled with JWT tokens stored locally in the browser.
- The app is intended as a prototype or foundation for a mental wellness companion experience and can be extended with AI integrations, notifications, and richer analytics.
