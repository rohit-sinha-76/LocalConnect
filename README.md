# LocalConnect

A service marketplace platform that connects people with local skilled workers in small cities.

---

## Problem Statement

In small cities, it is still hard to find reliable workers like plumbers, electricians, or carpenters. People depend on word of mouth or random visits to find someone. Workers on the other hand have no good way to reach customers beyond their immediate area. There is no simple system where someone can search, book, and review a local worker without hassle.

## Solution

LocalConnect solves this by providing a single place where customers can search for workers by skill and location, book services for specific time slots, and leave reviews after the job is done. Workers get a profile, manage incoming bookings, and build a reputation through ratings. It is built with small cities in mind — the interface is kept simple and the flow is straightforward.

## Features

- **User authentication** — Separate registration and login for customers and workers
- **Worker profiles** — Skills, location, price range, and rating displayed on each profile
- **Booking system** — Customers can book a worker for a specific date and time
- **Booking status flow** — Every booking moves through a controlled lifecycle: Pending to Confirmed to Completed or Cancelled
- **Review and rating** — After a booking is completed, customers can leave a rating and comment
- **Dashboard** — Customers see their bookings. Workers see incoming requests and manage them
- **Overlap prevention** — Workers cannot be double-booked for overlapping time slots
- **Duplicate booking prevention** — The same booking cannot be submitted twice

## Tech Stack

**Frontend:**
- React with Vite
- Tailwind CSS
- shadcn/ui components
- Axios for API calls
- React Router for navigation

**Backend:**
- Node.js and Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## How It Works

1. A user registers as a customer or a worker
2. Customers browse and search workers by skill or location
3. A customer selects a worker, picks a service and time slot, and creates a booking
4. The worker sees the booking and can accept it
5. After the service is done, the worker marks the booking as completed
6. The customer leaves a review and rating
7. The worker rating is recalculated automatically

## Screenshots

Add screenshots here.

## Setup Instructions

**Backend:**

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory and add your variables (see below).

```bash
npm run dev
```

**Frontend:**

```bash
cd client
npm install
npm run dev
```

The frontend runs on port 5173 and the backend on port 5000.

**Running with Docker:**

This project includes a `docker-compose.yml` file that runs the backend and MongoDB together.

```bash
docker compose up --build -d
```

The backend will be available on `http://localhost:5000` and MongoDB on `localhost:27017`.

To stop the containers:

```bash
docker compose down
```

To stop and remove the database volume:

```bash
docker compose down -v
```

Note: the frontend still needs to be run locally with `npm run dev` since it uses Vite's development server.

## Environment Variables

Create a `.env` file in the `server` folder with these values:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Do not share this file or commit it to the repository.

## Future Improvements

- Online payment integration
- In-app messaging between customers and workers
- Email or SMS notifications for booking updates
- Mobile application
- Better search with location-based filtering

## Author

This project was built as part of my full-stack development learning. I wanted to build a real-world system with proper backend logic, clean architecture, and a usable frontend. The focus was on getting the details right — booking validation, role-based access, and data consistency — rather than adding unnecessary features.

You can reach me at [your email] or view my other projects on [your GitHub profile].
