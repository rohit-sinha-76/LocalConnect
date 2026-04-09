import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password || !form.role) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 opacity-15 blur-3xl"></div>
        <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 opacity-15 blur-3xl"></div>
      </div>

      <Card className="relative w-full max-w-md border-0 shadow-2xl shadow-purple-500/10">
        <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500"></div>

        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-2xl font-bold">
            <span className="gradient-text">Create account</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground">Join LocalConnect today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                className="rounded-xl border-gray-200 bg-gray-50/50 focus:border-purple-400 focus:bg-white focus:ring-purple-400/20 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="rounded-xl border-gray-200 bg-gray-50/50 focus:border-purple-400 focus:bg-white focus:ring-purple-400/20 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="rounded-xl border-gray-200 bg-gray-50/50 focus:border-purple-400 focus:bg-white focus:ring-purple-400/20 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="role" className="text-sm font-medium text-gray-700">I am a</Label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 text-sm ring-offset-background focus:border-purple-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all"
              >
                <option value="customer">Customer — I want to hire workers</option>
                <option value="worker">Worker — I want to offer my services</option>
              </select>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 h-12 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:from-cyan-700 hover:to-blue-700 transition-all"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-purple-600 underline-offset-4 hover:text-purple-700 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
