import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Layout from "./components/Layout";
import { Button } from "./components/ui/button";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Workers from "./pages/Workers";
import Booking from "./pages/Booking";
import Dashboard from "./pages/Dashboard";

function Home() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center gap-8 text-center">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 opacity-15 blur-3xl"></div>
        <div className="absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 opacity-15 blur-3xl"></div>
        <div className="absolute left-1/3 -bottom-20 h-72 w-72 rounded-full bg-gradient-to-br from-pink-400 to-rose-600 opacity-10 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
          <span className="gradient-text">Welcome to</span>
          <br />
          <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            LocalConnect
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-gray-600">
          Connect with skilled local workers — plumbers, electricians, carpenters and more. Book services in minutes.
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap justify-center gap-4">
        <Link to="/workers">
          <Button className="h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:from-violet-700 hover:to-indigo-700 transition-all">
            Find Workers →
          </Button>
        </Link>
        <Link to="/register">
          <Button variant="outline" className="h-12 rounded-xl border-2 border-purple-200 px-8 font-semibold text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all">
            Get Started
          </Button>
        </Link>
      </div>

      {/* Feature cards */}
      <div className="relative z-10 mt-12 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 p-6 border border-purple-100 shadow-sm">
          <div className="mb-3 text-3xl">🔍</div>
          <h3 className="font-bold text-gray-900">Search</h3>
          <p className="mt-1 text-sm text-gray-600">Find workers by skill and location</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-6 border border-blue-100 shadow-sm">
          <div className="mb-3 text-3xl">📅</div>
          <h3 className="font-bold text-gray-900">Book</h3>
          <p className="mt-1 text-sm text-gray-600">Schedule services with a click</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 p-6 border border-emerald-100 shadow-sm">
          <div className="mb-3 text-3xl">⭐</div>
          <h3 className="font-bold text-gray-900">Review</h3>
          <p className="mt-1 text-sm text-gray-600">Rate and review after completion</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/workers" element={<Workers />} />
          <Route path="/workers/:id" element={<Booking />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
