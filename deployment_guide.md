# NEXmove Physio – Deployment & Setup Guide

This guide explains how to deploy the migrated NEXmove Physio application (Express.js + static HTML) to Vercel and set up the database using Neon PostgreSQL.

## 1. Database Setup (Neon PostgreSQL)

1. Go to [Neon.tech](https://neon.tech/) and create a free account.
2. Create a new project (e.g., `nexmove-db`).
3. Once the database is created, navigate to the **Dashboard** and locate the **Connection Details** section.
4. Copy the connection string. It should look like this:
   `postgresql://username:password@ep-cold-shadow-123456.eu-central-1.aws.neon.tech/neondb?sslmode=require`

## 2. Vercel Deployment

1. Go to [Vercel](https://vercel.com/) and create a free account.
2. Install the Vercel CLI locally (if you prefer deploying from your terminal) or connect your GitHub repository to Vercel.
3. Import your project into Vercel. Select the `backend` folder as your root directory (since it contains `vercel.json`, `package.json`, and the source code).
4. **Environment Variables:** During the Vercel setup process, add the following Environment Variables:
   * `DATABASE_URL`: The Neon connection string you copied in step 1.
   * `JWT_SECRET`: A secure, random string (e.g., generate one using a password manager).
   * `NODE_ENV`: `production`
5. Deploy the project.

## 3. Initializing the Database

Once deployed, or locally, you must run the database migration and seed scripts to create the tables and the default admin account.

### Option A: Local Execution (Recommended)
If you have Node.js installed locally, you can run the scripts directly against your remote Neon database.

1. Open your terminal in the `backend` directory (not the root `NEXmove` directory).
2. Create a `.env` file and add your `DATABASE_URL` and `JWT_SECRET`.
3. Run the following commands:
   ```bash
   cd backend
   npm install
   npm run migrate
   npm run seed
   ```

### Default Credentials
After running the seed script, the database will contain a default admin account:
* **Username:** `admin`
* **Password:** `admin123`

**Important:** Please log in to the admin dashboard (`/admin/login.html`) and change your password, or manually update the password hash in the database for security.

## 4. Local Development

To run the application locally on your machine for testing or further development:

1. Ensure you have Node.js installed.
2. Navigate to the `backend` directory.
3. Create a `.env` file containing your local configuration.
4. Run the development server:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
5. Access the site at `http://localhost:3000`. 
   * Main Site: `http://localhost:3000/`
   * Admin Dashboard: `http://localhost:3000/admin/login.html`
   * Advanced Booking: `http://localhost:3000/booking/index.html`

## Directory Structure Overview

The project is structured to work seamlessly on Vercel as serverless functions alongside static files:

* `/backend/package.json` – Dependencies for Express and Neon.
* `/backend/vercel.json` – Vercel routing configuration. Routes `/api/*` to the Express backend and serves everything else from the `frontend` folder statically.
* `/backend/src/` – The Express.js backend code.
  * `/src/routes/` – API endpoints for authentication, appointments, and bookings.
  * `/src/db/` – Database connection, migration, and seed scripts.
* `/backend/frontend/` – The static HTML, CSS, and JS files (converted from the old PHP templates).
