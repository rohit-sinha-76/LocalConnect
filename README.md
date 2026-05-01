# LocalConnect

LocalConnect is a service marketplace web application that connects customers with local skilled workers for home services in small cities.

## Features

* Search for local workers based on specific skills and availability.
* Create service bookings for specific date and time slots.
* Manage booking status transitions between pending, confirmed, completed, and cancelled states.
* Prevent overlapping time slots and duplicate booking requests for workers.
* Submit reviews and calculated star ratings after service completion.

## Tech Stack

* Node.js v18+ with Express framework
* React 18 with Vite and React Router
* Tailwind CSS for UI styling
* MongoDB with Mongoose ODM
* JSON Web Tokens (JWT) for authentication
* bcryptjs for password hashing

## Getting Started

### Prerequisites

* Node.js version 18.0 or higher
* npm version 9.0 or higher
* MongoDB server running locally or a MongoDB connection URI

### Installation

1. Clone the repository to your local machine:
   git clone https://github.com/rohit-sinha-76/LocalConnect.git

2. Navigate into the project directory:
   cd LocalConnect

3. Install server dependencies:
   cd server && npm install

4. Install client dependencies:
   cd ../client && npm install

5. Start the backend development server:
   cd ../server && npm run dev

6. Start the frontend development server in a separate terminal:
   cd client && npm run dev

### Environment Variables

Create a file named .env inside the server directory with the following variables:

PORT=5000
MONGO_URI=mongodb://localhost:27017/localconnect
JWT_SECRET=your_jwt_secret_key_here

## Usage

Register a customer account or worker profile through the web interface. Log in as a customer, search for workers by skill, select an available date and time slot, and submit a booking request. Log in as the assigned worker to accept the request, mark the job as completed upon finish, and view customer reviews on the worker profile dashboard.

## Project Structure

* client/ - React frontend application with UI components, pages, and API handlers.
* server/ - Express backend API containing routes, controllers, services, and Mongoose database models.
* android-app/ - Android client application implementation.
* docker-compose.yml - Docker configuration for backend and database containerization.

## Future Improvements

* Integrate payment processing gateway for digital transactions.
* Add real-time in-app messaging between customers and workers.
* Implement push and email notifications for booking status updates.

## License

MIT
