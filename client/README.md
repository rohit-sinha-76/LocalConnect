# LocalConnect — Frontend

This is the frontend for the LocalConnect platform. It provides the user interface for customers to browse workers, book services, and leave reviews, and for workers to manage incoming bookings and view their ratings.

---

## Tech Stack

- React with Vite
- Tailwind CSS for styling
- shadcn/ui for reusable components
- Axios for API communication
- React Router for page navigation

---

## Pages

- **Home** — Welcome screen with a brief overview and quick links
- **Login / Register** — Authentication forms for customers and workers
- **Workers** — Searchable list of workers with skill and location filters
- **Booking** — Form to book a worker for a specific service and time slot
- **Dashboard** — Shows bookings with their current status and available actions (cancel, complete, review)

---

## Setup

```bash
npm install
npm run dev
```

The development server runs on `http://localhost:5173`. It expects the backend to be running on `http://localhost:5000`.

---

## Configuration

The API base URL is set in `src/services/api.js`. If your backend runs on a different port, update it there.

---

## Building for Production

```bash
npm run build
```

The output is written to the `dist/` folder and can be served with any static file server or deployed to Vercel.
